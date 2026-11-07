import React from 'react';
import { HeartDisplay } from './HeartDisplay';
import { StreakDisplay } from './StreakDisplay';
import { XpDisplay } from './XpDisplay';
import { ProgressBar } from '../common/ProgressBar';
import { X } from 'lucide-react';

export interface StatHeaderProps {
  hearts: number;
  maxHearts?: number;
  xp: number;
  streak: number;
  quizProgress?: number; // 0 to 100 (optional, shown during active quiz)
  onCloseQuiz?: () => void; // shown when in quiz mode
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
    <header
      className={`sticky top-0 z-20 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 transition-shadow ${className}`}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* If in quiz mode, show close button + quiz progress bar */}
        {quizProgress !== undefined ? (
          <div className="flex items-center gap-3 w-full">
            {onCloseQuiz && (
              <button
                onClick={onCloseQuiz}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                title="Exit Quiz"
                aria-label="Exit Quiz"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            )}
            <div className="flex-1">
              <ProgressBar progress={quizProgress} color="green" height="md" />
            </div>
            <HeartDisplay
              currentHearts={hearts}
              maxHearts={maxHearts}
              isShaking={isHeartsShaking}
            />
          </div>
        ) : (
          /* General app mode header: Streak, XP, Hearts */
          <>
            <div className="flex items-center gap-2">
              <StreakDisplay streak={streak} />
            </div>

            <div className="flex items-center gap-3">
              <XpDisplay xp={xp} />
              <HeartDisplay
                currentHearts={hearts}
                maxHearts={maxHearts}
                isShaking={isHeartsShaking}
              />
            </div>
          </>
        )}
      </div>
    </header>
  );
};
