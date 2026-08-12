import React from 'react';

interface GoldFrameProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  headerBadge?: string;
  onClick?: () => void;
}

export const GoldFrame: React.FC<GoldFrameProps> = ({
  children,
  className = '',
  title,
  subtitle,
  headerBadge,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl bg-slate-950/90 text-slate-100 p-1 md:p-1.5 shadow-2xl transition-all duration-300 border-2 border-amber-500/80 ${className}`}
      style={{
        boxShadow: '0 0 25px rgba(212, 175, 55, 0.25), inset 0 0 15px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* Outer Metallic Gold Border Frame */}
      <div className="relative rounded-lg bg-gradient-to-b from-amber-900/40 via-slate-900/90 to-amber-950/60 p-4 md:p-6 border border-amber-400/60 overflow-hidden">
        {/* Pixel Corner Accents */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-300 pointer-events-none" />
        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-300 pointer-events-none" />
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-300 pointer-events-none" />
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-300 pointer-events-none" />

        {/* Optional Header Badge */}
        {headerBadge && (
          <div className="flex justify-center -mt-8 mb-4">
            <span className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-widest shadow-md border border-amber-200">
              {headerBadge}
            </span>
          </div>
        )}

        {/* Title & Subtitle */}
        {(title || subtitle) && (
          <div className="text-center mb-4">
            {title && (
              <h2 className="text-xl md:text-2xl font-black tracking-wider text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-serif uppercase">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs md:text-sm text-amber-200/80 font-mono mt-1">
                {subtitle}
              </p>
            )}
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-2" />
          </div>
        )}

        {/* Inner Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
};
