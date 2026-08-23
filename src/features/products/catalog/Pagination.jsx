import React from 'react';
import './Pagination.css';

function ChevronIcon({ direction }) {
  const rotate = direction === 'left' ? 'rotate(180deg)' : 'none';
  return (
    <svg width="6" height="12" viewBox="0 0 6 12" fill="none" style={{ transform: rotate }} aria-hidden="true">
      <path d="M1 1L5 6L1 11" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination__arrow"
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronIcon direction="left" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .slice(0, 5)
        .map((num) => (
          <button
            key={num}
            type="button"
            className={`pagination__number ${num === page ? 'pagination__active' : ''}`}
            onClick={() => onPageChange(num)}
            aria-label={`Page ${num}`}
            aria-current={num === page ? 'page' : undefined}
          >
            {num}
          </button>
        ))}
      <button
        className="pagination__arrow"
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronIcon direction="right" />
      </button>
    </nav>
  );
}