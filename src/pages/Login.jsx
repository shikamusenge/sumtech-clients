import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import '../styles/Auth.css'; // Keep for hero-overlay gradient

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      toast.success('Logged in successfully!');
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  const inputClasses = "w-full px-4 py-2.5 rounded-md border border-border bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground placeholder-muted";
  const labelClasses = "block text-sm font-medium text-foreground mb-1.5";
  const authBtnClasses = "inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-accent text-background rounded-md text-base font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-accent-dark hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed";

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="auth-hero relative h-[40vh] min-h-[300px] flex items-center -mt-[70px] pt-[70px] text-white">
        <div className="hero-overlay absolute inset-0 opacity-90"></div> {/* Gradient from Auth.css */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Welcome <span className="text-accent">Back</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl opacity-90">
              Sign in to access your account and manage your profile
            </p>
          </div>
        </div>
      </section>

      <div className="flex justify-center items-center px-4 py-8 sm:py-12">
        <div className="bg-background dark:bg-gray-800 p-6 sm:p-8 md:p-10 rounded-lg shadow-xl w-full max-w-md -mt-16 sm:-mt-20 md:-mt-24 relative z-20 border-t-4 border-accent">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-foreground">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="email" className={labelClasses}>Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClasses}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className={labelClasses}>Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={inputClasses}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading} className={authBtnClasses}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} /> Logging In...
                </>
              ) : (
                <>
                  Login <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          <p className="text-center mt-6 text-sm text-muted">
            Don't have an account? <a href="/signup" className="text-accent hover:underline font-medium">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;