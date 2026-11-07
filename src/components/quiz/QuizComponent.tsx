import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import type { Question, QuizAnswerState } from '../../types/quiz';
import { QuizOption } from './QuizOption';
import { QuizFeedbackDrawer } from './QuizFeedbackDrawer';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Lightbulb } from 'lucide-react';

export interface QuizComponentProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSubmit: (isCorrect: boolean, selectedOptionId: string) => void;
  onNextQuestion: () => void;
  earnedXpForThisLevel?: number;
  isStreakBonusAwarded?: boolean;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSubmit,
  onNextQuestion,
  earnedXpForThisLevel = 10,
  isStreakBonusAwarded = false,
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
      // Confetti burst for rewarding feeling!
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
    // Reset local state and trigger parent onNextQuestion
    setSelectedOptionId(null);
    setQuizState('idle');
    onNextQuestion();
  };

  const getDifficultyBadge = (lvl: number) => {
    if (lvl === 1) return <Badge variant="easy">Easy (Level 1)</Badge>;
    if (lvl === 2) return <Badge variant="medium">Medium (Level 2)</Badge>;
    return <Badge variant="hard">Hard (Level 3)</Badge>;
  };

  const correctAnswerOption = question.options.find((o) => o.id === question.answer);

  return (
    <div className="w-full max-w-2xl mx-auto pb-32 pt-2 px-4 select-none">
      {/* Top Question Meta */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
            Question {questionNumber} of {totalQuestions}
          </span>
          {getDifficultyBadge(question.level)}
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
          {question.topic}
        </span>
      </div>

      {/* Question Prompt */}
      <div className="mb-6 space-y-2">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
          {question.question}
        </h2>
      </div>

      {/* Options List */}
      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === question.answer;
          const shortcutKey = String(index + 1);

          return (
            <QuizOption
              key={option.id}
              id={option.id}
              text={option.text}
              state={quizState}
              isSelected={isSelected}
              isCorrectAnswer={isCorrect}
              disabled={quizState !== 'idle'}
              onSelect={handleSelect}
              keyboardShortcut={shortcutKey}
            />
          );
        })}
      </div>

      {/* Action / Check Button (Only shown while evaluating or idle before bottom sheet) */}
      {quizState === 'idle' && (
        <div className="flex justify-end pt-2">
          <Button
            variant="primary"
            size="lg"
            disabled={!selectedOptionId}
            onClick={handleSubmit}
            className="w-full sm:w-44"
          >
            Check Answer
          </Button>
        </div>
      )}

      {/* Evaluation Feedback Drawer (slides up from bottom when submitted) */}
      {(quizState === 'correct' || quizState === 'incorrect') && (
        <QuizFeedbackDrawer
          state={quizState}
          correctAnswerText={correctAnswerOption ? `${correctAnswerOption.id}: ${correctAnswerOption.text}` : undefined}
          explanation={question.explanation}
          earnedXp={earnedXpForThisLevel}
          streakBonus={isStreakBonusAwarded}
          onContinue={handleContinue}
        />
      )}

      {/* Educational Key Concept note */}
      <div className="mt-8 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-2.5 text-xs text-slate-500 font-medium">
        <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
        <span>Tip: Answer quickly and accurately to build streaks and earn bonus XP!</span>
      </div>
    </div>
  );
};
