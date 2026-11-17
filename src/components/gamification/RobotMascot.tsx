import React from 'react';
import robotImg from '../../assets/robot.png';

export interface RobotMascotProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  speechBubble?: string;
  className?: string;
  onClick?: () => void;
}

export const RobotMascot: React.FC<RobotMascotProps> = ({
  size = 'lg',
  animated = true,
  speechBubble,
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-[90px] h-[105px]',
    md: 'w-[110px] h-[128px]',
    lg: 'w-[132px] h-[154px]',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {/* Speech bubble if provided */}
      {speechBubble && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-2xl shadow-md border-2 border-[#dbeafe] text-xs font-bold text-[#1f2937] whitespace-nowrap z-10 animate-bounce">
          {speechBubble}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-b-2 border-r-2 border-[#dbeafe] rotate-45"></div>
        </div>
      )}

      {/* Robot Image with gentle float animation */}
      <div className={`relative ${sizeClasses[size]} ${animated ? 'animate-robot-float' : ''}`}>
        <img
          src={robotImg}
          alt="Study Buddy Robot Mascot"
          className="w-full h-full object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-200"
          draggable={false}
        />
      </div>
    </div>
  );
};
