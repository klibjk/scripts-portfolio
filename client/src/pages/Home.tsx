import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScriptCard } from "@/components/ScriptCard";
import { FilterControls } from "@/components/FilterControls";
import { ScriptWithDetails } from "@shared/schema";

export default function Home() {
  const [language, setLanguage] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const scriptsPerPage = 6;

  const { data: scripts = [], isLoading, error } = useQuery({
    queryKey: ['/api/scripts'],
  });

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [language, search]);

  // Filter scripts based on language and search
  const filteredScripts = useMemo(() => {
    return scripts.filter((script: ScriptWithDetails) => {
      // Filter by language
      const languageMatch = language === "all" || script.language === language;
      
      // Filter by search term
      const searchTerm = search.toLowerCase();
      const searchMatch = 
        search === "" || 
        script.title.toLowerCase().includes(searchTerm) || 
        script.summary.toLowerCase().includes(searchTerm) || 
        script.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      
      return languageMatch && searchMatch;
    });
  }, [scripts, language, search]);

  // Paginate results
  const indexOfLastScript = currentPage * scriptsPerPage;
  const indexOfFirstScript = indexOfLastScript - scriptsPerPage;
  const currentScripts = filteredScripts.slice(indexOfFirstScript, indexOfLastScript);
  const totalPages = Math.ceil(filteredScripts.length / scriptsPerPage);

  // Pagination navigation
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-300">
              Error loading scripts. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="script-gallery" className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Script Gallery</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Browse PowerShell and Bash automation scripts for system engineering
          </p>
        </div>

        <FilterControls 
          language={language} 
          setLanguage={setLanguage} 
          search={search} 
          setSearch={setSearch} 
        />
      </div>

      {filteredScripts.length === 0 ? (
        <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No scripts found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentScripts.map((script: ScriptWithDetails) => (
              <ScriptCard key={script.id} script={script} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="inline-flex rounded-md shadow-sm isolate">
                <button 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 dark:border-dark-600 ${
                    currentPage === 1 
                      ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-dark-800" 
                      : "bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600"
                  }`}
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="relative -ml-px inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-600 bg-primary-50 dark:bg-primary-900/30 text-sm font-medium text-primary-700 dark:text-primary-300">
                  {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={nextPage} 
                  disabled={currentPage === totalPages}
                  className={`relative -ml-px inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 dark:border-dark-600 ${
                    currentPage === totalPages 
                      ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-dark-800" 
                      : "bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600"
                  }`}
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
