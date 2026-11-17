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
        bg-white rounded-[22px] p-5 transition-all duration-150
        ${elevated ? 'border-2 border-[#dbeafe] border-b-4 border-b-[#bfdbfe]' : 'border border-[#dbeafe]'}
        ${interactive ? 'cursor-pointer hover:border-[#93c5fd] hover:shadow-sm active:translate-y-0.5' : ''}
        ${selected ? 'border-[#2563eb] border-b-[#1e40af] bg-[#eff6ff]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
