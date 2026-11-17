import React from 'react';
import { Heart, Flame, Star, X } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export interface StatHeaderProps {
  hearts: number;
  maxHearts?: number;
  xp: number;
  streak: number;
  quizProgress?: number; // 0 to 100
  onCloseQuiz?: () => void;
  className?: string;
  isHeartsShaking?: boolean;
}

export const StatHeader: React.FC<StatHeaderProps> = ({
  hearts,
  maxHearts = 5,
  xp,
  streak,
  quizProgress,
  onCloseQuiz,
  className = '',
  isHeartsShaking = false,
}) => {
  return (
    <header className={`w-full bg-white border-b border-[#dbeafe] px-4 py-3 select-none ${className}`}>
      <div className="max-w-md mx-auto space-y-3">
        {/* Top line: Close button + Progress Bar if in quiz mode */}
        {quizProgress !== undefined ? (
          <div className="flex items-center gap-3">
            {onCloseQuiz && (
              <button
                onClick={onCloseQuiz}
                className="p-1 text-[#6b7280] hover:text-[#1f2937] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Exit Quiz"
                aria-label="Exit Quiz"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            )}
            <div className="flex-1">
              <ProgressBar progress={quizProgress} color="blue" height="md" />
            </div>
          </div>
        ) : null}

        {/* 3 Pills Row (matching Figma exact pill styling) */}
        <div className="flex items-center justify-between gap-2">
          {/* Hearts Pill */}
          <div
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffe4e6] text-[#e11d48] text-xs font-extrabold border border-[#fecdd3] transition-transform ${
              isHeartsShaking ? 'animate-shake' : ''
            }`}
          >
            <Heart className="w-4 h-4 fill-current stroke-[2.5]" />
            <span>{hearts}/{maxHearts} hearts</span>
          </div>

          {/* Streak Pill */}
          <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fef3c7] text-[#d97706] text-xs font-extrabold border border-[#fde68a]">
            <Flame className="w-4 h-4 fill-current stroke-[2.5]" />
            <span>{streak} days</span>
          </div>

          {/* XP Pill */}
          <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fef9c3] text-[#ca8a04] text-xs font-extrabold border border-[#fef08a]">
            <Star className="w-4 h-4 fill-current stroke-[2.5]" />
            <span>{xp} XP</span>
          </div>
        </div>
      </div>
    </header>
  );
};
