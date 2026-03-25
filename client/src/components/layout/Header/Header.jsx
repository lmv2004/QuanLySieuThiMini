import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth.js';
import { ROUTES } from '../../../config/routes.js';
import { Topbar } from '../../Manage/Topbar.jsx';

const Header = ({ pageTitle = '', homeTo = ROUTES.DASHBOARD, user: userProp = null }) => {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  const currentUser = userProp || authUser;

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <Topbar
      pageTitle={pageTitle}
      user={currentUser}
      onLogout={handleLogout}
      homeTo={homeTo}
    />
  );
};

export default Header;
