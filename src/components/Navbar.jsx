import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  if (loading) {
    return <div className="navbar-loading"></div>;
  }

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
        <li><NavLink to="/events" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Events</NavLink></li>
        <li><NavLink to="/careers" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Careers</NavLink></li>
        <li><NavLink to="/portfolio" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Portfolio</NavLink></li>
        <li><NavLink to="/blogs" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Blogs</NavLink></li>
        <li><NavLink to="/shop" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Shop</NavLink></li>
        <li><NavLink to="/contact" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Contact</NavLink></li>
        
        {user ? (
          <>
            <li><NavLink to="/profile" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Profile</NavLink></li>
            <li><button onClick={handleLogout} className="nav-logout">Logout</button></li>
          </>
        ) : (
          <>
            <li><NavLink to="/login" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Login</NavLink></li>
            <li><NavLink to="/signup" activeClassName="active" onClick={() => setIsMenuOpen(false)}>Sign Up</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;