import React from 'react';
import Select from '../../../components/Select';
import filtersIcon from '../../../assets/icons/filters-icon.svg';
import './Toolbar.css';

function MobileArrowIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9L12 15L18 9" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DesktopToolbar({ count, sortBy, onSortChange }) {
  return (
    <div className="products__toolbar">
      <p className="products__count">
        Selected Products: <span>{count}</span>
      </p>
      <Select
        value={sortBy}
        onChange={onSortChange}
        options={[
          { value: 'rating', label: 'By rating' },
          { value: 'price', label: 'By price' },
          { value: 'title', label: 'By title' },
        ]}
      />
    </div>
  );
}

export function MobileToolbar({ count, onFilterToggle, filterOpen }) {
  return (
    <>
      <div className="mobile-controls">
        <button
          type="button"
          className="mobile-controls__btn"
          onClick={onFilterToggle}
          aria-expanded={filterOpen}
        >
          <span>Filters</span>
          <img src={filtersIcon} alt="" />
        </button>
        <button type="button" className="mobile-controls__btn">
          <span>By rating</span>
          <MobileArrowIcon />
        </button>
      </div>

      <p className="mobile-results">
        Products Result : <span>{count}</span>
      </p>
    </>
  );
}