import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import { ArrowRight, Search, X, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "../styles/Portfolio.css";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample portfolio data for a new company (can include personal/small projects)
  const portfolioItems = [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "Web Development",
      description: "Developed a full-featured online store with product management, cart functionality, and secure checkout. Implemented responsive design for optimal mobile experience.",
      image: "/ec.png",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      client: "Local Boutique",
      year: "2023",
      results: "Increased client's online sales by 200% in first 3 months"
    },
    {
      id: 2,
      title: "Business Management Dashboard",
      category: "Web Application",
      description: "Custom CRM solution with analytics dashboard, client management, and task tracking. Automated several manual processes saving 15+ hours/week.",
      image: "/bm.png",
      technologies: ["Vue.js", "Firebase", "Chart.js"],
      client: "Small Business Client",
      year: "2023",
      results: "Reduced administrative workload by 40%"
    },
    {
      id: 3,
      title: "Mobile App Prototype",
      category: "UI/UX Design",
      description: "Designed and prototyped a fitness tracking mobile application with custom illustrations and smooth animations.",
      image: "/ma.png",
      technologies: ["Figma", "Adobe XD", "Lottie"],
      client: "Startup Concept",
      year: "2022",
      results: "Won local design competition with this concept"
    },
    {
      id: 4,
      title: "Portfolio Website",
      category: "Web Development",
      description: "Modern, performant portfolio website with CMS integration allowing easy content updates by the client.",
      image: "/port.png",
      technologies: ["Next.js", "Tailwind CSS", "Sanity.io"],
      client: "Freelance Photographer",
      year: "2023",
      results: "Client reported 50% increase in booking inquiries"
    }
  ];

  const filteredProjects = portfolioItems.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "all" || project.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const openProjectModal = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="portfolio-page">
      {/* Hero Section */}
      <section className="portfolio-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1>
              Our <span>Work</span>
            </h1>
            <p className="hero-subtitle">
              Showcasing our passion for creating digital solutions that deliver results
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Portfolio Controls */}
        <div className="portfolio-controls">
          <div className="search-container">
            <div className="search-input">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <X
                  className="clear-icon"
                  onClick={() => setSearchTerm("")}
                />
              )}
            </div>
          </div>

          <div className="filter-buttons">
            <button 
              className={activeFilter === "all" ? "active" : ""}
              onClick={() => setActiveFilter("all")}
            >
              All Work
            </button>
            <button 
              className={activeFilter === "Web Development" ? "active" : ""}
              onClick={() => setActiveFilter("Web Development")}
            >
              Web Development
            </button>
            <button 
              className={activeFilter === "Web Application" ? "active" : ""}
              onClick={() => setActiveFilter("Web Application")}
            >
              Web Apps
            </button>
            <button 
              className={activeFilter === "UI/UX Design" ? "active" : ""}
              onClick={() => setActiveFilter("UI/UX Design")}
            >
              UI/UX Design
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="no-projects">
            <p>No projects match your search criteria.</p>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="project-card"
                onClick={() => openProjectModal(project)}
              >
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                  <div className="project-overlay">
                    <button className="view-btn">
                      View Project <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
                <div className="project-info">
                  <span className="project-category">{project.category}</span>
                  <h3>{project.title}</h3>
                  <div className="project-meta">
                    <span>{project.client}</span>
                    <span>{project.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Work Slider */}
        <div className="featured-work">
          <h2 className="section-title">Featured Case Studies</h2>
          <div className="featured-slider">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              className="featured-swiper"
            >
              {filteredProjects.slice(0, 3).map(project => (
                <SwiperSlide key={`featured-${project.id}`}>
                  <div className="featured-card">
                    <div className="featured-image">
                      <img src={project.image} alt={project.title} />
                    </div>
                    <div className="featured-content">
                      <span className="category-badge">{project.category}</span>
                      <h3>{project.title}</h3>
                      <p className="project-results">{project.results}</p>
                      <button 
                        className="view-case-study"
                        onClick={() => openProjectModal(project)}
                      >
                        View Case Study <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="portfolio-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Project?</h2>
            <p>
              Whether you have a clear vision or just an idea, we can help bring it to life.
            </p>
            <div className="cta-buttons">
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

      {/* Project Modal */}
      {selectedProject && (
        <div className="project-modal">
          <div className="modal-overlay" onClick={closeProjectModal}></div>
          <div className="modal-content">
            <button className="close-modal" onClick={closeProjectModal}>
              <X size={24} />
            </button>
            
            <div className="modal-header">
              <span className="project-category">{selectedProject.category}</span>
              <h2>{selectedProject.title}</h2>
              <div className="project-meta">
                <span><strong>Client:</strong> {selectedProject.client}</span>
                <span><strong>Year:</strong> {selectedProject.year}</span>
              </div>
            </div>

            <div className="modal-body">
              <div className="project-image">
                <img src={selectedProject.image} alt={selectedProject.title} />
              </div>

              <div className="project-details">
                <div className="details-section">
                  <h3>Project Overview</h3>
                  <p>{selectedProject.description}</p>
                </div>

                <div className="details-section">
                  <h3>Key Results</h3>
                  <p>{selectedProject.results}</p>
                </div>

                <div className="details-section">
                  <h3>Technologies Used</h3>
                  <div className="tech-tags">
                    {selectedProject.technologies.map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;