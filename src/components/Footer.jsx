import React from "react";
import { MapPin, Mail as MailIcon, Phone, Clock, Linkedin, Twitter, Facebook, Instagram, Github } from "lucide-react"; // Renamed Mail to MailIcon
import { NavLink } from "react-router-dom";
// Removed: import "../styles/Footer.css"; // Styles will be handled by Tailwind

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const navLinkClasses = ({ isActive }) => 
    `py-1 relative transition-colors ${isActive ? 'text-accent font-medium' : 'text-muted hover:text-foreground'}`;

  return (
    <footer className="bg-background text-muted text-sm relative pt-16 mt-20"> {/* Increased mt-20 for wave space */}
      <div className="absolute -top-15 left-0 w-full h-16 overflow-hidden"> {/* Footer Wave */}
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="var(--accent)"></path> {/* Changed fill to var(--accent) */}
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="var(--accent)"></path> {/* Changed fill to var(--accent) */}
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="var(--accent)"></path> {/* Changed fill to var(--accent) */}
        </svg>
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8 relative z-10"> {/* Main Content Area */}
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="mb-5 lg:mb-0">
              <span className="text-2xl font-bold text-accent mb-4 block">SamTech Group</span>
              <p className="text-muted mb-5 leading-relaxed">
                Innovating technology solutions for a smarter future.
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3 text-muted">
                  <MapPin className="text-accent mt-1 flex-shrink-0" size={18} />
                  <span>Ngoma-Kibungo, Rwanda</span>
                </div>
                <div className="flex items-start gap-3 text-muted">
                  <MailIcon className="text-accent mt-1 flex-shrink-0" size={18} />
                  <a href="mailto:info@samtechgrp.co.ke" className="hover:text-accent transition-colors">info@samtechgrp.co.ke</a>
                </div>
                <div className="flex items-start gap-3 text-muted">
                  <Phone className="text-accent mt-1 flex-shrink-0" size={18} />
                  <a href="tel:+250781599881" className="hover:text-accent transition-colors">+250 781 599 881</a>
                </div>
                <div className="flex items-start gap-3 text-muted">
                  <Clock className="text-accent mt-1 flex-shrink-0" size={18} />
                  <span>Mon-Fri: 8:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-5 text-accent relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-accent">Quick Links</h3>
              <ul className="flex flex-col gap-2.5">
                <li><NavLink to="/" className={navLinkClasses}>Home</NavLink></li>
                <li><NavLink to="/products" className={navLinkClasses}>Services</NavLink></li> {/* Changed /services to /products based on existing routes */}
                <li><NavLink to="/portfolio" className={navLinkClasses}>Portfolio</NavLink></li> {/* Changed /about to /portfolio */}
                <li><NavLink to="/careers" className={navLinkClasses}>Careers</NavLink></li>
                <li><NavLink to="/contact" className={navLinkClasses}>Contact</NavLink></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-5 text-accent relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-accent">Our Services</h3>
              <ul className="flex flex-col gap-2.5">
                <li><NavLink to="/products#web-development" className={navLinkClasses}>Web Development</NavLink></li> {/* Example: link to section if possible */}
                <li><NavLink to="/products#mobile-apps" className={navLinkClasses}>Mobile Applications</NavLink></li>
                <li><NavLink to="/products#cloud-solutions" className={navLinkClasses}>Cloud Solutions</NavLink></li>
                <li><NavLink to="/products#it-consulting" className={navLinkClasses}>IT Consulting</NavLink></li>
                <li><NavLink to="/products#digital-marketing" className={navLinkClasses}>Digital Marketing</NavLink></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="max-w-sm">
              <h3 className="text-lg font-semibold mb-5 text-accent relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-accent">Newsletter</h3>
              <p className="text-muted mb-5 leading-relaxed">
                Subscribe to our newsletter for the latest updates and offers.
              </p>
              <form className="flex flex-col sm:flex-row gap-2 mb-5">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  required 
                  className="flex-grow px-4 py-2.5 border border-border bg-gray-100 dark:bg-gray-700 text-foreground rounded-md focus:ring-2 focus:ring-accent focus:border-transparent outline-none placeholder-muted"
                />
                <button type="submit" className="px-5 py-2.5 bg-accent text-background rounded-md font-semibold hover:bg-accent-dark transition-all duration-300 ease-in-out hover:-translate-y-0.5">
                  Subscribe
                </button>
              </form>
              <div className="flex gap-3 mt-5">
                <a href="#" aria-label="LinkedIn" className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-muted hover:bg-accent hover:text-background transition-all duration-300 ease-in-out hover:-translate-y-0.5">
                  <Linkedin size={20} />
                </a>
                <a href="#" aria-label="Twitter" className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-muted hover:bg-accent hover:text-background transition-all duration-300 ease-in-out hover:-translate-y-0.5">
                  <Twitter size={20} />
                </a>
                <a href="#" aria-label="Facebook" className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-muted hover:bg-accent hover:text-background transition-all duration-300 ease-in-out hover:-translate-y-0.5">
                  <Facebook size={20} />
                </a>
                <a href="#" aria-label="Instagram" className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-muted hover:bg-accent hover:text-background transition-all duration-300 ease-in-out hover:-translate-y-0.5">
                  <Instagram size={20} />
                </a>
                <a href="#" aria-label="GitHub" className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-muted hover:bg-accent hover:text-background transition-all duration-300 ease-in-out hover:-translate-y-0.5">
                  <Github size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-black/50 py-5 border-t border-border"> {/* Footer Bottom */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left text-xs text-muted">
            <div className="order-2 md:order-1">
              &copy; {currentYear} SamTech Group. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 order-1 md:order-2">
              <NavLink to="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</NavLink>
              <NavLink to="/terms-of-service" className="hover:text-accent transition-colors">Terms of Service</NavLink>
              <NavLink to="/cookies-policy" className="hover:text-accent transition-colors">Cookies Policy</NavLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;