import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { HeartDisplay } from '../gamification/HeartDisplay';
import { StreakDisplay } from '../gamification/StreakDisplay';
import { XpDisplay } from '../gamification/XpDisplay';
import { StatHeader } from '../gamification/StatHeader';
import { QuizOption } from '../quiz/QuizOption';
import { OutOfHeartsModal } from '../quiz/OutOfHeartsModal';
import { QuizComponent } from '../quiz/QuizComponent';
import { TopicCard } from '../cards/TopicCard';
import { LevelCard } from '../cards/LevelCard';
import { initialQuizData } from '../../data/quizData';
import {
  Flame,
  Heart,
  Zap,
  Sparkles,
  RefreshCw,
  Eye,
  Sliders,
} from 'lucide-react';

export const ComponentShowcase: React.FC = () => {
  // Gamification interactive test state
  const [hearts, setHearts] = useState(5);
  const [isHeartsShaking, setIsHeartsShaking] = useState(false);
  const [xp, setXp] = useState(120);
  const [recentXp, setRecentXp] = useState<number | null>(null);
  const [streak, setStreak] = useState(4);
  const [progress, setProgress] = useState(65);
  const [isOutOfHeartsModalOpen, setIsOutOfHeartsModalOpen] = useState(false);

  // Quiz Option standalone demo states
  const [previewOptionState, setPreviewOptionState] = useState<'idle' | 'selected' | 'correct' | 'incorrect'>('idle');

  // Interactive Quiz live demo state
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const sampleQuestion = initialQuizData.questions[activeQuestionIndex % initialQuizData.questions.length];

  const triggerHeartLoss = () => {
    setIsHeartsShaking(true);
    setTimeout(() => setIsHeartsShaking(false), 500);
    setHearts((prev) => {
      const next = Math.max(0, prev - 1);
      if (next === 0) setIsOutOfHeartsModalOpen(true);
      return next;
    });
  };

  const awardXp = (amount = 20) => {
    setXp((prev) => prev + amount);
    setRecentXp(amount);
    setTimeout(() => setRecentXp(null), 1500);
  };

  const incrementStreak = () => {
    setStreak((prev) => prev + 1);
  };

  const resetStreak = () => {
    setStreak(0);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-24">
      {/* Top Header sticky demo */}
      <StatHeader
        hearts={hearts}
        maxHearts={5}
        xp={xp}
        streak={streak}
        quizProgress={progress}
        isHeartsShaking={isHeartsShaking}
      />

      <div className="max-w-5xl mx-auto px-4 pt-8 space-y-12">
        {/* Banner introduction */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 border-b-4 border-b-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase tracking-wider">
                Figma Design System Skeleton
              </span>
              <span className="text-xs font-bold text-slate-400">Computer Studies Quest</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Reusable Gamified Components
            </h1>
            <p className="text-slate-600 font-medium text-sm sm:text-base mt-1">
              Tactile 3D buttons, interactive cards, status header bar, and quiz states built for the Study Buddy app.
            </p>
          </div>

          {/* Quick interactive sandbox controls */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-2.5 min-w-[260px]">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-500 uppercase">
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Controls</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={triggerHeartLoss}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 flex items-center justify-center gap-1"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500" /> -1 Heart
              </button>
              <button
                onClick={() => setHearts(5)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Hearts
              </button>
              <button
                onClick={() => awardXp(20)}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl border border-purple-200 flex items-center justify-center gap-1"
              >
                <Zap className="w-3.5 h-3.5 fill-purple-500" /> +20 XP
              </button>
              <button
                onClick={incrementStreak}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl border border-amber-200 flex items-center justify-center gap-1"
              >
                <Flame className="w-3.5 h-3.5 fill-amber-500" /> +1 Streak
              </button>
            </div>
          </div>
        </div>

        {/* 1. BUTTONS SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">1. Duolingo-Style 3D Buttons</h2>
              <p className="text-xs font-bold text-slate-500">Tactile bevels, press animations, color variants, and sizes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Color Variants */}
            <Card className="space-y-4">
              <h3 className="font-extrabold text-sm text-slate-700 uppercase tracking-wider">Button Color Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary (Green)</Button>
                <Button variant="secondary">Secondary (Blue)</Button>
                <Button variant="amber">Streak (Amber)</Button>
                <Button variant="danger">Danger (Rose)</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="primary" disabled>Disabled State</Button>
                <Button variant="secondary" isLoading>Processing</Button>
              </div>
            </Card>

            {/* Sizes & Full Width */}
            <Card className="space-y-4">
              <h3 className="font-extrabold text-sm text-slate-700 uppercase tracking-wider">Sizes & Icons</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm">Small (sm)</Button>
                <Button variant="primary" size="md">Medium (md)</Button>
                <Button variant="primary" size="lg">Large (lg)</Button>
                <Button variant="secondary" size="md" icon={<Sparkles className="w-4 h-4 fill-white" />}>
                  With Icon
                </Button>
              </div>
              <div className="pt-2">
                <Button variant="primary" size="lg" fullWidth>
                  Full Width Call-To-Action Button
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* 2. HEARTS / XP / STREAK STATUS BAR */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">2. Hearts / XP / Streak Status Displays</h2>
              <p className="text-xs font-bold text-slate-500">Hover for tooltips, tap to interact with recovery & bonus info</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Hearts Display */}
            <Card className="flex flex-col items-center justify-center p-6 space-y-3 text-center">
              <span className="text-xs font-black text-slate-400 uppercase">Hearts & Lives</span>
              <HeartDisplay currentHearts={hearts} maxHearts={5} isShaking={isHeartsShaking} />
              <p className="text-xs text-slate-500 font-medium">5 max hearts • Depletes on incorrect answer</p>
            </Card>

            {/* XP Display */}
            <Card className="flex flex-col items-center justify-center p-6 space-y-3 text-center">
              <span className="text-xs font-black text-slate-400 uppercase">Experience Points</span>
              <XpDisplay xp={xp} recentGain={recentXp} />
              <p className="text-xs text-slate-500 font-medium">Easy: +10 XP • Med: +20 XP • Hard: +30 XP</p>
            </Card>

            {/* Streak Display */}
            <Card className="flex flex-col items-center justify-center p-6 space-y-3 text-center">
              <span className="text-xs font-black text-slate-400 uppercase">Streak Counter</span>
              <StreakDisplay streak={streak} />
              <p className="text-xs text-slate-500 font-medium">+5 bonus XP every 3 consecutive correct</p>
            </Card>
          </div>

          {/* Progress Bars */}
          <Card className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-700 uppercase tracking-wider">Glossy Progress Bars</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500">Quiz Question Progress (Green)</span>
                <ProgressBar progress={progress} color="green" height="md" showLabel />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500">Topic Completion Progress (Blue)</span>
                <ProgressBar progress={45} color="blue" height="md" showLabel />
              </div>
            </div>
          </Card>
        </section>

        {/* 3. CARDS SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">3. Topic & Level Cards</h2>
              <p className="text-xs font-bold text-slate-500">Curriculum navigation and progression lock/unlock states</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initialQuizData.topics.map((topic, index) => (
              <TopicCard
                key={topic.topic}
                topic={topic}
                progressPercentage={index === 0 ? 66 : 33}
                isCompleted={index === 0}
              />
            ))}
          </div>

          <div className="pt-2 space-y-3">
            <h3 className="font-extrabold text-sm text-slate-700 uppercase tracking-wider">Level Progression Cards</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <LevelCard
                levelInfo={{
                  level: 1,
                  name: "Hardware Rookie",
                  difficulty: "easy",
                  question_ids: ["HW001"]
                }}
                isUnlocked={true}
                isCompleted={true}
                starsEarned={3}
                rewardXp={10}
              />
              <LevelCard
                levelInfo={{
                  level: 2,
                  name: "Hardware Explorer",
                  difficulty: "medium",
                  question_ids: ["HW002"]
                }}
                isUnlocked={true}
                isCompleted={false}
                rewardXp={20}
              />
              <LevelCard
                levelInfo={{
                  level: 3,
                  name: "Hardware Master",
                  difficulty: "hard",
                  question_ids: ["HW003"]
                }}
                isUnlocked={false}
                isCompleted={false}
                rewardXp={30}
              />
            </div>
          </div>
        </section>

        {/* 4. QUIZ COMPONENT & DIFFERENT STATES */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">4. Quiz Component & Different States</h2>
              <p className="text-xs font-bold text-slate-500">
                Explore all 5 states: Idle, Selected, Correct (with explanation sheet), Incorrect (with correct answer reveal), and Out of Hearts
              </p>
            </div>
          </div>

          {/* Standalone Option State Preview Selector */}
          <Card className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-700 uppercase tracking-wider">
                  Option Button Visual States
                </h3>
                <p className="text-xs text-slate-500">Pick a state to inspect the styling on an isolated option</p>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {(['idle', 'selected', 'correct', 'incorrect'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setPreviewOptionState(st)}
                    className={`px-3 py-1 text-xs font-extrabold rounded-lg capitalize transition-colors ${
                      previewOptionState === st
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <QuizOption
                id="A"
                text="Arithmetic Logic Unit (ALU)"
                state={previewOptionState}
                isSelected={previewOptionState === 'selected' || previewOptionState === 'incorrect'}
                isCorrectAnswer={false}
              />
              <QuizOption
                id="B"
                text="Control Unit"
                state={previewOptionState}
                isSelected={previewOptionState === 'correct'}
                isCorrectAnswer={previewOptionState === 'incorrect'} // reveals B is the correct answer
              />
            </div>
          </Card>

          {/* Full Interactive Live Quiz Sandbox */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-sky-500" />
                <h3 className="font-black text-base text-slate-800">
                  Live Interactive Quiz Engine
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveQuestionIndex((prev) => prev + 1)}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Next Question
                </button>
              </div>
            </div>

            <QuizComponent
              key={`${sampleQuestion.id}-${activeQuestionIndex}`}
              question={sampleQuestion}
              questionNumber={(activeQuestionIndex % initialQuizData.questions.length) + 1}
              totalQuestions={initialQuizData.questions.length}
              earnedXpForThisLevel={sampleQuestion.level === 1 ? 10 : sampleQuestion.level === 2 ? 20 : 30}
              isStreakBonusAwarded={(streak + 1) % 3 === 0}
              onAnswerSubmit={(isCorrect) => {
                if (isCorrect) {
                  awardXp(sampleQuestion.level === 1 ? 10 : sampleQuestion.level === 2 ? 20 : 30);
                  incrementStreak();
                } else {
                  triggerHeartLoss();
                  resetStreak();
                }
              }}
              onNextQuestion={() => {
                setActiveQuestionIndex((prev) => prev + 1);
                setProgress((prev) => (prev >= 100 ? 20 : prev + 25));
              }}
            />
          </Card>
        </section>
      </div>

      {/* Out of Hearts Modal Demo */}
      <OutOfHeartsModal
        isOpen={isOutOfHeartsModalOpen}
        onRefill={() => {
          setHearts(5);
          setIsOutOfHeartsModalOpen(false);
        }}
        onExit={() => setIsOutOfHeartsModalOpen(false)}
        recoveryMinutes={30}
      />
    </div>
  );
};
