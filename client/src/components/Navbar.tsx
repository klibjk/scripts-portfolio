import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "./ThemeProvider";
import { FaTerminal, FaSun, FaMoon, FaUserShield, FaBars } from "react-icons/fa";

export function Navbar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-[hsl(var(--bg-primary))] border-b border-[hsl(var(--border-color))] shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <FaTerminal className="text-primary-600 text-2xl mr-2" />
              <span className="font-bold text-lg text-gray-900 dark:text-slate-100">Script Portfolio</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className={`${isActive('/') 
                  ? 'border-primary-500 text-gray-900 dark:text-white' 
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:border-gray-300'} 
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Gallery
              </Link>
              
              <Link 
                href="/documentation" 
                className={`${isActive('/documentation') 
                  ? 'border-primary-500 text-gray-900 dark:text-white' 
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:border-gray-300'} 
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Documentation
              </Link>
              
              <Link 
                href="/admin" 
                className={`${isActive('/admin') 
                  ? 'border-primary-500 text-gray-900 dark:text-white' 
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:border-gray-300'} 
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Admin
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="mr-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-600 focus:outline-none"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <FaMoon className="text-gray-500 dark:text-gray-400" />
              ) : (
                <FaSun className="text-gray-400 dark:text-gray-300" />
              )}
            </button>
            
            {/* Login Link */}
            <Link href="/admin" className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white">
              <FaUserShield className="mr-1.5" />
              <span>Login</span>
            </Link>
            
            {/* Mobile Menu Button */}
            <div className="ml-3 relative sm:hidden">
              <button 
                type="button" 
                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <FaBars />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden bg-white dark:bg-dark-700 border-b border-gray-200 dark:border-dark-600`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            href="/" 
            className={`${isActive('/') 
              ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300' 
              : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 hover:border-gray-300'} 
              block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Gallery
          </Link>
          
          <Link 
            href="/documentation" 
            className={`${isActive('/documentation') 
              ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300' 
              : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 hover:border-gray-300'} 
              block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Documentation
          </Link>
          
          <Link 
            href="/admin" 
            className={`${isActive('/admin') 
              ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300' 
              : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 hover:border-gray-300'} 
              block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
