import { useEffect } from "react";
import { logAgentAction } from "@/lib/logging";
import { FaInfoCircle, FaCode, FaDownload, FaCogs, FaLightbulb, FaQuestion } from "react-icons/fa";

export default function Documentation() {
  useEffect(() => {
    logAgentAction("Documentation View", "User accessed the documentation page");
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-slate-100 mb-4">Documentation</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Learn how to use the Script Portfolio and get the most out of the available scripts.
        </p>
      </div>

      <div className="space-y-10">
        {/* About Section */}
        <section className="bg-white dark:bg-dark-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600">
          <div className="flex items-center mb-4">
            <FaInfoCircle className="text-primary-600 dark:text-primary-400 text-xl mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">About the Portfolio</h2>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              The Script Portfolio is a collection of production-ready PowerShell and Bash scripts 
              for system engineering tasks. Each script is fully documented and tested to ensure 
              reliability in production environments.
            </p>
            <p>
              This tool was created to showcase scripting skills relevant to Systems 
              Engineering roles, demonstrating expertise in Windows and Linux 
              automation.
            </p>
          </div>
        </section>

        {/* Using Scripts Section */}
        <section className="bg-white dark:bg-dark-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600">
          <div className="flex items-center mb-4">
            <FaCode className="text-primary-600 dark:text-primary-400 text-xl mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Using the Scripts</h2>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <h3>Viewing Scripts</h3>
            <p>
              Browse the script gallery to find automation solutions. You can filter by language 
              (PowerShell or Bash) and search by keywords to find specific scripts.
            </p>
            
            <h3>Downloading and Running</h3>
            <p>
              Each script can be viewed, copied, or downloaded directly from its detail page. Always 
              read the documentation tab for usage instructions and requirements before running a script.
            </p>
            
            <h3>Script Structure</h3>
            <p>
              All scripts follow a consistent structure with:
            </p>
            <ul>
              <li>Header comments describing purpose and author</li>
              <li>Parameter declarations with validation</li>
              <li>Descriptive variable names and comments</li>
              <li>Error handling and logging</li>
              <li>Output formatting for integration with other tools</li>
            </ul>
          </div>
        </section>
        {/* Technical Details Section */}
        <section className="bg-white dark:bg-dark-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600">
          <div className="flex items-center mb-4">
            <FaCogs className="text-primary-600 dark:text-primary-400 text-xl mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Technical Details</h2>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              The Script Portfolio is built with:
            </p>
            <ul>
              <li>React and TypeScript for the frontend</li>
              <li>Express.js for the backend API</li>
              <li>PostgreSQL database for persistence</li>
              <li>Syntax highlighting for PowerShell and Bash</li>
              <li>Markdown rendering for documentation</li>
            </ul>
            <p>
              The application follows a vertical slice architecture to enable rapid feature 
              development and easy maintenance.
            </p>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="bg-white dark:bg-dark-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600">
          <div className="flex items-center mb-4">
            <FaLightbulb className="text-primary-600 dark:text-primary-400 text-xl mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Scripting Best Practices</h2>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              All scripts in this portfolio follow these best practices:
            </p>
            <ul>
              <li><strong>Idempotence:</strong> Scripts can be run multiple times without causing harm</li>
              <li><strong>Error Handling:</strong> Robust error catching and reporting</li>
              <li><strong>Logging:</strong> Detailed logging for troubleshooting</li>
              <li><strong>Parameterization:</strong> Configurable via parameters rather than hardcoded values</li>
              <li><strong>Comments:</strong> Clear explanations of complex operations</li>
              <li><strong>Consistent Formatting:</strong> Following language-specific style guides</li>
            </ul>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white dark:bg-dark-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600">
          <div className="flex items-center mb-4">
            <FaQuestion className="text-primary-600 dark:text-primary-400 text-xl mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Can I modify these scripts for my own use?</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Yes, all scripts are released under the MIT license unless otherwise specified, allowing modification and reuse.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Are these scripts secure to run in production?</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                All scripts have been tested in multiple environments, but you should always review the code and test in your specific environment before using in production.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">How can I report issues with a script?</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Please submit issues through the admin dashboard or contact the script author directly.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Do I need special permissions to run these scripts?</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Most scripts require administrative or root privileges. Check the script documentation for specific requirements.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
