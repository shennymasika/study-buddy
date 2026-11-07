import React from 'react';
import { Flame } from 'lucide-react';

export interface StreakDisplayProps {
  streak: number;
  bonusTrigger?: number; // every 3 consecutive
  className?: string;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  streak,
  bonusTrigger = 3,
  className = '',
}) => {
  const isHot = streak >= bonusTrigger;

  return (
    <div
      className={`relative group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all select-none cursor-pointer ${
        isHot
          ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm'
          : 'bg-slate-50 border-slate-200 text-slate-600'
      } ${className}`}
    >
      <div className="relative">
        <Flame
          className={`w-5 h-5 transition-transform duration-300 ${
            streak > 0
              ? 'text-amber-500 fill-amber-500 drop-shadow animate-pulse'
              : 'text-slate-300 fill-slate-200'
          }`}
        />
        {isHot && (
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        )}
      </div>

      <span className="font-black text-sm text-amber-600 tracking-tight">
        {streak}
      </span>

      {/* Tooltip */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-30 whitespace-nowrap">
        <p className="font-bold">
          {streak > 0 ? `${streak} in a row!` : 'Answer correctly to start streak'}
        </p>
        <p className="text-[11px] text-amber-300">+5 XP bonus every {bonusTrigger} correct</p>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900" />
      </div>
    </div>
  );
};
