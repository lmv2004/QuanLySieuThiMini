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
    'Sản phẩm': 'manage_products',
    'Danh sách sản phẩm': 'manage_products',
    'Loại sản phẩm': 'manage_products',
    'Tồn kho': 'view_inventory',
    'Bán hàng': 'create_invoice',
    'Điểm bán hàng (POS)': 'create_invoice',
    'Danh sách hóa đơn': 'create_invoice',
    'Nhập hàng': 'create_purchase_order',
    'Hủy hàng': 'create_disposal_slip',
    'Khách hàng': 'view_inventory',
    'Nhà cung cấp': 'manage_suppliers',
    'Nhân viên': 'manage_employees',
    'Khuyến mãi': 'create_invoice',
    'Voucher': 'create_invoice',
    'Giảm giá sản phẩm': 'manage_products',
    'Báo cáo': 'view_reports',
    'Báo cáo doanh thu': 'view_reports',
    'Báo cáo bán hàng': 'view_reports',
    'Báo cáo tồn kho': 'view_reports',
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
