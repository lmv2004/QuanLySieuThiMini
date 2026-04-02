import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PermissionProvider } from '../contexts/PermissionContext.jsx';

// Route Guards
import PublicRoute from './PublicRoute.jsx';

// Pages
import Login from '../pages/Auth/Login.jsx';

// ManageLayout & Nested Pages
import { ManageLayout } from '../components/layout/ManageLayout.jsx';
import { DashboardPage }  from '../pages/Dashboard/DashboardPage.jsx';
import { EmployeesPage }  from '../pages/Employees/EmployeesPage.jsx';
import { PositionsPage }  from '../pages/Positions/PositionsPage.jsx';
import { PermissionsPage } from '../pages/Permissions/PermissionsPage.jsx';
import { SuppliersPage }  from '../pages/Suppliers/SuppliersPage.jsx';
import { ProductsPage }   from '../pages/Products/ProductsPage.jsx';
import { CategoriesPage } from '../pages/Categories/CategoriesPage.jsx';
import { InvoicesPage }   from '../pages/Invoices/InvoicesPage.jsx';
import { InvoicesListPage } from '../pages/Invoices/InvoicesListPage.jsx';
import { CustomersPage }  from '../pages/Customers/CustomersPage.jsx';
import { VouchersPage }   from '../pages/Vouchers/VouchersPage.jsx';
import { PromotionsPage } from '../pages/Promotions/PromotionsPage.jsx';
import { AccountsPage }   from '../pages/Accounts/AccountsPage.jsx';
import { ImportsPage }    from '../pages/Imports/ImportsPage.jsx';
import { DisposalsPage }  from '../pages/Disposals/DisposalsPage.jsx';
import { ReportsPage }    from '../pages/Reports/ReportsPage.jsx';
import StoreInfoPage      from '../pages/StoreInfo/StoreInfoPage.jsx';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <PermissionProvider>
        <Routes>
          {/* ── Public ─────────────────────────────── */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* ── Dashboard chính (tất cả vai trò) ────── */}
          {/* ManageLayout tự xử lý: auth check + filter sidebar theo permission */}
          <Route element={<ManageLayout />}>
            {/* / → /dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            <Route path="dashboard"   element={<DashboardPage />} />
            <Route path="employees"   element={<EmployeesPage />} />
            <Route path="positions"   element={<PositionsPage />} />
            <Route path="permissions" element={<PermissionsPage />} />
            <Route path="suppliers"   element={<SuppliersPage />} />
            <Route path="products"    element={<ProductsPage />} />
            <Route path="categories"  element={<CategoriesPage />} />
            <Route path="cashier"     element={<InvoicesPage />} />
            <Route path="invoices"    element={<InvoicesListPage />} />
            <Route path="customers"   element={<CustomersPage />} />
            <Route path="vouchers"    element={<VouchersPage />} />
            <Route path="promotions"  element={<PromotionsPage />} />
            <Route path="accounts"    element={<AccountsPage />} />
            <Route path="imports"     element={<ImportsPage />} />
            <Route path="disposals"   element={<DisposalsPage />} />
            <Route path="reports"     element={<ReportsPage />} />
            <Route path="store-info"  element={<StoreInfoPage />} />
          </Route>

          {/* ── Legacy redirects: /manage/* → /* ───── */}
          <Route path="/manage"             element={<Navigate to="/dashboard" replace />} />
          <Route path="/manage/dashboard"   element={<Navigate to="/dashboard"  replace />} />
          <Route path="/manage/employees"   element={<Navigate to="/employees"  replace />} />
          <Route path="/manage/positions"   element={<Navigate to="/positions"  replace />} />
          <Route path="/manage/permissions" element={<Navigate to="/permissions" replace />} />
          <Route path="/manage/suppliers"   element={<Navigate to="/suppliers"  replace />} />
          <Route path="/manage/products"    element={<Navigate to="/products"   replace />} />
          <Route path="/manage/categories"  element={<Navigate to="/categories" replace />} />
          <Route path="/manage/cashier"     element={<Navigate to="/cashier"    replace />} />
          <Route path="/manage/invoices"    element={<Navigate to="/invoices"   replace />} />
          <Route path="/manage/customers"   element={<Navigate to="/customers"  replace />} />
          <Route path="/manage/vouchers"    element={<Navigate to="/vouchers"   replace />} />
          <Route path="/manage/promotions"  element={<Navigate to="/promotions" replace />} />
          <Route path="/manage/accounts"    element={<Navigate to="/accounts"   replace />} />
          <Route path="/manage/imports"     element={<Navigate to="/imports"    replace />} />
          <Route path="/manage/disposals"   element={<Navigate to="/disposals"  replace />} />
          <Route path="/manage/reports"     element={<Navigate to="/reports"    replace />} />
          <Route path="/manage/store-info"  element={<Navigate to="/store-info" replace />} />

          {/* ── Catch all ──────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PermissionProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;