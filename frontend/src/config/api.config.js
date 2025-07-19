// Simple API configuration pointing to the backend API
// In development: Points to local server (http://localhost:5001)
// In production: Points to Netlify Functions proxy ('/api')
// The Netlify Functions will forward requests to the Render backend
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
    verifyEmail: `${API_BASE_URL}/auth/verify-email`,
    me: `${API_BASE_URL}/auth/me`,
    users: `${API_BASE_URL}/auth/admin/users`,
    createUser: `${API_BASE_URL}/auth/admin/create-user`,
  },
  events: {
    list: `${API_BASE_URL}/events`,
    upcoming: `${API_BASE_URL}/events?upcoming=true&status=published`,
    create: `${API_BASE_URL}/events`,
    updateStatus: (id) => `${API_BASE_URL}/events/${id}/status`,
    delete: (id) => `${API_BASE_URL}/events/${id}`,
    uploadImage: `${API_BASE_URL}/events/upload-image`,
  },
  contact: `${API_BASE_URL}/contact`,
};
