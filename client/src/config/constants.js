// Application Constants

export const APP_NAME = 'Quản Lý Siêu Thị Mini';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const API_TIMEOUT = 30000;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date Formats
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm:ss';
export const TIME_FORMAT = 'HH:mm:ss';

// Currency
export const CURRENCY_SYMBOL = '₫';
export const CURRENCY_LOCALE = 'vi-VN';

// Status Constants
export const STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
};

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
  THEME: 'theme',
};

// Toast/Notification Settings
export const NOTIFICATION_DURATION = 3000;
