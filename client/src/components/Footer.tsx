import { FaTerminal } from "react-icons/fa";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-dark-700 border-t border-gray-200 dark:border-dark-600 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <div className="flex items-center">
            <FaTerminal className="text-primary-600 text-xl mr-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Script Portfolio Builder</span>
          </div>
          <div className="mt-4 sm:mt-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {currentYear} Systems Engineering Team. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
