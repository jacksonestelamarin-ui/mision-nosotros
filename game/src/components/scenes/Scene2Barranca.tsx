import React, { useState, useEffect, useRef, useCallback } from 'react';

import { soundEngine } from '../../utils/audio';
import { GameHUD } from '../GameHUD';
import { TouchControls } from '../TouchControls';
import { PixelAvatar } from '../PixelAvatar';
import { GameScene } from '../../types';
import { drawJacksonSprite, drawCarlosSprite, drawPigeonSprite } from '../../utils/pixelSprites';

interface Scene2Props {
  onCompleteScene: () => void;
  onRestartScene: () => void;
}

interface Pigeon {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isOnGround: boolean;
  groundTimer: number;
  isDestroyed?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

export const Scene2Barranca: React.FC<Scene2Props> = ({
  onCompleteScene,
  onRestartScene,
}) => {
  const [gameState, setGameState] = useState<'playing' | 'reward' | 'gameover'>('playing');

  // Three Short Carlos Phases: 1, 2, 3
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [pigeonsKickedInPhase, setPigeonsKickedInPhase] = useState(0);
  const [carlosHits, setCarlosHits] = useState(0);

  // HUD State
  const [hearts, setHearts] = useState(3);
  const [bossHp, setBossHp] = useState(100);

  // Canvas Reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keyboard controls
  const keys = useRef<{ left: boolean; right: boolean; jump: boolean; kick: boolean }>({
    left: false,
    right: false,
    jump: false,
    kick: false,
  });

  // Entities
  const playerRef = useRef({
    x: 80,
    y: 230,
    vx: 0,
    vy: 0,
    width: 60,
    height: 90,
    isGrounded: true,
    facingLeft: false,
    isKicking: false,
    kickTimer: 0,
    invulnerableTimer: 0,
  });

  const bossRef = useRef({
    x: 680,
    y: 220,
    width: 66,
    height: 100,
    hitFlashTimer: 0,
    tossTimer: 0,
  });

  const pigeonsRef = useRef<Pigeon[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const pigeonIdCounter = useRef(1);

  // Listeners
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

  // Start BGM on mount
  useEffect(() => {
    soundEngine.startBGM();
    return () => {
      soundEngine.stopBGM();
    };
  }, []);

  // Spawn Ordinary Gray Pigeon towards the floor
  const spawnPigeon = useCallback(() => {
    const targetX = 180 + Math.random() * 380;
    pigeonsRef.current.push({
      id: pigeonIdCounter.current++,
      x: bossRef.current.x - 10,
      y: bossRef.current.y + 10,
      vx: (targetX - bossRef.current.x) / 38,
      vy: -6,
      isOnGround: false,
      groundTimer: 240,
    });
  }, []);

  // Particle Explosions
  const addParticles = useCallback((x: number, y: number, color: string, count = 8) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 2 + Math.random() * 3,
        life: 1,
      });
    }
  }, []);

  // Trigger Kick Action
  const triggerKick = useCallback(() => {
    const player = playerRef.current;
    if (!player.isKicking) {
      player.isKicking = true;
      player.kickTimer = 15;
      soundEngine.playKick();

      const playerCenterX = player.x + player.width / 2;
      addParticles(playerCenterX, player.y + 20, '#fef08a', 5);

      // Destroy only the nearest grounded pigeon within horizontal range
      const groundedPigeons = pigeonsRef.current.filter((p) => p.isOnGround);
      let nearestPigeonId: number | null = null;
      let nearestDistance = Infinity;

      groundedPigeons.forEach((p) => {
        const distance = Math.abs(p.x - playerCenterX);
        if (distance <= 140 && distance < nearestDistance) {
          nearestDistance = distance;
          nearestPigeonId = p.id;
        }
      });

      if (nearestPigeonId !== null) {
        const removedPigeon = pigeonsRef.current.find((p) => p.id === nearestPigeonId);
        if (removedPigeon) {
          removedPigeon.isDestroyed = true;
          soundEngine.playPigeonHit();
          addParticles(removedPigeon.x, removedPigeon.y, '#9ca3af', 10);
          addParticles(removedPigeon.x, removedPigeon.y, '#f59e0b', 6);

          setPigeonsKickedInPhase((prev) => {
            const nextCount = prev + 1;
            if (phase === 1) {
              setBossHp(70);
              if (nextCount >= 2) {
                setPhase(2);
                return 0; // reset counter for phase 2
              }
            } else if (phase === 2) {
              setBossHp(35);
              if (nextCount >= 3) {
                setPhase(3);
                bossRef.current.x = 520;
                return 0;
              }
            }
            return nextCount;
          });
        }
      }

      // Phase 3: Direct kick to Carlos!
      if (phase === 3) {
        const boss = bossRef.current;
        const kickX = player.facingLeft ? player.x - 35 : player.x + player.width;
        const kickWidth = 40;
        const isBossHit =
          boss.x >= kickX - 30 &&
          boss.x <= kickX + kickWidth + 30 &&
          Math.abs(player.y - boss.y) < 50;

        if (isBossHit) {
          soundEngine.playKick();
          boss.hitFlashTimer = 12;
          addParticles(boss.x + 20, boss.y + 20, '#ef4444', 15);

          setCarlosHits((prev) => {
            const nextHits = prev + 1;
            setBossHp(Math.max(0, 35 - nextHits * 20));
            if (nextHits >= 2) {
              setBossHp(0);
              setGameState('reward');
              soundEngine.playVictory();
            }
            return nextHits;
          });
        }
      }
    }
  }, [addParticles, phase]);

  // Main Canvas Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const groundY = 320;

    let frameCount = 0;

    const render = () => {
      frameCount++;
      const player = playerRef.current;
      const boss = bossRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- 1. Background Stage ---
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(0.4, '#581c87');
      skyGrad.addColorStop(0.7, '#c2410c');
      skyGrad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, groundY);

      // Ocean
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(0, groundY - 40, canvas.width, 40);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(0, groundY - 30, canvas.width, 4);

      // Sand
      ctx.fillStyle = '#d97706';
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, groundY, canvas.width, 6);

      // Statue Silhouette
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.moveTo(10, groundY);
      ctx.lineTo(40, groundY - 100);
      ctx.lineTo(90, groundY - 100);
      ctx.lineTo(120, groundY);
      ctx.fill();
      ctx.fillStyle = '#4338ca';
      ctx.fillRect(55, groundY - 160, 20, 60);
      ctx.fillRect(35, groundY - 145, 60, 10);

      // Pier
      ctx.fillStyle = '#78350f';
      ctx.fillRect(boss.x - 20, groundY - 10, 80, 10);
      ctx.fillRect(boss.x - 10, groundY - 10, 8, 40);
      ctx.fillRect(boss.x + 40, groundY - 10, 8, 40);

      // --- 2. Update & Draw Player ---
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
        player.vy = -11;
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

      if (player.invulnerableTimer > 0) {
        player.invulnerableTimer--;
      }

      // Draw Jackson
      ctx.save();
      if (player.invulnerableTimer % 4 > 2) ctx.globalAlpha = 0.5;

      drawJacksonSprite(ctx, player.x, player.y, player.width, player.height, {
        facingLeft: player.facingLeft,
        isKicking: player.isKicking,
        isJumping: !player.isGrounded,
        isWalking: Math.abs(player.vx) > 0.5,
        frameCount,
      });
      ctx.restore();

      // --- 3. Draw Carlos (Boss) & Toss Logic ---
      if (phase < 3) {
        boss.tossTimer++;
        // Fast toss interval (~1.8 seconds)
        if (boss.tossTimer > 100) {
          spawnPigeon();
          boss.tossTimer = 0;
        }
      }

      if (boss.hitFlashTimer > 0) boss.hitFlashTimer--;

      drawCarlosSprite(ctx, boss.x, boss.y, boss.width, boss.height, {
        hitFlash: boss.hitFlashTimer > 0,
        isTossing: boss.tossTimer > 80,
        frameCount,
      });

      // --- 4. Update & Draw Pigeons ---
      pigeonsRef.current.forEach((p) => {
        if (p.isDestroyed) return;

        if (!p.isOnGround) {
          p.vy += 0.35;
          p.x += p.vx;
          p.y += p.vy;

          if (p.y >= groundY - 12) {
            p.y = groundY - 12;
            p.vy = 0;
            p.vx = 0;
            p.isOnGround = true;
          }
        } else {
          p.groundTimer--;
        }

        drawPigeonSprite(ctx, p.x, p.y, {
          isOnGround: p.isOnGround,
          frameCount,
        });

        // Walking into pigeon on ground causes minor damage if not kicking
        if (p.isOnGround && player.invulnerableTimer === 0) {
          const dist = Math.hypot(p.x - (player.x + 16), p.y + 4 - (player.y + 24));
          if (dist < 18 && !player.isKicking) {
            soundEngine.playHurt();
            player.invulnerableTimer = 90;
            player.vx = player.facingLeft ? 5 : -5;
            setHearts((prev) => {
              const next = prev - 1;
              if (next <= 0) setGameState('gameover');
              return next;
            });
          }
        }
      });

      pigeonsRef.current = pigeonsRef.current.filter((p) => !p.isDestroyed && (!p.isOnGround || p.groundTimer > 0));

      // --- 5. Particles Render ---
      particlesRef.current.forEach((part) => {
        part.x += part.vx;
        part.y += part.vy;
        part.life -= 0.03;

        ctx.save();
        ctx.globalAlpha = Math.max(0, part.life);
        ctx.fillStyle = part.color;
        ctx.fillRect(part.x, part.y, part.size, part.size);
        ctx.restore();
      });

      particlesRef.current = particlesRef.current.filter((part) => part.life > 0);

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameId);
  }, [gameState, phase, spawnPigeon, triggerKick]);

  const handleRestart = () => {
    setHearts(3);
    setBossHp(100);
    setPhase(1);
    setPigeonsKickedInPhase(0);
    setCarlosHits(0);
    pigeonsRef.current = [];
    particlesRef.current = [];
    playerRef.current.x = 80;
    playerRef.current.y = 230;
    bossRef.current.x = 680;
    bossRef.current.y = 220;
    playerRef.current.invulnerableTimer = 0;
    setGameState('playing');
  };

  // 10-second auto-advance on reward screen
  useEffect(() => {
    if (gameState === 'reward') {
      const timer = setTimeout(() => {
        onCompleteScene();
      }, 10000); // Exactly 10 seconds as specified
      return () => clearTimeout(timer);
    }
  }, [gameState, onCompleteScene]);

  const phaseBannerText =
    phase === 1
      ? `FASE 1/3: Patea ${Math.max(0, 2 - pigeonsKickedInPhase)} paloma(s)`
      : phase === 2
      ? `FASE 2/3: Patea ${Math.max(0, 3 - pigeonsKickedInPhase)} paloma(s)`
      : `FASE 3/3: ¡Patea a Carlos! (${Math.max(0, 2 - carlosHits)}/2)`;

  return (
    <div className="relative w-full min-h-[calc(100vh-60px)] flex flex-col justify-between bg-slate-950 text-slate-100">
      {/* HUD Header */}
      <GameHUD
        currentScene={GameScene.BARRANCA}
        hearts={hearts}
        bossHp={bossHp}
        showBossBar={gameState === 'playing'}
        onRestartScene={handleRestart}
        onRestartGame={onRestartScene}
      />

      {/* Main Game Screen */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-2">
        {/* Active Playing Canvas Mode */}
        {gameState === 'playing' && (
          <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
            {/* Canvas Container */}
            <div className="relative w-full rounded-2xl overflow-hidden border-4 border-amber-500/90 shadow-[0_0_30px_rgba(212,175,55,0.3)] bg-slate-950 aspect-[16/9]">
              <canvas
                ref={canvasRef}
                width={800}
                height={450}
                className="w-full h-full object-cover block shape-rendering-crisp"
              />

              {/* Phase Banner Top Overlay */}
              <div className="absolute top-2 left-2 right-2 flex justify-between items-center pointer-events-none">
                <div className="bg-slate-950/90 px-3 py-1 rounded-md border border-amber-400/80 text-xs md:text-sm font-mono text-amber-300 font-bold shadow-lg">
                  {phaseBannerText}
                </div>

                <div className="bg-slate-950/80 px-3 py-1 rounded-md border border-amber-400/60 text-[10px] md:text-xs font-mono text-amber-200">
                  <span>[A/D] Mover | [W/Espacio] Saltar | </span>
                  <span className="text-amber-400 font-bold">[X] ¡PATEAR!</span>
                </div>
              </div>
            </div>

            {/* Mobile Touch Controls */}
            <div className="w-full mt-2">
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
        )}

        {/* 10-Second Reward Screen after defeating Carlos */}
        {gameState === 'reward' && (
          <div className="w-full max-w-md mx-auto my-auto p-6 bg-slate-950/95 border-2 border-amber-400 rounded-2xl text-center shadow-2xl animate-fade-in">
            <h2 className="text-2xl font-black text-amber-300 font-serif uppercase tracking-widest mb-3">
              ¡DERROTASTE A CARLOS!
            </h2>

            <div className="my-4 flex justify-center">
              <PixelAvatar character="incakola" size="xl" />
            </div>

            <p className="text-lg font-black text-amber-200 font-mono tracking-wider mb-6">
              OBTUVISTE: INCA KOLA
            </p>

            <button
              onClick={onCompleteScene}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer hover:from-amber-400 hover:to-amber-300 transform active:scale-95 transition-all"
            >
              Continuar ▶
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="w-full max-w-md mx-auto my-auto p-6 bg-slate-950/95 border-2 border-red-500 rounded-2xl text-center shadow-2xl">
            <h2 className="text-2xl font-black text-red-500 font-serif uppercase mb-4">
              ¡INTÉNTALO DE NUEVO!
            </h2>
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-sm uppercase tracking-wider shadow-lg border border-red-300 cursor-pointer transform active:scale-95 transition-transform"
            >
              🔄 REINTENTAR PELEA
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
