import React, { useState, useId } from 'react';
import './accordion.css';

export default function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="accordion">
      <button
        type="button"
        className="accordion__header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span>{title}</span>
        <svg
          className={`accordion__arrow ${open ? 'accordion__arrow--open' : ''}`}
          width="12"
          height="7.4"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1 1L6 6L11 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div id={panelId} className="accordion__body" role="region">
          {children}
        </div>
      )}
    </div>
  );
}