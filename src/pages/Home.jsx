import React from "react";
import { ArrowRight, Phone, Mail, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../styles/Home.css";

const Home = () => {
  const services = [
    {
      id: 1,
      title: "IT Consulting",
      description: "Expert advice to optimize your technology strategy and infrastructure",
      icon: "💼",
    },
    {
      id: 2,
      title: "Web Development",
      description: "Professional websites with modern designs that drive business growth",
      icon: "🌐",
    },
    {
      id: 3,
      title: "Electronics Repair & Parts",
      description: "Expert repair services for all electronic devices with genuine replacement parts available for purchase",
      icon: "🔧",
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1>
              Reliable IT & Electronics Services <span>Fast, Professional, and Affordable!</span>
            </h1>
            <p className="hero-subtitle">
              SamTech Grp Ltd delivers cutting-edge technology solutions and electronics services 
              to help your business thrive in the digital age.
            </p>
            <div className="hero-cta">
              <a href="/contact" className="cta-button primary">
                Get Started <ArrowRight size={18} />
              </a>
              <a href="/services" className="cta-button secondary">
                Our Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-titles">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive IT and electronics services to support your needs
          </p>
          <div className="services-slider">
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              autoplay={{ delay: 5000 }}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
            >
              {services.map((service) => (
                <SwiperSlide key={service.id}>
                  <div className="service-card">
                    <div className="service-icon">{service.icon}</div>
                    <div className="service-content">
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                      <a href={`/services/${service.id}`} className="service-link">
                        Explore Service <ChevronRight size={16} />
                      </a>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Business?</h2>
            <p>
              Contact us today to discuss how SamTech Group can help with your technology
              and electronics needs.
            </p>
            <div className="cta-buttons">
              <a href="tel:+254700123456" className="cta-button phone">
                <Phone size={18} /> Call Us Now
              </a>
              <a href="mailto:info@samtechgroup.co.ke" className="cta-button email">
                <Mail size={18} /> Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;