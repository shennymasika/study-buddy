import React from 'react';
import { HeartCrack, Clock, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export interface OutOfHeartsModalProps {
  isOpen: boolean;
  onRefill: () => void;
  onExit: () => void;
  recoveryMinutes?: number;
}

export const OutOfHeartsModal: React.FC<OutOfHeartsModalProps> = ({
  isOpen,
  onRefill,
  onExit,
  recoveryMinutes = 30,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-2 border-slate-100 animate-scale-up space-y-5">
        {/* Animated broken heart icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-rose-500 animate-bounce">
          <HeartCrack className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            You ran out of hearts!
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Take a breather to recharge, or refill your hearts now to keep learning Computer Studies!
          </p>
        </div>

        {/* Refill Timer notice */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 py-2 px-3 rounded-xl">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Next heart restores in ~{recoveryMinutes} minutes</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onRefill}
            icon={<Sparkles className="w-5 h-5 fill-white" />}
          >
            Refill Full Hearts
          </Button>

          <Button variant="ghost" size="md" fullWidth onClick={onExit}>
            Exit to Home
          </Button>
        </div>
      </div>
    </div>
  );
};
