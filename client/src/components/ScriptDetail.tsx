import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { ScriptWithDetails } from "@shared/schema";
import { FaArrowLeft, FaDownload, FaCopy, FaTerminal, FaWindows, FaLinux, FaCode, FaBook, FaInfoCircle, FaExclamationTriangle, FaCalendarAlt, FaClock } from "react-icons/fa";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ScriptDetailProps {
  script: ScriptWithDetails;
}

type TabType = "code" | "readme" | "metadata";

export function ScriptDetail({ script }: ScriptDetailProps) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("code");
  
  const isWindows = script.language === "PowerShell";
  const language = isWindows ? "powershell" : "bash";
  
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };
  
  const handleBackClick = () => {
    setLocation("/");
  };
  
  const copyCode = () => {
    navigator.clipboard.writeText(script.code).then(() => {
      toast({
        title: "Code copied",
        description: "Script code copied to clipboard",
      });
    });
  };
  
  const downloadScript = () => {
    const element = document.createElement("a");
    const file = new Blob([script.code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = script.title;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const formatDate = (dateString: Date | string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };
  
  return (
    <div className="mb-16">
      <div className="mb-6 flex items-center justify-between">
        <button 
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          onClick={handleBackClick}
        >
          <FaArrowLeft className="mr-2" />
          Back to Gallery
        </button>
        <div className="flex items-center space-x-2">
          <button 
            onClick={downloadScript}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-dark-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FaDownload className="mr-2" />
            Download
          </button>
          <button 
            onClick={copyCode}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-50 dark:text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FaCopy className="mr-2" />
            Copy Code
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-700 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600 overflow-hidden">
        {/* Script Header */}
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-md ${
                isWindows 
                  ? "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400" 
                  : "bg-secondary-100 dark:bg-secondary-900/50 text-secondary-600 dark:text-secondary-400"
              }`}>
                <FaTerminal className="text-xl" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {script.title}
                </h2>
                <div className="mt-1 flex flex-wrap items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isWindows 
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300" 
                      : "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                  } mr-2`}>
                    {isWindows ? <FaWindows className="mr-1" /> : <FaLinux className="mr-1" />}
                    {script.language}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    <FaClock className="inline mr-1" />
                    Last updated: {formatDate(script.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center">
              <div className="flex flex-wrap gap-2">
                {script.highlights.map((highlight, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-dark-600 text-gray-800 dark:text-gray-200"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Script Content Tabs */}
        <div className="border-b border-gray-200 dark:border-dark-600">
          <nav className="flex -mb-px overflow-x-auto scrollbar-hide">
            <button 
              className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm focus:outline-none ${
                activeTab === "code" 
                  ? "border-primary-500 text-primary-600 dark:text-primary-400" 
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              onClick={() => handleTabChange("code")}
            >
              <FaCode className="inline mr-2" />
              Code
            </button>
            <button 
              className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm focus:outline-none ${
                activeTab === "readme" 
                  ? "border-primary-500 text-primary-600 dark:text-primary-400" 
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              onClick={() => handleTabChange("readme")}
            >
              <FaBook className="inline mr-2" />
              Documentation
            </button>
            <button 
              className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm focus:outline-none ${
                activeTab === "metadata" 
                  ? "border-primary-500 text-primary-600 dark:text-primary-400" 
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              onClick={() => handleTabChange("metadata")}
            >
              <FaInfoCircle className="inline mr-2" />
              Metadata
            </button>
          </nav>
        </div>

        {/* Code Tab Content */}
        {activeTab === "code" && (
          <div className="p-4 sm:p-6">
            <div className="code-container bg-gray-800 rounded-lg overflow-auto max-h-[500px]">
              <SyntaxHighlighter 
                language={language} 
                style={tomorrow}
                showLineNumbers
                wrapLines
              >
                {script.code}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        {/* README Tab Content */}
        {activeTab === "readme" && (
          <div className="p-4 sm:p-6 prose dark:prose-invert max-w-none">
            <h2>{script.title}</h2>
            
            {script.readme.includes("Warning") && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaExclamationTriangle className="text-yellow-400 dark:text-yellow-300" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-200">
                      This script modifies system settings. Always test in a non-production environment first.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <ReactMarkdown>{script.readme}</ReactMarkdown>
          </div>
        )}

        {/* Metadata Tab Content */}
        {activeTab === "metadata" && (
          <div className="p-4 sm:p-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Author</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{script.author}</dd>
              </div>
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Version</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{script.version}</dd>
              </div>
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(script.createdAt)}</dd>
              </div>
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Modified</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(script.updatedAt)}</dd>
              </div>
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Compatible OS</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{script.compatibleOS}</dd>
              </div>
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Required Modules</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{script.requiredModules || "None"}</dd>
              </div>
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Dependencies</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{script.dependencies || "None"}</dd>
              </div>
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">License</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{script.license}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  <div className="flex flex-wrap gap-2">
                    {script.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-dark-600 text-gray-800 dark:text-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
            </dl>
            
            {script.versions && script.versions.length > 0 && (
              <div className="mt-8 border-t border-gray-200 dark:border-dark-600 pt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Script History</h3>
                <div className="mt-4 overflow-hidden">
                  <ul className="space-y-4">
                    {script.versions.map((version, index) => (
                      <li key={index} className="bg-gray-50 dark:bg-dark-800 p-3 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">v{version.version}</div>
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{formatDate(version.createdAt)}</span>
                          </div>
                          {index === 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                              Latest
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {version.changes}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
