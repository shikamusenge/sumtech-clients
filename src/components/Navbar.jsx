import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, loading, logout } = useAuth();

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
        <li><NavLink to="/" exact activeClassName="active" onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
        <li><NavLink to="/products" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Products</NavLink></li>
        <li><NavLink to="/shop" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Shop</NavLink></li>
        <li><NavLink to="/contact" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Contact</NavLink></li>
        
        {/* Explore Dropdown */}
        <li className="dropdown-container">
          <button 
            className={`dropdown-toggle ${activeDropdown === 'explore' ? 'active' : ''}`}
            onClick={() => toggleDropdown('explore')}
          >
            Explore
            <span className="dropdown-arrow">&#9660;</span>
          </button>
          <ul className={`dropdown-menu ${activeDropdown === 'explore' ? 'show' : ''}`}>
            <li><NavLink to="/events" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}>Events</NavLink></li>
            <li><NavLink to="/careers" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}>Careers</NavLink></li>
            <li><NavLink to="/portfolio" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}>Portfolio</NavLink></li>
            <li><NavLink to="/blogs" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}>Blogs</NavLink></li>
          </ul>
        </li>
        
        {/* Account Dropdown */}
        {user ? (
          <li className="dropdown-container">
            <button 
              className={`dropdown-toggle ${activeDropdown === 'account' ? 'active' : ''}`}
              onClick={() => toggleDropdown('account')}
            >
              Account
              <span className="dropdown-arrow">&#9660;</span>
            </button>
            <ul className={`dropdown-menu ${activeDropdown === 'account' ? 'show' : ''}`}>
              <li><NavLink to="/profile" activeClassName="active" onClick={() => { setIsMenuOpen(false); setActiveDropdown(null); }}>Profile</NavLink></li>
              <li><button onClick={handleLogout} className="nav-logout">Logout</button></li>
            </ul>
          </li>
        ) : (
          <li className="dropdown-container">
            <button 
              className={`dropdown-toggle ${activeDropdown === 'account' ? 'active' : ''}`}
              onClick={() => toggleDropdown('account')}
            >
              Account
              <span className="dropdown-arrow">&#9660;</span>
            </button>
            <ul className={`dropdown-menu ${activeDropdown === 'account' ? 'show' : ''}`}>
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