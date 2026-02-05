import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth.js';
import { APP_NAME } from '../../../config/constants.js';
import { ROUTES } from '../../../config/routes.js';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to={ROUTES.DASHBOARD} className="header-logo">
            <h1>{APP_NAME}</h1>
          </Link>
        </div>

        <div className="header-right">
          {user && (
            <div className="user-menu">
              <span className="user-name">{user.name || user.email}</span>
              <button onClick={handleLogout} className="logout-btn">
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
