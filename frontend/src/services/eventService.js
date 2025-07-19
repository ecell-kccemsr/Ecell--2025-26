// src/services/eventService.js
import api from './api';
import { API_ENDPOINTS } from '../config/api.config';

export const eventService = {
  getAllEvents: async (filters = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.events.list, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Get events error:', error);
      throw error;
    }
  },

  getUpcomingEvents: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.events.upcoming);
      return response.data;
    } catch (error) {
      console.error('Get upcoming events error:', error);
      throw error;
    }
  },

  createEvent: async (eventData) => {
    try {
      const response = await api.post(API_ENDPOINTS.events.create, eventData);
      return response.data;
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  },

  updateEventStatus: async (eventId, status) => {
    try {
      const response = await api.patch(API_ENDPOINTS.events.updateStatus(eventId), { status });
      return response.data;
    } catch (error) {
      console.error('Update event status error:', error);
      throw error;
    }
  },

  deleteEvent: async (eventId) => {
    try {
      const response = await api.delete(API_ENDPOINTS.events.delete(eventId));
      return response.data;
    } catch (error) {
      console.error('Delete event error:', error);
      throw error;
    }
  },

  uploadEventImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post(API_ENDPOINTS.events.uploadImage, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Upload image error:', error);
      throw error;
    }
  }
};

export default eventService;
