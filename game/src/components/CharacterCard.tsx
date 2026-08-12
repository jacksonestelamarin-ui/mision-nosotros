import React from 'react';
import { PixelAvatar } from './PixelAvatar';

interface CharacterCardProps {
  name: string;
  role: string;
  character: 'jackson' | 'eliza' | 'carlos';
  details: string[];
  stats?: { label: string; value: string }[];
  variant?: 'normal' | 'wedding';
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  name,
  role,
  character,
  details,
  stats,
  variant = 'normal',
}) => {
  return (
    <div className="relative rounded-xl bg-slate-900/90 border-2 border-amber-400 p-4 shadow-xl max-w-sm w-full mx-auto text-slate-100 flex flex-col items-center">
      {/* Top Banner */}
      <div className="w-full text-center pb-2 border-b border-amber-500/40 mb-3">
        <h3 className="text-lg font-black text-amber-300 font-serif tracking-wider uppercase">
          {name}
        </h3>
        <p className="text-xs text-amber-200/70 font-mono">{role}</p>
      </div>

      {/* Character Pixel Portrait */}
      <div className="my-2 p-2 rounded-lg bg-slate-950 border border-amber-400/60 shadow-inner">
        <PixelAvatar character={character} size="xl" variant={variant} />
      </div>

      {/* Details List */}
      <ul className="w-full text-xs text-slate-300 space-y-1.5 my-3 bg-slate-950/60 p-3 rounded-md border border-slate-800">
        {details.map((detail, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">◆</span>
            <span>{detail}</span>
          </li>
        ))}
      </ul>

      {/* Stats Section if present */}
      {stats && stats.length > 0 && (
        <div className="w-full grid grid-cols-2 gap-2 mt-1">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-amber-950/40 border border-amber-500/30 rounded p-1.5 text-center">
              <span className="text-[10px] uppercase text-amber-300 block font-mono">{stat.label}</span>
              <span className="text-xs font-bold text-amber-100">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
