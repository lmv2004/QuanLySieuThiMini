import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Chào mừng đến với hệ thống Quản Lý Siêu Thị Mini!</p>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Tổng sản phẩm</h3>
          <p className="stat-number">0</p>
        </div>
        
        <div className="stat-card">
          <h3>Hóa đơn hôm nay</h3>
          <p className="stat-number">0</p>
        </div>
        
        <div className="stat-card">
          <h3>Doanh thu hôm nay</h3>
          <p className="stat-number">0₫</p>
        </div>
        
        <div className="stat-card">
          <h3>Khách hàng</h3>
          <p className="stat-number">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
