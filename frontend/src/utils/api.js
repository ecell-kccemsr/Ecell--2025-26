const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const api = {
  baseUrl: API_URL,

  async fetch(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Network response was not ok");
    }

    return response.json();
  },

  // Auth endpoints
  auth: {
    login: (data) =>
      api.fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    forgotPassword: (data) =>
      api.fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    resetPassword: (data) =>
      api.fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    verifyEmail: (data) =>
      api.fetch("/api/auth/verify-email", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    me: () =>
      api.fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
  },

  // Events endpoints
  events: {
    getUpcoming: () => api.fetch("/api/events?upcoming=true&status=published"),
    getAll: () => api.fetch("/api/events"),
    create: (data) =>
      api.fetch("/api/events", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    updateStatus: (eventId, status) =>
      api.fetch(`/api/events/${eventId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    delete: (eventId) =>
      api.fetch(`/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    uploadImage: (formData) =>
      fetch(`${API_URL}/api/events/upload-image`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => res.json()),
  },

  // Admin endpoints
  admin: {
    getUsers: () =>
      api.fetch("/api/auth/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    createUser: (data) =>
      api.fetch("/api/auth/admin/create-user", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    deleteUser: (userId) =>
      api.fetch(`/api/auth/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
  },

  // Contact endpoints
  contact: {
    send: (data) =>
      api.fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};
