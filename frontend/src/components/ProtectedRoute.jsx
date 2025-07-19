import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token with backend
      const API_URL = "/.netlify/functions/auth-me";
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setIsAuthenticated(true);
        setIsAdmin(userData.user?.role === "admin");
      } else if (response.status === 401) {
        // Only remove token if it's actually invalid
        localStorage.removeItem("token");
      } else {
        // For other errors (like 500), keep the token but log the error
        console.error("Auth check failed with status:", response.status);
      }
    } catch (error) {
      // Only remove token for specific errors
      if (error.message.includes('invalid token') || error.message.includes('jwt')) {
        localStorage.removeItem("token");
      }
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Verifying access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
        <a href="/">Go back to home</a>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
