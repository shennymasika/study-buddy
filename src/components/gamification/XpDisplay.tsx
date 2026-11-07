import React from 'react';
import { Zap } from 'lucide-react';

export interface XpDisplayProps {
  xp: number;
  recentGain?: number | null;
  className?: string;
}

export const XpDisplay: React.FC<XpDisplayProps> = ({
  xp,
  recentGain = null,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50/80 hover:bg-purple-100/70 border border-purple-200 rounded-full transition-colors cursor-pointer select-none ${className}`}
    >
      <div className="bg-purple-500 text-white p-1 rounded-full shadow-sm">
        <Zap className="w-3.5 h-3.5 fill-white" />
      </div>
      <span className="font-black text-sm text-purple-700 tracking-tight">
        {xp.toLocaleString()} <span className="text-xs font-bold text-purple-500">XP</span>
      </span>

      {/* Floating XP Gain Badge if recently awarded */}
      {recentGain !== null && recentGain > 0 && (
        <span className="absolute -top-3 -right-2 bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-bounce shadow">
          +{recentGain}
        </span>
      )}
    </div>
  );
};
