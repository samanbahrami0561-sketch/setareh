import React from 'react';

interface SetarehLogoProps {
  className?: string;
  size?: number;
}

export const SetarehLogo: React.FC<SetarehLogoProps> = ({ className = '', size = 48 }) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
      >
        {/* Phone Outer Metallic Frame */}
        <rect
          x="45"
          y="20"
          width="110"
          height="160"
          rx="18"
          stroke="url(#goldGrad)"
          strokeWidth="6"
          fill="#0a0f1d"
        />
        
        {/* Phone Notch / Earpiece */}
        <rect x="85" y="27" width="30" height="4" rx="2" fill="#d97706" />

        {/* Outer Corner Bevel Accents */}
        <path d="M 55 45 L 70 32" stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" />
        <path d="M 145 45 L 130 32" stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" />
        <path d="M 55 155 L 70 168" stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" />
        <path d="M 145 155 L 130 168" stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" />

        {/* 3D Geometric Star Facets (Gold & Metallic Steel Blue) */}
        {/* Central North Gold Facet */}
        <polygon points="100,42 100,100 118,72" fill="url(#goldGradLight)" />
        <polygon points="100,42 100,100 82,72" fill="url(#goldGradDark)" />

        {/* East Star Points */}
        <polygon points="162,100 100,100 128,118" fill="url(#blueGradLight)" />
        <polygon points="162,100 100,100 128,82" fill="url(#blueGradDark)" />

        {/* South Gold Facet */}
        <polygon points="100,158 100,100 82,128" fill="url(#goldGradLight)" />
        <polygon points="100,158 100,100 118,128" fill="url(#goldGradDark)" />

        {/* West Star Points */}
        <polygon points="38,100 100,100 72,82" fill="url(#blueGradLight)" />
        <polygon points="38,100 100,100 72,118" fill="url(#blueGradDark)" />

        {/* Diagonal Cross Star Facets */}
        <polygon points="142,58 100,100 114,88" fill="url(#goldGradLight)" />
        <polygon points="142,58 100,100 126,72" fill="#2563eb" />

        <polygon points="58,58 100,100 74,72" fill="url(#goldGradDark)" />
        <polygon points="58,58 100,100 86,88" fill="#1e40af" />

        <polygon points="142,142 100,100 126,128" fill="url(#blueGradLight)" />
        <polygon points="142,142 100,100 114,112" fill="url(#goldGradLight)" />

        <polygon points="58,142 100,100 86,112" fill="url(#blueGradDark)" />
        <polygon points="58,142 100,100 74,128" fill="url(#goldGradDark)" />

        {/* Center Star Diamond Core Highlight */}
        <polygon points="100,90 110,100 100,110 90,100" fill="#ffffff" />

        {/* Gradients */}
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <linearGradient id="goldGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          <linearGradient id="goldGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          <linearGradient id="blueGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          <linearGradient id="blueGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
