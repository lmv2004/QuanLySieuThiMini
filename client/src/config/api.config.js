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
    LIST: '/san-pham',
    DETAIL: (id) => `/san-pham/${id}`,
    CREATE: '/san-pham',
    UPDATE: (id) => `/san-pham/${id}`,
    DELETE: (id) => `/san-pham/${id}`,
  },

  // Categories
  CATEGORIES: {
    LIST: '/loai-san-pham',
    DETAIL: (id) => `/loai-san-pham/${id}`,
    CREATE: '/loai-san-pham',
    UPDATE: (id) => `/loai-san-pham/${id}`,
    DELETE: (id) => `/loai-san-pham/${id}`,
  },

  // Customers
  CUSTOMERS: {
    LIST: '/khach-hang',
    DETAIL: (id) => `/khach-hang/${id}`,
    CREATE: '/khach-hang',
    UPDATE: (id) => `/khach-hang/${id}`,
    DELETE: (id) => `/khach-hang/${id}`,
  },

  // Employees
  EMPLOYEES: {
    LIST: '/nhan-vien',
    DETAIL: (id) => `/nhan-vien/${id}`,
    CREATE: '/nhan-vien',
    UPDATE: (id) => `/nhan-vien/${id}`,
    DELETE: (id) => `/nhan-vien/${id}`,
  },

  // Suppliers
  SUPPLIERS: {
    LIST: '/nha-cung-cap',
    DETAIL: (id) => `/nha-cung-cap/${id}`,
    CREATE: '/nha-cung-cap',
    UPDATE: (id) => `/nha-cung-cap/${id}`,
    DELETE: (id) => `/nha-cung-cap/${id}`,
  },

  // Invoices
  INVOICES: {
    LIST: '/hoa-don',
    DETAIL: (id) => `/hoa-don/${id}`,
    CREATE: '/hoa-don',
    UPDATE: (id) => `/hoa-don/${id}`,
    DELETE: (id) => `/hoa-don/${id}`,
  },

  // Import Receipts
  IMPORTS: {
    LIST: '/phieu-nhap',
    DETAIL: (id) => `/phieu-nhap/${id}`,
    CREATE: '/phieu-nhap',
    UPDATE: (id) => `/phieu-nhap/${id}`,
    DELETE: (id) => `/phieu-nhap/${id}`,
  },

  // Disposal Receipts
  DISPOSAL: {
    LIST: '/phieu-huy',
    DETAIL: (id) => `/phieu-huy/${id}`,
    CREATE: '/phieu-huy',
    UPDATE: (id) => `/phieu-huy/${id}`,
    DELETE: (id) => `/phieu-huy/${id}`,
  },

  // Inventory
  INVENTORY: {
    LIST: '/ton-kho',
    DETAIL: (id) => `/ton-kho/${id}`,
  },

  // Vouchers
  VOUCHERS: {
    LIST: '/voucher',
    DETAIL: (id) => `/voucher/${id}`,
    CREATE: '/voucher',
    UPDATE: (id) => `/voucher/${id}`,
    DELETE: (id) => `/voucher/${id}`,
  },

  // Discounts
  DISCOUNTS: {
    LIST: '/giam-gia-sp',
    DETAIL: (id) => `/giam-gia-sp/${id}`,
    CREATE: '/giam-gia-sp',
    UPDATE: (id) => `/giam-gia-sp/${id}`,
    DELETE: (id) => `/giam-gia-sp/${id}`,
  },

  // Reports
  REPORTS: {
    SALES: '/reports/sales',
    INVENTORY: '/reports/inventory',
    REVENUE: '/reports/revenue',
  },
};
