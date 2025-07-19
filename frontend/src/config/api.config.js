// Simple API configuration pointing to our Netlify Functions API
// In development: Points to local server (http://localhost:8888/.netlify/functions/api)
// In production: Points to Netlify Functions directly
// All API functionality is now handled by Netlify Functions
export const API_BASE_URL = import.meta.env.VITE_API_URL || "/.netlify/functions";

export const API_ENDPOINTS = {
  auth: {
    login: `/api/auth/login`,
    forgotPassword: `/api/auth/forgot-password`,
    resetPassword: `/api/auth/reset-password`,
    verifyEmail: `/api/auth/verify-email`,
    me: `/api/auth/me`,
    users: `/api/auth/admin/users`,
    createUser: `/api/auth/admin/create-user`,
  },
  events: {
    list: `/api/events`,
    upcoming: `/api/events?upcoming=true&status=published`,
    create: `/api/events`,
    updateStatus: (id) => `/api/events/${id}/status`,
    delete: (id) => `/api/events/${id}`,
    uploadImage: `/api/events/upload-image`,
  },
  contact: `/api/contact`,
};
