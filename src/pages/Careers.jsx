import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowRight, FileText, MapPin, Briefcase, Clock, X } from "lucide-react";
import "../styles/Careers.css";
import { BASE_URL } from "../utils/server";

const API_URL = `${BASE_URL}/api/careers`;

const Careers = () => {
  console.log({API_BASE_URL: import.meta.env.VITE_API_BASE_URL});
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
    <div className="careers-page">
      {/* Hero Section */}
      <section className="careers-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1>
              Career <span>Opportunities</span>
            </h1>
            <p className="hero-subtitle">
              Join our team of innovators and grow your career with SamTech Group
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            Loading career opportunities...
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {careers.length === 0 && !isLoading ? (
          <div className="no-careers">
            <p>No current job openings. Please check back later.</p>
            <a href="/contact" className="cta-button primary">
              Contact Us <ArrowRight size={18} />
            </a>
          </div>
        ) : (
          <div className="careers-grid">
            {careers.map((career) => (
              <div 
                key={career._id} 
                className="career-card"
                onClick={() => openCareerModal(career)}
              >
                <div className="career-header">
                  <h2>{career.title}</h2>
                  <div className="career-meta">
                    <span className="career-type">
                      <Briefcase size={16} /> {career.type}
                    </span>
                    <span className="career-location">
                      <MapPin size={16} /> {career.location}
                    </span>
                  </div>
                </div>

                <div className="career-content">
                  <div className="career-section">
                    <h3>Job Description</h3>
                    <p>{career.description.substring(0, 150)}...</p>
                  </div>

                  <div className="career-footer">
                    <p className="deadline">
                      <Clock size={16} /> <strong>Deadline:</strong> {formatDate(career.deadline)}
                    </p>
                    <button className="view-details-btn">
                      View Details <ArrowRight size={16} />
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
        <div className="career-modal">
          <div className="modal-overlay" onClick={closeCareerModal}></div>
          <div className="modal-content">
            <button className="close-modal" onClick={closeCareerModal}>
              <X size={24} />
            </button>
            
            <div className="modal-header">
              <h2>{selectedCareer.title}</h2>
              <div className="career-meta">
                <span className="career-type">
                  <Briefcase size={18} /> {selectedCareer.type}
                </span>
                <span className="career-location">
                  <MapPin size={18} /> {selectedCareer.location}
                </span>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>Job Description</h3>
                <p>{selectedCareer.description}</p>
              </div>

              <div className="modal-section">
                <h3>Requirements</h3>
                <p>{selectedCareer.requirements}</p>
              </div>

              <div className="modal-section">
                <h3>Application Deadline</h3>
                <p className="deadline">
                  <Clock size={18} /> {formatDate(selectedCareer.deadline)}
                </p>
              </div>

              {selectedCareer.pdfUrl && (
                <div className="modal-section">
                  <h3>Job Details</h3>
                  <a
                    href={`http://localhost:5000${selectedCareer.pdfUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-download"
                  >
                    <FileText size={18} /> Download Full Job Description (PDF)
                  </a>
                </div>
              )}
            </div>

            <div className="modal-footer">
            <a href="/contact"><button className="apply-btn">
                Contact Now <ArrowRight size={18} />
              </button></a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;