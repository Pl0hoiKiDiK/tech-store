import React, { useState, useRef, useEffect } from 'react';
import './select.css';

export default function Select({ value, options, onChange, className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className={`custom-select ${className}`} ref={ref}>
      <button
        type="button"
        className="custom-select__trigger"
        onClick={() => setOpen((o) => !o)}
      >
        <span>{selected?.label}</span>
        <svg
          className={`custom-select__arrow ${open ? 'custom-select__arrow--open' : ''}`}
          width="12"
          height="7.4"
          viewBox="0 0 12 8"
          fill="none"
        >
          <path d="M1 1L6 6L11 1" stroke="#9F9F9F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul className="custom-select__list">
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`custom-select__option ${opt.value === value ? 'custom-select__option--active' : ''}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}