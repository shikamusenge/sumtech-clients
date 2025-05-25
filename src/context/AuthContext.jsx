import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/server';
import { SERVER } from '../utils/server';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // The interceptor in server.js will add the token to the headers
        const response = await SERVER.get(`/clients/api/user`); 
        setUser(response.data.user);
      } catch (err) {
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    } else {
      setUser(null);
      setLoading(false);
    }
  };

  const register = async (userData) => {
    const response = await SERVER.post(`/clients/api/register`, userData, { withCredentials: true });
    // Assuming register might also log the user in or require session check
    // If register returns a token and user, handle it similarly to login:
    // if (response.data.token) {
    //   localStorage.setItem('authToken', response.data.token);
    // }
    // if (response.data.user) {
    //   setUser(response.data.user);
    // } else {
    //   await checkSession(); // Or rely on app reload/navigation to trigger checkSession
    // }
    await checkSession(); // Keep for now, might need adjustment based on actual API response
    return response.data;
  };

  const login = async (credentials) => {
    const response = await SERVER.post(`/clients/api/login`, credentials, { withCredentials: true });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    if (response.data.user) {
      setUser(response.data.user);
    } else {
      // If user object is not returned directly, call checkSession to fetch it using the new token
      // This assumes the token is set in localStorage before checkSession is called by another effect or navigation
      // For immediate update, it's better if login returns the user object or checkSession is awaited.
      await checkSession(); // This will use the new token
    }
    return response.data;
  };

  const logout = async () => {
    try {
      await SERVER.post(`/clients/api/logout`, {}, { withCredentials: true }); // Invalidate backend session if any
    } catch (error) {
      console.error("Logout failed on server:", error);
      // Decide if local logout should proceed even if server logout fails
    }
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const updateProfile = async (userData) => {
    const response = await SERVER.put(`/clients/api/user`, userData); // Token will be added by interceptor
    // const response = await axios.put(`${BASE_URL}/clients/api/user`, userData, { withCredentials: true });
    setUser(response.data.user); // Assuming response contains user object
    return response.data;
  };

  const updatePassword = async (passwordData) => {
    // Token will be added by interceptor
    const response = await SERVER.put(`/clients/api/user/password`, passwordData); 
    // const response = await axios.put(`${BASE_URL}/clients/api/user/password`, passwordData, { withCredentials: true });
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);