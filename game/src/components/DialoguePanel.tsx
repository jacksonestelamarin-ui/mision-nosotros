import React, { useState, useEffect } from 'react';

import { soundEngine } from '../utils/audio';
import { PixelAvatar } from './PixelAvatar';

interface DialoguePanelProps {
  speaker: 'Jackson' | 'Eliza' | 'Carlos' | 'Narrador';
  text: string;
  avatar: 'jackson' | 'eliza' | 'carlos' | 'heart' | 'plane';
  variant?: 'normal' | 'wedding';
  onNext: () => void;
  nextText?: string;
  isLast?: boolean;
}

export const DialoguePanel: React.FC<DialoguePanelProps> = ({
  speaker,
  text,
  avatar,
  variant = 'normal',
  onNext,
  nextText = 'Continuar ▶',
  isLast = false,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [text]);

  const handleSkipOrNext = () => {
    soundEngine.playKick();
    if (isTyping) {
      setDisplayedText(text);
      setIsTyping(false);
    } else {
      onNext();
    }
  };

  const getSpeakerColor = () => {
    switch (speaker) {
      case 'Jackson':
        return 'from-blue-600 to-indigo-700 text-blue-100 border-blue-400';
      case 'Eliza':
        return 'from-amber-500 to-yellow-600 text-amber-950 border-amber-300';
      case 'Carlos':
        return 'from-red-700 to-rose-900 text-rose-100 border-red-500';
      default:
        return 'from-purple-600 to-indigo-800 text-purple-100 border-purple-400';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-2">
      <div className="relative bg-slate-950/95 border-2 border-amber-400/90 rounded-2xl p-4 md:p-5 shadow-[0_0_25px_rgba(212,175,55,0.3)] backdrop-blur-md">
        {/* Pixel Corner Decorations */}
        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-300" />
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-300" />
        <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-300" />
        <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-300" />

        {/* Speaker Name Tag */}
        <div className="absolute -top-3.5 left-6">
          <span
            className={`px-3 py-0.5 rounded-md bg-gradient-to-r ${getSpeakerColor()} border font-mono font-bold text-xs uppercase tracking-wider shadow-md`}
          >
            {speaker}
          </span>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
          {/* Avatar */}
          <div className="flex-shrink-0 self-center sm:self-start">
            <PixelAvatar character={avatar} size="lg" variant={variant} />
          </div>

          {/* Dialogue Text Container */}
          <div className="flex-1 min-h-[70px] flex flex-col justify-between">
            <p className="text-amber-100 font-sans text-sm md:text-base leading-relaxed tracking-wide min-h-[3rem]">
              {displayedText}
              {isTyping && <span className="animate-pulse text-amber-400 font-mono"> ▌</span>}
            </p>

            {/* Action Button */}
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSkipOrNext}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs md:text-sm uppercase tracking-wider shadow-lg border border-amber-200 transition-all transform active:scale-95 cursor-pointer flex items-center gap-2"
              >
                {isTyping ? 'Saltar ▶' : isLast ? 'Finalizar ♥' : nextText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
