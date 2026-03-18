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
import Cashier from '../pages/Cashier/Cashier.jsx';
import Warehouse from '../pages/Warehouse/Warehouse.jsx';

// Manage Nested Pages
import { ManageLayout } from '../components/layout/ManageLayout.jsx';
import { DashboardPage } from '../pages/Dashboard/DashboardPage.jsx';
import { EmployeesPage } from '../pages/Employees/EmployeesPage.jsx';
import { PositionsPage } from '../pages/Positions/PositionsPage.jsx';
import { PermissionsPage } from '../pages/Permissions/PermissionsPage.jsx';
import { SuppliersPage } from '../pages/Suppliers/SuppliersPage.jsx';
import { ProductsPage } from '../pages/Products/ProductsPage.jsx';
import { CategoriesPage } from '../pages/Categories/CategoriesPage.jsx';
import { InvoicesPage } from '../pages/Invoices/InvoicesPage.jsx';
import { CustomersPage } from '../pages/Customers/CustomersPage.jsx';
import { VouchersPage } from '../pages/Vouchers/VouchersPage.jsx';
import { PromotionsPage } from '../pages/Promotions/PromotionsPage.jsx';
import { AccountsPage } from '../pages/Accounts/AccountsPage.jsx';
import { ImportsPage } from '../pages/Imports/ImportsPage.jsx';
import { DisposalsPage } from '../pages/Disposals/DisposalsPage.jsx';
import { ReportsPage } from '../pages/Reports/ReportsPage.jsx';

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
                <DashboardPage />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Manage – full management UI */}
        <Route path={ROUTES.MANAGE} element={<ManageLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="positions" element={<PositionsPage />} />
          <Route path="permissions" element={<PermissionsPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="vouchers" element={<VouchersPage />} />
          <Route path="promotions" element={<PromotionsPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="imports" element={<ImportsPage />} />
          <Route path="disposals" element={<DisposalsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>

        {/* Cashier interface */}
        <Route path={ROUTES.CASHIER} element={<Cashier />} />

        {/* Warehouse interface */}
        <Route path={ROUTES.WAREHOUSE} element={<Warehouse />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;