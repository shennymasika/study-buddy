import React from 'react';
import type { LevelInfo } from '../../types/quiz';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Sprout, Lock, Play, Check } from 'lucide-react';

export interface LevelCardProps {
  levelInfo: LevelInfo;
  isUnlocked: boolean;
  isCompleted?: boolean;
  rewardXp?: number;
  levelBonus?: number;
  onPlay?: (level: LevelInfo) => void;
  className?: string;
}

export const LevelCard: React.FC<LevelCardProps> = ({
  levelInfo,
  isUnlocked,
  isCompleted = false,
  rewardXp = 10,
  levelBonus = 20,
  onPlay,
  className = '',
}) => {
  const isRookie = levelInfo.level === 1;

  const descriptions: Record<number, string> = {
    1: 'Get to know software ownership. One question to warm up.',
    2: 'Go deeper into operating systems and virtual memory.',
    3: 'Put buffering, spooling and multitasking to the test.',
  };

  const statusText = !isUnlocked
    ? `0/1 this attempt • Pass ${levelInfo.level === 2 ? 'Rookie' : 'Explorer'} to unlock`
    : isCompleted
    ? 'Completed • Ready to replay'
    : '0/1 this attempt • Unlocked';

  return (
    <Card
      className={`relative transition-all p-5 space-y-3.5 ${
        isUnlocked && !isCompleted
          ? 'border-2 border-[#2563eb] border-b-4 border-b-[#1e40af] shadow-sm'
          : 'border-2 border-[#dbeafe] border-b-4'
      } ${className}`}
    >
      {/* Top Header: Icon, Level Number, Name, Difficulty */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0 ${
              isUnlocked
                ? 'bg-[#2563eb] text-white shadow-sm'
                : 'bg-[#eff6ff] text-[#9ca3af] border border-[#dbeafe]'
            }`}
          >
            {isCompleted ? (
              <Check className="w-6 h-6 stroke-[3]" />
            ) : isRookie ? (
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            ) : (
              <Lock className="w-5 h-5 stroke-[2]" />
            )}
          </div>

          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#6b7280]">
              LEVEL {levelInfo.level}
            </span>
            <h3 className="text-xl font-black text-[#1f2937] leading-tight">
              {levelInfo.name}
            </h3>
          </div>
        </div>

        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
            isUnlocked ? 'text-[#2563eb] bg-[#eff6ff]' : 'text-[#6b7280] bg-[#f3f4f6]'
          }`}
        >
          {levelInfo.difficulty}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-[#4b5563] leading-relaxed">
        {descriptions[levelInfo.level] || 'Test your understanding and conquer this level.'}
      </p>

      {/* Reward line */}
      <div className="flex items-center justify-between text-xs font-bold pt-1">
        <span className="text-[#2563eb] font-extrabold text-sm">
          +{rewardXp} XP / correct
        </span>
        <span className="text-[#6b7280]">
          +{levelBonus} level bonus
        </span>
      </div>

      {/* Status Bar line */}
      <div className="bg-[#eff6ff] h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${isCompleted ? 'bg-[#2563eb] w-full' : isUnlocked ? 'bg-[#eaa400] w-1/4' : 'w-0'}`}
        />
      </div>

      <p className="text-xs font-semibold text-[#6b7280]">
        {statusText}
      </p>

      {/* Big Action button if unlocked */}
      {isUnlocked && (
        <div className="pt-1">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => onPlay && onPlay(levelInfo)}
            icon={<Play className="w-4 h-4 fill-white" />}
            iconPosition="right"
          >
            {isCompleted ? `Replay ${levelInfo.name}` : `Start ${levelInfo.name}`}
          </Button>
        </div>
      )}
    </Card>
  );
};
