import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../../config/routes.js';
import useAuth from '../../../hooks/useAuth.js';
import authService from '../../../services/authService.js';
import './Sidebar.css';

const Sidebar = () => {
  const { permissions: authPermissions } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);

  useEffect(() => {
    // Try to get permissions from useAuth hook first
    if (authPermissions && authPermissions.permissions) {
      setUserRole(authPermissions.role);
      setUserPermissions(authPermissions.permissions);
      console.log('Sidebar - Role (from useAuth):', authPermissions.role);
      console.log('Sidebar - Permissions (from useAuth):', authPermissions.permissions);
      return;
    }

    // Fallback to authService
    const permissions = authService.getPermissions();
    if (permissions && permissions.permissions) {
      setUserRole(permissions.role);
      setUserPermissions(permissions.permissions);
      console.log('Sidebar - Role (from authService):', permissions.role);
      console.log('Sidebar - Permissions (from authService):', permissions.permissions);
    }
  }, [authPermissions]);

  // Permission mapping for menu items
  const PERMISSION_MAP = {
    'Sản phẩm': 'products.view',
    'Danh sách sản phẩm': 'products.view',
    'Loại sản phẩm': 'categories.view',
    'Tồn kho': 'inventories.view',
    'Bán hàng': 'invoices.view',
    'Điểm bán hàng (POS)': 'invoices.create',
    'Danh sách hóa đơn': 'invoices.view',
    'Nhập hàng': 'purchase-orders.view',
    'Hủy hàng': 'disposal-slips.view',
    'Khách hàng': 'customers.view',
    'Nhà cung cấp': 'suppliers.view',
    'Nhân viên': 'employees.view',
    'Khuyến mãi': 'discounts.view',
    'Voucher': 'vouchers.view',
    'Giảm giá sản phẩm': 'discounts.view',
    'Báo cáo': 'reports.view',
    'Báo cáo doanh thu': 'reports.view',
    'Báo cáo bán hàng': 'reports.view',
    'Báo cáo tồn kho': 'reports.view',
  };

  // Check if user has permission for menu item
  const hasPermissionForItem = (itemName) => {
    const requiredPermission = PERMISSION_MAP[itemName];
    if (!requiredPermission) return true; // Show if no permission mapping
    if (!userPermissions || userPermissions.length === 0) return false;
    return userPermissions.includes(requiredPermission);
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: ROUTES.DASHBOARD,
      icon: '📊',
    },
    {
      title: 'Sản phẩm',
      icon: '📦',
      children: [
        { title: 'Danh sách sản phẩm', path: ROUTES.PRODUCTS },
        { title: 'Loại sản phẩm', path: ROUTES.CATEGORIES },
        { title: 'Tồn kho', path: ROUTES.INVENTORY },
      ],
    },
    {
      title: 'Bán hàng',
      icon: '🛒',
      children: [
        { title: 'Điểm bán hàng (POS)', path: ROUTES.POS },
        { title: 'Danh sách hóa đơn', path: ROUTES.INVOICES },
      ],
    },
    {
      title: 'Nhập hàng',
      path: ROUTES.IMPORTS,
      icon: '📥',
    },
    {
      title: 'Hủy hàng',
      path: ROUTES.DISPOSAL,
      icon: '🗑️',
    },
    {
      title: 'Khách hàng',
      path: ROUTES.CUSTOMERS,
      icon: '👥',
    },
    {
      title: 'Nhà cung cấp',
      path: ROUTES.SUPPLIERS,
      icon: '🏢',
    },
    {
      title: 'Nhân viên',
      path: ROUTES.EMPLOYEES,
      icon: '👨‍💼',
    },
    {
      title: 'Khuyến mãi',
      icon: '🎁',
      children: [
        { title: 'Voucher', path: ROUTES.VOUCHERS },
        { title: 'Giảm giá sản phẩm', path: ROUTES.DISCOUNTS },
      ],
    },
    {
      title: 'Báo cáo',
      icon: '📈',
      children: [
        { title: 'Báo cáo doanh thu', path: ROUTES.REVENUE_REPORT },
        { title: 'Báo cáo bán hàng', path: ROUTES.SALES_REPORT },
        { title: 'Báo cáo tồn kho', path: ROUTES.INVENTORY_REPORT },
      ],
    },
  ];

  const renderMenuItem = (item, index) => {
    // Check if item has permission
    if (!hasPermissionForItem(item.title)) {
      return null;
    }

    if (item.children) {
      // Filter children by permissions
      const filteredChildren = item.children.filter((child) =>
        hasPermissionForItem(child.title)
      );

      // Don't render group if no children have permission
      if (filteredChildren.length === 0) {
        return null;
      }

      return (
        <div key={index} className="menu-group">
          <div className="menu-group-title">
            <span className="menu-icon">{item.icon}</span>
            {item.title}
          </div>
          <div className="menu-group-items">
            {filteredChildren.map((child, childIndex) => (
              <NavLink
                key={childIndex}
                to={child.path}
                className={({ isActive }) =>
                  `menu-item ${isActive ? 'active' : ''}`
                }
              >
                {child.title}
              </NavLink>
            ))}
          </div>
        </div>
      );
    }

    return (
      <NavLink
        key={index}
        to={item.path}
        className={({ isActive }) =>
          `menu-item ${isActive ? 'active' : ''}`
        }
      >
        <span className="menu-icon">{item.icon}</span>
        {item.title}
      </NavLink>
    );
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => renderMenuItem(item, index))}
      </nav>
    </aside>
  );
};

export default Sidebar;
