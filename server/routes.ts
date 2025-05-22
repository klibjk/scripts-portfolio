import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  insertScriptSchema, 
  insertScriptVersionSchema 
} from "@shared/schema";
import { logAgentAction } from "./logger";

export async function registerRoutes(app: Express): Promise<Server> {
  // Log API requests
  app.use("/api", async (req, res, next) => {
    await logAgentAction(
      "API Request", 
      `${req.method} ${req.path} - IP: ${req.ip}`
    );
    next();
  });

  // Get all scripts
  app.get("/api/scripts", async (req, res) => {
    try {
      const language = req.query.language as string | undefined;
      
      let scripts;
      if (language && (language === 'PowerShell' || language === 'Bash')) {
        scripts = await storage.getScriptsByLanguage(language);
      } else {
        scripts = await storage.getAllScripts();
      }
      
      res.json(scripts);
    } catch (error) {
      console.error("Error fetching scripts:", error);
      res.status(500).json({ message: "Failed to fetch scripts" });
    }
  });

  // Get script by key
  app.get("/api/scripts/key/:key", async (req, res) => {
    try {
      const key = req.params.key;
      const script = await storage.getScriptByKey(key);
      
      if (!script) {
        return res.status(404).json({ message: "Script not found" });
      }
      
      res.json(script);
    } catch (error) {
      console.error("Error fetching script:", error);
      res.status(500).json({ message: "Failed to fetch script" });
    }
  });

  // Get script by ID
  app.get("/api/scripts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid script ID" });
      }
      
      const script = await storage.getScriptById(id);
      
      if (!script) {
        return res.status(404).json({ message: "Script not found" });
      }
      
      res.json(script);
    } catch (error) {
      console.error("Error fetching script:", error);
      res.status(500).json({ message: "Failed to fetch script" });
    }
  });

  // Create new script
  app.post("/api/scripts", async (req, res) => {
    try {
      // Define request schema
      const requestSchema = z.object({
        script: insertScriptSchema,
        tags: z.array(z.string()),
        highlights: z.array(z.string()),
        version: insertScriptVersionSchema.omit({ scriptId: true })
      });
      
      // Validate request body
      const { script, tags, highlights, version } = requestSchema.parse(req.body);
      
      // Create script with tags, highlights and initial version
      const newScript = await storage.createScript(
        script,
        tags,
        highlights,
        { ...version, scriptId: 0 } // scriptId will be set in storage method
      );
      
      res.status(201).json(newScript);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error creating script:", error);
      res.status(500).json({ message: "Failed to create script" });
    }
  });

  // Update script
  app.put("/api/scripts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid script ID" });
      }
      
      // Define request schema
      const requestSchema = z.object({
        script: insertScriptSchema.partial(),
        tags: z.array(z.string()).optional(),
        highlights: z.array(z.string()).optional()
      });
      
      // Validate request body
      const { script, tags, highlights } = requestSchema.parse(req.body);
      
      // Update script
      const updatedScript = await storage.updateScript(id, script, tags, highlights);
      
      res.json(updatedScript);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error updating script:", error);
      res.status(500).json({ message: "Failed to update script" });
    }
  });

  // Delete script
  app.delete("/api/scripts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid script ID" });
      }
      
      const deleted = await storage.deleteScript(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Script not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting script:", error);
      res.status(500).json({ message: "Failed to delete script" });
    }
  });

  // Add new version to script
  app.post("/api/scripts/:id/versions", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid script ID" });
      }
      
      // Validate script exists
      const script = await storage.getScriptById(id);
      
      if (!script) {
        return res.status(404).json({ message: "Script not found" });
      }
      
      // Define request schema
      const versionSchema = insertScriptVersionSchema.omit({ scriptId: true });
      
      // Validate request body
      const versionData = versionSchema.parse(req.body);
      
      // Add version
      const newVersion = await storage.addScriptVersion({
        ...versionData,
        scriptId: id
      });
      
      res.status(201).json(newVersion);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error adding script version:", error);
      res.status(500).json({ message: "Failed to add script version" });
    }
  });

  // Get agent logs
  app.get("/api/logs", async (req, res) => {
    try {
      // Get logs from agent-activity.log file
      const logs = await logAgentAction("Get logs", "Retrieved agent logs", true);
      res.json({ logs });
    } catch (error) {
      console.error("Error fetching logs:", error);
      res.status(500).json({ message: "Failed to fetch logs" });
    }
  });

  // Handle batched logs
  app.post("/api/logs", async (req, res) => {
    try {
      const { logs } = req.body;
      if (Array.isArray(logs)) {
        for (const log of logs) {
          await logAgentAction(log.action, log.details);
        }
      } else {
        await logAgentAction(req.body.action, req.body.details);
      }
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error logging actions:", error);
      res.status(500).json({ message: "Failed to log actions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
