import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import logoIcon from '../assets/icons/logo-icon.svg';
import searchIcon from '../assets/icons/search-icon.svg';
import heartIcon from '../assets/icons/heart-icon.svg';
import cartIcon from '../assets/icons/cart-icon.svg';
import userIcon from '../assets/icons/user-icon.svg';
import './header.css';

export default function Header() {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header__inner">
        <img src={logoIcon} alt="Cyber — интернет-магазин техники" className="header__logo" />

        <div className="header__search">
          <img src={searchIcon} alt="" className="header__search-icon" />
          <label htmlFor="header-search-input" className="visually-hidden">
            Поиск товаров
          </label>
          <input id="header-search-input" type="text" placeholder="Search" />
        </div>

        <div className="header__icons">
          <button className="header__icon" type="button" aria-label="Избранное">
            <img src={heartIcon} alt="" />
          </button>
          <button className="header__icon" type="button" aria-label="Корзина">
            <img src={cartIcon} alt="" />
          </button>
          <button
            className="header__icon"
            type="button"
            onClick={() => dispatch(logout())}
            aria-label="Выйти из аккаунта"
          >
            <img src={userIcon} alt="" />
          </button>
        </div>

        <button
          className="header__burger"
          type="button"
          aria-label="Открыть меню"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="header__mobile-menu">
          <div className="header__search header__search--mobile">
            <img src={searchIcon} alt="" className="header__search-icon" />
            <input type="text" placeholder="Search" />
          </div>
          <div className="header__mobile-icons">
            <button className="header__icon" type="button" aria-label="Избранное">
              <img src={heartIcon} alt="" />
            </button>
            <button className="header__icon" type="button" aria-label="Корзина">
              <img src={cartIcon} alt="" />
            </button>
            <button
              className="header__icon"
              type="button"
              onClick={() => dispatch(logout())}
              aria-label="Выйти из аккаунта"
            >
              <img src={userIcon} alt="" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}