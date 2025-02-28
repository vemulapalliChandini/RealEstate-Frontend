import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ role }) => {
  const newToken=localStorage.getItem(`token`)
  if (newToken !== null) {
    try {
      const decodedToken = jwtDecode(newToken);
      const role1 = decodedToken.user.role;

      if (role === role1) {
        return <Outlet />;
      }
    } catch (error) {
      console.error('Invalid token',error);
    }
  }
  return <Navigate to="/unauthorized" replace />; 
};

export default ProtectedRoute;
