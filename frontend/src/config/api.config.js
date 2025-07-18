export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    verifyEmail: '/api/auth/verify-email',
    me: '/api/auth/me',
    users: '/api/auth/admin/users',
    createUser: '/api/auth/admin/create-user'
  },
  events: {
    list: '/api/events',
    upcoming: '/api/events?upcoming=true&status=published',
    create: '/api/events',
    updateStatus: (id) => `/api/events/${id}/status`,
    delete: (id) => `/api/events/${id}`,
    uploadImage: '/api/events/upload-image'
  },
  contact: '/api/contact'
};
