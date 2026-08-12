import React, { useState, useEffect, useRef, useCallback } from 'react';

import { GoldFrame } from '../GoldFrame';
import { TouchControls } from '../TouchControls';
import { PixelAvatar } from '../PixelAvatar';
import { soundEngine } from '../../utils/audio';
import { drawJacksonSprite, drawTravelStampSprite } from '../../utils/pixelSprites';

import arequipaBg from '../../assets/images/arequipa_pixel_bg_1786477412787.jpg';

interface Scene1Props {
  onCompleteScene: () => void;
}

export const Scene1Arequipa: React.FC<Scene1Props> = ({ onCompleteScene }) => {
  const [isStampCollected, setIsStampCollected] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keyboard controls
  const keys = useRef<{ left: boolean; right: boolean; jump: boolean; kick: boolean }>({
    left: false,
    right: false,
    jump: false,
    kick: false,
  });

  // Player state
  const playerRef = useRef({
    x: 60,
    y: 240,
    vx: 0,
    vy: 0,
    width: 60,
    height: 90,
    isGrounded: true,
    facingLeft: false,
    isKicking: false,
    kickTimer: 0,
  });

  // Glowing Travel Stamp position (floating near middle-right)
  const stampRef = useRef({
    x: 650,
    y: 220,
    width: 36,
    height: 36,
    hoverOffset: 0,
  });

  // Particle Effects
  const particlesRef = useRef<
    Array<{ x: number; y: number; vx: number; vy: number; color: string; size: number; life: number }>
  >([]);

  // Key Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.left = true;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.right = true;
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp' || e.key === ' ') {
        keys.current.jump = true;
      }
      if (e.key === 'x' || e.key === 'X') {
        keys.current.kick = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.left = false;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.right = false;
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp' || e.key === ' ') {
        keys.current.jump = false;
      }
      if (e.key === 'x' || e.key === 'X') {
        keys.current.kick = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Trigger Kick
  const triggerKick = useCallback(() => {
    const player = playerRef.current;
    if (!player.isKicking) {
      player.isKicking = true;
      player.kickTimer = 12;
      soundEngine.playKick();

      // Kick particles
      const kickX = player.facingLeft ? player.x - 10 : player.x + player.width + 10;
      for (let i = 0; i < 6; i++) {
        particlesRef.current.push({
          x: kickX,
          y: player.y + 20,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          color: '#facc15',
          size: 3,
          life: 1,
        });
      }
    }
  }, []);

  // Main Canvas Loop
  useEffect(() => {
    let animFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const groundY = 330;
    let frameCount = 0;

    const render = () => {
      frameCount++;
      const player = playerRef.current;
      const stamp = stampRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- 1. Movement & Physics ---
      if (keys.current.left) {
        player.vx = -4.5;
        player.facingLeft = true;
      } else if (keys.current.right) {
        player.vx = 4.5;
        player.facingLeft = false;
      } else {
        player.vx *= 0.8;
      }

      if (keys.current.jump && player.isGrounded) {
        player.vy = -11.5;
        player.isGrounded = false;
        soundEngine.playJump();
      }

      if (keys.current.kick) {
        triggerKick();
      }

      player.vy += 0.65;
      player.x += player.vx;
      player.y += player.vy;

      if (player.y >= groundY - player.height) {
        player.y = groundY - player.height;
        player.vy = 0;
        player.isGrounded = true;
      }

      if (player.x < 10) player.x = 10;
      if (player.x > canvas.width - player.width - 10) player.x = canvas.width - player.width - 10;

      if (player.kickTimer > 0) {
        player.kickTimer--;
        if (player.kickTimer === 0) player.isKicking = false;
      }

      // --- 2. Draw Ground Platform ---
      ctx.fillStyle = '#451a03';
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, groundY, canvas.width, 4);

      // --- 3. Draw Jackson ---
      drawJacksonSprite(ctx, player.x, player.y, player.width, player.height, {
        facingLeft: player.facingLeft,
        isKicking: player.isKicking,
        isJumping: !player.isGrounded,
        isWalking: Math.abs(player.vx) > 0.5,
        frameCount,
      });

      // --- 4. Draw Stamp & Collision ---
      if (!isStampCollected) {
        stamp.hoverOffset = Math.sin(frameCount * 0.08) * 8;
        const currentStampY = stamp.y + stamp.hoverOffset;

        drawTravelStampSprite(ctx, stamp.x, currentStampY, stamp.width, stamp.height);

        // Check collision between Jackson and Stamp
        if (
          player.x + player.width >= stamp.x &&
          player.x <= stamp.x + stamp.width &&
          player.y + player.height >= currentStampY &&
          player.y <= currentStampY + stamp.height
        ) {
          setIsStampCollected(true);
          soundEngine.playVictory();

          // Explosion particles
          for (let i = 0; i < 20; i++) {
            particlesRef.current.push({
              x: stamp.x + 18,
              y: currentStampY + 18,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.5) * 8,
              color: i % 2 === 0 ? '#f59e0b' : '#38bdf8',
              size: 4 + Math.random() * 3,
              life: 1,
            });
          }
        }
      }

      // --- 5. Particles Update ---
      // Isolate canvas state when drawing particles so globalAlpha does not leak
      ctx.save();
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      ctx.restore();
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameId);
  }, [isStampCollected, triggerKick]);

  // Auto-advance after collecting stamp
  useEffect(() => {
    if (isStampCollected) {
      const timer = setTimeout(() => {
        onCompleteScene();
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isStampCollected, onCompleteScene]);

  return (
    <div className="relative w-full min-h-[calc(100vh-60px)] flex flex-col items-center justify-between p-2 md:p-4 overflow-hidden bg-slate-950 text-slate-100">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={arequipaBg}
          alt="Arequipa Pixel Art"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between items-center py-2">
        {/* Title Top Banner */}
        <GoldFrame className="w-full max-w-xl text-center py-2 px-4">
          <h2 className="text-lg md:text-xl font-black text-amber-300 font-serif tracking-wider uppercase">
            ESCENA 1: TUTORIAL DE AREQUIPA
          </h2>
          <p className="text-xs font-mono text-amber-100 mt-0.5">
            Camina, salta, patea y recolecta el sello de viaje para partir.
          </p>
        </GoldFrame>

        {/* Interactive Game Canvas */}
        <div className="relative w-full max-w-3xl my-auto rounded-2xl overflow-hidden border-4 border-amber-500/90 shadow-[0_0_30px_rgba(212,175,55,0.4)] bg-slate-950/80 aspect-[16/9]">
          <canvas
            ref={canvasRef}
            width={800}
            height={450}
            className="w-full h-full object-cover block shape-rendering-crisp"
          />

          {/* Prompt Overlay if Stamp Collected */}
          {isStampCollected && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-4 animate-fade-in text-center">
              <div className="mb-2">
                <PixelAvatar character="stamp" size="lg" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-amber-300 font-serif uppercase tracking-wider mb-1">
                ¡SELLO DE VIAJE OBTENIDO! ✈️
              </h3>
              <p className="text-xs md:text-sm font-mono text-amber-100 mb-4">
                ¡Jackson tiene su sello listo para el viaje!
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

        {/* Touch Controls for Mobile */}
        <div className="w-full max-w-3xl">
          <TouchControls
            onLeftStart={() => (keys.current.left = true)}
            onLeftEnd={() => (keys.current.left = false)}
            onRightStart={() => (keys.current.right = true)}
            onRightEnd={() => (keys.current.right = false)}
            onJump={() => {
              keys.current.jump = true;
              setTimeout(() => (keys.current.jump = false), 150);
            }}
            onKick={() => triggerKick()}
          />
        </div>
      </div>
    </div>
  );
};
