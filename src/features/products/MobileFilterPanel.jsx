import React from 'react';
import FilterContent from './FilterContent';
import './MobileFilterPanel.css';

export default function MobileFilterPanel({ onClose, onApply, ...filterProps }) {
  return (
    <div className="mobile-filter-panel">
      <div className="mf-top">
        <button type="button" className="mf-top__back" onClick={onClose} aria-label="Close filter">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="mf-top__title">Filters</span>
      </div>

      <div className="mf-filters">
        <FilterContent {...filterProps} isMobile />
      </div>

      <button type="button" className="mf-apply" onClick={onApply}>
        Apply
      </button>
    </div>
  );
}