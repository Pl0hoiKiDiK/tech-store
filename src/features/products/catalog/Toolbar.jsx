import React from 'react';
import Select from '../../../components/Select';
import filtersIcon from '../../../assets/icons/filters-icon.svg';
import './Toolbar.css';

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

export function MobileToolbar({ count, onFilterToggle, filterOpen, sortBy, onSortChange }) {
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

        <Select
          value={sortBy}
          onChange={onSortChange}
          options={[
            { value: 'rating', label: 'By rating' },
            { value: 'price', label: 'By price' },
            { value: 'title', label: 'By title' },
          ]}
          className="mobile-controls__btn"
        />
      </div>

      <p className="mobile-results">
        Products Result : <span>{count}</span>
      </p>
    </>
  );
}