import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, loading, logout } = useAuth();
  const navbarRef = useRef(null);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setActiveDropdown(null);
    }
  };

  const handleMouseEnter = (dropdown) => {
    if (window.innerWidth > 768) { // Only for desktop
      setActiveDropdown(dropdown);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 768) { // Only for desktop
      setActiveDropdown(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <nav className="navbar" ref={navbarRef}>
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
        <li><NavLink to="/" exact activeClassName="active" onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
        <li><NavLink to="/products" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Products</NavLink></li>
        <li><NavLink to="/shop" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Shop</NavLink></li>
        <li><NavLink to="/contact" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Contact</NavLink></li>
        
        {/* Explore Dropdown */}
        <li 
          className="dropdown-container"
          onMouseEnter={() => handleMouseEnter('explore')}
          onMouseLeave={handleMouseLeave}
        >
          <button 
            className={`dropdown-toggle ${activeDropdown === 'explore' ? 'active' : ''}`}
            onClick={() => toggleDropdown('explore')}
            aria-haspopup="true"
            aria-expanded={activeDropdown === 'explore'}
          >
            Explore
            <span className="dropdown-arrow">&#9660;</span>
          </button>
          <ul 
            className={`dropdown-menu ${activeDropdown === 'explore' ? 'show' : ''}`}
            onMouseEnter={() => handleMouseEnter('explore')}
            onMouseLeave={handleMouseLeave}
          >
            <li><NavLink to="/events" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}>Events</NavLink></li>
            <li><NavLink to="/careers" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}>Careers</NavLink></li>
            <li><NavLink to="/portfolio" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}>Portfolio</NavLink></li>
            <li><NavLink to="/blogs" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}>Blogs</NavLink></li>
          </ul>
        </li>
        
        {/* Account Dropdown */}
        {user ? (
          <li 
            className="dropdown-container"
            onMouseEnter={() => handleMouseEnter('account')}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              className={`dropdown-toggle ${activeDropdown === 'account' ? 'active' : ''}`}
              onClick={() => toggleDropdown('account')}
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'account'}
            >
              <span className="account-icon">👤</span>
              <span className="account-text">Account</span>
              <span className="dropdown-arrow">&#9660;</span>
            </button>
            <ul 
              className={`dropdown-menu ${activeDropdown === 'account' ? 'show' : ''}`}
              onMouseEnter={() => handleMouseEnter('account')}
              onMouseLeave={handleMouseLeave}
            >
              <li><NavLink to="/profile" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}>Profile</NavLink></li>
              <li><button onClick={handleLogout} className="nav-logout">Logout</button></li>
            </ul>
          </li>
        ) : (
          <li 
            className="dropdown-container"
            onMouseEnter={() => handleMouseEnter('account')}
            onMouseLeave={handleMouseLeave}
          >
            <button 
              className={`dropdown-toggle ${activeDropdown === 'account' ? 'active' : ''}`}
              onClick={() => toggleDropdown('account')}
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'account'}
            >
              <span className="account-icon">👤</span>
              <span className="account-text">Account</span>
              <span className="dropdown-arrow">&#9660;</span>
            </button>
            <ul 
              className={`dropdown-menu ${activeDropdown === 'account' ? 'show' : ''}`}
              onMouseEnter={() => handleMouseEnter('account')}
              onMouseLeave={handleMouseLeave}
            >
              <li><NavLink to="/login" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}>Login</NavLink></li>
              <li><NavLink to="/signup" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}>Sign Up</NavLink></li>
            </ul>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;