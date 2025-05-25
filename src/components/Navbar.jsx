import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext.jsx'; // Corrected path
import { 
  Home, Package, ShoppingCart, Mail, Compass, UserCircle,
  Calendar, Briefcase, Folder, FileText, User, LogIn, UserPlus, LogOut, ChevronDown,
  Sun, Moon // Added Sun and Moon icons
} from 'lucide-react';
import '../styles/Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); // Added useTheme hook

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setActiveDropdown(null);
    }
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  // if (loading) {
  //   return <div className="navbar-loading"></div>;
  // }

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src="./logo.jpg" alt="SamTech Grp Ltd Logo" className="logo-img" />
        <span className="logo-text">SamTech Grp Ltd.</span>
      </div>
      
      <button 
        className={`hamburger ${isMenuOpen ? 'open' : ''}`} 
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <ul className={`nav-links ${isMenuOpen ? 'mobile-menu-open' : ''}`}>
        <li><NavLink to="/" exact activeClassName="active" onClick={() => setIsMenuOpen(false)}><Home size={18} /> Home</NavLink></li>
        <li><NavLink to="/products" activeClassName="active" onClick={() => setIsMenuOpen(false)}><Package size={18} /> Products</NavLink></li>
        <li><NavLink to="/shop" activeClassName="active" onClick={() => setIsMenuOpen(false)}><ShoppingCart size={18} /> Shop</NavLink></li>
        <li><NavLink to="/contact" activeClassName="active" onClick={() => setIsMenuOpen(false)}><Mail size={18} /> Contact</NavLink></li>
        
        {/* Explore Dropdown */}
        <li className="dropdown-container">
          <button 
            className={`dropdown-toggle ${activeDropdown === 'explore' ? 'active' : ''}`}
            onClick={() => toggleDropdown('explore')}
          >
            <Compass size={18} /> Explore
            <ChevronDown size={16} className="dropdown-arrow-icon" />
          </button>
          <ul className={`dropdown-menu ${activeDropdown === 'explore' ? 'show' : ''}`}>
            <li><NavLink to="/events" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}><Calendar size={18} /> Events</NavLink></li>
            <li><NavLink to="/careers" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}><Briefcase size={18} /> Careers</NavLink></li>
            <li><NavLink to="/portfolio" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}><Folder size={18} /> Portfolio</NavLink></li>
            <li><NavLink to="/blogs" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}><FileText size={18} /> Blogs</NavLink></li>
          </ul>
        </li>
        
        {/* Account Dropdown */}
        {user ? (
          <li className="dropdown-container">
            <button 
              className={`dropdown-toggle ${activeDropdown === 'account' ? 'active' : ''}`}
              onClick={() => toggleDropdown('account')}
            >
              <UserCircle size={18} /> Account
              <ChevronDown size={16} className="dropdown-arrow-icon" />
            </button>
            <ul className={`dropdown-menu ${activeDropdown === 'account' ? 'show' : ''}`}>
              <li><NavLink to="/profile" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}><User size={18} /> Profile</NavLink></li>
              <li><button onClick={handleLogout} className="nav-logout"><LogOut size={18} /> Logout</button></li>
            </ul>
          </li>
        ) : (
          <li className="dropdown-container">
            <button 
              className={`dropdown-toggle ${activeDropdown === 'account' ? 'active' : ''}`}
              onClick={() => toggleDropdown('account')}
            >
              <UserCircle size={18} /> Account
              <ChevronDown size={16} className="dropdown-arrow-icon" />
            </button>
            <ul className={`dropdown-menu ${activeDropdown === 'account' ? 'show' : ''}`}>
              <li><NavLink to="/login" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}><LogIn size={18} /> Login</NavLink></li>
              <li><NavLink to="/signup" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}><UserPlus size={18} /> Sign Up</NavLink></li>
            </ul>
          </li>
        )}
        {/* Theme Toggle Button */}
        <li>
          <button
            onClick={() => {
              toggleTheme();
              // Close mobile menu if open, and any dropdowns
              setIsMenuOpen(false); 
              setActiveDropdown(null);
            }}
            aria-label="Toggle theme"
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-foreground flex items-center justify-center transition-colors duration-200 ease-in-out" 
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;