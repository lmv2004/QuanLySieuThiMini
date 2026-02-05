import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../../config/routes.js';
import './Sidebar.css';

const Sidebar = () => {
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
    if (item.children) {
      return (
        <div key={index} className="menu-group">
          <div className="menu-group-title">
            <span className="menu-icon">{item.icon}</span>
            {item.title}
          </div>
          <div className="menu-group-items">
            {item.children.map((child, childIndex) => (
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
