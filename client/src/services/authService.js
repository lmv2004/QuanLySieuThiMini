import api from './api.js';
import { API_ENDPOINTS } from '../config/api.config.js';
import { STORAGE_KEYS } from '../config/constants.js';

const authService = {
  // Login
  login: async (credentials) => {
    const payload = {
      TENTK: credentials.email,
      MATKHAU: credentials.password,
    };
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, payload);

    if (response.token) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.token);
      if (response.user) {
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(response.user));
      }
    }

    return response;
  },

  // Logout
  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    }
  },

  // Get current user
  getCurrentUser: async () => {
    return await api.get(API_ENDPOINTS.AUTH.ME);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  // Get user info from localStorage
  getUserInfo: () => {
    const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    return userInfo ? JSON.parse(userInfo) : null;
  },
};

export default authService;
