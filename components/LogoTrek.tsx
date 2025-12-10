import React from 'react';

// Subtle Star Trek-inspired mark: abstract chevron + orbiting star.
// Intentionally original shape—evokes exploration without copying trademarks.
const LogoTrek: React.FC<{ className?: string }> = ({ className = '' }) => {
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
        <linearGradient id="ltg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD7A8" />
          <stop offset="100%" stopColor="#B46638" />
        </linearGradient>
      </defs>

      {/* soft backdrop circle */}
      <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.03)" />

      {/* abstract chevron (not identical to any IP) */}
      <g transform="translate(0,2)">
        <path
          d="M20 44 L32 16 L44 44 L36 44 L32 34 L28 34 L24 44 Z"
          fill="url(#ltg)"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="0.6"
        />
      </g>

      {/* orbiting spark to the upper-right */}
      <g transform="translate(46,12) scale(0.9)">
        <circle cx="0" cy="0" r="2.2" fill="#FFD700" />
        <path d="M0 -4 L0.4 -1 L3 -1 L0.8 0.6 L1.8 3 L0 1.2 L-1.8 3 L-0.8 0.6 L-3 -1 L-0.4 -1 Z" fill="#FFD700" opacity="0.9" />
      </g>

      {/* grounding dot */}
      <circle cx="32" cy="40" r="2.5" fill="#A65A2E" opacity="0.95" />
    </svg>
  );
};

export default LogoTrek;
