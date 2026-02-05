import React from 'react';
import Header from '../Header/index.js';
import Sidebar from '../Sidebar/index.js';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <div className="layout-content">
        <Sidebar />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
