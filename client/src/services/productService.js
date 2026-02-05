import api from './api.js';
import { API_ENDPOINTS } from '../config/api.config.js';

const productService = {
  // Get all products
  getAll: async (params = {}) => {
    return await api.get(API_ENDPOINTS.PRODUCTS.LIST, { params });
  },

  // Get product by ID
  getById: async (id) => {
    return await api.get(API_ENDPOINTS.PRODUCTS.DETAIL(id));
  },

  // Create new product
  create: async (data) => {
    return await api.post(API_ENDPOINTS.PRODUCTS.CREATE, data);
  },

  // Update product
  update: async (id, data) => {
    return await api.put(API_ENDPOINTS.PRODUCTS.UPDATE(id), data);
  },

  // Delete product
  delete: async (id) => {
    return await api.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
  },
};

export default productService;
