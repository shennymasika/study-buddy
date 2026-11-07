import React from 'react';
import { CheckCircle2, XCircle, Zap, HeartCrack } from 'lucide-react';
import { Button } from '../common/Button';

export interface QuizFeedbackDrawerProps {
  state: 'correct' | 'incorrect';
  correctAnswerText?: string;
  explanation: string;
  earnedXp?: number;
  streakBonus?: boolean;
  onContinue: () => void;
  className?: string;
}

export const QuizFeedbackDrawer: React.FC<QuizFeedbackDrawerProps> = ({
  state,
  correctAnswerText,
  explanation,
  earnedXp = 10,
  streakBonus = false,
  onContinue,
  className = '',
}) => {
  const isCorrect = state === 'correct';

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-30 transition-all duration-300 transform translate-y-0
        ${
          isCorrect
            ? 'bg-emerald-100/95 border-t-2 border-emerald-300 text-emerald-950'
            : 'bg-rose-100/95 border-t-2 border-rose-300 text-rose-950'
        }
        backdrop-blur-md px-4 py-5 shadow-2xl ${className}
      `}
    >
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left Side: Icon, Header, and Explanation */}
        <div className="flex items-start gap-3.5 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            {isCorrect ? (
              <CheckCircle2 className="w-9 h-9 text-emerald-600 fill-emerald-200" />
            ) : (
              <XCircle className="w-9 h-9 text-rose-600 fill-rose-200" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-xl tracking-tight">
                {isCorrect ? 'Nicely done!' : 'Not quite!'}
              </h3>

              {/* Badges for rewards or losses */}
              {isCorrect ? (
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm">
                    <Zap className="w-3 h-3 fill-white" /> +{earnedXp} XP
                  </span>
                  {streakBonus && (
                    <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-black px-2 py-0.5 rounded-full shadow-sm">
                      Streak +5 XP!
                    </span>
                  )}
                </div>
              ) : (
                <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-xs font-black px-2 py-0.5 rounded-full shadow-sm">
                  <HeartCrack className="w-3 h-3" /> -1 Heart
                </span>
              )}
            </div>

            {!isCorrect && correctAnswerText && (
              <p className="text-sm font-bold text-rose-900">
                Correct answer: <span className="underline">{correctAnswerText}</span>
              </p>
            )}

            <p className="text-sm text-slate-700 font-medium leading-relaxed max-w-xl">
              {explanation}
            </p>
          </div>
        </div>

        {/* Right Side: Big continue button */}
        <div className="w-full sm:w-auto flex-shrink-0">
          <Button
            variant={isCorrect ? 'primary' : 'danger'}
            size="lg"
            onClick={onContinue}
            className="w-full sm:w-36"
            autoFocus
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
