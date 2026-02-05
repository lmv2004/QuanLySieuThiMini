/**
 * Validation utilities
 */

export const validators = {
  // Required field
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'Trường này là bắt buộc';
    }
    return null;
  },

  // Email validation
  email: (value) => {
    if (!value) return null;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Email không hợp lệ';
    }
    return null;
  },

  // Phone number validation
  phone: (value) => {
    if (!value) return null;
    
    const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(value)) {
      return 'Số điện thoại không hợp lệ';
    }
    return null;
  },

  // Minimum length
  minLength: (min) => (value) => {
    if (!value) return null;
    
    if (value.length < min) {
      return `Độ dài tối thiểu là ${min} ký tự`;
    }
    return null;
  },

  // Maximum length
  maxLength: (max) => (value) => {
    if (!value) return null;
    
    if (value.length > max) {
      return `Độ dài tối đa là ${max} ký tự`;
    }
    return null;
  },

  // Minimum value
  min: (min) => (value) => {
    if (value === null || value === undefined || value === '') return null;
    
    if (Number(value) < min) {
      return `Giá trị tối thiểu là ${min}`;
    }
    return null;
  },

  // Maximum value
  max: (max) => (value) => {
    if (value === null || value === undefined || value === '') return null;
    
    if (Number(value) > max) {
      return `Giá trị tối đa là ${max}`;
    }
    return null;
  },

  // Number validation
  number: (value) => {
    if (!value) return null;
    
    if (isNaN(Number(value))) {
      return 'Giá trị phải là số';
    }
    return null;
  },

  // Positive number
  positive: (value) => {
    if (value === null || value === undefined || value === '') return null;
    
    if (Number(value) <= 0) {
      return 'Giá trị phải lớn hơn 0';
    }
    return null;
  },
};

/**
 * Validate form data
 * @param {object} data - Form data
 * @param {object} rules - Validation rules
 * @returns {object} - Errors object
 */
export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
    const value = data[field];

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return errors;
};
