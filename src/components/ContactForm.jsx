// src/components/ContactForm.js
import React from "react";
import { ArrowRight } from "lucide-react";
import { BASE_URL } from "../utils/server";

const ContactForm = ({ 
  title = "Send Us a Message",
  showName = true,
  showPhone = true,
  showSubject = true,
  buttonText = "Send Message"
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };
  
    try {
      const response = await fetch(`${BASE_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        alert("Thank you for your message! We'll get back to you soon.");
        e.target.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      alert("There was an error sending your message. Please try again later.");
      console.error('Error:', error);
    }
  };

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {title}
        </h2>
      )}
      
      <form 
        onSubmit={handleSubmit} 
        className="space-y-5"
      >
        {showName && (
          <div className="space-y-2">
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
            </label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          
          {showPhone && (
            <div className="space-y-2">
              <label 
                htmlFor="phone" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone Number
              </label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          )}
        </div>

        {showSubject && (
          <div className="space-y-2">
            <label 
              htmlFor="subject" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Subject
            </label>
            <select 
              id="subject" 
              name="subject" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">Select a subject</option>
              <option value="general">General Inquiry</option>
              <option value="sales">Sales Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="partnership">Partnership Opportunity</option>
              <option value="careers">Careers</option>
            </select>
          </div>
        )}

        <div className="space-y-2">
          <label 
            htmlFor="message" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Your Message
          </label>
          <textarea 
            id="message" 
            name="message" 
            rows="5" 
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:focus:ring-offset-gray-800"
        >
          {buttonText} <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
};

export default ContactForm;