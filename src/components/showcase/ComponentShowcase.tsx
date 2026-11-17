import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { StatHeader } from '../gamification/StatHeader';
import { RobotMascot } from '../gamification/RobotMascot';
import { QuizOption } from '../quiz/QuizOption';
import { QuizComponent } from '../quiz/QuizComponent';
import { initialQuizData } from '../../data/quizData';
import trophyImg from '../../assets/trophy.png';
import {
  RefreshCw,
  Sliders,
} from 'lucide-react';

export const ComponentShowcase: React.FC = () => {
  // Gamification interactive test state
  const [hearts, setHearts] = useState(5);
  const [isHeartsShaking, setIsHeartsShaking] = useState(false);
  const [xp, setXp] = useState(250);
  const [streak, setStreak] = useState(7);
  const [progress, setProgress] = useState(67);

  // Standalone Option preview state
  const [previewOptionState, setPreviewOptionState] = useState<'idle' | 'selected' | 'correct' | 'incorrect'>('idle');

  // Interactive Quiz live question index
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const sampleQuestion = initialQuizData.questions[activeQuestionIndex % initialQuizData.questions.length];

  const triggerHeartLoss = () => {
    setIsHeartsShaking(true);
    setTimeout(() => setIsHeartsShaking(false), 500);
    setHearts((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#1f2937] pb-24">
      {/* Top Header */}
      <StatHeader
        hearts={hearts}
        maxHearts={5}
        xp={xp}
        streak={streak}
        quizProgress={progress}
        isHeartsShaking={isHeartsShaking}
      />

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-8">
        {/* Banner introduction with Robot Mascot */}
        <div className="bg-white rounded-[26px] p-6 border-2 border-[#dbeafe] border-b-4 border-b-[#bfdbfe] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <span className="px-3 py-1 bg-[#eff6ff] text-[#2563eb] text-xs font-black rounded-full uppercase tracking-wider border border-[#bfdbfe]">
              Figma Design System • Pixel Perfect
            </span>
            <h1 className="text-3xl font-black text-[#1e3a8a] tracking-tight">
              Study Buddy Design Library
            </h1>
            <p className="text-[#6b7280] font-medium text-sm">
              Extracted directly from the Figma project. Features the official Computer Robot mascot, royal blue 3D buttons, and interactive quiz states.
            </p>
          </div>

          {/* Robot Mascot in Hero Banner */}
          <div className="flex-shrink-0">
            <RobotMascot size="lg" animated speechBubble="Hi, Joy!" />
          </div>
        </div>

        {/* Quick Sandbox Controls */}
        <div className="bg-white border-2 border-[#dbeafe] rounded-[22px] p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-[#1e3a8a]">
            <Sliders className="w-4 h-4 text-[#2563eb]" />
            <span>Interactive Tester Controls</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={triggerHeartLoss}
              className="px-3 py-1.5 bg-[#ffe4e6] text-[#e11d48] text-xs font-bold rounded-xl border border-[#fecdd3] hover:bg-[#fecdd3] transition-colors"
            >
              -1 Heart
            </button>
            <button
              onClick={() => setHearts(5)}
              className="px-3 py-1.5 bg-[#eff6ff] text-[#2563eb] text-xs font-bold rounded-xl border border-[#bfdbfe] hover:bg-[#dbeafe] transition-colors"
            >
              Reset Hearts
            </button>
            <button
              onClick={() => setXp((prev) => prev + 30)}
              className="px-3 py-1.5 bg-[#fef9c3] text-[#ca8a04] text-xs font-bold rounded-xl border border-[#fef08a] hover:bg-[#fef08a] transition-colors"
            >
              +30 XP
            </button>
            <button
              onClick={() => setStreak((prev) => prev + 1)}
              className="px-3 py-1.5 bg-[#fef3c7] text-[#d97706] text-xs font-bold rounded-xl border border-[#fde68a] hover:bg-[#fde68a] transition-colors"
            >
              +1 Day Streak
            </button>
          </div>
        </div>

        {/* 1. FIGMA BUTTONS */}
        <section className="space-y-4">
          <h2 className="text-xl font-black text-[#1e3a8a]">1. Figma Tactile 3D Buttons</h2>
          <Card className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg">Primary Blue (Next →)</Button>
              <Button variant="secondary" size="lg">Secondary (Topic Map)</Button>
              <Button variant="amber" size="lg">Amber (Streak / Level)</Button>
              <Button variant="danger" size="lg">Danger Red</Button>
              <Button variant="outline" size="lg">Outline</Button>
              <Button variant="primary" size="lg" disabled>Disabled State</Button>
            </div>
          </Card>
        </section>

        {/* 2. THE ROBOT & TROPHY GRAPHICS */}
        <section className="space-y-4">
          <h2 className="text-xl font-black text-[#1e3a8a]">2. Figma Mascot & Celebration Graphics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Robot Mascot Card */}
            <Card className="flex flex-col items-center justify-center p-6 space-y-3 text-center">
              <RobotMascot size="lg" animated />
              <h3 className="font-black text-base text-[#1f2937]">Computer Robot Mascot</h3>
              <p className="text-xs text-[#6b7280]">Official Study Buddy mascot from Figma</p>
            </Card>

            {/* Trophy Celebration Card */}
            <Card className="flex flex-col items-center justify-center p-6 space-y-3 text-center">
              <img src={trophyImg} alt="Celebration Trophy" className="w-[180px] h-[147px] object-contain drop-shadow-md" />
              <h3 className="font-black text-base text-[#1f2937]">Level Complete Trophy</h3>
              <p className="text-xs text-[#6b7280]">Awarded upon passing level threshold</p>
            </Card>
          </div>
        </section>

        {/* 3. QUIZ OPTION VISUAL STATES */}
        <section className="space-y-4">
          <h2 className="text-xl font-black text-[#1e3a8a]">3. Quiz Option Button States</h2>
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6b7280]">Select a state to test:</span>
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {(['idle', 'selected', 'correct', 'incorrect'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setPreviewOptionState(st)}
                    className={`px-3 py-1 text-xs font-extrabold rounded-lg capitalize transition-colors ${
                      previewOptionState === st
                        ? 'bg-[#2563eb] text-white shadow-xs'
                        : 'text-[#6b7280] hover:text-[#1f2937]'
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
                isCorrectAnswer={previewOptionState === 'incorrect'}
              />
            </div>
          </Card>
        </section>

        {/* 4. LIVE INTERACTIVE QUIZ ENGINE */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#1e3a8a]">4. Live Interactive Quiz Engine</h2>
            <button
              onClick={() => setActiveQuestionIndex((prev) => prev + 1)}
              className="text-xs font-extrabold text-[#2563eb] hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Next Question
            </button>
          </div>

          <Card className="p-6">
            <QuizComponent
              key={`${sampleQuestion.id}-${activeQuestionIndex}`}
              question={sampleQuestion}
              questionNumber={(activeQuestionIndex % initialQuizData.questions.length) + 1}
              totalQuestions={initialQuizData.questions.length}
              remainingHearts={hearts}
              earnedXpForThisLevel={sampleQuestion.level === 1 ? 10 : sampleQuestion.level === 2 ? 20 : 30}
              onAnswerSubmit={(isCorrect) => {
                if (isCorrect) {
                  setXp((prev) => prev + (sampleQuestion.level === 1 ? 10 : sampleQuestion.level === 2 ? 20 : 30));
                } else {
                  triggerHeartLoss();
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
    </div>
  );
};
