import React from "react";
import { MapPin, Mail, Phone, Clock, Linkedin, Twitter, Facebook, Instagram, Github } from "lucide-react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="samtech-footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-col company-info">
              <h3 className="footer-heading">SamTech Group</h3>
              <div className="footer-contact">
                <div className="contact-item">
                  <MapPin className="contact-icon" size={16} />
                  <span>Ngoma-Kibungo</span>
                </div>
                <div className="contact-item">
                  <Mail className="contact-icon" size={16} />
                  <span>info@samtechgrp.co.ke</span>
                </div>
                <div className="contact-item">
                  <Phone className="contact-icon" size={16} />
                  <span>+250 781599881</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h3 className="footer-heading">Links</h3>
              <ul className="footer-links">
                <li><a href="/">Home</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>

            {/* Services Provided */}
            <div className="footer-col">
              <h3 className="footer-heading">Services</h3>
              <ul className="footer-links">
                <li><a href="/web-development">Web Development</a></li>
                <li><a href="/mobile-apps">Mobile Applications</a></li>
                <li><a href="/cloud-solutions">Cloud Solutions</a></li>
                <li><a href="/it-consulting">IT Consulting</a></li>
              </ul>
            </div>

            {/* Developers */}
            <div className="footer-col">
              <h3 className="footer-heading">Developers</h3>
              <div className="developer-info">
                <p>Built with React & Node.js</p>
                <div className="developer-contact">
                  <div className="contact-item">
                    <Phone size={16} className="contact-icon" />
                    <span>0782605270</span>
                  </div>
                  <div className="contact-item">
                    <Mail size={16} className="contact-icon" />
                    <span>nshutiprophetelisa@gmail.com</span>
                  </div>
                </div>
                <div className="social-links">
                  <a href="https://github.com/NSHUT28" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                    <Github size={18} />
                  </a>
                  <a href="https://www.linkedin.com/in/nshuti-prophet-elisa-b92270361/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; {new Date().getFullYear()} SamTech Group. All rights reserved.</p>
            <div className="social-links">
              <a href="#" aria-label="Twitter"><Twitter size={16} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={16} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={16} /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;