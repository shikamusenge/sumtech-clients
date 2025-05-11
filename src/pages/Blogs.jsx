import React, { useState, useEffect } from "react";
import { BASE_URL } from "../utils/server";
import axios from "axios";
import { ArrowRight, FileText, User, Calendar, X } from "lucide-react";
import "../styles/Blogs.css";

const API_URL = `${BASE_URL}/api/blogs`;

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(API_URL);
        setBlogs(response.data);
      } catch (err) {
        setError("Failed to load blog posts. Please try again later.");
        console.error("Error fetching blogs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openBlogModal = (blog) => {
    setSelectedBlog(blog);
    document.body.style.overflow = 'hidden';
  };

  const closeBlogModal = () => {
    setSelectedBlog(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="blogs-page">
      {/* Hero Section */}
      <section className="blogs-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1>
              Our <span>Blog</span>
            </h1>
            <p className="hero-subtitle">
              Insights, stories, and updates from our team
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            Loading blog posts...
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {blogs.length === 0 && !isLoading ? (
          <div className="no-blogs">
            <p>No blog posts available. Please check back later.</p>
          </div>
        ) : (
          <div className="blogs-grid">
            {blogs.map((blog) => (
              <div 
                key={blog._id} 
                className="blog-card"
                onClick={() => openBlogModal(blog)}
              >
                <div className="blog-header">
                  <h2>{blog.title}</h2>
                  <div className="blog-meta">
                    <span className="blog-author">
                      <User size={16} /> {blog.author}
                    </span>
                    <span className="blog-date">
                      <Calendar size={16} /> {formatDate(blog.date || blog.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="blog-content">
                  <div className="blog-section">
                    <p>{blog.content.substring(0, 150)}...</p>
                  </div>

                  <div className="blog-footer">
                    <button className="read-more-btn">
                      Read More <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className="blog-modal">
          <div className="modal-overlay" onClick={closeBlogModal}></div>
          <div className="modal-content">
            <button className="close-modal" onClick={closeBlogModal}>
              <X size={24} />
            </button>
            
            <div className="modal-header">
              <h2>{selectedBlog.title}</h2>
              <div className="blog-meta">
                <span className="blog-author">
                  <User size={18} /> {selectedBlog.author}
                </span>
                <span className="blog-date">
                  <Calendar size={18} /> {formatDate(selectedBlog.date || selectedBlog.createdAt)}
                </span>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <p className="blog-full-content">{selectedBlog.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;