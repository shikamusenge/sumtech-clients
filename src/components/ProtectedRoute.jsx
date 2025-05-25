import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ClipLoader } from 'react-spinners';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader color={'var(--primary)'} loading={true} size={50} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is provided and is not empty, check user's role
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user.role || !allowedRoles.includes(user.role)) {
      // Redirect if user's role is not in allowedRoles
      return <Navigate to="/" replace />; // Or to a specific unauthorized page e.g. /unauthorized
    }
  }

  // If user is authenticated and (no specific roles are required OR user's role is allowed)
  return children;
};

export default ProtectedRoute;