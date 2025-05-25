import React from "react";
import { MapPin, Phone, Mail as MailIcon, Clock, Linkedin, Twitter, Facebook, Mailbox, Headphones, LifeBuoy, ArrowRight } from "lucide-react"; // Renamed Mail to MailIcon to avoid conflict
import { toast } from 'react-toastify'; // Assuming react-toastify is used for alerts
// Removed "../styles/Contacts.css"; as styles will be handled by Tailwind
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
        toast.success("Thank you for your message! We'll get back to you soon.");
        e.target.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error("There was an error sending your message. Please try again later.");
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section - Assuming .contacts-hero and .hero-overlay manage background image and gradient in CSS */}
      <section className="contacts-hero relative h-[50vh] min-h-[400px] flex items-center -mt-[70px] pt-[70px]">
        <div className="hero-overlay absolute inset-0 opacity-90"></div> {/* Kept for gradient, defined in CSS */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight text-white">
              Contact <span className="text-accent">Us</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl opacity-90 text-white">
              We'd love to hear from you. Reach out for inquiries, support, or partnership opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Location Card */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl border-t-4 border-accent">
              <div className="mb-5 text-accent flex justify-center">
                <MapPin size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Our Headquarters</h3>
              <p className="text-sm text-muted">123 Tech Park Avenue</p>
              <p className="text-sm text-muted">Nairobi, Kenya</p>
              <p className="text-sm text-muted">P.O. Box 45678-00100</p>
            </div>

            {/* Phone Card */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl border-t-4 border-accent">
              <div className="mb-5 text-accent flex justify-center">
                <Phone size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Phone Numbers</h3>
              <p className="text-sm text-muted">Main: +250 735 832 224</p>
              <p className="text-sm text-muted">Support: +250 735 832 224</p>
              <p className="text-sm text-muted">Sales: +250 735 832 224</p>
            </div>

            {/* Email Card */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl border-t-4 border-accent">
              <div className="mb-5 text-accent flex justify-center">
                <MailIcon size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Email Addresses</h3>
              <p className="text-sm text-muted">General: info@samtechgroup.co.ke</p>
              <p className="text-sm text-muted">Support: support@samtechgroup.co.ke</p>
              <p className="text-sm text-muted">Sales: sales@samtechgroup.co.ke</p>
            </div>

            {/* Hours Card */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl border-t-4 border-accent">
              <div className="mb-5 text-accent flex justify-center">
                <Clock size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Working Hours</h3>
              <p className="text-sm text-muted">Monday - Friday: 8:00 AM - 5:00 PM</p>
              <p className="text-sm text-muted">Saturday: 9:00 AM - 1:00 PM</p>
              <p className="text-sm text-muted">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="name" className="block mb-2 font-semibold text-foreground">Full Name</label>
                  <input type="text" id="name" name="name" required className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-border rounded-md focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground placeholder-muted"/>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block mb-2 font-semibold text-foreground">Email Address</label>
                    <input type="email" id="email" name="email" required className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-border rounded-md focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground placeholder-muted"/>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block mb-2 font-semibold text-foreground">Phone Number</label>
                    <input type="tel" id="phone" name="phone" className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-border rounded-md focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground placeholder-muted"/>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block mb-2 font-semibold text-foreground">Subject</label>
                  <select id="subject" name="subject" required className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-border rounded-md focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground">
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="careers">Careers</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 font-semibold text-foreground">Your Message</label>
                  <textarea id="message" name="message" rows="5" required className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-border rounded-md focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground placeholder-muted resize-y min-h-[120px]"></textarea>
                </div>

                <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-background rounded-md text-base font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-accent-dark hover:-translate-y-0.5 hover:shadow-lg mt-3 self-start">
                  Send Message <ArrowRight size={18} />
                </button>
              </form>
            </div>

            {/* Map and Support Info */}
            <div className="flex flex-col gap-8 mt-10 lg:mt-0">
              <div className="h-72 md:h-96 lg:h-full rounded-lg overflow-hidden shadow-lg">
                <iframe
                  title="SamTech Group Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.808559538274!2d36.82154831475395!3d-1.2923555359809296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d3b2b3b3b3%3A0x3b3b3b3b3b3b3b3b!2sTech%20Park%20Avenue!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-gray-800 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="text-accent flex-shrink-0 pt-1">
                    <Headphones size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1 text-foreground">Technical Support</h4>
                    <p className="text-sm text-muted mb-1">Available 24/7 for critical issues</p>
                    <a href="mailto:support@samtechgroup.co.ke" className="text-sm text-accent font-medium hover:underline">support@samtechgroup.co.ke</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-gray-800 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="text-accent flex-shrink-0 pt-1">
                    <LifeBuoy size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1 text-foreground">Customer Service</h4>
                    <p className="text-sm text-muted mb-1">Monday - Friday, 8:00 AM - 5:00 PM</p>
                    <a href="tel:+254700123456" className="text-sm text-accent font-medium hover:underline">+250 735 832 224</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-gray-800 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="text-accent flex-shrink-0 pt-1">
                    <Mailbox size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1 text-foreground">Email Support</h4>
                    <p className="text-sm text-muted mb-1">Response within 24 hours</p>
                    <a href="mailto:info@samtechgroup.co.ke" className="text-sm text-accent font-medium hover:underline">info@samtechgroup.co.ke</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 md:py-20 bg-gray-100 dark:bg-gray-800 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Connect With Us</h2>
          <p className="text-muted mb-8 max-w-xl mx-auto">Follow us on social media for the latest updates and news</p>
          
          <div className="flex justify-center gap-6">
            <a href="https://linkedin.com/company/samtechgroup" target="_blank" rel="noopener noreferrer" className="text-accent transition-all duration-300 hover:text-accent-dark hover:-translate-y-1">
              <Linkedin size={36} />
            </a>
            <a href="https://twitter.com/samtechgroup" target="_blank" rel="noopener noreferrer" className="text-accent transition-all duration-300 hover:text-accent-dark hover:-translate-y-1">
              <Twitter size={36} />
            </a>
            <a href="https://facebook.com/samtechgroup" target="_blank" rel="noopener noreferrer" className="text-accent transition-all duration-300 hover:text-accent-dark hover:-translate-y-1">
              <Facebook size={36} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacts;