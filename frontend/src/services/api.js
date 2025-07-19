// src/services/api.js
import axios from "axios";
import { API_BASE_URL } from "../config/api.config";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // No CORS issues anymore since everything is on Netlify
  withCredentials: false,
});

// Add interceptors for authorization tokens and error handling
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors like 401, 403, etc.
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // Network errors (likely CORS issues)
    if (error.message === "Network Error") {
      console.error(
        "Network error - possible CORS issue or backend not available"
      );
    }

    return Promise.reject(error);
  }
);

export default api;
