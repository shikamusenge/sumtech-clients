import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, LogOut } from 'lucide-react';
import '../styles/Profile.css';

const Profile = () => {
  const { user, updateProfile, updatePassword, logout } = useAuth();
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    dateOfBirth: '',
    gender: 'male',
    phoneNumber: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordRepeat: ''
  });
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username,
        email: user.email,
        dateOfBirth: new Date(user.dateOfBirth).toISOString().split('T')[0],
        gender: user.gender,
        phoneNumber: user.phoneNumber
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setProfileError('');
      setProfileSuccess('');
      await updateProfile(profileForm);
      setProfileSuccess('Profile updated successfully');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Update failed');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.newPasswordRepeat) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    try {
      setPasswordError('');
      setPasswordSuccess('');
      await updatePassword(passwordForm);
      setPasswordSuccess('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        newPasswordRepeat: ''
      });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="profile-page">
      {/* Hero Section */}
      <section className="profile-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1>
              My <span>Account</span>
            </h1>
            <p className="hero-subtitle">
              Manage your profile information and account settings
            </p>
          </div>
        </div>
      </section>

      <div className="profile-container">
        <div className="profile-header">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} /> Logout
          </button>
        </div>
        
        <div className="profile-tabs">
          <button
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={activeTab === 'password' ? 'active' : ''}
            onClick={() => setActiveTab('password')}
          >
            Password
          </button>
        </div>
        
        {activeTab === 'profile' && (
          <div className="profile-section">
            <form onSubmit={handleProfileSubmit}>
              {profileError && <div className="alert alert-danger">{profileError}</div>}
              {profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}
              
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={profileForm.username}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profileForm.dateOfBirth}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={profileForm.gender}
                  onChange={handleProfileChange}
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
                  value={profileForm.phoneNumber}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              
              <button type="submit" className="update-btn">
                Update Profile <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}
        
        {activeTab === 'password' && (
          <div className="password-section">
            <form onSubmit={handlePasswordSubmit}>
              {passwordError && <div className="alert alert-danger">{passwordError}</div>}
              {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}
              
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>
              
              <div className="form-group">
                <label>Repeat New Password</label>
                <input
                  type="password"
                  name="newPasswordRepeat"
                  value={passwordForm.newPasswordRepeat}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>
              
              <button type="submit" className="update-btn">
                Update Password <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;