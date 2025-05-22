import { useTheme } from "@/components/ThemeProvider";
import { useState } from "react";

export default function TestMode() {
  const { theme, setTheme } = useTheme();
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Theme Test Page</h1>
      
      <div className="flex space-x-4 mb-6">
        <button 
          onClick={() => setTheme("light")}
          className="px-4 py-2 rounded border"
        >
          Light Mode
        </button>
        <button 
          onClick={() => setTheme("dark")}
          className="px-4 py-2 rounded border"
        >
          Dark Mode
        </button>
        <div className="ml-4">
          Current mode: <strong>{theme}</strong>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card 1 */}
        <div className="border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b">
            <h3 className="text-base font-medium">PowerShell Script</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100">
              PowerShell
            </span>
          </div>
          <div className="p-4">
            <p className="text-sm mb-4">
              This is sample script content that should have good contrast in both light and dark modes.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100">
                Tag 1
              </span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100">
                Tag 2
              </span>
            </div>
            <button className="px-3 py-1.5 rounded-md bg-blue-500 text-white">
              View Script
            </button>
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b">
            <h3 className="text-base font-medium">Bash Script</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100">
              Bash
            </span>
          </div>
          <div className="p-4">
            <p className="text-sm mb-4">
              This is sample script content that should have good contrast in both light and dark modes.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100">
                Tag 3
              </span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100">
                Tag 4
              </span>
            </div>
            <button className="px-3 py-1.5 rounded-md bg-purple-500 text-white">
              View Script
            </button>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 rounded border mb-2"
        >
          {showDetails ? "Hide" : "Show"} CSS Variables
        </button>
        
        {showDetails && (
          <div className="p-4 border rounded bg-gray-50 dark:bg-gray-800 overflow-auto">
            <h3 className="font-bold mb-2">Current CSS Variables</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 border rounded">
                <div style={{backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', padding: '8px', border: '1px solid var(--border-color)'}}>
                  --bg-color / --text-color
                </div>
              </div>
              <div className="p-2 border rounded">
                <div style={{backgroundColor: 'var(--muted-bg)', color: 'var(--text-color)', padding: '8px', border: '1px solid var(--border-color)'}}>
                  --muted-bg / --text-color
                </div>
              </div>
              <div className="p-2 border rounded">
                <div style={{backgroundColor: 'var(--primary-bg)', color: 'var(--text-color)', padding: '8px', border: '1px solid var(--border-color)'}}>
                  --primary-bg / --text-color
                </div>
              </div>
              <div className="p-2 border rounded">
                <div style={{backgroundColor: 'var(--secondary-bg)', color: 'var(--text-color)', padding: '8px', border: '1px solid var(--border-color)'}}>
                  --secondary-bg / --text-color
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <p className="text-center">
        This test page shows how different UI elements appear in light and dark modes.
      </p>
    </div>
  );
}