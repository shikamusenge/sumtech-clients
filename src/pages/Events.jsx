import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Calendar, Clock, MapPin, Youtube, Search, X, ArrowRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/Events.css";
import { BASE_URL } from "../utils/server";

const API_URL = `${BASE_URL}/api/events`;

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(API_URL);
        setEvents(res.data);
        setFilteredEvents(res.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    let result = events;
    
    const now = new Date();
    if (activeFilter === "upcoming") {
      result = result.filter(event => new Date(event.date) > now);
    } else if (activeFilter === "past") {
      result = result.filter(event => new Date(event.date) <= now);
    }
    
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(term) || 
        event.description.toLowerCase().includes(term) ||
        (event.location && event.location.toLowerCase().includes(term))
      );
    }
    
    setFilteredEvents(result);
    
    if (searchTerm.trim() !== "") {
      const titles = events.map(event => event.title);
      const filteredTitles = titles.filter(title =>
        title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filteredTitles.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [activeFilter, searchTerm, events]);

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filterEvents = (type) => {
    setActiveFilter(type);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedEvent(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="events-page">
      {/* Hero Section */}
      <section className="events-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1>
              Our <span>Events</span>
            </h1>
            <p className="hero-subtitle">
              Join us for exciting tech gatherings, workshops, and conferences that inspire innovation
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Events Controls */}
        <div className="events-controls">
          <div className="search-container">
            <div className="search-input">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search events..."
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
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setSearchTerm(suggestion);
                      setSuggestions([]);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="filter-buttons">
            <button 
              className={activeFilter === "all" ? "active" : ""}
              onClick={() => filterEvents("all")}
            >
              All Events
            </button>
            <button 
              className={activeFilter === "upcoming" ? "active" : ""}
              onClick={() => filterEvents("upcoming")}
            >
              Upcoming
            </button>
            <button 
              className={activeFilter === "past" ? "active" : ""}
              onClick={() => filterEvents("past")}
            >
              Past Events
            </button>
          </div>
        </div>

        {/* Loading and Empty States */}
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            Loading events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="no-events">
            <p>
              {searchTerm
                ? "No events match your search criteria."
                : "No events scheduled at the moment. Please check back later!"}
            </p>
            <a href="/contact" className="cta-button primary">
              Contact Us <ArrowRight size={18} />
            </a>
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <div key={event._id} className="event-card">
                <div className="event-media">
                  {event.images?.length > 0 ? (
                    <div className="image-slider">
                      <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000 }}
                        loop={true}
                      >
                        {event.images.map((image, index) => (
                          <SwiperSlide key={index}>
                            <div className="swiper-image-container">
                              <img 
                                src={`http://localhost:5000${image}`} 
                                alt={`${event.title} ${index + 1}`}
                                className="swiper-image"
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  ) : (
                    <div className="placeholder-image">
                      <div className="placeholder-content">
                        <Calendar size={48} />
                        <span>Event Image</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="event-content">
                  <div className="event-meta">
                    <span className="event-date">
                      <Clock size={16} /> {formatDate(event.date)}
                    </span>
                    {event.location && (
                      <span className="event-location">
                        <MapPin size={16} /> {event.location}
                      </span>
                    )}
                  </div>

                  <h2>{event.title}</h2>
                  <p className="event-description">
                    {event.description.length > 150
                      ? `${event.description.substring(0, 150)}...`
                      : event.description}
                  </p>

                  <button 
                    className="event-button"
                    onClick={() => handleEventClick(event)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="event-modal">
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>
              <X size={24} />
            </button>
            
            <div className="modal-header">
              <div className="modal-media">
                {selectedEvent.images?.length > 0 ? (
                  <div className="modal-slider">
                    <Swiper
                      modules={[Navigation, Pagination]}
                      navigation
                      pagination={{ clickable: true }}
                      spaceBetween={20}
                    >
                      {selectedEvent.images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <div className="modal-image-container">
                            <img 
                              src={`http://localhost:5000${image}`} 
                              alt={`${selectedEvent.title} ${index + 1}`}
                              className="modal-image"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                ) : (
                  <div className="modal-placeholder">
                    <Calendar size={72} />
                    <span>Event Image</span>
                  </div>
                )}
              </div>
              
              <div className="modal-header-content">
                <h2>{selectedEvent.title}</h2>
                <div className="modal-meta">
                  <div className="meta-item">
                    <Clock size={20} />
                    <span>{formatDate(selectedEvent.date)}</span>
                  </div>
                  {selectedEvent.location && (
                    <div className="meta-item">
                      <MapPin size={20} />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-description">
                <h3>About This Event</h3>
                <p>{selectedEvent.description}</p>
              </div>

              {selectedEvent.youtubeUrls?.length > 0 && (
                <div className="modal-videos">
                  <h3>
                    <Youtube size={24} /> Event Videos
                  </h3>
                  <div className="video-grid">
                    {selectedEvent.youtubeUrls.map((url, index) => {
                      const videoId = getYouTubeId(url);
                      return videoId ? (
                        <div key={index} className="video-wrapper">
                          <iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={`YouTube video ${index + 1}`}
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;