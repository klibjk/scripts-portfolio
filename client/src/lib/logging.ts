import { apiRequest } from "./queryClient";

/**
 * Logs an action taken by the user to the agent activity log
 * @param action The action being performed
 * @param details Additional details about the action
 */
// Batch logs and send them periodically
let logQueue: Array<{action: string, details: string}> = [];
let timeout: NodeJS.Timeout | null = null;

export async function logAgentAction(action: string, details: string): Promise<void> {
  // Log locally in development mode
  if (process.env.NODE_ENV === "development") {
    console.log(`[Agent Log] ${action}: ${details}`);
  }
  
  logQueue.push({ action, details });
  
  // Debounce log sending
  if (timeout) clearTimeout(timeout);
  
  timeout = setTimeout(async () => {
    try {
      const logs = [...logQueue];
      logQueue = [];
      
      if (logs.length > 0) {
        await apiRequest("POST", "/api/logs", { logs });
      }
    } catch (error) {
      console.error("Failed to log actions:", error);
    }
  }, 2000); // Wait 2 seconds before sending batch
}
