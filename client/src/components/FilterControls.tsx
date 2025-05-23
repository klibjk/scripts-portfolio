import { FaSearch } from "react-icons/fa";
import { useCallback } from "react";

interface FilterControlsProps {
  language: string;
  setLanguage: (language: string) => void;
  search: string;
  setSearch: (search: string) => void;
}

export function FilterControls({ 
  language, 
  setLanguage, 
  search, 
  setSearch 
}: FilterControlsProps) {
  const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  }, [setLanguage]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, [setSearch]);

  return (
    <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
      <div className="relative">
        <select
          className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 dark:border-dark-500 dark:bg-dark-700 dark:text-white rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={language}
          onChange={handleLanguageChange}
          aria-label="Filter by language"
        >
          <option value="all">All Languages</option>
          <option value="PowerShell">PowerShell</option>
          <option value="Bash">Bash</option>
        </select>
      </div>
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Search scripts..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-500 dark:bg-dark-700 dark:text-white rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
          value={search}
          onChange={handleSearchChange}
          aria-label="Search scripts"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FaSearch className="text-gray-400 dark:text-gray-500" />
        </div>
      </div>
    </div>
  );
}
