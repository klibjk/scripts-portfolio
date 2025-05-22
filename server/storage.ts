import { db } from "./db";
import { 
  users, type User, type InsertUser,
  scripts, type Script, type InsertScript,
  scriptTags, type ScriptTag, type InsertScriptTag,
  scriptHighlights, type ScriptHighlight, type InsertScriptHighlight,
  scriptVersions, type ScriptVersion, type InsertScriptVersion,
  agentLogs, type AgentLog, type InsertAgentLog,
  type ScriptWithDetails
} from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { logAgentAction } from "./logger";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Script operations
  getAllScripts(): Promise<ScriptWithDetails[]>;
  getScriptsByLanguage(language: string): Promise<ScriptWithDetails[]>;
  getScriptByKey(key: string): Promise<ScriptWithDetails | undefined>;
  getScriptById(id: number): Promise<ScriptWithDetails | undefined>;
  createScript(script: InsertScript, tags: string[], highlights: string[], version: InsertScriptVersion): Promise<ScriptWithDetails>;
  updateScript(id: number, script: Partial<InsertScript>, tags?: string[], highlights?: string[]): Promise<ScriptWithDetails>;
  deleteScript(id: number): Promise<boolean>;
  
  // Script version operations
  addScriptVersion(version: InsertScriptVersion): Promise<ScriptVersion>;
  
  // Agent log operations
  logAction(log: InsertAgentLog): Promise<AgentLog>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    
    await logAgentAction("Created user", `Created user: ${insertUser.username}`);
    return user;
  }
  
  // Script operations
  async getAllScripts(): Promise<ScriptWithDetails[]> {
    const scriptsData = await db.select().from(scripts).orderBy(desc(scripts.createdAt));
    return this.attachScriptDetails(scriptsData);
  }
  
  async getScriptsByLanguage(language: string): Promise<ScriptWithDetails[]> {
    const scriptsData = await db
      .select()
      .from(scripts)
      .where(eq(scripts.language, language))
      .orderBy(desc(scripts.createdAt));
    return this.attachScriptDetails(scriptsData);
  }
  
  async getScriptByKey(key: string): Promise<ScriptWithDetails | undefined> {
    const [scriptData] = await db.select().from(scripts).where(eq(scripts.key, key));
    if (!scriptData) return undefined;
    
    const [result] = await this.attachScriptDetails([scriptData]);
    return result;
  }
  
  async getScriptById(id: number): Promise<ScriptWithDetails | undefined> {
    const [scriptData] = await db.select().from(scripts).where(eq(scripts.id, id));
    if (!scriptData) return undefined;
    
    const [result] = await this.attachScriptDetails([scriptData]);
    return result;
  }
  
  async createScript(
    scriptData: InsertScript, 
    tagsData: string[], 
    highlightsData: string[],
    versionData: InsertScriptVersion
  ): Promise<ScriptWithDetails> {
    // Insert script
    const [script] = await db.insert(scripts).values(scriptData).returning();
    
    // Insert tags
    if (tagsData.length > 0) {
      await db.insert(scriptTags).values(
        tagsData.map(tag => ({ scriptId: script.id, tag }))
      );
    }
    
    // Insert highlights
    if (highlightsData.length > 0) {
      await db.insert(scriptHighlights).values(
        highlightsData.map(highlight => ({ scriptId: script.id, highlight }))
      );
    }
    
    // Insert initial version
    await db.insert(scriptVersions).values({
      ...versionData,
      scriptId: script.id
    });
    
    await logAgentAction("Created script", `Created script: ${script.title} (${script.key})`);
    
    // Return full script with details
    return this.getScriptById(script.id) as Promise<ScriptWithDetails>;
  }
  
  async updateScript(
    id: number, 
    scriptData: Partial<InsertScript>, 
    tagsData?: string[], 
    highlightsData?: string[]
  ): Promise<ScriptWithDetails> {
    // Update script
    const [script] = await db
      .update(scripts)
      .set({
        ...scriptData,
        updatedAt: new Date()
      })
      .where(eq(scripts.id, id))
      .returning();
    
    // Update tags if provided
    if (tagsData) {
      // Delete existing tags
      await db.delete(scriptTags).where(eq(scriptTags.scriptId, id));
      
      // Insert new tags
      if (tagsData.length > 0) {
        await db.insert(scriptTags).values(
          tagsData.map(tag => ({ scriptId: id, tag }))
        );
      }
    }
    
    // Update highlights if provided
    if (highlightsData) {
      // Delete existing highlights
      await db.delete(scriptHighlights).where(eq(scriptHighlights.scriptId, id));
      
      // Insert new highlights
      if (highlightsData.length > 0) {
        await db.insert(scriptHighlights).values(
          highlightsData.map(highlight => ({ scriptId: id, highlight }))
        );
      }
    }
    
    await logAgentAction("Updated script", `Updated script: ${script.title} (${script.key})`);
    
    // Return full script with details
    return this.getScriptById(id) as Promise<ScriptWithDetails>;
  }
  
  async deleteScript(id: number): Promise<boolean> {
    const [script] = await db.select().from(scripts).where(eq(scripts.id, id));
    if (!script) return false;
    
    // Delete script (cascade will delete related records)
    await db.delete(scripts).where(eq(scripts.id, id));
    
    await logAgentAction("Deleted script", `Deleted script: ${script.title} (${script.key})`);
    
    return true;
  }
  
  // Script version operations
  async addScriptVersion(versionData: InsertScriptVersion): Promise<ScriptVersion> {
    const [version] = await db
      .insert(scriptVersions)
      .values(versionData)
      .returning();
    
    const [script] = await db.select().from(scripts).where(eq(scripts.id, versionData.scriptId));
    
    await logAgentAction(
      "Added script version", 
      `Added version ${versionData.version} to script: ${script.title}`
    );
    
    return version;
  }
  
  // Agent log operations
  async logAction(logData: InsertAgentLog): Promise<AgentLog> {
    const [log] = await db
      .insert(agentLogs)
      .values(logData)
      .returning();
    
    return log;
  }
  
  // Helper method to attach tags, highlights, and versions to scripts
  private async attachScriptDetails(scriptsData: Script[]): Promise<ScriptWithDetails[]> {
    if (scriptsData.length === 0) return [];
    
    const scriptIds = scriptsData.map(script => script.id);
    
    // Get all tags for these scripts
    const tagsData = await db
      .select()
      .from(scriptTags)
      .where(sql`${scriptTags.scriptId} IN ${scriptIds}`);
    
    // Get all highlights for these scripts
    const highlightsData = await db
      .select()
      .from(scriptHighlights)
      .where(sql`${scriptHighlights.scriptId} IN ${scriptIds}`);
    
    // Get all versions for these scripts
    const versionsData = await db
      .select()
      .from(scriptVersions)
      .where(sql`${scriptVersions.scriptId} IN ${scriptIds}`)
      .orderBy(desc(scriptVersions.createdAt));
    
    // Combine all data
    return scriptsData.map(script => {
      const scriptTags = tagsData
        .filter(tag => tag.scriptId === script.id)
        .map(tag => tag.tag);
      
      const scriptHighlights = highlightsData
        .filter(highlight => highlight.scriptId === script.id)
        .map(highlight => highlight.highlight);
      
      const scriptVersions = versionsData
        .filter(version => version.scriptId === script.id);
      
      return {
        ...script,
        tags: scriptTags,
        highlights: scriptHighlights,
        versions: scriptVersions
      };
    });
  }
}

export const storage = new DatabaseStorage();
