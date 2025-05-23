import { pgTable, text, serial, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const scripts = pgTable("scripts", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // e.g., PS-01, SH-01
  language: text("language").notNull(), // PowerShell or Bash
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  code: text("code").notNull(), // Raw script content
  readme: text("readme").notNull(), // Markdown content
  author: text("author").notNull(),
  version: text("version").notNull(),
  compatibleOS: text("compatible_os").notNull(),
  requiredModules: text("required_modules"),
  dependencies: text("dependencies"),
  license: text("license"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const scriptTags = pgTable("script_tags", {
  scriptId: integer("script_id").notNull().references(() => scripts.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.scriptId, t.tag] }),
}));

export const scriptHighlights = pgTable("script_highlights", {
  scriptId: integer("script_id").notNull().references(() => scripts.id, { onDelete: "cascade" }),
  highlight: text("highlight").notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.scriptId, t.highlight] }),
}));

export const scriptVersions = pgTable("script_versions", {
  id: serial("id").primaryKey(),
  scriptId: integer("script_id").notNull().references(() => scripts.id, { onDelete: "cascade" }),
  version: text("version").notNull(),
  changes: text("changes").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agentLogs = pgTable("agent_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  details: text("details"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertScriptSchema = createInsertSchema(scripts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertScriptTagSchema = createInsertSchema(scriptTags);

export const insertScriptHighlightSchema = createInsertSchema(scriptHighlights);

export const insertScriptVersionSchema = createInsertSchema(scriptVersions).omit({
  id: true,
  createdAt: true,
});

export const insertAgentLogSchema = createInsertSchema(agentLogs).omit({
  id: true,
  timestamp: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertScript = z.infer<typeof insertScriptSchema>;
export type Script = typeof scripts.$inferSelect;

export type InsertScriptTag = z.infer<typeof insertScriptTagSchema>;
export type ScriptTag = typeof scriptTags.$inferSelect;

export type InsertScriptHighlight = z.infer<typeof insertScriptHighlightSchema>;
export type ScriptHighlight = typeof scriptHighlights.$inferSelect;

export type InsertScriptVersion = z.infer<typeof insertScriptVersionSchema>;
export type ScriptVersion = typeof scriptVersions.$inferSelect;

export type InsertAgentLog = z.infer<typeof insertAgentLogSchema>;
export type AgentLog = typeof agentLogs.$inferSelect;

// Extended types for frontend
export type ScriptWithDetails = Script & {
  tags: string[];
  highlights: string[];
  versions: ScriptVersion[];
};
