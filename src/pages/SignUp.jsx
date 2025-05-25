import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import '../styles/Auth.css'; // Keep for hero-overlay gradient

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    dateOfBirth: '',
    gender: 'male',
    phoneNumber: '',
    password: '',
    passwordRepeat: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.passwordRepeat) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(formData);
      toast.success('Registration successful!');
      navigate('/profile');
    } catch (err) {
      console.log(err); // Keep console.log for debugging if desired
      toast.error(err.response?.data?.message || 'Registration failed');
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
              Join <span className="text-accent">Us</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl opacity-90">
              Create your account to access all features
            </p>
          </div>
        </div>
      </section>

      <div className="flex justify-center items-center px-4 py-8 sm:py-12">
        <div className="bg-background dark:bg-gray-800 p-6 sm:p-8 md:p-10 rounded-lg shadow-xl w-full max-w-lg -mt-16 sm:-mt-20 md:-mt-24 relative z-20 border-t-4 border-accent">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-foreground">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="username" className={labelClasses}>Username</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                  placeholder="Choose a username"
                />
              </div>
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
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="dateOfBirth" className={labelClasses}>Date of Birth</label>
                <input
                  id="dateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="gender" className={labelClasses}>Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className={labelClasses}>Phone Number</label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className={inputClasses}
                placeholder="+1234567890"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="password" className={labelClasses}>Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className={inputClasses}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label htmlFor="passwordRepeat" className={labelClasses}>Repeat Password</label>
                <input
                  id="passwordRepeat"
                  type="password"
                  name="passwordRepeat"
                  value={formData.passwordRepeat}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className={inputClasses}
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <button type="submit" disabled={loading} className={authBtnClasses}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} /> Creating Account...
                </>
              ) : (
                <>
                  Sign Up <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          <p className="text-center mt-6 text-sm text-muted">
            Already have an account? <a href="/login" className="text-accent hover:underline font-medium">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;