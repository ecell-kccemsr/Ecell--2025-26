// src/services/authService.js
import api from './api';
import { API_ENDPOINTS } from '../config/api.config';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.auth.login, { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.auth.me);
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post(API_ENDPOINTS.auth.forgotPassword, { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.auth.resetPassword, { token, password });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  }
};

export default authService;
