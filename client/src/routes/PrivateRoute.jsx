import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { ROUTES } from '../config/routes.js';
import Loading from '../components/common/Loading/index.js';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading size="large" text="Đang kiểm tra đăng nhập..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

export default PrivateRoute;
