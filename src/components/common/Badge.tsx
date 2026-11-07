import React from 'react';

export type BadgeVariant = 'easy' | 'medium' | 'hard' | 'xp' | 'streak' | 'neutral';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  icon,
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    easy: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    medium: 'bg-amber-100 text-amber-800 border-amber-300',
    hard: 'bg-rose-100 text-rose-800 border-rose-300',
    xp: 'bg-purple-100 text-purple-800 border-purple-300',
    streak: 'bg-orange-100 text-orange-800 border-orange-300',
    neutral: 'bg-slate-100 text-slate-700 border-slate-300',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black tracking-wide uppercase border ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="flex-shrink-0 text-current">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
