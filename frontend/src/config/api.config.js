export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    forgotPassword: `${API_BASE_URL}/api/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/api/auth/reset-password`,
    verifyEmail: `${API_BASE_URL}/api/auth/verify-email`,
    me: `${API_BASE_URL}/api/auth/me`,
    users: `${API_BASE_URL}/api/auth/admin/users`,
    createUser: `${API_BASE_URL}/api/auth/admin/create-user`
  },
  events: {
    list: `${API_BASE_URL}/api/events`,
    upcoming: `${API_BASE_URL}/api/events?upcoming=true&status=published`,
    create: `${API_BASE_URL}/api/events`,
    updateStatus: (id) => `${API_BASE_URL}/api/events/${id}/status`,
    delete: (id) => `${API_BASE_URL}/api/events/${id}`,
    uploadImage: `${API_BASE_URL}/api/events/upload-image`
  },
  contact: `${API_BASE_URL}/api/contact`
};
