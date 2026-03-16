import { useState, useEffect } from 'react';
import authService from '../services/authService.js';

/**
 * Custom hook for authentication
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        try {
          // Fetch fresh user info from server (includes TENNV, chucVu)
          const data = await authService.getCurrentUser();
          const userInfo = data?.user ?? data;
          setUser(userInfo);
          // Update localStorage with fresh data
          localStorage.setItem('user_info', JSON.stringify(userInfo));
        } catch {
          // Fallback to localStorage if API fails
          const userInfo = authService.getUserInfo();
          setUser(userInfo);
        }
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };
};

export default useAuth;
