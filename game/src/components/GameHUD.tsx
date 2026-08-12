import React, { useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Heart, Shield } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { GameScene } from '../types';

interface GameHUDProps {
  currentScene: GameScene;
  hearts?: number; // Max 3
  bossHp?: number; // Max 100
  showBossBar?: boolean;
  onRestartScene: () => void;
  onRestartGame: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  currentScene,
  hearts = 3,
  bossHp = 100,
  showBossBar = false,
  onRestartScene,
  onRestartGame,
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const getSceneName = () => {
    switch (currentScene) {
      case GameScene.AREQUIPA:
        return '1. AREQUIPA — INICIO';
      case GameScene.BARRANCA:
        return '2. PLAYA CRISTO REDENTOR — BARRANCA';
      case GameScene.UTAH_TRAVEL:
        return '3. VIAJE A UTAH';
      case GameScene.PROVO_TEMPLE:
        return '4. PROVO, UTAH — TEMPLO';
    }
  };

  return (
    <header className="w-full bg-slate-950/90 border-b-2 border-amber-500/70 px-3 py-2 text-slate-100 shadow-lg backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Title & Scene Name */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 font-black px-2.5 py-1 rounded text-xs md:text-sm tracking-widest font-mono shadow">
            MISIÓN: NOSOTROS
          </div>
          <span className="text-amber-200/90 font-mono text-xs md:text-sm font-semibold hidden sm:inline">
            {getSceneName()}
          </span>
        </div>

        {/* Scene 2 Gameplay HUD Stats */}
        {currentScene === GameScene.BARRANCA && (
          <div className="flex items-center gap-4">
            {/* Jackson 3 Hearts */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-red-500/50">
              <span className="text-xs font-mono font-bold text-slate-300 hidden md:inline">JACKSON:</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((h) => (
                  <Heart
                    key={h}
                    className={`w-5 h-5 transition-transform duration-200 ${
                      h <= hearts
                        ? 'text-red-500 fill-red-500 scale-100 animate-pulse'
                        : 'text-slate-600 fill-slate-800 scale-90'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Carlos Boss Bar if active */}
            {showBossBar && (
              <div className="flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-amber-500/50 min-w-[140px] md:min-w-[200px]">
                <Shield className="w-4 h-4 text-amber-400" />
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] font-mono font-bold text-amber-300 mb-0.5">
                    <span>CARLOS DE BARRANCA</span>
                    <span>{Math.max(0, bossHp)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 transition-all duration-300"
                      style={{ width: `${Math.max(0, bossHp)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mute/Unmute */}
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 transition-colors cursor-pointer"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Restart Scene */}
          <button
            onClick={onRestartScene}
            className="px-2.5 py-1 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-500/50 text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title="Reiniciar Escena"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reiniciar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
