import { apiRequest } from "./queryClient";

/**
 * Logs an action taken by the user to the agent activity log
 * @param action The action being performed
 * @param details Additional details about the action
 */
export async function logAgentAction(action: string, details: string): Promise<void> {
  try {
    // Log locally in development mode
    if (process.env.NODE_ENV === "development") {
      console.log(`[Agent Log] ${action}: ${details}`);
    }
    
    // Send to server
    await apiRequest("POST", "/api/logs", { action, details });
  } catch (error) {
    console.error("Failed to log action:", error);
  }
}
