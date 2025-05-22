import { FaTerminal, FaLink, FaWindows, FaLinux } from "react-icons/fa";
import { Link } from "wouter";
import { useState } from "react";
import { ScriptWithDetails } from "@shared/schema";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface ScriptCardProps {
  script: ScriptWithDetails;
}

export function ScriptCard({ script }: ScriptCardProps) {
  const [copied, setCopied] = useState(false);
  
  const isWindows = script.language === "PowerShell";
  
  const copyLink = () => {
    const url = `${window.location.origin}/scripts/${script.key}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link copied",
        description: "Script link copied to clipboard",
      });
    });
  };
  
  const formatDate = (dateString: Date | string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };
  
  return (
    <div className="bg-white dark:bg-dark-700 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="px-4 py-4 sm:px-6 border-b border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md ${
              isWindows 
                ? "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400" 
                : "bg-secondary-100 dark:bg-secondary-900/50 text-secondary-600 dark:text-secondary-400"
            }`}>
              <FaTerminal />
            </div>
            <div className="ml-3">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">{script.title}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium ${
                isWindows 
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300" 
                  : "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
              }`}>
                {isWindows ? <FaWindows className="mr-1" /> : <FaLinux className="mr-1" />}
                {script.language}
              </span>
            </div>
          </div>
          <div>
            <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
              <i className="far fa-calendar-alt mr-1"></i> Added {formatDate(script.createdAt)}
            </span>
          </div>
        </div>
      </div>
      <div className="px-4 py-4 sm:px-6 flex-1 flex flex-col">
        <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">
          {script.summary}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {script.highlights.map((highlight, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-dark-600 text-gray-800 dark:text-gray-200"
            >
              {highlight}
            </span>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-600 flex justify-between items-center">
          <Link 
            href={`/scripts/${script.key}`}
            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              isWindows 
                ? "bg-primary-600 hover:bg-primary-700 focus:ring-primary-500" 
                : "bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500"
            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            View Script
          </Link>
          <button 
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-md" 
            title="Copy script link"
            onClick={copyLink}
            aria-label="Copy script link"
          >
            <FaLink />
          </button>
        </div>
      </div>
    </div>
  );
}
