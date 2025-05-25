import React from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
// Swiper imports are not used in this refactored version, can be removed if not needed for other parts
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
import "../styles/Products.css"; // Keep for hero gradient if not moved

function Products() {
  const services = [
    {
      id: 1,
      title: "Software Development",
      description: "We build web apps, mobile apps, and automation tools tailored to your business needs.",
      image: "./system_images/software.jpg", // Ensure these paths are correct relative to public directory or use import
      price: "Starting at $200",
      icon: "💻",
    },
    {
      id: 2,
      title: "Computer Repairs",
      description: "Hardware diagnostics, upgrades, and fast repair services for all devices and brands.",
      image: "./system_images/computer_repair.jpg",
      price: "Starting at $25",
      icon: "🛠️",
    },
    {
      id: 3,
      title: "Digital Advertising",
      description: "Comprehensive online marketing, graphic design, branding and video content creation.",
      image: "./system_images/advert.jpg",
      price: "Custom pricing",
      icon: "📢",
    },
    {
      id: 4,
      title: "Network Solutions",
      description: "Professional network setup, security, and maintenance for businesses of all sizes.",
      image: "./system_images/network.jpg",
      price: "Starting at $150",
      icon: "🌐",
    },
    {
      id: 5,
      title: "IT Support",
      description: "Reliable ongoing IT support and troubleshooting for your business operations.",
      image: "./system_images/support.jpg",
      price: "Monthly plans available",
      icon: "🛟",
    },
    {
      id: 6,
      title: "Data Recovery",
      description: "Expert data recovery services for all storage devices and situations.",
      image: "./system_images/data.jpg",
      price: "Starting at 50,000RF",
      icon: "💾",
    },
  ];

  return (
    <div className="bg-background text-foreground font-sans leading-relaxed"> {/* Replaces .products-page */}
      {/* Hero Section - Assuming .products-hero class in Products.css handles the gradient background */}
      <section className="products-hero relative h-[60vh] min-h-[500px] flex items-center text-white -mt-[70px] pt-[70px]">
        {/* products-hero-overlay is handled by the gradient in .products-hero or could be an ::before pseudo-element */}
        <div className="container mx-auto px-4 w-11/12 max-w-6xl"> {/* Replaces .products-container */}
          <div className="max-w-2xl"> {/* Replaces .products-hero-content implicitly by max-width */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
              Our <span className="text-accent">Products & Services</span>
            </h1>
            <p className="text-lg sm:text-xl mb-8 max-w-xl opacity-90">
              Comprehensive technology solutions designed to meet your business needs and drive growth
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-20 bg-background"> {/* Replaces .products-section */}
        <div className="container mx-auto px-4 w-11/12 max-w-6xl"> {/* Replaces .products-container */}
          <h2 className="text-3xl md:text-4xl font-bold text-accent text-center mb-4">What We Offer</h2>
          <p className="text-lg text-muted text-center mb-12 max-w-2xl mx-auto">
            Professional services with transparent pricing to help you plan your technology investment
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Replaces .products-grid */}
            {services.map((service) => (
              <div key={service.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl border-t-4 border-accent dark:border-accent"> {/* Card: light bg, dark bg */}
                <div className="relative h-52 overflow-hidden"> {/* Replaces .products-image-container */}
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" /> {/* Replaces .products-image, group-hover for card needed if not targeting card directly */}
                  <div className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-700 bg-opacity-80 dark:bg-opacity-70 w-12 h-12 rounded-full flex items-center justify-center text-2xl text-accent"> {/* Icon background */}
                    {service.icon}
                  </div>
                </div>
                <div className="p-6"> {/* Replaces .products-content */}
                  <h3 className="text-xl font-semibold mb-3 text-accent">{service.title}</h3>
                  <p className="text-muted mb-5 min-h-[60px]">{service.description}</p>
                  <div className="flex justify-between items-center mt-4"> {/* Replaces .products-footer */}
                    <span className="text-accent font-bold text-lg">{service.price}</span> {/* Replaces .products-price */}
                    <a href={`/services/${service.id}`} className="inline-flex items-center text-accent font-semibold transition-colors duration-300 hover:text-accent-dark group"> {/* Replaces .products-link */}
                      Details <ChevronRight size={18} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-center min-h-[50vh] flex items-center justify-center"> {/* Replaces .products-cta-section style was minHeight:100vh */}
        <div className="container mx-auto px-4 w-11/12 max-w-6xl"> {/* Replaces .products-container */}
          <div className="max-w-3xl mx-auto"> {/* Replaces .products-cta-content */}
            <h2 className="text-3xl sm:text-4xl font-bold mb-5">Need Custom Solutions?</h2>
            <p className="text-lg sm:text-xl mb-10 opacity-90">
              Contact us for personalized service packages tailored to your specific requirements.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5"> {/* Replaces .products-cta-buttons */}
              <a href="/contact" className="px-6 py-3 text-lg font-medium rounded-lg bg-accent text-background transition-colors duration-300 hover:bg-accent-dark inline-flex items-center justify-center group">
                Get a Quote <ArrowRight size={20} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="/services" className="px-6 py-3 text-lg font-medium rounded-lg border-2 border-accent text-accent transition-colors duration-300 hover:bg-accent hover:text-background inline-flex items-center justify-center">
                All Services
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Products;