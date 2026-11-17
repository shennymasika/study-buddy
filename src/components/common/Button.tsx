import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'amber' | 'danger' | 'ghost' | 'outline' | 'blue-light';
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
  const baseStyles = 'inline-flex items-center justify-center font-extrabold select-none transition-all duration-100 cursor-pointer text-center';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3.5 py-2 rounded-[12px] min-h-[38px] border-b-[3px]',
    md: 'text-sm px-5 py-3 rounded-[14px] min-h-[48px] border-b-4',
    lg: 'text-[16px] px-6 py-4 rounded-[16px] min-h-[56px] border-b-4',
    xl: 'text-[18px] px-8 py-4.5 rounded-[18px] min-h-[62px] border-b-[5px]',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    // Exact Figma Royal Blue action button
    primary:
      'bg-[#2563eb] hover:bg-[#1d4ed8] text-white border-[#1e40af] active:border-b-2 active:translate-y-[2px] shadow-sm',
    // Exact Figma White secondary button with #dbeafe border
    secondary:
      'bg-white hover:bg-slate-50 text-[#1f2937] border-2 border-[#dbeafe] border-b-4 border-b-[#93c5fd] active:border-b-2 active:translate-y-[2px] shadow-sm',
    // Warm Amber / Streak button
    amber:
      'bg-[#eaa400] hover:bg-[#d97706] text-white border-[#b45309] active:border-b-2 active:translate-y-[2px] shadow-sm',
    // Danger / Red button
    danger:
      'bg-[#ef4444] hover:bg-[#dc2626] text-white border-[#b91c1c] active:border-b-2 active:translate-y-[2px] shadow-sm',
    // Light Blue pill/button
    'blue-light':
      'bg-[#eff6ff] hover:bg-[#dbeafe] text-[#2563eb] border-2 border-[#bfdbfe] border-b-4 border-b-[#93c5fd] active:border-b-2 active:translate-y-[2px]',
    // Ghost
    ghost:
      'bg-transparent hover:bg-slate-100 text-[#6b7280] border-b-0 active:translate-y-[1px]',
    // Outline
    outline:
      'bg-white hover:bg-slate-50 text-[#1f2937] border-2 border-[#dbeafe] border-b-4 border-b-[#93c5fd] active:border-b-2 active:translate-y-[2px]',
  };

  const disabledStyles =
    'bg-slate-200 text-slate-400 border-b-4 border-slate-300 cursor-not-allowed hover:bg-slate-200 active:translate-y-0 active:border-b-4 shadow-none opacity-70';

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
