import React from 'react';
import type { Topic } from '../../types/quiz';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import { Cpu, Server, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';

export interface TopicCardProps {
  topic: Topic;
  progressPercentage?: number; // 0 to 100
  isCompleted?: boolean;
  onSelectTopic?: (topic: Topic) => void;
  className?: string;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  progressPercentage = 0,
  isCompleted = false,
  onSelectTopic,
  className = '',
}) => {
  // Select icon based on topic name
  const isHardware = topic.topic.toLowerCase().includes('hardware');
  const IconComponent = isHardware ? Cpu : Server;

  return (
    <Card
      interactive
      className={`group relative overflow-hidden transition-all duration-200 hover:-translate-y-1 ${className}`}
      onClick={() => onSelectTopic && onSelectTopic(topic)}
    >
      {/* Top Banner with Icon & Status */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
              isHardware ? 'bg-sky-100 text-sky-600' : 'bg-purple-100 text-purple-600'
            }`}
          >
            <IconComponent className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-sky-600 transition-colors">
                {topic.topic}
              </h3>
              {isCompleted && (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
              )}
            </div>
            <p className="text-xs font-bold text-slate-400">
              {topic.levels.length} Levels • {topic.key_terms.length} Key Terms
            </p>
          </div>
        </div>

        <span className="text-xs font-black px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
          {progressPercentage}%
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 font-medium mb-4 line-clamp-2 leading-relaxed">
        {topic.description}
      </p>

      {/* Key Terms tags preview */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {topic.key_terms.slice(0, 4).map((term, i) => (
          <span
            key={i}
            className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
          >
            {term}
          </span>
        ))}
        {topic.key_terms.length > 4 && (
          <span className="text-[11px] font-bold text-slate-400 self-center">
            +{topic.key_terms.length - 4} more
          </span>
        )}
      </div>

      {/* Progress Bar & Continue Action */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <ProgressBar progress={progressPercentage} color={isHardware ? 'blue' : 'purple'} height="sm" />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>IST1020 Core Module</span>
          </div>

          <Button
            variant={isCompleted ? 'secondary' : 'primary'}
            size="sm"
            icon={<ChevronRight className="w-4 h-4" />}
            iconPosition="right"
          >
            {isCompleted ? 'Review' : 'Play Quest'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
