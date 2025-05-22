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
    
    // Check if we already have scripts
    if (existingScripts.length > 0) {
      console.log(`Database already has ${existingScripts.length} scripts, skipping seed.`);
      return;
    }
    
    console.log("Seeding database with initial scripts...");
    
    // Add seed scripts
    for (const seedData of seedScripts) {
      await storage.createScript(
        seedData.script,
        seedData.tags,
        seedData.highlights,
        { ...seedData.version, scriptId: 0 } // scriptId will be set in storage method
      );
      
      console.log(`Added script: ${seedData.script.title}`);
    }
    
    await logAgentAction("Database Seed", `Seeded database with ${seedScripts.length} initial scripts`);
    
    console.log("Database seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
