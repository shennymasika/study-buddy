import React from 'react';

export interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: 'green' | 'blue' | 'amber' | 'rose' | 'purple';
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'green',
  height = 'md',
  showLabel = false,
  className = '',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const heightClasses = {
    sm: 'h-2.5',
    md: 'h-4',
    lg: 'h-6',
  };

  const colorGradients = {
    green: 'bg-gradient-to-r from-[#58cc02] to-[#46a302]',
    blue: 'bg-gradient-to-r from-[#1cb0f6] to-[#1899d6]',
    amber: 'bg-gradient-to-r from-[#ff9600] to-[#e68700]',
    rose: 'bg-gradient-to-r from-[#ff4b4b] to-[#e53e3e]',
    purple: 'bg-gradient-to-r from-[#ce82ff] to-[#a855f7]',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-1.5">
          <span>Progress</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200/90 rounded-full ${heightClasses[height]} overflow-hidden p-0.5 shadow-inner`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out relative ${colorGradients[color]}`}
          style={{ width: `${clampedProgress}%` }}
        >
          {/* Subtle glossy shine effect */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-white/25 rounded-t-full" />
        </div>
      </div>
    </div>
  );
};
