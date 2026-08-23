import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { showToast } from '../features/ui/uiSlice';
import logoIcon from '../assets/icons/logo-icon.svg';
import searchIcon from '../assets/icons/search-icon.svg';
import heartIcon from '../assets/icons/heart-icon.svg';
import cartIcon from '../assets/icons/cart-icon.svg';
import userIcon from '../assets/icons/user-icon.svg';
import './header.css';

function HeaderSearch({ id, value, onChange, onSubmit, className = 'header__search' }) {
  return (
    <form className={className} onSubmit={onSubmit}>
      <img src={searchIcon} alt="" className="header__search-icon" />
      <label htmlFor={id} className="visually-hidden">
        Search products
      </label>
      <input
        id={id}
        type="search"
        placeholder="Search"
        value={value}
        onChange={onChange}
        autoComplete="off"
      />
    </form>
  );
}

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (location.pathname === '/catalog') {
      setSearchQuery(searchParams.get('q') || '');
    }
  }, [location.pathname, searchParams]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery) {
      navigate(`/catalog?q=${encodeURIComponent(trimmedQuery)}`);
    } else {
      navigate('/catalog');
    }

    setMenuOpen(false);
  };

  const handleWishlistClick = () => {
    if (wishlistCount === 0) {
      dispatch(showToast('Your wishlist is empty'));
      return;
    }

    dispatch(showToast(`You have ${wishlistCount} item${wishlistCount === 1 ? '' : 's'} in your wishlist`));
  };

  const handleCartClick = () => {
    dispatch(showToast('Cart is coming soon'));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/catalog" className="header__logo-link" aria-label="Go to catalog">
          <img src={logoIcon} alt="Cyber tech store" className="header__logo" />
        </Link>

        <HeaderSearch
          id="header-search-input"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onSubmit={handleSearchSubmit}
        />

        <div className="header__icons">
          <button
            className="header__icon"
            type="button"
            aria-label="Wishlist"
            onClick={handleWishlistClick}
          >
            <img src={heartIcon} alt="" />
          </button>
          <button
            className="header__icon"
            type="button"
            aria-label="Cart"
            onClick={handleCartClick}
          >
            <img src={cartIcon} alt="" />
          </button>
          <button
            className="header__icon"
            type="button"
            onClick={handleLogout}
            aria-label="Sign out"
          >
            <img src={userIcon} alt="" />
          </button>
        </div>

        <button
          className="header__burger"
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="header__mobile-menu">
          <HeaderSearch
            id="header-search-input-mobile"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onSubmit={handleSearchSubmit}
            className="header__search header__search--mobile"
          />
          <div className="header__mobile-icons">
            <button
              className="header__icon"
              type="button"
              aria-label="Wishlist"
              onClick={handleWishlistClick}
            >
              <img src={heartIcon} alt="" />
            </button>
            <button
              className="header__icon"
              type="button"
              aria-label="Cart"
              onClick={handleCartClick}
            >
              <img src={cartIcon} alt="" />
            </button>
            <button
              className="header__icon"
              type="button"
              onClick={handleLogout}
              aria-label="Sign out"
            >
              <img src={userIcon} alt="" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
