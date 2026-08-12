import React from 'react';

interface TouchControlsProps {
  onLeftStart: () => void;
  onLeftEnd: () => void;
  onRightStart: () => void;
  onRightEnd: () => void;
  onJump: () => void;
  onKick: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onLeftStart,
  onLeftEnd,
  onRightStart,
  onRightEnd,
  onJump,
  onKick,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 flex items-center justify-between pointer-events-auto select-none touch-none">
      {/* Directional Pad */}
      <div className="flex gap-2">
        <button
          onTouchStart={onLeftStart}
          onTouchEnd={onLeftEnd}
          onMouseDown={onLeftStart}
          onMouseUp={onLeftEnd}
          onMouseLeave={onLeftEnd}
          className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-amber-400/80 active:border-amber-300 text-amber-300 font-mono font-black text-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
        >
          ◄
        </button>

        <button
          onTouchStart={onRightStart}
          onTouchEnd={onRightEnd}
          onMouseDown={onRightStart}
          onMouseUp={onRightEnd}
          onMouseLeave={onRightEnd}
          className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-amber-400/80 active:border-amber-300 text-amber-300 font-mono font-black text-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
        >
          ►
        </button>
      </div>

      {/* Action Buttons: Jump & Kick */}
      <div className="flex gap-3">
        <button
          onTouchStart={onJump}
          onMouseDown={onJump}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-b from-blue-600 to-indigo-900 border-2 border-blue-300 text-blue-100 font-black text-xs md:text-sm flex flex-col items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer"
        >
          <span className="text-base font-bold">▲</span>
          <span className="text-[9px] uppercase font-mono">Salto</span>
        </button>

        <button
          onTouchStart={onKick}
          onMouseDown={onKick}
          className="w-16 h-16 md:w-18 md:h-18 rounded-full bg-gradient-to-b from-amber-500 to-amber-700 border-2 border-amber-200 text-amber-950 font-black text-xs md:text-sm flex flex-col items-center justify-center shadow-xl active:scale-90 transition-transform cursor-pointer ring-2 ring-amber-400/50"
        >
          <span className="text-lg font-black">X</span>
          <span className="text-[10px] uppercase font-mono font-bold">PATADA</span>
        </button>
      </div>
    </div>
  );
};
