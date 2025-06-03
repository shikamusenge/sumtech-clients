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
    try {
      const response = await SERVER.get(`/clients/api/user`, { withCredentials: true },
      );
      // const response = await axios.get(`${BASE_URL}/clients/api/user`, { withCredentials: true });
      setUser(response.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    const response = await SERVER.post(`/clients/api/register`, userData, { withCredentials: true });
    await checkSession();
    return response.data;
  };

  const login = async (credentials) => {
    const response = await SERVER.post(`/clients/api/login`, credentials, { withCredentials: true });
    // const response = await axios.post(`${BASE_URL}/clients/api/login`, credentials, { withCredentials: true });
    localStorage.setItem('token',response.data.token);
    await checkSession();
    
    return response.data;
  };

  const logout = async () => {
    const response = await SERVER.post(`/clients/api/logout`, {}, { withCredentials: true });
    await axios.post(`${BASE_URL}/clients/api/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  const updateProfile = async (userData) => {
    const response = await SERVER.put(`/clients/api/user`, userData, { withCredentials: true });
    // const response = await axios.put(`${BASE_URL}/clients/api/user`, userData, { withCredentials: true });
    setUser(response.data);
    return response.data;
  };

  const updatePassword = async (passwordData) => {
    const response = await SERVER.put(`/clients/api/user/password`, passwordData, { withCredentials: true });
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