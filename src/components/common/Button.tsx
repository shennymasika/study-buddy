import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'amber' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  // Base 3D tactile button styling inspired by modern gamified apps
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wide rounded-2xl select-none transition-all duration-100 cursor-pointer text-center';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 border-b-[3px]',
    md: 'text-sm px-5 py-2.5 border-b-4',
    lg: 'text-base px-6 py-3.5 border-b-4',
    xl: 'text-lg px-8 py-4 border-b-[5px]',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    // Duolingo-style vibrant green
    primary:
      'bg-[#58cc02] hover:bg-[#52be02] text-white border-[#46a302] active:border-b-0 active:translate-y-[4px] shadow-sm',
    // Sky blue
    secondary:
      'bg-[#1cb0f6] hover:bg-[#1899d6] text-white border-[#147eb2] active:border-b-0 active:translate-y-[4px] shadow-sm',
    // Fiery amber / streak
    amber:
      'bg-[#ff9600] hover:bg-[#e68700] text-white border-[#cc7800] active:border-b-0 active:translate-y-[4px] shadow-sm',
    // Rose / error
    danger:
      'bg-[#ff4b4b] hover:bg-[#e53e3e] text-white border-[#cc2c2c] active:border-b-0 active:translate-y-[4px] shadow-sm',
    // Subtle ghost
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 border-b-0 active:translate-y-[1px]',
    // Outlined
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 border-b-4 border-b-slate-300 active:border-b-2 active:translate-y-[2px]',
  };

  const disabledStyles =
    'bg-slate-200 text-slate-400 border-b-4 border-slate-300 cursor-not-allowed hover:bg-slate-200 active:translate-y-0 active:border-b-4 shadow-none opacity-80';

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${disabled || isLoading ? disabledStyles : variantStyles[variant]}
        ${widthStyle}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </span>
      )}
    </button>
  );
};
