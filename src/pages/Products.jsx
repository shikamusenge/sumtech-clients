import React from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../styles/Products.css";

function Products() {
  const services = [
    {
      id: 1,
      title: "Software Development",
      description: "We build web apps, mobile apps, and automation tools tailored to your business needs.",
      image: "./system_images/software.jpg",
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
    <div className="products-page">
  {/* Hero Section */}
  <section className="products-hero">
    <div className="products-hero-overlay"></div>
    <div className="products-container">
      <div className="products-hero-content">
        <h1>
          Our <span>Products & Services</span>
        </h1>
        <p className="products-hero-subtitle">
          Comprehensive technology solutions designed to meet your business needs and drive growth
        </p>
      </div>
    </div>
  </section>

  {/* Services Grid */}
  <section className="products-section">
    <div className="products-container">
      <h2 className="products-section-title">What We Offer</h2>
      <p className="products-section-subtitle">
        Professional services with transparent pricing to help you plan your technology investment
      </p>

      <div className="products-grid">
        {services.map((service) => (
          <div key={service.id} className="products-card">
            <div className="products-image-container">
              <img src={service.image} alt={service.title} className="products-image" />
              <div className="products-icon">{service.icon}</div>
            </div>
            <div className="products-content">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div className="products-footer">
                <span className="products-price">{service.price}</span>
                <a href={`/services/${service.id}`} className="products-link">
                  Details <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* CTA Section */}
  <section className="products-cta-section">
    <div className="products-container">
      <div className="products-cta-content">
        <h2>Need Custom Solutions?</h2>
        <p>
          Contact us for personalized service packages tailored to your specific requirements.
        </p>
        <div className="products-cta-buttons">
          <a href="/contact" className="products-cta-button primary">
            Get a Quote <ArrowRight size={18} />
          </a>
          <a href="/services" className="products-cta-button secondary">
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