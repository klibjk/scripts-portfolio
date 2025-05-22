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
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="px-4 py-4 sm:px-6 border-b border-gray-300 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md ${
              isWindows 
                ? "bg-blue-100 text-black" 
                : "bg-purple-100 text-black"
            }`}>
              <FaTerminal />
            </div>
            <div className="ml-3">
              <h3 className="text-base font-medium text-black">{script.title}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium ${
                isWindows 
                  ? "bg-blue-200 text-black" 
                  : "bg-purple-200 text-black"
              }`}>
                {isWindows ? <FaWindows className="mr-1" /> : <FaLinux className="mr-1" />}
                {script.language}
              </span>
            </div>
          </div>
          <div>
            <span className="inline-flex items-center text-xs text-black">
              <i className="far fa-calendar-alt mr-1"></i> Added {formatDate(script.createdAt)}
            </span>
          </div>
        </div>
      </div>
      <div className="px-4 py-4 sm:px-6 flex-1 flex flex-col">
        <p className="text-sm text-black flex-1">
          {script.summary}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {script.highlights.map((highlight, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-200 text-black border border-gray-300"
            >
              {highlight}
            </span>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-300 flex justify-between items-center">
          <Link 
            href={`/scripts/${script.key}`}
            className={`inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm ${
              isWindows 
                ? "bg-blue-500 hover:bg-blue-600 text-black" 
                : "bg-purple-500 hover:bg-purple-600 text-black"
            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            View Script
          </Link>
          <button 
            className="p-1.5 text-black hover:text-gray-800 rounded-md border border-gray-300" 
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
