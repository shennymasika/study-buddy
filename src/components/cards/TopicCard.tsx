import React from 'react';
import type { Topic } from '../../types/quiz';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { Cpu, AppWindow, Play, Lock, ArrowRight } from 'lucide-react';

export interface TopicCardProps {
  topic: Topic;
  progressPercentage?: number;
  completedLevelsCount?: number;
  isSelected?: boolean;
  onSelectTopic?: (topic: Topic) => void;
  className?: string;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  progressPercentage = 33,
  completedLevelsCount = 1,
  isSelected = false,
  onSelectTopic,
  className = '',
}) => {
  const isHardware = topic.topic.toLowerCase().includes('hardware');
  const IconComponent = isHardware ? Cpu : AppWindow;
  const subtitle = isHardware
    ? 'Inside the machine: CPU & storage'
    : 'The programs that make it happen';

  return (
    <Card
      interactive
      className={`relative overflow-hidden transition-all duration-150 p-5 space-y-4 ${
        isSelected
          ? 'border-2 border-[#2563eb] border-b-4 border-b-[#1e40af] shadow-md'
          : 'border-2 border-[#dbeafe] border-b-4 hover:border-[#93c5fd]'
      } ${className}`}
      onClick={() => onSelectTopic && onSelectTopic(topic)}
    >
      {/* 1. Header with Icon & Title */}
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-[16px] bg-[#eff6ff] text-[#2563eb] flex items-center justify-center flex-shrink-0 border border-[#bfdbfe]">
          <IconComponent className="w-6 h-6 stroke-[2.2]" />
        </div>

        <div>
          <h3 className="text-lg font-black text-[#1f2937] leading-tight">
            {topic.topic}
          </h3>
          <p className="text-xs font-semibold text-[#6b7280] mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* 2. Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-extrabold">
          <span className="text-[#1f2937]">{completedLevelsCount}/3 levels</span>
          <span className="text-[#2563eb]">{progressPercentage}%</span>
        </div>
        <ProgressBar progress={progressPercentage} color="blue" height="sm" />
      </div>

      {/* 3. Three Level Circles (Rookie, Explorer, Master) matching Figma */}
      <div className="flex items-center justify-around pt-1">
        {/* Level 1: Rookie */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-12 h-12 rounded-full bg-[#2563eb] text-white flex items-center justify-center shadow-sm">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
          <span className="text-xs font-extrabold text-[#2563eb]">Rookie</span>
        </div>

        {/* Level 2: Explorer */}
        <div className="flex flex-col items-center gap-1.5">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            completedLevelsCount >= 2 ? 'bg-[#2563eb] text-white' : 'bg-[#f3f4f6] text-[#9ca3af]'
          }`}>
            {completedLevelsCount >= 2 ? (
              <Play className="w-5 h-5 fill-white ml-0.5" />
            ) : (
              <Lock className="w-5 h-5 stroke-[2]" />
            )}
          </div>
          <span className={`text-xs font-extrabold ${completedLevelsCount >= 2 ? 'text-[#2563eb]' : 'text-[#6b7280]'}`}>
            Explorer
          </span>
        </div>

        {/* Level 3: Master */}
        <div className="flex flex-col items-center gap-1.5">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            completedLevelsCount >= 3 ? 'bg-[#2563eb] text-white' : 'bg-[#f3f4f6] text-[#9ca3af]'
          }`}>
            {completedLevelsCount >= 3 ? (
              <Play className="w-5 h-5 fill-white ml-0.5" />
            ) : (
              <Lock className="w-5 h-5 stroke-[2]" />
            )}
          </div>
          <span className={`text-xs font-extrabold ${completedLevelsCount >= 3 ? 'text-[#2563eb]' : 'text-[#6b7280]'}`}>
            Master
          </span>
        </div>
      </div>

      {/* 4. Bottom continue link if selected */}
      {isSelected && (
        <div className="pt-2 border-t border-[#dbeafe] flex items-center justify-between text-sm font-extrabold text-[#2563eb]">
          <span>Continue this topic</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      )}
    </Card>
  );
};
