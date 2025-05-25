import React, { useState, useEffect } from "react";
import { BASE_URL } from "../utils/server";
import axios from "axios";
import { ArrowRight, User, Calendar, X } from "lucide-react"; // Removed FileText as it's not used
import { BeatLoader } from 'react-spinners'; // Import BeatLoader
import "../styles/Blogs.css"; // Keep for hero gradient, will be minimized later

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
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="blogs-hero relative h-[50vh] min-h-[400px] flex items-center text-white -mt-[70px] pt-[70px]">
        <div className="hero-overlay absolute inset-0 opacity-90"></div> {/* Gradient defined in Blogs.css */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Our <span className="text-accent">Blog</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl opacity-90">
              Insights, stories, and updates from our team
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-muted">
            <BeatLoader color={'var(--accent)'} size={15} />
            <p className="mt-4 text-lg">Loading blog posts...</p>
          </div>
        )}
        
        {error && (
          <div className="my-8 p-4 bg-red-100 dark:bg-red-800 dark:bg-opacity-30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md text-center">
            {error}
          </div>
        )}

        {!isLoading && !error && blogs.length === 0 && (
          <div className="text-center py-16 text-muted">
            <p className="text-xl mb-4">No blog posts available. Please check back later.</p>
          </div>
        )}

        {!isLoading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div 
                key={blog._id} 
                className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 border-t-4 border-accent group"
                onClick={() => openBlogModal(blog)}
              >
                <div className="p-6"> {/* Blog Header */}
                  <h2 className="text-xl font-semibold mb-3 text-foreground group-hover:text-accent transition-colors duration-300 line-clamp-2" title={blog.title}>{blog.title}</h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted mb-2">
                    <span className="flex items-center gap-1.5">
                      <User size={14} /> {blog.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} /> {formatDate(blog.date || blog.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="px-6 pb-6 flex-grow"> {/* Blog Content */}
                  <p className="text-sm text-muted line-clamp-3">{blog.content}</p>
                </div>

                <div className="px-6 pb-6 text-right mt-auto"> {/* Blog Footer */}
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-lighter text-accent border border-accent/50 rounded-md text-sm font-semibold hover:bg-accent hover:text-background transition-colors duration-300">
                    Read More <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"> {/* Modal Backdrop/Overlay */}
          <div className="relative bg-background dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col border-t-4 border-accent"> {/* Modal Content */}
            <div className="p-6 border-b border-border"> {/* Modal Header */}
              <h2 className="text-2xl font-bold mb-2 text-accent">{selectedBlog.title}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <User size={16} /> {selectedBlog.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} /> {formatDate(selectedBlog.date || selectedBlog.createdAt)}
                </span>
              </div>
              <button 
                className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-foreground hover:bg-accent hover:text-background transition-colors z-10" 
                onClick={closeBlogModal}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow"> {/* Modal Body */}
              <div className="prose dark:prose-invert max-w-none text-foreground whitespace-pre-line">
                {selectedBlog.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;