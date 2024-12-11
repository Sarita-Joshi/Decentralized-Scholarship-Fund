// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    alert("You must log in to access this page.");
    return <Navigate to="/" replace />;
  }

  // Redirect to home if role is not authorized
  if (requiredRole && userRole !== requiredRole) {
    alert("Access denied: You do not have the required role.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
