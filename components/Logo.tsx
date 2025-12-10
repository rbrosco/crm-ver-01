import React from 'react';

// Neutral, abstract mark — circular emblem with two subtle arcs.
// Intentionally avoids any direct reference to existing sci-fi insignia.
export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      width="36"
      height="36"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
    >
      <defs>
        <linearGradient id="gA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8C9B0" />
          <stop offset="100%" stopColor="#A65A2E" />
        </linearGradient>
      </defs>

      {/* Soft background circle */}
      <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" />

      {/* Outer arc */}
      <path
        d="M14 36 A18 18 0 0 1 50 28"
        stroke="url(#gA)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.95"
      />

      {/* Inner arc (mirrored, lighter) */}
      <path
        d="M18 40 A14 14 0 0 1 46 26"
        stroke="#C8A08A"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />

      {/* Central dot to anchor composition */}
      <circle cx="32" cy="32" r="3" fill="#B46638" opacity="0.95" />
    </svg>
  );
};

export default Logo;
