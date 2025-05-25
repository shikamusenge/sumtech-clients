import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, LogOut } from 'lucide-react';
// Removed: import '../styles/Profile.css'; // Styles will be handled by Tailwind

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

  const tabButtonClasses = (tabName) => 
    `px-4 py-3 text-sm sm:text-base font-medium transition-colors focus:outline-none ${
      activeTab === tabName 
        ? 'border-b-2 border-accent text-accent' 
        : 'text-muted hover:text-foreground'
    }`;

  const inputClasses = "w-full px-4 py-2.5 rounded-md border border-border bg-background dark:bg-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-foreground placeholder-muted";
  const labelClasses = "block text-sm font-medium text-foreground mb-1.5";
  const alertBaseClasses = "p-4 mb-4 rounded-md text-sm";
  const alertDangerClasses = `${alertBaseClasses} bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200`;
  const alertSuccessClasses = `${alertBaseClasses} bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200`;
  const updateBtnClasses = "inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-background rounded-md text-base font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-accent-dark hover:-translate-y-0.5 hover:shadow-md";

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="profile-hero relative h-[40vh] min-h-[300px] flex items-center text-white -mt-[70px] pt-[70px]">
        <div className="hero-overlay absolute inset-0 opacity-90"></div> {/* Gradient from Profile.css */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
              My <span className="text-accent">Account</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl opacity-90">
              Manage your profile information and account settings
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl -mt-16 sm:-mt-20 md:-mt-24 relative z-20 mb-12">
        <div className="bg-background dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl">
          <div className="flex justify-end mb-8">
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/30 dark:border-red-500/40 rounded-md text-sm font-medium hover:bg-red-500/20 dark:hover:bg-red-500/30 hover:border-red-600 dark:hover:border-red-400 transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
          
          <div className="flex border-b border-border mb-8">
            <button
              className={tabButtonClasses('profile')}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={tabButtonClasses('password')}
              onClick={() => setActiveTab('password')}
            >
              Password
            </button>
          </div>
          
          {activeTab === 'profile' && (
            <div className="py-6">
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {profileError && <div className={alertDangerClasses}>{profileError}</div>}
                {profileSuccess && <div className={alertSuccessClasses}>{profileSuccess}</div>}
                
                <div>
                  <label htmlFor="username" className={labelClasses}>Username</label>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={profileForm.username}
                    onChange={handleProfileChange}
                    required
                    className={inputClasses}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className={labelClasses}>Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    required
                    className={inputClasses}
                  />
                </div>
                
                <div>
                  <label htmlFor="dateOfBirth" className={labelClasses}>Date of Birth</label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    name="dateOfBirth"
                    value={profileForm.dateOfBirth}
                    onChange={handleProfileChange}
                    required
                    className={inputClasses}
                  />
                </div>
                
                <div>
                  <label htmlFor="gender" className={labelClasses}>Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={profileForm.gender}
                    onChange={handleProfileChange}
                    required
                    className={inputClasses}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className={labelClasses}>Phone Number</label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    value={profileForm.phoneNumber}
                    onChange={handleProfileChange}
                    required
                    className={inputClasses}
                  />
                </div>
                
                <button type="submit" className={updateBtnClasses}>
                  Update Profile <ArrowRight size={18} />
                </button>
              </form>
            </div>
          )}
          
          {activeTab === 'password' && (
            <div className="py-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {passwordError && <div className={alertDangerClasses}>{passwordError}</div>}
                {passwordSuccess && <div className={alertSuccessClasses}>{passwordSuccess}</div>}
                
                <div>
                  <label htmlFor="currentPassword" className={labelClasses}>Current Password</label>
                  <input
                    id="currentPassword"
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className={inputClasses}
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className={labelClasses}>New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength="6"
                    className={inputClasses}
                  />
                </div>
                
                <div>
                  <label htmlFor="newPasswordRepeat" className={labelClasses}>Repeat New Password</label>
                  <input
                    id="newPasswordRepeat"
                    type="password"
                    name="newPasswordRepeat"
                    value={passwordForm.newPasswordRepeat}
                    onChange={handlePasswordChange}
                    required
                    minLength="6"
                    className={inputClasses}
                  />
                </div>
                
                <button type="submit" className={updateBtnClasses}>
                  Update Password <ArrowRight size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;