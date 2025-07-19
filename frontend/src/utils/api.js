const API_URL = import.meta.env.VITE_API_URL || "/.netlify/functions";

export const api = {
  baseUrl: API_URL,

  async fetch(endpoint, options = {}) {
    // Remove any duplicate /api prefixes
    const cleanEndpoint = endpoint.startsWith("/api")
      ? endpoint
      : endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;

    const url = `${API_URL}${cleanEndpoint}`;
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
      api.fetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    forgotPassword: (data) =>
      api.fetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    resetPassword: (data) =>
      api.fetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    verifyEmail: (data) =>
      api.fetch("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    me: () =>
      api.fetch("/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
  },

  // Events endpoints
  events: {
    getUpcoming: () => api.fetch("/events?upcoming=true&status=published"),
    getAll: () => api.fetch("/events"),
    create: (data) =>
      api.fetch("/events", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    updateStatus: (eventId, status) =>
      api.fetch(`/events/${eventId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    delete: (eventId) =>
      api.fetch(`/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    uploadImage: (formData) =>
      fetch(`${API_URL}/events/upload-image`, {
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
      api.fetch("/auth/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    createUser: (data) =>
      api.fetch("/auth/admin/create-user", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    deleteUser: (userId) =>
      api.fetch(`/auth/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
  },

  // Contact endpoints
  contact: {
    send: (data) =>
      api.fetch("/contact", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};
