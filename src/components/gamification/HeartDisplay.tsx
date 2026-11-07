import React from 'react';
import { Heart } from 'lucide-react';

export interface HeartDisplayProps {
  currentHearts: number;
  maxHearts?: number;
  recoveryText?: string;
  isShaking?: boolean;
  className?: string;
}

export const HeartDisplay: React.FC<HeartDisplayProps> = ({
  currentHearts,
  maxHearts = 5,
  recoveryText = 'Restores 1 heart every 30m',
  isShaking = false,
  className = '',
}) => {
  return (
    <div
      className={`relative group inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50/80 hover:bg-rose-100/70 border border-rose-200 rounded-full transition-colors cursor-pointer select-none ${
        isShaking ? 'animate-shake' : ''
      } ${className}`}
    >
      <div className="flex items-center -space-x-1">
        {Array.from({ length: maxHearts }).map((_, index) => {
          const isFilled = index < currentHearts;
          return (
            <Heart
              key={index}
              className={`w-5 h-5 transition-transform duration-200 ${
                isFilled
                  ? 'text-rose-500 fill-rose-500 drop-shadow-sm scale-100'
                  : 'text-slate-300 fill-slate-200 scale-90'
              }`}
            />
          );
        })}
      </div>
      <span className="font-extrabold text-sm text-rose-600 ml-1">
        {currentHearts}
      </span>

      {/* Tooltip on hover */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-30 whitespace-nowrap">
        <span className="font-bold">{recoveryText}</span>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900" />
      </div>
    </div>
  );
};
