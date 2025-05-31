import React from "react";
import { MapPin, Phone, Mail, Clock, Linkedin, Twitter, Facebook, Mailbox, Headphones, LifeBuoy, ArrowRight } from "lucide-react";
import "../styles/Contacts.css";
import { BASE_URL } from "../utils/server";
const Contacts = () => {
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
    <div className="contacts-page" id="contact">
      {/* Hero Section */}
      <section className="contacts-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1>
              Contact <span>Us</span>
            </h1>
            <p className="hero-subtitle">
              We'd love to hear from you. Reach out for inquiries, support, or partnership opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-cards">
            {/* Location Card */}
            <div className="contact-card">
              <div className="contact-icon">
                <MapPin size={40} />
              </div>
              <h3>Our Headquarters</h3>
              <p>123 Tech Park Avenue</p>
              <p>Nairobi, Kenya</p>
              <p>P.O. Box 45678-00100</p>
            </div>

            {/* Phone Card */}
            <div className="contact-card">
              <div className="contact-icon">
                <Phone size={40} />
              </div>
              <h3>Phone Numbers</h3>
              <p>Main: +250 735 832 224</p>
              <p>Support: +250 735 832 224</p>
              <p>Sales: +250 735 832 224</p>
            </div>

            {/* Email Card */}
            <div className="contact-card">
              <div className="contact-icon">
                <Mail size={40} />
              </div>
              <h3>Email Addresses</h3>
              <p>General: info@samtechgroup.co.ke</p>
              <p>Support: support@samtechgroup.co.ke</p>
              <p>Sales: sales@samtechgroup.co.ke</p>
            </div>

            {/* Hours Card */}
            <div className="contact-card">
              <div className="contact-icon">
                <Clock size={40} />
              </div>
              <h3>Working Hours</h3>
              <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
              <p>Saturday: 9:00 AM - 1:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="contact-form-map">
        <div className="container">
          <div className="form-map-container">
            {/* Contact Form */}
            <div className="contact-form-container">
              <h2>Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select id="subject" name="subject" required>
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="careers">Careers</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea id="message" name="message" rows="5" required></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  Send Message <ArrowRight size={18} />
                </button>
              </form>
            </div>

            {/* Map and Support Info */}
            <div className="map-support-container">
              {/* Google Map Embed */}
              <div className="map-container">
                <iframe
                  title="SamTech Group Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.808559538274!2d36.82154831475395!3d-1.2923555359809296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d3b2b3b3b3%3A0x3b3b3b3b3b3b3b3b!2sTech%20Park%20Avenue!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>

              {/* Support Information */}
              <div className="support-info">
                <div className="support-item">
                  <div className="support-icon">
                    <Headphones size={32} />
                  </div>
                  <div className="support-text">
                    <h4>Technical Support</h4>
                    <p>Available 24/7 for critical issues</p>
                    <a href="mailto:support@samtechgroup.co.ke">support@samtechgroup.co.ke</a>
                  </div>
                </div>

                <div className="support-item">
                  <div className="support-icon">
                    <LifeBuoy size={32} />
                  </div>
                  <div className="support-text">
                    <h4>Customer Service</h4>
                    <p>Monday - Friday, 8:00 AM - 5:00 PM</p>
                    <a href="tel:+254700123456">+250 735 832 224</a>
                  </div>
                </div>

                <div className="support-item">
                  <div className="support-icon">
                    <Mailbox size={32} />
                  </div>
                  <div className="support-text">
                    <h4>Email Support</h4>
                    <p>Response within 24 hours</p>
                    <a href="mailto:info@samtechgroup.co.ke">info@samtechgroup.co.ke</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="social-media-section">
        <div className="container">
          <h2>Connect With Us</h2>
          <p>Follow us on social media for the latest updates and news</p>
          
          <div className="social-icons">
            <a href="https://linkedin.com/company/samtechgroup" target="_blank" rel="noopener noreferrer">
              <Linkedin size={40} />
            </a>
            <a href="https://twitter.com/samtechgroup" target="_blank" rel="noopener noreferrer">
              <Twitter size={40} />
            </a>
            <a href="https://facebook.com/samtechgroup" target="_blank" rel="noopener noreferrer">
              <Facebook size={40} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacts;