// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if token exists in localStorage (or cookie)
  const token = localStorage.getItem("jwt");

  if (!token) {
    // If no token, redirect to /home
    return <Navigate to="/" replace />;
  }

  // If token exists, allow access
  return children;
};

export default ProtectedRoute;