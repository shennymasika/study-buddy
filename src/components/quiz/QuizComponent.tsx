import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import type { Question, QuizAnswerState } from '../../types/quiz';
import { QuizOption } from './QuizOption';
import { Button } from '../common/Button';
import { CheckCircle2, XCircle, Lightbulb, Heart, ArrowRight } from 'lucide-react';

export interface QuizComponentProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  remainingHearts?: number;
  onAnswerSubmit: (isCorrect: boolean, selectedOptionId: string) => void;
  onNextQuestion: () => void;
  earnedXpForThisLevel?: number;
  isStreakBonusAwarded?: boolean;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({
  question,
  questionNumber,
  totalQuestions,
  remainingHearts = 5,
  onAnswerSubmit,
  onNextQuestion,
  earnedXpForThisLevel = 10,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<QuizAnswerState>('idle');

  const handleSelect = (id: string) => {
    if (quizState === 'idle') {
      setSelectedOptionId(id);
    }
  };

  const handleSubmit = () => {
    if (!selectedOptionId || quizState !== 'idle') return;

    const isCorrect = selectedOptionId === question.answer;

    if (isCorrect) {
      setQuizState('correct');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } else {
      setQuizState('incorrect');
    }

    onAnswerSubmit(isCorrect, selectedOptionId);
  };

  const handleContinue = () => {
    setSelectedOptionId(null);
    setQuizState('idle');
    onNextQuestion();
  };

  const selectedOption = question.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-5 select-none">
      {/* 1. Top Feedback Banner (Appears after submission matching Figma exact feedback) */}
      {quizState === 'correct' && (
        <div className="bg-[#eff6ff] border-2 border-[#bfdbfe] rounded-[22px] p-4 flex items-center gap-3 animate-fade-in shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#1e3a8a]">You got it!</h3>
            <p className="text-xs font-bold text-[#2563eb]">
              +{earnedXpForThisLevel} XP • 1 correct in a row
            </p>
          </div>
        </div>
      )}

      {quizState === 'incorrect' && (
        <div className="bg-[#fef2f2] border-2 border-[#fecaca] rounded-[22px] p-4 flex items-center gap-3 animate-fade-in shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#ef4444] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <XCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#991b1b]">Not quite. Keep going!</h3>
            <p className="text-xs font-bold text-[#ef4444]">
              Alternative branch • -1 heart • +0 XP
            </p>
          </div>
        </div>
      )}

      {/* 2. Topic & Difficulty Header */}
      <div className="flex items-center justify-between">
        <span className="font-extrabold text-[15px] text-[#2563eb]">
          {question.topic}
        </span>
        <span className="bg-[#eff6ff] text-[#2563eb] text-xs font-bold px-3 py-1 rounded-full border border-[#bfdbfe]">
          {question.level === 1 ? 'Easy' : question.level === 2 ? 'Medium' : 'Hard'}
        </span>
      </div>

      {/* 3. Question Metadata */}
      <div className="flex items-center justify-between text-xs font-bold text-[#6b7280]">
        <span className="uppercase tracking-wider">QUESTION {questionNumber}</span>
        <span>
          {question.level === 1 ? 'Rookie' : question.level === 2 ? 'Explorer' : 'Master'} • {questionNumber} of {totalQuestions}
        </span>
      </div>

      {/* 4. Question Text */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1f2937] leading-snug">
          {question.question}
        </h2>
      </div>

      {/* 5. Answer Options */}
      <div className="space-y-3">
        {question.options.map((option) => (
          <QuizOption
            key={option.id}
            id={option.id}
            text={option.text}
            state={quizState}
            isSelected={selectedOptionId === option.id}
            isCorrectAnswer={option.id === question.answer}
            disabled={quizState !== 'idle'}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* 6. Ready to Submit indicator (when option is chosen) */}
      {quizState === 'idle' && selectedOptionId && (
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#2563eb] pt-1">
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>{selectedOption?.id} selected • Ready to submit</span>
        </div>
      )}

      {/* 7. Action Button: Submit Answer (when idle) */}
      {quizState === 'idle' && (
        <div className="space-y-2 pt-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!selectedOptionId}
            onClick={handleSubmit}
          >
            Submit Answer
          </Button>
          <p className="text-center text-xs font-medium text-[#6b7280]">
            Correct +{earnedXpForThisLevel} XP • Wrong -1 heart
          </p>
        </div>
      )}

      {/* 8. Explanation Card (Shown after submission) */}
      {quizState !== 'idle' && (
        <div className="space-y-3 pt-2">
          <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-[22px] p-4.5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#1e3a8a]">
              <Lightbulb className="w-4 h-4 text-[#eaa400] stroke-[2.5]" />
              <span>Why {question.answer} is correct</span>
            </div>
            <p className="text-sm text-[#374151] leading-relaxed">
              {question.explanation}
            </p>
          </div>

          {/* Heart loss details if incorrect */}
          {quizState === 'incorrect' && (
            <div className="bg-[#fef2f2] border border-[#fecaca] rounded-[20px] p-4 flex items-start gap-3">
              <Heart className="w-5 h-5 text-[#ef4444] stroke-[2.5] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#991b1b]">
                  {remainingHearts - 1}/5 hearts remaining
                </h4>
                <p className="text-xs text-[#b91c1c] leading-relaxed">
                  Down from {remainingHearts}/5. Regenerate 1 heart every 30 minutes. This answer resets your correct-answer combo.
                </p>
              </div>
            </div>
          )}

          {/* Next Button */}
          <div className="space-y-2 pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleContinue}
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              autoFocus
            >
              Next
            </Button>
            <p className="text-center text-xs font-medium text-[#6b7280]">
              {quizState === 'correct' ? 'Next up: your Rookie level results' : 'Alternative outcome • Retry to reach ≥70% and pass'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
