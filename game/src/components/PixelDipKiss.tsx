import React from 'react';

export const PixelDipKiss: React.FC = () => {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center p-2 rounded-2xl bg-slate-950/90 border-4 border-amber-400 shadow-[0_0_50px_rgba(212,175,55,0.7)] backdrop-blur">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full shape-rendering-crisp"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Soft Background Radial Glow */}
        <circle cx="50" cy="50" r="45" fill="#fef08a" opacity="0.15" />

        {/* --- FLOATING PIXEL HEARTS & SPARKLES OVERHEAD --- */}
        <g className="animate-pulse">
          {/* Main Glowing Center Heart */}
          <path
            d="M46 16 Q46 12 50 12 Q54 12 54 16 Q54 12 58 12 Q62 12 62 16 Q62 22 54 30 Q46 22 46 16 Z"
            fill="#ef4444"
            stroke="#b91c1c"
            strokeWidth="1"
          />
          {/* Sparkles */}
          <rect x="36" y="10" width="3" height="3" fill="#fef08a" />
          <rect x="68" y="14" width="3" height="3" fill="#fef08a" />
          <rect x="32" y="22" width="2" height="2" fill="#38bdf8" />
          <rect x="72" y="24" width="2" height="2" fill="#f43f5e" />
          <rect x="42" y="6" width="2" height="2" fill="#ffffff" />
          <rect x="62" y="6" width="2" height="2" fill="#ffffff" />
        </g>

        {/* --- JACKSON (Left/Center) --- */}
        {/* Jackson Legs (White Wedding Suit Trousers & Black Shoes) */}
        <rect x="30" y="68" width="8" height="26" fill="#ffffff" />
        <rect x="40" y="68" width="8" height="26" fill="#f8fafc" />
        <rect x="28" y="92" width="11" height="5" fill="#0f172a" rx="1" /> {/* Black Shoe L */}
        <rect x="39" y="92" width="11" height="5" fill="#0f172a" rx="1" /> {/* Black Shoe R */}

        {/* Jackson Torso (White Suit, Black Bowtie & Red Boutonniere) */}
        <rect x="30" y="38" width="22" height="30" fill="#ffffff" />
        <rect x="40" y="38" width="2" height="18" fill="#0f172a" /> {/* Black Tie Line */}
        <rect x="38" y="38" width="6" height="3" fill="#020617" /> {/* Bowtie */}
        <rect x="33" y="44" width="4" height="4" fill="#ef4444" rx="1" /> {/* Boutonniere Rose */}

        {/* Jackson Arms Supporting Eliza in Dip Kiss */}
        {/* Supporting Arm under Eliza's waist */}
        <rect x="42" y="48" width="26" height="8" fill="#ffffff" />
        <rect x="62" y="52" width="14" height="7" fill="#ffffff" />
        <rect x="72" y="50" width="6" height="6" fill="#fbcfe8" /> {/* Hand around Eliza */}

        {/* Jackson Head (Leaning slightly forward/right) */}
        <rect x="34" y="20" width="18" height="18" fill="#fbcfe8" />
        {/* Semi-wavy Dark Hair with Low Taper Fade */}
        <rect x="32" y="16" width="22" height="8" fill="#1c1917" />
        <rect x="30" y="18" width="24" height="4" fill="#292524" />
        <rect x="30" y="22" width="3" height="6" fill="#57534e" /> {/* Taper Fade L */}
        <rect x="51" y="22" width="3" height="6" fill="#57534e" /> {/* Taper Fade R */}

        {/* Classic Black Glasses */}
        <rect x="42" y="24" width="8" height="5" fill="#09090b" />
        <rect x="43" y="25" width="3" height="2" fill="#38bdf8" /> {/* Glass reflection */}

        {/* --- ELIZA (Right, Dipped Backwards) --- */}
        {/* Eliza Bridal Veil (Floating behind her back) */}
        <path d="M56 22 Q72 18 84 32 Q90 50 86 66 Z" fill="#ffffff" opacity="0.6" />

        {/* Eliza All-White Wedding Dress Body (Dipped angle) */}
        <rect x="52" y="42" width="24" height="26" fill="#ffffff" rx="2" />
        <rect x="56" y="56" width="30" height="30" fill="#f8fafc" />

        {/* Eliza Standing Leg (Supporting weight) */}
        <rect x="58" y="76" width="8" height="18" fill="#ffffff" />
        <rect x="58" y="92" width="9" height="5" fill="#ffffff" rx="1" />

        {/* Eliza Lifted Leg (Dramatic Romantic Dip Kiss Leg Raise!) */}
        <rect x="74" y="60" width="16" height="7" fill="#fef3c7" /> {/* Thigh extending */}
        <rect x="86" y="50" width="7" height="14" fill="#fef3c7" /> {/* Lower leg raised up! */}
        <rect x="88" y="44" width="6" height="8" fill="#ffffff" rx="1" /> {/* Bridal Heel */}

        {/* Eliza Head & Blonde Shoulder-Length Hair (Dipped back to right) */}
        <rect x="52" y="22" width="16" height="16" fill="#fef3c7" />
        {/* Blonde Hair */}
        <rect x="48" y="18" width="22" height="8" fill="#fde047" />
        <rect x="56" y="16" width="16" height="18" fill="#eab308" />
        <rect x="68" y="22" width="6" height="16" fill="#fde047" /> {/* Hair cascading back */}

        {/* Eliza Blue Eye (Closed in sweet kiss) */}
        <rect x="54" y="26" width="4" height="1" fill="#1e3a8a" />
        <rect x="53" y="30" width="3" height="2" fill="#f43f5e" opacity="0.7" /> {/* Blush */}

        {/* --- KISS CONNECTION POINT --- */}
        <rect x="49" y="28" width="5" height="4" fill="#e11d48" />
      </svg>
    </div>
  );
};
