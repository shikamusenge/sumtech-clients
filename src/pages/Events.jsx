import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Calendar, Clock, MapPin, Youtube, Search, X, ArrowRight } from "lucide-react";
import { BeatLoader } from 'react-spinners'; // Import BeatLoader
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/events.css"; // Keep for hero gradient, will be minimized later
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
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="events-hero relative h-[60vh] min-h-[500px] flex items-center text-white -mt-[70px] pt-[70px]">
        <div className="hero-overlay absolute inset-0 opacity-90"></div> {/* Gradient defined in events.css */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Our <span className="text-accent">Events</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl opacity-90">
              Join us for exciting tech gatherings, workshops, and conferences that inspire innovation
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Events Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 my-8 md:my-12">
          <div className="relative w-full md:max-w-md">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-full border border-border bg-background focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground placeholder-muted"
              />
              {searchTerm ? (
                 <X
                  className="absolute right-3 text-muted cursor-pointer hover:text-accent transition-colors duration-200 ease-in-out"
                  onClick={() => setSearchTerm("")}
                  size={20}
                />
              ) : (
                <Search className="absolute right-3 text-muted" size={20} />
              )}
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setSearchTerm(suggestion);
                      setSuggestions([]);
                    }}
                    className="px-4 py-2 hover:bg-primary-lighter cursor-pointer transition-colors duration-200 ease-in-out"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {['all', 'upcoming', 'past'].map(filterType => (
              <button 
                key={filterType}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out
                  ${activeFilter === filterType 
                    ? 'bg-accent text-background' 
                    : 'bg-gray-100 dark:bg-gray-700 text-foreground hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                onClick={() => filterEvents(filterType)}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)} Events
              </button>
            ))}
          </div>
        </div>

        {/* Loading and Empty States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted">
            <BeatLoader color={'var(--accent)'} size={15} />
            <p className="mt-4 text-lg">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <p className="text-xl mb-6">
              {searchTerm
                ? "No events match your search criteria."
                : "No events scheduled at the moment. Please check back later!"}
            </p>
            <a href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-background rounded-full text-base font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-accent-dark hover:-translate-y-0.5 hover:shadow-lg">
              Contact Us <ArrowRight size={18} />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredEvents.map((event) => (
              <div key={event._id} className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col group border-t-4 border-accent hover:shadow-2xl transition-all duration-300">
                <div className="h-56 bg-gray-200 dark:bg-gray-700 relative">
                  {event.images?.length > 0 ? (
                    <Swiper
                      modules={[Navigation, Pagination, Autoplay]}
                      navigation
                      pagination={{ clickable: true }}
                      autoplay={{ delay: 5000 }}
                      loop={true}
                      className="h-full w-full"
                    >
                      {event.images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <div className="w-full h-56 flex items-center justify-center overflow-hidden">
                            <img 
                              src={`${BASE_URL}${image}`} 
                              alt={`${event.title} image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted">
                      <Calendar size={48} className="mb-2 text-accent" />
                      <span>Event Image</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted mb-3">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} /> {formatDate(event.date)}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} /> {event.location}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-semibold mb-3 text-foreground group-hover:text-accent transition-colors duration-300 line-clamp-2" title={event.title}>{event.title}</h2>
                  <p className="text-sm text-muted line-clamp-3 mb-4 flex-grow">
                    {event.description}
                  </p>

                  <button 
                    className="mt-auto w-full inline-block px-6 py-3 bg-accent text-background rounded-lg text-sm font-semibold text-center hover:bg-accent-dark transition-colors duration-300"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative bg-background dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col border-t-4 border-accent">
            <button 
              className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-foreground hover:bg-accent hover:text-background transition-colors z-20"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col md:flex-row gap-0 md:gap-6 p-6 items-start">
              <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden self-center md:self-start flex-shrink-0">
                {selectedEvent.images?.length > 0 ? (
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    className="h-full w-full modal-swiper" // Added modal-swiper for specific overrides
                  >
                    {selectedEvent.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <div className="w-full h-64 md:h-[400px] flex items-center justify-center overflow-hidden">
                          <img 
                            src={`http://localhost:5000${image}`} 
                            alt={`${selectedEvent.title} image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted">
                    <Calendar size={72} className="mb-2 text-accent" />
                    <span>Event Image</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 py-4 md:py-0">
                <h2 className="text-2xl lg:text-3xl font-bold mb-3 text-accent">{selectedEvent.title}</h2>
                <div className="flex flex-col gap-2 text-sm text-muted">
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{formatDate(selectedEvent.date)}</span>
                  </div>
                  {selectedEvent.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 md:pt-6 overflow-y-auto flex-grow space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">About This Event</h3>
                <p className="text-muted whitespace-pre-line prose dark:prose-invert max-w-none">{selectedEvent.description}</p>
              </div>

              {selectedEvent.youtubeUrls?.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 text-foreground">
                    <Youtube size={24} className="text-accent" /> Event Videos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedEvent.youtubeUrls.map((url, index) => {
                      const videoId = getYouTubeId(url);
                      return videoId ? (
                        <div key={index} className="aspect-video rounded-lg overflow-hidden">
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={`YouTube video ${index + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="border-0"
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