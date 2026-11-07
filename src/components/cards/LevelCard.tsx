import React from 'react';
import type { LevelInfo } from '../../types/quiz';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Lock, Star, Play, Check } from 'lucide-react';

export interface LevelCardProps {
  levelInfo: LevelInfo;
  isUnlocked: boolean;
  isCompleted?: boolean;
  starsEarned?: number; // 0 to 3
  rewardXp?: number;
  onPlay?: (level: LevelInfo) => void;
  className?: string;
}

export const LevelCard: React.FC<LevelCardProps> = ({
  levelInfo,
  isUnlocked,
  isCompleted = false,
  starsEarned = 0,
  rewardXp = 10,
  onPlay,
  className = '',
}) => {
  return (
    <Card
      interactive={isUnlocked}
      className={`relative transition-all duration-150 ${
        !isUnlocked ? 'bg-slate-50 opacity-75 border-dashed' : 'hover:-translate-y-0.5'
      } ${className}`}
      onClick={() => isUnlocked && onPlay && onPlay(levelInfo)}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Level Number & Title */}
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border-b-4 shadow-sm ${
              !isUnlocked
                ? 'bg-slate-200 text-slate-400 border-slate-300'
                : isCompleted
                ? 'bg-emerald-500 text-white border-emerald-600'
                : 'bg-sky-500 text-white border-sky-600'
            }`}
          >
            {isCompleted ? <Check className="w-6 h-6 stroke-[3]" /> : levelInfo.level}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-black text-base text-slate-800">
                {levelInfo.name}
              </h4>
              <Badge variant={levelInfo.difficulty}>
                {levelInfo.difficulty}
              </Badge>
            </div>

            <p className="text-xs font-bold text-slate-400">
              +{rewardXp} XP • {levelInfo.question_ids.length} Question{levelInfo.question_ids.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Right: Stars / Locked / Play */}
        <div className="flex items-center gap-3">
          {/* Star rating for completed level */}
          {isCompleted && (
            <div className="flex items-center gap-0.5">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-4 h-4 ${
                    starIdx <= starsEarned
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-200 fill-slate-200'
                  }`}
                />
              ))}
            </div>
          )}

          {!isUnlocked ? (
            <div className="p-2 rounded-xl bg-slate-200 text-slate-500 flex items-center gap-1.5 text-xs font-bold">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Locked</span>
            </div>
          ) : (
            <Button
              variant={isCompleted ? 'secondary' : 'primary'}
              size="sm"
              icon={isCompleted ? undefined : <Play className="w-3.5 h-3.5 fill-current" />}
            >
              {isCompleted ? 'Replay' : 'Start'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
