import React, { useState, useEffect, useRef } from 'react';

import { GoldFrame } from '../GoldFrame';
import { PixelAvatar } from '../PixelAvatar';
import { soundEngine } from '../../utils/audio';
import { drawAirplaneSprite, drawGlowingHeartSprite } from '../../utils/pixelSprites';

import utahTravelBg from '../../assets/images/utah_travel_bg_1786477441372.jpg';

interface Scene3Props {
  onCompleteScene: () => void;
}

interface Cloud {
  id: number;
  x: number;
  y: number;
  speed: number;
  radius: number;
}

export const Scene3UtahTravel: React.FC<Scene3Props> = ({ onCompleteScene }) => {
  const [distanceKm, setDistanceKm] = useState(0);
  const [isHeartCollected, setIsHeartCollected] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Plane controls
  const keys = useRef<{ up: boolean; down: boolean }>({ up: false, down: false });

  // Plane state
  const planeRef = useRef({
    x: 100,
    y: 200,
    vy: 0,
    width: 48,
    height: 24,
  });

  // Glowing Heart position (spawns around 80% distance)
  const heartRef = useRef<{ x: number; y: number; width: number; height: number; active: boolean }>({
    x: 1200, // Offscreen initially
    y: 200,
    width: 32,
    height: 32,
    active: false,
  });

  const cloudsRef = useRef<Cloud[]>([]);
  const particlesRef = useRef<
    Array<{ x: number; y: number; vx: number; vy: number; color: string; size: number; life: number }>
  >([]);

  // Key Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keys.current.up = true;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keys.current.down = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keys.current.up = false;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keys.current.down = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Distance progression timer (~35 seconds total flight)
  useEffect(() => {
    const targetKm = 6850;
    const interval = setInterval(() => {
      setDistanceKm((prev) => {
        if (prev < targetKm) {
          const next = prev + 190;
          // Activate Heart at 80% (~5400 KM)
          if (next >= 5000 && !heartRef.current.active && heartRef.current.x > 800) {
            heartRef.current.x = 750;
            heartRef.current.y = 120 + Math.random() * 180;
            heartRef.current.active = true;
          }
          return Math.min(targetKm, next);
        } else {
          clearInterval(interval);
          return targetKm;
        }
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Main Canvas Game Loop
  useEffect(() => {
    let animFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameCount = 0;

    // Initialize clouds
    if (cloudsRef.current.length === 0) {
      for (let i = 0; i < 6; i++) {
        cloudsRef.current.push({
          id: i,
          x: 200 + Math.random() * 600,
          y: 40 + Math.random() * 320,
          speed: 2 + Math.random() * 3,
          radius: 20 + Math.random() * 20,
        });
      }
    }

    const render = () => {
      frameCount++;
      const plane = planeRef.current;
      const heart = heartRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- 1. Move Plane ---
      if (keys.current.up) {
        plane.vy = -4;
      } else if (keys.current.down) {
        plane.vy = 4;
      } else {
        plane.vy *= 0.85;
      }

      plane.y += plane.vy;
      if (plane.y < 30) plane.y = 30;
      if (plane.y > canvas.height - 50) plane.y = canvas.height - 50;

      // --- 2. Draw Clouds (Obstacles) ---
      cloudsRef.current.forEach((c) => {
        c.x -= c.speed;
        if (c.x < -60) {
          c.x = canvas.width + 60;
          c.y = 40 + Math.random() * 320;
        }

        ctx.save();
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.arc(c.x + c.radius * 0.7, c.y - c.radius * 0.3, c.radius * 0.8, 0, Math.PI * 2);
        ctx.arc(c.x - c.radius * 0.7, c.y - c.radius * 0.2, c.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Check collision with plane (minor bump)
        const dist = Math.hypot(plane.x + 24 - c.x, plane.y + 12 - c.y);
        if (dist < c.radius + 15) {
          plane.y += plane.y < c.y ? -2 : 2;
        }
      });

      // --- 3. Draw Plane ---
      drawAirplaneSprite(ctx, plane.x, plane.y, plane.width, plane.height);

      // --- 4. Draw Glowing Heart & Collection ---
      if (heart.active && !isHeartCollected) {
        heart.x -= 2.5; // Drifts left towards plane
        if (heart.x < -30) {
          heart.x = canvas.width + 30;
          heart.y = 100 + Math.random() * 220;
        }

        const hoverY = heart.y + Math.sin(frameCount * 0.1) * 6;

        drawGlowingHeartSprite(ctx, heart.x, hoverY, frameCount);

        // Check collection
        const heartDist = Math.hypot(plane.x + 24 - heart.x, plane.y + 12 - hoverY);
        if (heartDist < 36) {
          setIsHeartCollected(true);
          soundEngine.playRomanticChime();

          // Particles
          for (let i = 0; i < 20; i++) {
            particlesRef.current.push({
              x: heart.x,
              y: hoverY,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.5) * 8,
              color: '#ef4444',
              size: 4 + Math.random() * 4,
              life: 1,
            });
          }
        }
      }

      // --- 5. Draw Particles ---
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.restore();
      });
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameId);
  }, [isHeartCollected]);

  // Auto-advance after collecting the single heart
  useEffect(() => {
    if (isHeartCollected) {
      const timer = setTimeout(() => {
        onCompleteScene();
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isHeartCollected, onCompleteScene]);

  return (
    <div className="relative w-full min-h-[calc(100vh-60px)] flex flex-col items-center justify-between p-2 md:p-4 overflow-hidden bg-slate-950 text-slate-100">
      {/* Background Pixel Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={utahTravelBg}
          alt="Flight to Utah Pixel Scene"
          className="w-full h-full object-cover filter brightness-90"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between items-center py-2">
        {/* Title Top Banner */}
        <GoldFrame className="w-full max-w-xl text-center py-2 px-4">
          <h2 className="text-lg md:text-xl font-black text-amber-300 font-serif tracking-wider uppercase">
            ESCENA 3: VUELO A UTAH
          </h2>
          <p className="text-xs font-mono text-amber-100 mt-0.5">
            Mueve el avión [▲ / ▼], esquiva nubes y atrapa el corazón de Eliza.
          </p>
        </GoldFrame>

        {/* Flight Canvas */}
        <div className="relative w-full max-w-3xl my-auto rounded-2xl overflow-hidden border-4 border-amber-500/90 shadow-[0_0_30px_rgba(212,175,55,0.4)] bg-slate-950/80 aspect-[16/9]">
          <canvas
            ref={canvasRef}
            width={800}
            height={450}
            className="w-full h-full object-cover block shape-rendering-crisp"
          />

          {/* Overlay if Heart Collected */}
          {isHeartCollected && (
            <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center p-4 animate-fade-in text-center">
              <div className="mb-2 animate-bounce">
                <PixelAvatar character="heart" size="lg" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-rose-400 font-serif uppercase tracking-wider mb-1">
                ¡CORAZÓN ENCONTRADO! ♥
              </h3>
              <p className="text-xs md:text-sm font-mono text-amber-100 mb-4">
                Aterrizando en Utah para el reencuentro...
              </p>
              <button
                onClick={onCompleteScene}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer transform active:scale-95 transition-transform"
              >
                Continuar ▶
              </button>
            </div>
          )}
        </div>

        {/* Distance Progress & Touch Controls */}
        <div className="w-full max-w-3xl flex flex-col items-center gap-2">
          <div className="w-full bg-slate-950/90 p-3 rounded-xl border border-amber-400/60 shadow-lg">
            <div className="flex justify-between text-xs font-mono font-bold text-amber-300 mb-1">
              <span>BARRANCA</span>
              <span>{distanceKm.toLocaleString()} / 6,850 KM</span>
              <span>PROVO</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-amber-500/40 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-rose-500 rounded-full transition-all duration-150"
                style={{ width: `${(distanceKm / 6850) * 100}%` }}
              />
            </div>
          </div>

          {/* Up / Down Touch Controls */}
          <div className="flex gap-4">
            <button
              onTouchStart={() => (keys.current.up = true)}
              onTouchEnd={() => (keys.current.up = false)}
              onMouseDown={() => (keys.current.up = true)}
              onMouseUp={() => (keys.current.up = false)}
              onMouseLeave={() => (keys.current.up = false)}
              className="px-6 py-3 rounded-xl bg-slate-900 border-2 border-amber-400 text-amber-300 font-mono font-black text-lg shadow-lg cursor-pointer active:scale-95"
            >
              ▲ SUBIR
            </button>
            <button
              onTouchStart={() => (keys.current.down = true)}
              onTouchEnd={() => (keys.current.down = false)}
              onMouseDown={() => (keys.current.down = true)}
              onMouseUp={() => (keys.current.down = false)}
              onMouseLeave={() => (keys.current.down = false)}
              className="px-6 py-3 rounded-xl bg-slate-900 border-2 border-amber-400 text-amber-300 font-mono font-black text-lg shadow-lg cursor-pointer active:scale-95"
            >
              ▼ BAJAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
