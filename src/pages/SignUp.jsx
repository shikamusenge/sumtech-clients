import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Loader2 } from 'lucide-react';

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
  const [error, setError] = useState('');
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
      setError('Passwords do not match');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await register(formData);
      navigate('/profile');
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Hero Section */}
      <section className="auth-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1>
              Join <span>Us</span>
            </h1>
            <p className="hero-subtitle">
              Create your account to access all features
            </p>
          </div>
        </div>
      </section>

      <div className="auth-container">
        <div className="auth-card">
          <h2>Create Account</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Repeat Password</label>
              <input
                type="password"
                name="passwordRepeat"
                value={formData.passwordRepeat}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="auth-btn">
              {loading ? (
                <>
                  <Loader2 className="spinner" size={18} /> Creating Account...
                </>
              ) : (
                <>
                  Sign Up <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          <p className="auth-footer">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;