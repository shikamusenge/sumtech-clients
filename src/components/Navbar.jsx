import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronDown, User, ShoppingBag, Briefcase, Calendar, LayoutGrid, BookOpen } from 'lucide-react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, loading, logout } = useAuth();
  const navbarRef = useRef(null);
  const location = useLocation();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setActiveDropdown(null);
    }
  };

  const toggleDropdown = (dropdown) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  // Explore dropdown items with icons
  const exploreItems = [
    { path: "/events", label: "Events", icon: <Calendar className="w-5 h-5" /> },
    { path: "/careers", label: "Careers", icon: <Briefcase className="w-5 h-5" /> },
    { path: "/portfolio", label: "Portfolio", icon: <LayoutGrid className="w-5 h-5" /> },
    { path: "/blogs", label: "Blogs", icon: <BookOpen className="w-5 h-5" /> }
  ];

  return (
    <nav 
      ref={navbarRef}
      className="fixed w-full z-50 top-0 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-yellow-600 to-indigo-700 w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ST</span>
              </div>
              <span className="hidden sm:inline-block text-xl font-bold text-gray-900 dark:text-white">
                SamTech Group LTD
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLink 
              to="/" 
              className={({isActive}) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`
              }
            >
              Home
            </NavLink>
            
            <NavLink 
              to="/#products" 
              className={({isActive}) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`
              }
            >
              Products
            </NavLink>
            
            <NavLink 
              to="/shop" 
              className={({isActive}) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`
              }
            >
              <div className="flex items-center">
                <ShoppingBag className="w-5 h-5 mr-1" />
                Shop
              </div>
            </NavLink>
            
            {/* Explore Dropdown */}
            <div className="relative">
              <button
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeDropdown === 'explore' 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => toggleDropdown('explore')}
                onMouseEnter={() => setActiveDropdown('explore')}
              >
                Explore
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${activeDropdown === 'explore' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'explore' && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className="py-1">
                    {exploreItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Account Dropdown */}
            <div className="relative ml-2">
              <button
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeDropdown === 'account' 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => toggleDropdown('account')}
                onMouseEnter={() => setActiveDropdown('account')}
              >
                <User className="w-5 h-5 mr-1" />
                Account
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${activeDropdown === 'account' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'account' && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className="py-1">
                    {user ? (
                      <>
                        <NavLink
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Profile
                        </NavLink>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <NavLink
                          to="/login"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Login
                        </NavLink>
                        <NavLink
                          to="/signup"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Sign Up
                        </NavLink>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Home
            </NavLink>
            
            <NavLink
              to="/#products"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Products
            </NavLink>
            
            <NavLink
              to="/shop"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop
              </div>
            </NavLink>
            
            {/* Explore Dropdown for Mobile */}
            <div>
              <button
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium ${
                  activeDropdown === 'explore' 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => toggleDropdown('explore')}
              >
                <span>Explore</span>
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${activeDropdown === 'explore' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'explore' && (
                <div className="pl-4 mt-1 space-y-1">
                  {exploreItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
            
            {/* Account Dropdown for Mobile */}
            <div>
              <button
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium ${
                  activeDropdown === 'account' 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => toggleDropdown('account')}
              >
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  <span>Account</span>
                </div>
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${activeDropdown === 'account' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'account' && (
                <div className="pl-4 mt-1 space-y-1">
                  {user ? (
                    <>
                      <NavLink
                        to="/profile"
                        className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Profile
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/login"
                        className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Login
                      </NavLink>
                      <NavLink
                        to="/signup"
                        className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Sign Up
                      </NavLink>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;