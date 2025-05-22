import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaExclamationTriangle, FaLock } from "react-icons/fa";
import { logAgentAction } from "@/lib/logging";

// This is a simple placeholder for the admin dashboard
// In a real application, this would include authentication and CRUD operations
export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    logAgentAction("Admin Page Visit", "User visited the admin dashboard page");
  }, []);

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['/api/logs'],
    enabled: isAuthenticated
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simplified authentication logic
    // In a real application, this would be a proper auth system with JWT
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
      setLoginError("");
      logAgentAction("Admin Login", "Admin user successfully logged in");
    } else {
      setLoginError("Invalid username or password");
      logAgentAction("Failed Login Attempt", `Failed login attempt with username: ${username}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-dark-700 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-800">
            <div className="flex items-center justify-center">
              <FaLock className="text-primary-600 dark:text-primary-400 text-xl mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Admin Login
              </h2>
            </div>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            {loginError && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaExclamationTriangle className="text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {loginError}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 dark:border-dark-500 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 dark:border-dark-500 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-800 dark:text-white sm:text-sm"
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Login
                  </button>
                </div>
              </div>
            </form>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                For the demo, use:<br />
                Username: admin<br />
                Password: admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage scripts and view system logs
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-dark-700 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600 overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Agent Activity Logs
              </h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-5/6"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-600">
                    <thead className="bg-gray-50 dark:bg-dark-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Action
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-dark-700 divide-y divide-gray-200 dark:divide-dark-600">
                      {Array.isArray(logs.logs) && logs.logs.map((log: string, index: number) => {
                        const matches = log.match(/\[(.*?)\] (.*?): (.*)/);
                        
                        if (!matches || matches.length < 4) return null;
                        
                        const [, timestamp, action, details] = matches;
                        
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {timestamp}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                              {action}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                              {details}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white dark:bg-dark-700 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600 overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Quick Actions
              </h2>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-4">
              <button
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => logAgentAction("Admin Action", "Clicked add new script button")}
              >
                Add New Script
              </button>
              
              <button
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => logAgentAction("Admin Action", "Clicked manage users button")}
              >
                Manage Users
              </button>
              
              <button
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => {
                  setIsAuthenticated(false);
                  logAgentAction("Admin Logout", "Admin user logged out");
                }}
              >
                Logout
              </button>
            </div>
          </div>
          
          <div className="mt-6 bg-white dark:bg-dark-700 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600 overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                System Stats
              </h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Scripts</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">4</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">PowerShell Scripts</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">2</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Bash Scripts</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">2</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Update</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">Today</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
