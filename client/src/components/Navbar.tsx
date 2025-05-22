import { useState } from "react";
import { Link, useLocation } from "wouter";
import { FaTerminal, FaUserShield, FaBars } from "react-icons/fa";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <FaTerminal className="text-blue-600 text-2xl mr-2" />
              <span className="font-bold text-lg text-gray-900">Script Portfolio</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className={`${isActive('/') 
                  ? 'border-blue-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Gallery
              </Link>
              
              <Link 
                href="/documentation" 
                className={`${isActive('/documentation') 
                  ? 'border-blue-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Documentation
              </Link>
              
              <Link 
                href="/admin" 
                className={`${isActive('/admin') 
                  ? 'border-blue-500 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
                  inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Admin
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Login Link */}
            <Link href="/admin" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
              <FaUserShield className="mr-1.5" />
              <span>Login</span>
            </Link>
            
            {/* Mobile Menu Button */}
            <div className="ml-3 relative sm:hidden">
              <button 
                type="button" 
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
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
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden bg-white border-b border-gray-200`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            href="/" 
            className={`${isActive('/') 
              ? 'bg-blue-50 border-blue-500 text-blue-700' 
              : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300'} 
              block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Gallery
          </Link>
          
          <Link 
            href="/documentation" 
            className={`${isActive('/documentation') 
              ? 'bg-blue-50 border-blue-500 text-blue-700' 
              : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300'} 
              block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Documentation
          </Link>
          
          <Link 
            href="/admin" 
            className={`${isActive('/admin') 
              ? 'bg-blue-50 border-blue-500 text-blue-700' 
              : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300'} 
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
