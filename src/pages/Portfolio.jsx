import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import { ArrowRight, Search, X, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
// Removed: import "../styles/Portfolio.css"; // Styles will be handled by Tailwind

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

  const filterButtonClasses = (type) => 
    `px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 ${
      activeFilter === type 
        ? 'bg-accent text-background' 
        : 'bg-gray-100 dark:bg-gray-700 text-foreground hover:bg-gray-200 dark:hover:bg-gray-600'
    }`;

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 dark:from-gray-800 dark:to-gray-900 text-white py-20 text-center -mt-[70px] pt-[calc(70px+3rem)] md:pt-[calc(70px+5rem)]">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-accent">Work</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            Showcasing our passion for creating digital solutions that deliver results
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Portfolio Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 md:mb-12">
          <div className="relative w-full md:max-w-xs">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground placeholder-muted"
            />
            {searchTerm && (
              <X
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted cursor-pointer hover:text-accent"
                onClick={() => setSearchTerm("")}
                size={20}
              />
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {['all', 'Web Development', 'Web Application', 'UI/UX Design'].map(filter => (
              <button 
                key={filter}
                className={filterButtonClasses(filter === 'all' ? 'all' : filter)}
                onClick={() => setActiveFilter(filter === 'all' ? 'all' : filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 text-muted text-xl">
            <p>No projects match your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl"
                onClick={() => openProjectModal(project)}
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="px-4 py-2 bg-accent text-background rounded-md text-sm font-semibold flex items-center gap-2">
                      View Project <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-accent/20 text-accent mb-2">{project.category}</span>
                  <h3 className="text-xl font-semibold mb-1 text-foreground">{project.title}</h3>
                  <div className="flex justify-between text-xs text-muted">
                    <span>{project.client}</span>
                    <span>{project.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Work Slider */}
        {filteredProjects.length > 0 && (
          <div className="py-12 md:py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-foreground">Featured Case Studies</h2>
            <div className="max-w-5xl mx-auto">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                className="pb-10" // Added padding-bottom for pagination
              >
                {filteredProjects.slice(0, 3).map(project => ( // Ensure at least one item for Swiper
                  <SwiperSlide key={`featured-${project.id}`}>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
                      <div className="md:w-1/2 h-64 md:h-auto">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover"/>
                      </div>
                      <div className="md:w-1/2 p-6 flex flex-col justify-center">
                        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-accent/20 text-accent mb-2 self-start">{project.category}</span>
                        <h3 className="text-2xl font-semibold mb-2 text-foreground">{project.title}</h3>
                        <p className="text-muted mb-4">{project.results}</p>
                        <button 
                          className="self-start px-5 py-2.5 bg-accent text-background rounded-lg text-sm font-semibold hover:bg-accent-dark transition-colors flex items-center gap-2"
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
        )}
      </div>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary to-blue-700 dark:from-gray-800 dark:to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-lg opacity-90 mb-8">
              Whether you have a clear vision or just an idea, we can help bring it to life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/contact" className="px-8 py-3 bg-accent text-background rounded-lg font-semibold hover:bg-accent-dark transition-colors flex items-center justify-center gap-2">
                Get Started <ArrowRight size={18} />
              </a>
              <a href="/services" className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
                Our Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative bg-background dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col border-t-4 border-accent">
            <button 
              className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-foreground hover:bg-accent hover:text-background transition-colors z-10" 
              onClick={closeProjectModal}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            
            <div className="p-6 border-b border-border">
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-accent/20 text-accent mb-2">{selectedProject.category}</span>
              <h2 className="text-2xl md:text-3xl font-bold my-1 text-foreground">{selectedProject.title}</h2>
              <div className="flex justify-between text-sm text-muted">
                <span><strong>Client:</strong> {selectedProject.client}</span>
                <span><strong>Year:</strong> {selectedProject.year}</span>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-grow grid md:grid-cols-2 gap-6">
              <div className="h-64 md:h-auto rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover"/>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Project Overview</h3>
                  <p className="text-muted">{selectedProject.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Key Results</h3>
                  <p className="text-muted">{selectedProject.results}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-primary-lighter text-primary rounded-full text-xs font-medium">{tech}</span>
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