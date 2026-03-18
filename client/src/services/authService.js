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

      // Fetch and store permissions
      try {
        const permissionsResponse = await api.get(API_ENDPOINTS.AUTH.PERMISSIONS);
        if (permissionsResponse) {
          localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(permissionsResponse));
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
        // Continue even if permissions fetch fails
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
      localStorage.removeItem(STORAGE_KEYS.PERMISSIONS);
    }
  },

  // Get current user
  getCurrentUser: async () => {
    return await api.get(API_ENDPOINTS.AUTH.ME);
  },

  // Get permissions from localStorage
  getPermissions: () => {
    const permissions = localStorage.getItem(STORAGE_KEYS.PERMISSIONS);
    return permissions ? JSON.parse(permissions) : null;
  },

  // Check if user has specific permission
  hasPermission: (permission) => {
    const permissions = authService.getPermissions();
    if (!permissions || !permissions.permissions) {
      return false;
    }
    return permissions.permissions.includes(permission);
  },

  // Get user role
  getUserRole: () => {
    const permissions = authService.getPermissions();
    return permissions?.role || null;
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
