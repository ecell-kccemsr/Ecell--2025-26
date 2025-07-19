import { API_BASE_URL, API_ENDPOINTS } from "../config/api.config";

class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };

    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  async handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  }

  async fetch(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log(`API Request to: ${url}`);

      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
        mode: "cors",
        credentials: "include",
      });

      if (response.status === 204) {
        return {}; // No content
      }

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`API Error: ${error.message}`);
      throw error;
    }
  }

  // Auth Methods
  async login(credentials) {
    return this.fetch(API_ENDPOINTS.auth.login, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async forgotPassword(email) {
    return this.fetch(API_ENDPOINTS.auth.forgotPassword, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, password) {
    return this.fetch(API_ENDPOINTS.auth.resetPassword, {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  }

  async verifyEmail(token) {
    return this.fetch(API_ENDPOINTS.auth.verifyEmail, {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  async getCurrentUser() {
    return this.fetch(API_ENDPOINTS.auth.me);
  }

  // Events Methods
  async getEvents() {
    return this.fetch(API_ENDPOINTS.events.list);
  }

  async getUpcomingEvents() {
    return this.fetch(API_ENDPOINTS.events.upcoming);
  }

  async createEvent(eventData) {
    return this.fetch(API_ENDPOINTS.events.create, {
      method: "POST",
      body: JSON.stringify(eventData),
    });
  }

  async updateEventStatus(eventId, status) {
    return this.fetch(API_ENDPOINTS.events.updateStatus(eventId), {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async deleteEvent(eventId) {
    return this.fetch(API_ENDPOINTS.events.delete(eventId), {
      method: "DELETE",
    });
  }

  async uploadEventImage(formData) {
    return this.fetch(API_ENDPOINTS.events.uploadImage, {
      method: "POST",
      headers: {
        // Don't set Content-Type here, let the browser set it with the boundary
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });
  }

  // Admin Methods
  async getUsers() {
    return this.fetch(API_ENDPOINTS.auth.users);
  }

  async createUser(userData) {
    return this.fetch(API_ENDPOINTS.auth.createUser, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // Contact Methods
  async submitContact(contactData) {
    return this.fetch(API_ENDPOINTS.contact, {
      method: "POST",
      body: JSON.stringify(contactData),
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);
