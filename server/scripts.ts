import { storage } from "./storage";
import { seedScripts } from "@shared/scripts";
import { logAgentAction } from "./logger";

/**
 * Seeds the database with initial scripts if they don't exist
 */
export async function seedDatabase(): Promise<void> {
  try {
    // Get all scripts
    const existingScripts = await storage.getAllScripts();
    
    // Check for new scripts to add
    const existingKeys = existingScripts.map(script => script.key);
    const newScripts = seedScripts.filter(script => !existingKeys.includes(script.script.key));
    
    if (newScripts.length === 0) {
      console.log(`Database already has all ${existingScripts.length} scripts, nothing to add.`);
      return;
    }
    
    console.log(`Found ${newScripts.length} new scripts to add to database...`);
    
    // Only add new scripts
    for (const seedData of newScripts) {
      await storage.createScript(
        seedData.script,
        seedData.tags,
        seedData.highlights,
        { ...seedData.version, scriptId: 0 } // scriptId will be set in storage method
      );
      
      console.log(`Added script: ${seedData.script.title}`);
      await logAgentAction("Created script", `Created script: ${seedData.script.title} (${seedData.script.key})`);
    }
    
    await logAgentAction("Database Seed", `Added ${newScripts.length} new scripts to database`);
    
    console.log("Database seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
