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
import Manage from '../pages/Manage/Manage.jsx';
import Cashier from '../pages/Cashier/Cashier.jsx';
import Warehouse from '../pages/Warehouse/Warehouse.jsx';

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

        {/* Manage – full management UI with its own dark-theme layout */}
        <Route
          path={ROUTES.MANAGE}
          element={<Manage />}
        />

        {/* Cashier – thu ngân interface */}
        <Route
          path={ROUTES.CASHIER}
          element={<Cashier />}
        />

        {/* Warehouse – nhân viên kho interface */}
        <Route
          path={ROUTES.WAREHOUSE}
          element={<Warehouse />}
        />

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
