// API Endpoints Configuration

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh',
    ME: '/auth/me',
    PERMISSIONS: '/auth/permissions',
  },

  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (id) => `/categories/${id}`,
    CREATE: '/categories',
    UPDATE: (id) => `/categories/${id}`,
    DELETE: (id) => `/categories/${id}`,
  },

  // Customers
  CUSTOMERS: {
    LIST: '/customers',
    DETAIL: (id) => `/customers/${id}`,
    CREATE: '/customers',
    UPDATE: (id) => `/customers/${id}`,
    DELETE: (id) => `/customers/${id}`,
  },

  // Employees
  EMPLOYEES: {
    LIST: '/employees',
    DETAIL: (id) => `/employees/${id}`,
    CREATE: '/employees',
    UPDATE: (id) => `/employees/${id}`,
    DELETE: (id) => `/employees/${id}`,
  },

  // Suppliers
  SUPPLIERS: {
    LIST: '/suppliers',
    DETAIL: (id) => `/suppliers/${id}`,
    CREATE: '/suppliers',
    UPDATE: (id) => `/suppliers/${id}`,
    DELETE: (id) => `/suppliers/${id}`,
  },

  // Invoices
  INVOICES: {
    LIST: '/invoices',
    DETAIL: (id) => `/invoices/${id}`,
    CREATE: '/invoices',
    UPDATE: (id) => `/invoices/${id}`,
    DELETE: (id) => `/invoices/${id}`,
  },

  // Import Receipts
  IMPORTS: {
    LIST: '/purchase-orders',
    DETAIL: (id) => `/purchase-orders/${id}`,
    CREATE: '/purchase-orders',
    UPDATE: (id) => `/purchase-orders/${id}`,
    DELETE: (id) => `/purchase-orders/${id}`,
    APPROVE: (id) => `/purchase-orders/${id}/approve`,
    CANCEL: (id) => `/purchase-orders/${id}/cancel`,
  },

  // Disposal Receipts
  DISPOSAL: {
    LIST: '/disposal-slips',
    DETAIL: (id) => `/disposal-slips/${id}`,
    CREATE: '/disposal-slips',
    UPDATE: (id) => `/disposal-slips/${id}`,
    DELETE: (id) => `/disposal-slips/${id}`,
  },

  // Inventory
  INVENTORY: {
    LIST: '/inventories',
    DETAIL: (id) => `/inventories/${id}`,
  },

  // Vouchers
  VOUCHERS: {
    LIST: '/vouchers',
    DETAIL: (id) => `/vouchers/${id}`,
    CREATE: '/vouchers',
    UPDATE: (id) => `/vouchers/${id}`,
    DELETE: (id) => `/vouchers/${id}`,
  },

  // Discounts
  DISCOUNTS: {
    LIST: '/discounts',
    DETAIL: (id) => `/discounts/${id}`,
    CREATE: '/discounts',
    UPDATE: (id) => `/discounts/${id}`,
    DELETE: (id) => `/discounts/${id}`,
  },

  // Reports
  REPORTS: {
    SALES: '/reports/sales',
    INVENTORY: '/reports/inventory',
    REVENUE: '/reports/revenue',
  },
};
