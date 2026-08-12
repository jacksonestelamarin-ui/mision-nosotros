import React from 'react';

interface PixelAvatarProps {
  character: 'jackson' | 'eliza' | 'carlos' | 'heart' | 'plane' | 'incakola' | 'stamp';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'normal' | 'wedding';
}

export const PixelAvatar: React.FC<PixelAvatarProps> = ({
  character,
  size = 'md',
}) => {
  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
  }[size];

  if (character === 'incakola') {
    return (
      <div className={`relative ${dimensions} flex items-center justify-center p-1 bg-amber-950/80 border-2 border-amber-400 rounded-xl shadow-xl`}>
        <svg viewBox="0 0 24 24" className="w-full h-full shape-rendering-crisp">
          <rect x="10" y="2" width="4" height="2" fill="#dc2626" />
          <rect x="10.5" y="4" width="3" height="3" fill="#38bdf8" opacity="0.6" />
          <rect x="8" y="7" width="8" height="13" rx="1" fill="#facc15" />
          <rect x="9" y="8" width="6" height="11" fill="#fef08a" />
          <rect x="7.5" y="10" width="9" height="6" fill="#2563eb" />
          <rect x="8.5" y="11" width="7" height="4" fill="#fef08a" />
          <rect x="9" y="12" width="6" height="2" fill="#1e3a8a" />
          <rect x="10" y="14" width="1" height="1" fill="#ffffff" />
          <rect x="13" y="9" width="1" height="1" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  if (character === 'jackson') {
    return (
      <div className={`relative ${dimensions} rounded-xl bg-slate-900/90 border-2 border-amber-400 p-1 flex items-center justify-center overflow-hidden shadow-lg`}>
        <img
          src="/assets/sprites/jackson.svg"
          alt="Jackson"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  if (character === 'eliza') {
    return (
      <div className={`relative ${dimensions} rounded-xl bg-slate-900/90 border-2 border-amber-400 p-1 flex items-center justify-center overflow-hidden shadow-lg`}>
        <img
          src="/assets/sprites/eliza.svg"
          alt="Eliza"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  if (character === 'carlos') {
    return (
      <div className={`relative ${dimensions} rounded-xl bg-slate-900/90 border-2 border-red-500 p-1 flex items-center justify-center overflow-hidden shadow-lg`}>
        <img
          src="/assets/sprites/carlos.svg"
          alt="Carlos"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  if (character === 'stamp') {
    return (
      <div className={`relative ${dimensions} flex items-center justify-center p-1 bg-amber-950/80 border-2 border-amber-300 rounded-xl shadow-xl animate-pulse`}>
        <svg viewBox="0 0 24 24" className="w-full h-full shape-rendering-crisp">
          <rect x="2" y="3" width="20" height="18" fill="#d97706" rx="2" />
          <rect x="4" y="5" width="16" height="14" fill="#fef08a" />
          <circle cx="12" cy="12" r="5" fill="#3b82f6" opacity="0.8" />
          <path d="M9 12 L12 9 L15 12 L12 15 Z" fill="#ffffff" />
          <rect x="7" y="7" width="10" height="1" fill="#1e3a8a" />
          <rect x="7" y="16" width="10" height="1" fill="#1e3a8a" />
        </svg>
      </div>
    );
  }

  if (character === 'plane') {
    return (
      <div className={`relative ${dimensions} flex items-center justify-center`}>
        <svg viewBox="0 0 24 24" className="w-full h-full shape-rendering-crisp">
          <rect x="3" y="10" width="18" height="4" fill="#f8fafc" />
          <rect x="19" y="11" width="4" height="2" fill="#38bdf8" />
          <rect x="9" y="4" width="4" height="8" fill="#cbd5e1" />
          <rect x="9" y="12" width="4" height="8" fill="#cbd5e1" />
          <rect x="1" y="8" width="3" height="4" fill="#ef4444" />
        </svg>
      </div>
    );
  }

  // Heart
  return (
    <div className={`relative ${dimensions} flex items-center justify-center`}>
      <svg viewBox="0 0 24 24" className="w-full h-full shape-rendering-crisp">
        <path d="M3 8 Q3 3 8 3 Q12 3 12 8 Q12 3 16 3 Q21 3 21 8 Q21 14 12 21 Q3 14 3 8 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
      </svg>
    </div>
  );
};
