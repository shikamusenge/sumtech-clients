import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowRight, FileText, MapPin, Briefcase, Clock, X } from "lucide-react";
import { BeatLoader } from 'react-spinners'; // Import BeatLoader
import "../styles/Careers.css"; // Keep for hero gradient, will be minimized later
import { BASE_URL } from "../utils/server";

const API_URL = `${BASE_URL}/api/careers`;

const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCareer, setSelectedCareer] = useState(null);

  useEffect(() => {
    const fetchCareers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(API_URL);
        setCareers(response.data);
      } catch (err) {
        setError("Failed to load career opportunities. Please try again later.");
        console.error("Error fetching careers:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCareers();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openCareerModal = (career) => {
    setSelectedCareer(career);
    document.body.style.overflow = 'hidden';
  };

  const closeCareerModal = () => {
    setSelectedCareer(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="careers-hero relative h-[50vh] min-h-[400px] flex items-center text-white -mt-[70px] pt-[70px]">
        <div className="hero-overlay absolute inset-0 opacity-90"></div> {/* Gradient defined in Careers.css */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Career <span className="text-accent">Opportunities</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl opacity-90">
              Join our team of innovators and grow your career with SamTech Group
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-muted">
            <BeatLoader color={'var(--accent)'} size={15} />
            <p className="mt-4 text-lg">Loading career opportunities...</p>
          </div>
        )}
        
        {error && (
          <div className="my-8 p-4 bg-red-100 dark:bg-red-800 dark:bg-opacity-30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md text-center">
            {error}
          </div>
        )}

        {!isLoading && !error && careers.length === 0 && (
          <div className="text-center py-16 text-muted">
            <p className="text-xl mb-6">No current job openings. Please check back later.</p>
            <a href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-background rounded-full text-base font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-accent-dark hover:-translate-y-0.5 hover:shadow-lg">
              Contact Us <ArrowRight size={18} />
            </a>
          </div>
        )}

        {!isLoading && !error && careers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {careers.map((career) => (
              <div 
                key={career._id} 
                className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 border-t-4 border-accent group"
                onClick={() => openCareerModal(career)}
              >
                <div className="p-6"> {/* Career Header */}
                  <h2 className="text-xl font-semibold mb-3 text-accent group-hover:text-accent-dark transition-colors duration-300 line-clamp-2" title={career.title}>{career.title}</h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted mb-2">
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={14} /> {career.type}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} /> {career.location}
                    </span>
                  </div>
                </div>

                <div className="p-6 pt-0 flex-grow flex flex-col"> {/* Career Content */}
                  <div>
                    <h3 className="text-md font-semibold mb-1 text-foreground">Job Description</h3>
                    <p className="text-sm text-muted line-clamp-3 mb-4">{career.description}</p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3"> {/* Career Footer */}
                    <p className="flex items-center gap-1.5 text-xs text-muted">
                      <Clock size={14} /> <strong className="font-semibold text-foreground">Deadline:</strong> {formatDate(career.deadline)}
                    </p>
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-lighter text-accent border border-accent/50 rounded-md text-xs font-semibold hover:bg-accent hover:text-background transition-colors duration-300 self-end sm:self-auto">
                      View Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Career Detail Modal */}
      {selectedCareer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"> {/* Modal Backdrop/Overlay */}
          <div className="relative bg-background dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col border-t-4 border-accent"> {/* Modal Content */}
            <div className="p-6 border-b border-border"> {/* Modal Header */}
              <h2 className="text-2xl font-bold mb-3 text-accent">{selectedCareer.title}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <Briefcase size={16} /> {selectedCareer.type}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} /> {selectedCareer.location}
                </span>
              </div>
              <button 
                className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-foreground hover:bg-accent hover:text-background transition-colors z-10" 
                onClick={closeCareerModal}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow space-y-6"> {/* Modal Body */}
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Job Description</h3>
                <p className="text-muted whitespace-pre-line">{selectedCareer.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Requirements</h3>
                <p className="text-muted whitespace-pre-line">{selectedCareer.requirements}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Application Deadline</h3>
                <p className="flex items-center gap-1.5 text-muted">
                  <Clock size={18} /> {formatDate(selectedCareer.deadline)}
                </p>
              </div>

              {selectedCareer.pdfUrl && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Job Details</h3>
                  <a
                    href={`http://localhost:5000${selectedCareer.pdfUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-lighter text-accent border border-accent/50 rounded-md text-sm font-semibold hover:bg-accent hover:text-background transition-colors"
                  >
                    <FileText size={18} /> Download Full Job Description (PDF)
                  </a>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border text-right"> {/* Modal Footer */}
              <a href="/contact">
                <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-background rounded-md text-base font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-accent-dark hover:-translate-y-0.5 hover:shadow-lg">
                  Contact Now <ArrowRight size={18} />
                </button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;