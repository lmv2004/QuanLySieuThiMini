import { CURRENCY_SYMBOL, CURRENCY_LOCALE, DATE_FORMAT, DATETIME_FORMAT } from '../config/constants';

/**
 * Format number to currency
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0₫';
  
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Format date
 * @param {string|Date} date
 * @param {string} format
 * @returns {string}
 */
export const formatDate = (date, format = DATE_FORMAT) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * Format datetime
 * @param {string|Date} datetime
 * @returns {string}
 */
export const formatDateTime = (datetime) => {
  return formatDate(datetime, DATETIME_FORMAT);
};

/**
 * Format number
 * @param {number} number
 * @param {number} decimals
 * @returns {string}
 */
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return '0';
  
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

/**
 * Format phone number
 * @param {string} phone
 * @returns {string}
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  return phone;
};
