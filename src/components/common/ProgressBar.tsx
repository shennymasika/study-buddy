import React from 'react';

export interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: 'blue' | 'yellow' | 'green' | 'red';
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'blue',
  height = 'md',
  showLabel = false,
  className = '',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const colorStyles = {
    blue: 'bg-[#2563eb]',
    yellow: 'bg-[#eaa400]',
    green: 'bg-[#10b981]',
    red: 'bg-[#ef4444]',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-bold text-[#6b7280] mb-1.5">
          <span>Progress</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className={`w-full bg-[#dbeafe] rounded-full ${heightClasses[height]} overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${colorStyles[color]}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};
