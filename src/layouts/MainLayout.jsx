import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export default function MainLayout() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="layout">
      <header className="header">
        <nav className="nav">
          <Link to="/catalog">Каталог</Link>
        </nav>
        <button onClick={handleLogout}>Выйти</button>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}