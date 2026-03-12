// Route Paths Configuration

export const ROUTES = {
  // Public Routes
  LOGIN: '/login',
  REGISTER: '/register',

  // Private Routes
  DASHBOARD: '/',

  // Products
  PRODUCTS: '/products',
  PRODUCT_LIST: '/products',
  PRODUCT_DETAIL: '/products/:id',
  PRODUCT_CREATE: '/products/create',
  PRODUCT_EDIT: '/products/:id/edit',

  // Categories
  CATEGORIES: '/categories',

  // Inventory
  INVENTORY: '/inventory',
  INVENTORY_IMPORT: '/inventory/import',

  // Sales
  SALES: '/sales',
  POS: '/sales/pos',
  INVOICES: '/sales/invoices',
  INVOICE_DETAIL: '/sales/invoices/:id',

  // Customers
  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: '/customers/:id',

  // Suppliers
  SUPPLIERS: '/suppliers',
  SUPPLIER_DETAIL: '/suppliers/:id',

  // Employees
  EMPLOYEES: '/employees',
  EMPLOYEE_DETAIL: '/employees/:id',

  // Imports
  IMPORTS: '/imports',
  IMPORT_CREATE: '/imports/create',
  IMPORT_DETAIL: '/imports/:id',

  // Disposal
  DISPOSAL: '/disposal',

  // Promotions
  PROMOTIONS: '/promotions',
  VOUCHERS: '/promotions/vouchers',
  DISCOUNTS: '/promotions/discounts',

  // Reports
  REPORTS: '/reports',
  SALES_REPORT: '/reports/sales',
  INVENTORY_REPORT: '/reports/inventory',
  REVENUE_REPORT: '/reports/revenue',

  // Manage (all-in-one management section)
  MANAGE: '/manage',

  // Cashier (thu ngân )
  CASHIER: '/cashier',

  // Warehouse (nhân viên kho )
  WAREHOUSE: '/warehouse',
};
