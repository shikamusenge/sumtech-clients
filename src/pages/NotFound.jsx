import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Mail, Phone } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 text-center">
      <div className="max-w-md mx-auto">
        {/* Animated 404 Text */}
        <div className="text-9xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          404
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
          Page Not Found
        </h1>
        
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all group"
          >
            <Home className="h-5 w-5 mr-2" />
            Go Home
          </Link>
          
          <Link
            to="/contact"
            className="flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium rounded-lg transition-all"
          >
            <Mail className="h-5 w-5 mr-2" />
            Contact Support
          </Link>
        </div>
        
        {/* Additional Help Section */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3">
            Need immediate help?
          </h3>
          <a
            href="tel:+254700123456"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Phone className="h-5 w-5 mr-2" />
            +254 700 123 456
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;