import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../config/routes.js';

// Layout
import MainLayout from '../components/layout/MainLayout/index.js';

// Route Guards
import PrivateRoute from './PrivateRoute.jsx';
import PublicRoute from './PublicRoute.jsx';

// Pages
import Login from '../pages/Auth/Login.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import ProductList from '../pages/Products/ProductList.jsx';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Private Routes */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.PRODUCTS}
          element={
            <PrivateRoute>
              <MainLayout>
                <ProductList />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
