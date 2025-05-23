import fs from 'fs/promises';
import path from 'path';
import { storage } from './storage';

const LOG_FILE_PATH = path.join(process.cwd(), 'logs', 'agent-activity.log');

/**
 * Logs an action taken by the agentic AI to both the database and a log file
 * @param action The action being performed
 * @param details Additional details about the action
 * @param retrieveOnly If true, only retrieves logs and doesn't add a new entry
 * @returns The newly created log entry or all logs if retrieveOnly is true
 */
export async function logAgentAction(
  action: string, 
  details: string, 
  retrieveOnly: boolean = false
): Promise<string[] | void> {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${action}: ${details}`;
  
  try {
    // Ensure logs directory exists
    await fs.mkdir(path.dirname(LOG_FILE_PATH), { recursive: true });
    
    if (retrieveOnly) {
      // Read and return logs
      const logContent = await fs.readFile(LOG_FILE_PATH, 'utf-8').catch(() => '');
      return logContent.split('\n').filter(line => line.trim() !== '');
    }
    
    // Write to log file
    await fs.appendFile(LOG_FILE_PATH, logEntry + '\n');
    
    // Store in database
    await storage.logAction({
      action,
      details,
    }).catch(err => {
      console.error('Failed to store log in database:', err);
    });
    
    console.log(`[AGENT] ${logEntry}`);
  } catch (error) {
    console.error('Error logging agent action:', error);
  }
}
