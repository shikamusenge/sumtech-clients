// src/components/FloatingContactButton.js
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ContactForm from './ContactForm';

const FloatingContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
          aria-label={isOpen ? "Close contact form" : "Open contact form"}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

      {/* Contact Form Panel */}
      <div 
        className={`fixed bottom-20 right-6 z-50 w-full max-w-md transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              Contact Us
            </h3>
            <ContactForm 
              title={null} 
              showSubject={true}
              buttonText="Send Message"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingContactButton;