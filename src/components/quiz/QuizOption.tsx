import React from 'react';
import { Check, X } from 'lucide-react';
import type { QuizAnswerState } from '../../types/quiz';

export interface QuizOptionProps {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
  state?: QuizAnswerState;
  isSelected?: boolean;
  isCorrectAnswer?: boolean; // For revealing the right answer when incorrect
  disabled?: boolean;
  onSelect?: (id: string) => void;
  keyboardShortcut?: string;
}

export const QuizOption: React.FC<QuizOptionProps> = ({
  id,
  text,
  state = 'idle',
  isSelected = false,
  isCorrectAnswer = false,
  disabled = false,
  onSelect,
  keyboardShortcut,
}) => {
  // Determine computed visual appearance based on quiz state and selection
  let containerStyles =
    'bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-300';
  let badgeStyles = 'bg-slate-100 text-slate-600 border border-slate-300';
  let iconNode: React.ReactNode = null;

  if (state === 'idle') {
    if (isSelected) {
      containerStyles =
        'bg-sky-50 border-2 border-sky-400 border-b-4 border-b-sky-500 text-sky-900 shadow-sm';
      badgeStyles = 'bg-sky-500 text-white border-sky-600';
    }
  } else if (state === 'correct') {
    if (isSelected || isCorrectAnswer) {
      containerStyles =
        'bg-emerald-50 border-2 border-emerald-500 border-b-4 border-b-emerald-600 text-emerald-950';
      badgeStyles = 'bg-emerald-500 text-white border-emerald-600';
      iconNode = <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />;
    } else {
      containerStyles = 'bg-white border-2 border-slate-200 opacity-50 text-slate-400';
    }
  } else if (state === 'incorrect') {
    if (isSelected) {
      containerStyles =
        'bg-rose-50 border-2 border-rose-500 border-b-4 border-b-rose-600 text-rose-950 animate-shake';
      badgeStyles = 'bg-rose-500 text-white border-rose-600';
      iconNode = <X className="w-5 h-5 text-rose-600 stroke-[3]" />;
    } else if (isCorrectAnswer) {
      // Highlight the correct answer even when user chose wrongly
      containerStyles =
        'bg-emerald-50 border-2 border-emerald-500 border-b-4 border-b-emerald-600 text-emerald-950';
      badgeStyles = 'bg-emerald-500 text-white border-emerald-600';
      iconNode = <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />;
    } else {
      containerStyles = 'bg-white border-2 border-slate-200 opacity-40 text-slate-400';
    }
  }

  const handleClick = () => {
    if (!disabled && state === 'idle' && onSelect) {
      onSelect(id);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || state !== 'idle'}
      className={`
        w-full p-4 rounded-2xl flex items-center justify-between text-left transition-all duration-150 select-none
        active:translate-y-0.5 active:border-b-2
        ${containerStyles}
        ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
      `}
    >
      <div className="flex items-center gap-3.5 flex-1 pr-2">
        {/* Letter indicator (A, B, C, D) */}
        <span
          className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center flex-shrink-0 transition-colors shadow-sm ${badgeStyles}`}
        >
          {id}
        </span>
        {/* Option text */}
        <span className="font-bold text-base leading-snug">{text}</span>
      </div>

      {/* Right side icon or keyboard shortcut badge */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {iconNode}
        {keyboardShortcut && state === 'idle' && (
          <span className="text-[10px] font-semibold text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded hidden sm:inline-block">
            {keyboardShortcut}
          </span>
        )}
      </div>
    </button>
  );
};
