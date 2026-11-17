import React from 'react';
import type { QuizAnswerState } from '../../types/quiz';

export interface QuizOptionProps {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
  state?: QuizAnswerState;
  isSelected?: boolean;
  isCorrectAnswer?: boolean;
  disabled?: boolean;
  onSelect?: (id: string) => void;
}

export const QuizOption: React.FC<QuizOptionProps> = ({
  id,
  text,
  state = 'idle',
  isSelected = false,
  isCorrectAnswer = false,
  disabled = false,
  onSelect,
}) => {
  let containerStyles = 'bg-white border-2 border-[#dbeafe] hover:border-[#bfdbfe] text-[#1f2937]';
  let badgeStyles = 'bg-[#f3f4f6] text-[#6b7280]';
  let subtext: React.ReactNode = null;

  if (state === 'idle') {
    if (isSelected) {
      containerStyles = 'bg-[#eff6ff] border-2 border-[#2563eb] border-b-4 border-b-[#1e40af] text-[#1e3a8a] shadow-sm';
      badgeStyles = 'bg-[#2563eb] text-white';
    }
  } else if (state === 'correct') {
    if (isSelected || isCorrectAnswer) {
      containerStyles = 'bg-[#eff6ff] border-2 border-[#2563eb] border-b-4 border-b-[#1e40af] text-[#1e3a8a]';
      badgeStyles = 'bg-[#2563eb] text-white';
      subtext = (
        <span className="flex items-center gap-1 text-xs font-bold text-[#2563eb] mt-1">
          ✓ Correct answer
        </span>
      );
    } else {
      containerStyles = 'bg-white border-2 border-[#e5e7eb] opacity-40 text-[#9ca3af]';
    }
  } else if (state === 'incorrect') {
    if (isSelected) {
      containerStyles = 'bg-[#fef2f2] border-2 border-[#ef4444] border-b-4 border-b-[#b91c1c] text-[#991b1b] animate-shake';
      badgeStyles = 'bg-[#ef4444] text-white';
      subtext = (
        <span className="flex items-center gap-1 text-xs font-bold text-[#ef4444] mt-1">
          × Your answer
        </span>
      );
    } else if (isCorrectAnswer) {
      containerStyles = 'bg-[#eff6ff] border-2 border-[#2563eb] border-b-4 border-b-[#1e40af] text-[#1e3a8a]';
      badgeStyles = 'bg-[#2563eb] text-white';
      subtext = (
        <span className="flex items-center gap-1 text-xs font-bold text-[#2563eb] mt-1">
          ✓ Correct answer
        </span>
      );
    } else {
      containerStyles = 'bg-white border-2 border-[#e5e7eb] opacity-40 text-[#9ca3af]';
    }
  }

  return (
    <button
      type="button"
      onClick={() => !disabled && state === 'idle' && onSelect && onSelect(id)}
      disabled={disabled || state !== 'idle'}
      className={`
        w-full p-4 rounded-[20px] flex items-start gap-3.5 text-left transition-all duration-150 select-none
        active:translate-y-0.5
        ${containerStyles}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* Square letter badge */}
      <span className={`w-8 h-8 rounded-[10px] font-extrabold text-sm flex items-center justify-center flex-shrink-0 transition-colors ${badgeStyles}`}>
        {id}
      </span>

      {/* Option Text and subtext */}
      <div className="flex-1">
        <p className="font-semibold text-[15px] leading-snug">{text}</p>
        {subtext}
      </div>
    </button>
  );
};
