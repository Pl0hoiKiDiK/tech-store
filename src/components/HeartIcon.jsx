import React from 'react';

export default function HeartIcon({ active = false, className = '' }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="none"
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <path
        stroke={active ? '#C0392B' : '#919191'}
        strokeOpacity={active ? 1 : 0.77}
        strokeWidth="1.4"
        fill={active ? '#C0392B' : 'none'}
        d="m5.934 18.544 9.381 8.813c.325.305.487.457.685.457s.36-.152.685-.457l9.38-8.813a6.94 6.94 0 0 0 .732-9.31l-.412-.53c-2.625-3.383-7.892-2.816-9.736 1.048a.719.719 0 0 1-1.298 0C13.507 5.888 8.24 5.32 5.615 8.703l-.412.532a6.94 6.94 0 0 0 .731 9.31Z"
      />
    </svg>
  );
}
