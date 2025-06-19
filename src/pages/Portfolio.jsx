// src/components/Portfolio.js
import React, { useState } from "react";
import { ArrowRight, Search, X, ChevronRight, Monitor, Smartphone, Layout, Code } from "lucide-react";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Portfolio data with 4 sample projects
  const portfolioItems = [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "Web Development",
      description: "Developed a full-featured online store with product management, cart functionality, and secure checkout. Implemented responsive design for optimal mobile experience.",
      image: "bg-gradient-to-r from-indigo-500 to-purple-600",
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
      image: "bg-gradient-to-r from-cyan-500 to-blue-500",
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
      image: "bg-gradient-to-r from-green-500 to-emerald-500",
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
      image: "bg-gradient-to-r from-rose-500 to-pink-500",
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

  // Category icons
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Web Development": return <Code className="w-5 h-5" />;
      case "Web Application": return <Monitor className="w-5 h-5" />;
      case "UI/UX Design": return <Layout className="w-5 h-5" />;
      default: return <Smartphone className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-4">
            Our Portfolio
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Showcasing our passion for creating digital solutions that deliver results
          </p>
        </div>

        {/* Portfolio Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button onClick={() => setSearchTerm("")} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {["all", "Web Development", "Web Application", "UI/UX Design"].map((filter) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === "all" ? "All Projects" : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 dark:bg-gray-700" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No projects found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                onClick={() => openProjectModal(project)}
              >
                <div className={`h-48 ${project.image} relative`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <div className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {getCategoryIcon(project.category)}
                      {project.category}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
                    <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                      {project.year}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span 
                        key={tech} 
                        className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  <button className="mt-4 w-full flex items-center justify-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl mb-16">
          <div className="px-8 py-12 md:p-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
                Whether you have a clear vision or just an idea, we can help bring it to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="#" 
                  className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href="/#products" 
                  className="px-6 py-3 bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:bg-indigo-800 transition-colors"
                >
                  View Our Services
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={closeProjectModal}></div>
          
          <div className="flex items-center justify-center min-h-screen p-4">
            <div 
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={closeProjectModal}
              >
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              
              <div className={`h-64 ${selectedProject.image} relative`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                  <div>
                    <div className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium w-fit mb-3">
                      {getCategoryIcon(selectedProject.category)}
                      {selectedProject.category}
                    </div>
                    <h2 className="text-3xl font-bold text-white">{selectedProject.title}</h2>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Project Overview</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedProject.description}
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Client</h4>
                      <p className="text-gray-900 dark:text-white">{selectedProject.client}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Year</h4>
                      <p className="text-gray-900 dark:text-white">{selectedProject.year}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Results</h4>
                      <p className="text-gray-900 dark:text-white">{selectedProject.results}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.technologies.map(tech => (
                      <span 
                        key={tech} 
                        className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <a 
                    href="#" 
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Visit Project <ArrowRight className="w-4 h-4" />
                  </a>
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