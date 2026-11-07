import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  interactive?: boolean;
  selected?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = true,
  interactive = false,
  selected = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        bg-white rounded-2xl p-5 transition-all duration-150
        ${elevated ? 'border-2 border-slate-200 border-b-4 border-b-slate-300 shadow-sm' : 'border border-slate-200'}
        ${interactive ? 'cursor-pointer hover:border-slate-300 hover:shadow-md active:translate-y-0.5' : ''}
        ${selected ? 'border-sky-400 border-b-sky-500 bg-sky-50/40' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
