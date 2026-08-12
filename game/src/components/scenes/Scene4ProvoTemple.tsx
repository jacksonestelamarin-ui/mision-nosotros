import React, { useState, useEffect, useRef } from 'react';

import { GoldFrame } from '../GoldFrame';
import { PixelDipKiss } from '../PixelDipKiss';
import { soundEngine } from '../../utils/audio';
import { drawJacksonSprite, drawElizaSprite } from '../../utils/pixelSprites';

import provoTempleFinaleBg from '../../assets/images/provo_temple_finale_1786477453916.jpg';

interface Scene4Props {
  onRestartGame: () => void;
}

export const Scene4ProvoTemple: React.FC<Scene4Props> = ({ onRestartGame }) => {
  const [stage, setStage] = useState<'walk' | 'dialog' | 'wedding'>('walk');
  const [walkProgress, setWalkProgress] = useState(10); // 10% to 75%

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keys = useRef<{ right: boolean }>({ right: false });

  // Key listeners for walking right
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight' || e.key === ' ') {
        keys.current.right = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight' || e.key === ' ') {
        keys.current.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Auto-walk timer (~20 seconds walk if user doesn't press keys)
  useEffect(() => {
    if (stage !== 'walk') return;

    const interval = setInterval(() => {
      setWalkProgress((prev) => {
        const step = keys.current.right ? 4 : 1.5; // Walking speed
        const next = prev + step;
        if (next >= 75) {
          clearInterval(interval);
          setStage('dialog');
          soundEngine.playRomanticChime();
          return 75;
        }
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [stage]);

  // Transition from 'dialog' to 'wedding' automatically after 3 seconds
  useEffect(() => {
    if (stage === 'dialog') {
      const timer = setTimeout(() => {
        setStage('wedding');
        soundEngine.playVictory();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Canvas render for walking phase
  useEffect(() => {
    if (stage !== 'walk') return;

    let animFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const groundY = 350;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Walkway ground
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, groundY, canvas.width, 4);

      // Eliza waiting at X = 620 (wearing initial modest blue dress)
      const elizaX = 620;
      const elizaY = groundY - 90;
      drawElizaSprite(ctx, elizaX, elizaY, 60, 90);

      // Jackson walking towards Eliza based on walkProgress (blue shirt, black pants)
      const jacksonX = 50 + (walkProgress / 100) * 520;
      const jacksonY = groundY - 90;

      drawJacksonSprite(ctx, jacksonX, jacksonY, 60, 90, {
        facingLeft: false,
        isWalking: keys.current.right,
        frameCount: Math.floor(walkProgress * 2),
      });

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameId);
  }, [stage, walkProgress]);

  return (
    <div className="relative w-full min-h-[calc(100vh-60px)] flex flex-col items-center justify-between p-2 md:p-4 overflow-hidden bg-slate-950 text-slate-100">
      {/* Background Image: Provo Temple */}
      <div className="absolute inset-0 z-0">
        <img
          src={provoTempleFinaleBg}
          alt="Provo Utah Temple Finale"
          className="w-full h-full object-cover filter brightness-95 contrast-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/60" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between items-center py-2">
        {/* Title Top Banner */}
        <GoldFrame className="w-full max-w-xl text-center py-2 px-4">
          <h2 className="text-lg md:text-xl font-black text-amber-300 font-serif tracking-wider uppercase">
            {stage === 'wedding' ? 'MISIÓN: FOREVER ♥' : 'ESCENA 4: PROVO, UTAH'}
          </h2>
          <p className="text-xs font-mono text-amber-200 mt-0.5">Templo de Provo, Utah</p>
        </GoldFrame>

        {/* Phase 1: 20-second Walking sequence */}
        {stage === 'walk' && (
          <div className="relative w-full max-w-3xl my-auto flex flex-col items-center">
            <div className="relative w-full rounded-2xl overflow-hidden border-4 border-amber-500/90 shadow-[0_0_30px_rgba(212,175,55,0.4)] bg-slate-950/80 aspect-[16/9]">
              <canvas
                ref={canvasRef}
                width={800}
                height={450}
                className="w-full h-full object-cover block shape-rendering-crisp"
              />
              <div className="absolute top-3 left-3 bg-slate-950/90 px-3 py-1 rounded-md border border-amber-400 text-xs font-mono text-amber-200">
                Camina hacia Eliza [Presiona ► para acelerar]
              </div>
            </div>

            <button
              onTouchStart={() => (keys.current.right = true)}
              onTouchEnd={() => (keys.current.right = false)}
              onMouseDown={() => (keys.current.right = true)}
              onMouseUp={() => (keys.current.right = false)}
              className="mt-3 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer transform active:scale-95 transition-transform"
            >
              ► CAMINAR HACIA ELIZA
            </button>
          </div>
        )}

        {/* Phase 2: Reunion Speech Bubble Dialogue */}
        {stage === 'dialog' && (
          <div className="my-auto flex flex-col items-center gap-6 animate-fade-in text-center">
            <div className="py-6 px-10 rounded-2xl bg-slate-950/95 border-4 border-amber-400 shadow-[0_0_50px_rgba(212,175,55,0.8)] max-w-md">
              <p className="text-2xl md:text-3xl font-black text-amber-300 font-serif tracking-wide">
                Eliza: Al fin llegaste. ♥
              </p>
            </div>

            <button
              onClick={() => setStage('wedding')}
              className="px-6 py-2 rounded-xl bg-amber-500/80 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer hover:bg-amber-400"
            >
              Ver Final ▶
            </button>
          </div>
        )}

        {/* Phase 3: FINAL WEDDING DIP KISS */}
        {stage === 'wedding' && (
          <div className="my-auto flex flex-col items-center gap-4 animate-fade-in text-center max-w-lg">
            {/* Dip Kiss Pixel-Art Graphic */}
            <PixelDipKiss />

            {/* REQUIRED EXACT FINAL TEXT */}
            <div className="w-full py-4 px-6 rounded-2xl bg-slate-950/95 border-2 border-amber-400 shadow-2xl flex flex-col items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-amber-300 font-serif tracking-widest uppercase">
                MISSION COMPLETE
              </h1>
              <h2 className="text-xl md:text-2xl font-black text-rose-400 font-serif tracking-wider">
                NEW MISSION: FOREVER ♥
              </h2>
              <p className="text-sm md:text-base font-serif italic text-amber-100 mt-1">
                “El inicio de nuestra eternidad juntos.”
              </p>
            </div>

            <button
              onClick={onRestartGame}
              className="mt-1 px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-2xl border border-amber-200 cursor-pointer transform active:scale-95 transition-all"
            >
              🔄 Reiniciar Misión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
