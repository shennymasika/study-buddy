import React, { useState } from 'react';
import { initialQuizData } from '../../data/quizData';
import type { Topic, LevelInfo, Question } from '../../types/quiz';
import { StatHeader } from '../gamification/StatHeader';
import { RobotMascot } from '../gamification/RobotMascot';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { TopicCard } from '../cards/TopicCard';
import { LevelCard } from '../cards/LevelCard';
import { QuizComponent } from '../quiz/QuizComponent';
import { OutOfHeartsModal } from '../quiz/OutOfHeartsModal';
import trophyImg from '../../assets/trophy.png';
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  Star,
  Heart,
  Flame,
  ArrowRight,
  Map,
  Trophy,
  Sparkles,
  House,
  Info,
  CheckCircle2,
  XCircle,
  Footprints,
  Lock,
  RotateCcw,
} from 'lucide-react';

export const QuestAppFlow: React.FC = () => {
  // Navigation Screens: 'home' | 'topics' | 'levels' | 'quiz' | 'result' | 'leaderboard'
  const [currentScreen, setCurrentScreen] = useState<'home' | 'topics' | 'levels' | 'quiz' | 'result' | 'leaderboard'>('home');

  // Check for PHP session user if running under PHP backend
  const phpUser = typeof window !== 'undefined' && (window as any).PHP_USER ? (window as any).PHP_USER : null;
  const studentName = phpUser?.username || 'Joy';
  const initialInitial = studentName.charAt(0).toUpperCase();

  // Player Game State (matching Figma defaults: 250 XP, 5/5 hearts, 7-day streak)
  const [hearts, setHearts] = useState(phpUser?.hearts ?? 5);
  const [isHeartsShaking, setIsHeartsShaking] = useState(false);
  const [xp, setXp] = useState(phpUser?.xp ?? 250);
  const [streak, setStreak] = useState(phpUser?.streak ?? 7);
  const [isOutOfHeartsOpen, setIsOutOfHeartsOpen] = useState(false);

  // Selected Topic & Level for active gameplay
  const [selectedTopic, setSelectedTopic] = useState<Topic>(initialQuizData.topics[1]); // Computer Software by default
  const [selectedLevel, setSelectedLevel] = useState<LevelInfo>(initialQuizData.topics[1].levels[0]); // Rookie
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  // Performance Tracking
  const [levelCorrectCount, setLevelCorrectCount] = useState(1);
  const [levelIncorrectCount, setLevelIncorrectCount] = useState(0);
  const [levelXpEarned, setLevelXpEarned] = useState(30);
  const [leaderboardTab, setLeaderboardTab] = useState<'global' | 'friends' | 'weekly'>('global');

  // Completed levels tracking
  const [completedLevels, setCompletedLevels] = useState<Record<string, number[]>>({
    'Computer Hardware': [1, 2],
    'Computer Software': [1],
  });

  // Filter questions for the selected topic and level
  const activeQuestions = initialQuizData.questions.filter(
    (q) => q.topic === selectedTopic.topic && q.level === selectedLevel.level
  );
  const currentQuestion: Question = activeQuestions[activeQuestionIdx] || initialQuizData.questions[3];

  const syncWithBackend = (newXp: number, newStreak: number, newHearts: number) => {
    if (phpUser) {
      fetch('index.php?api=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xp: newXp, streak: newStreak, hearts: newHearts }),
      }).catch(() => {});
    }
  };

  const handleStartLevel = (lvl: LevelInfo) => {
    setSelectedLevel(lvl);
    setActiveQuestionIdx(0);
    setLevelCorrectCount(0);
    setLevelIncorrectCount(0);
    setLevelXpEarned(0);
    setCurrentScreen('quiz');
  };

  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (isCorrect) {
      const questionXp = selectedLevel.difficulty === 'easy' ? 10 : selectedLevel.difficulty === 'medium' ? 20 : 30;
      const completionBonus = 20;
      const totalEarned = questionXp + completionBonus;
      const updatedXp = xp + totalEarned;
      const newStreak = streak + 1;

      setXp(updatedXp);
      setStreak(newStreak);
      setLevelXpEarned(totalEarned);
      setLevelCorrectCount(1);
      setLevelIncorrectCount(0);
      syncWithBackend(updatedXp, newStreak, hearts);
    } else {
      setIsHeartsShaking(true);
      setTimeout(() => setIsHeartsShaking(false), 500);
      const remaining = Math.max(0, hearts - 1);
      setHearts(remaining);
      setStreak(0);
      setLevelCorrectCount(0);
      setLevelIncorrectCount(1);
      setLevelXpEarned(0);
      if (remaining === 0) {
        setIsOutOfHeartsOpen(true);
      }
      syncWithBackend(xp, 0, remaining);
    }
  };

  const handleNextQuestion = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Mark completed
    setCompletedLevels((prev) => ({
      ...prev,
      [selectedTopic.topic]: Array.from(new Set([...(prev[selectedTopic.topic] || []), selectedLevel.level])),
    }));

    setCurrentScreen('result');
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex justify-center py-0 sm:py-6">
      {/* Phone container mimicking Figma mobile frame (393px width) */}
      <div className="w-full sm:max-w-[420px] bg-white sm:rounded-[40px] shadow-2xl overflow-hidden border border-[#dbeafe] flex flex-col relative min-h-screen sm:min-h-[880px]">
        
        {/* iOS Style Status Bar */}
        <div className="h-[44px] px-6 pt-3 flex items-center justify-between text-xs font-semibold text-[#1f2937] select-none bg-white z-20">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] tracking-tighter font-mono">5G</span>
            <div className="w-5 h-2.5 border border-[#1f2937] rounded-sm p-0.5 flex items-center">
              <div className="h-full w-full bg-[#1f2937] rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Dynamic Screen Content */}
        <div className="flex-1 overflow-y-auto pb-24">

          {/* ========================================================= */}
          {/* SCREEN 1: HOME (Exact match of Figma node 3:10960) */}
          {/* ========================================================= */}
          {currentScreen === 'home' && (
            <div className="px-5 pt-2 pb-6 space-y-5 animate-fade-in">
              {/* Brand Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-[#1e3a8a] tracking-tight leading-none">
                    Study Buddy
                  </h1>
                  <p className="text-xs font-semibold text-[#6b7280] mt-1">
                    Learn • Practice • Level up
                  </p>
                </div>
                {/* Profile Circle */}
                <div className="w-11 h-11 rounded-full bg-[#fff8dc] border-2 border-[#eaa400] flex items-center justify-center font-black text-lg text-[#eaa400] shadow-sm">
                  {initialInitial}
                </div>
              </div>

              {/* Greeting */}
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">
                  Hi, {studentName} 👋
                </h2>
                <p className="text-sm text-[#6b7280]">
                  A little revision. A big step forward.
                </p>
              </div>

              {/* 3 Learning Stats Cards */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* Total XP */}
                <Card className="p-3 text-center flex flex-col items-center justify-center space-y-1">
                  <Star className="w-6 h-6 text-[#eaa400] stroke-[2.2]" />
                  <span className="text-xl font-black text-[#1f2937] leading-none">{xp}</span>
                  <span className="text-[11px] font-semibold text-[#6b7280]">Total XP</span>
                </Card>

                {/* Hearts */}
                <Card className="p-3 text-center flex flex-col items-center justify-center space-y-1">
                  <Heart className="w-6 h-6 text-[#e11d48] stroke-[2.2]" />
                  <span className="text-xl font-black text-[#1f2937] leading-none">{hearts}/5</span>
                  <span className="text-[11px] font-semibold text-[#6b7280]">Hearts</span>
                </Card>

                {/* Streak */}
                <Card className="p-3 text-center flex flex-col items-center justify-center space-y-1">
                  <Flame className="w-6 h-6 text-[#ea580c] stroke-[2.2]" />
                  <span className="text-xl font-black text-[#1f2937] leading-none">{streak}-day</span>
                  <span className="text-[11px] font-semibold text-[#6b7280]">Streak</span>
                </Card>
              </div>

              {/* Continue Learning Card with the ROBOT MASCOT */}
              <Card className="p-5 space-y-4 border-2 border-[#dbeafe] border-b-4 border-b-[#bfdbfe]">
                {/* Course label */}
                <div className="flex items-center justify-between">
                  <span className="bg-[#fff8dc] text-[#eaa400] text-xs font-black px-3 py-1 rounded-full">
                    IST 1020
                  </span>
                  <span className="text-xs font-bold text-[#2563eb]">
                    Your daily quest
                  </span>
                </div>

                {/* Learning Invitation + ROBOT MASCOT */}
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-2 flex-1">
                    <h3 className="text-2xl font-black text-[#1f2937] leading-[1.1] tracking-tight">
                      Small steps.<br />Smart moves.
                    </h3>
                    <p className="text-xs font-semibold text-[#2563eb] leading-snug">
                      Introduction to<br />Information Systems
                    </p>
                  </div>

                  {/* ROBOT MASCOT */}
                  <RobotMascot
                    size="lg"
                    animated
                    speechBubble="Let's study!"
                    onClick={() => setCurrentScreen('levels')}
                  />
                </div>

                {/* Resume details */}
                <div className="space-y-2 pt-2 border-t border-[#eff6ff]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-[#1f2937]">Computer Software</span>
                    <span className="font-bold text-[#2563eb]">Rookie • Easy</span>
                  </div>

                  {/* Gold Progress Fill */}
                  <div className="h-3 bg-[#dbeafe] rounded-full overflow-hidden">
                    <div className="h-full bg-[#eaa400] rounded-full w-1/3 transition-all duration-300" />
                  </div>

                  <p className="text-xs text-[#2563eb] font-semibold">
                    1 of 3 levels saved • Ready for a fresh run
                  </p>
                </div>

                {/* Big Blue Next Button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    setSelectedTopic(initialQuizData.topics[1]);
                    setSelectedLevel(initialQuizData.topics[1].levels[0]);
                    setCurrentScreen('levels');
                  }}
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                >
                  Next
                </Button>
              </Card>

              {/* Quick Actions (Topic Map & Leaderboard) */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => setCurrentScreen('topics')}
                  icon={<Map className="w-5 h-5 text-[#2563eb]" />}
                  iconPosition="right"
                >
                  Topic Map
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => setCurrentScreen('leaderboard')}
                >
                  Leaderboard
                </Button>
              </div>

              {/* Sparkles Encouragement */}
              <div className="flex items-center gap-2 text-xs font-medium text-[#6b7280] pt-1 px-1">
                <Sparkles className="w-4 h-4 text-[#eaa400] flex-shrink-0" />
                <span>One lesson today keeps your streak going.</span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 2: TOPIC MAP (Exact match of Figma node 3:11032) */}
          {/* ========================================================= */}
          {currentScreen === 'topics' && (
            <div className="px-5 pt-2 pb-6 space-y-5 animate-fade-in">
              {/* Back Header */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="w-10 h-10 rounded-[14px] border-2 border-[#dbeafe] flex items-center justify-center text-[#1f2937] hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#6b7280] block">
                    IST 1020
                  </span>
                  <h2 className="text-xl font-black text-[#1f2937] leading-none">
                    Topic Map
                  </h2>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-[#1f2937] tracking-tight">
                  Your next big idea.
                </h3>
                <p className="text-xs text-[#6b7280] leading-relaxed">
                  Two topics. Three levels each. Build your confidence one question at a time.
                </p>
              </div>

              {/* Fresh attempt pill */}
              <div className="inline-flex items-center gap-2 bg-[#eff6ff] text-[#2563eb] px-3.5 py-1.5 rounded-full text-xs font-extrabold border border-[#bfdbfe]">
                <span>⚑ Fresh attempt • Start at Rookie</span>
              </div>

              {/* Topic Cards List */}
              <div className="space-y-4">
                {/* Computer Hardware */}
                <TopicCard
                  topic={initialQuizData.topics[0]}
                  progressPercentage={67}
                  completedLevelsCount={2}
                  isSelected={selectedTopic.topic === initialQuizData.topics[0].topic}
                  onSelectTopic={(t) => {
                    setSelectedTopic(t);
                    setCurrentScreen('levels');
                  }}
                />

                {/* Computer Software */}
                <TopicCard
                  topic={initialQuizData.topics[1]}
                  progressPercentage={33}
                  completedLevelsCount={1}
                  isSelected={selectedTopic.topic === initialQuizData.topics[1].topic}
                  onSelectTopic={(t) => {
                    setSelectedTopic(t);
                    setCurrentScreen('levels');
                  }}
                />
              </div>

              {/* Footnote with info icon */}
              <div className="flex items-start gap-2.5 text-xs text-[#6b7280] pt-2 px-1 leading-relaxed">
                <Info className="w-4 h-4 text-[#9ca3af] flex-shrink-0 mt-0.5" />
                <span>
                  Bars show your saved best progress. Locks show access in this fresh attempt; pass each level to unlock the next.
                </span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 3: LEVEL SELECT (Exact match of Figma node 3:11123) */}
          {/* ========================================================= */}
          {currentScreen === 'levels' && (
            <div className="px-5 pt-2 pb-6 space-y-4 animate-fade-in">
              {/* Back Header */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentScreen('topics')}
                  className="w-10 h-10 rounded-[14px] border-2 border-[#dbeafe] flex items-center justify-center text-[#1f2937] hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#6b7280] block">
                    CHOOSE YOUR LEVEL
                  </span>
                  <h2 className="text-xl font-black text-[#1f2937] leading-none">
                    {selectedTopic.topic}
                  </h2>
                </div>
              </div>

              {/* Saved Best Pill */}
              <div className="inline-flex items-center gap-1.5 bg-[#eff6ff] text-[#2563eb] px-3 py-1 rounded-full text-xs font-black border border-[#bfdbfe]">
                <span>🔖 Saved best: 1/3 levels</span>
              </div>

              <p className="text-xs text-[#6b7280] leading-relaxed">
                A fresh run starts at Rookie. Your saved best stays safe while you unlock this attempt.
              </p>

              {/* Level Cards */}
              <div className="space-y-3.5">
                {selectedTopic.levels.map((lvl, index) => {
                  const isUnlocked = index === 0 || (completedLevels[selectedTopic.topic] || []).includes(index);
                  const isDone = (completedLevels[selectedTopic.topic] || []).includes(lvl.level);

                  return (
                    <LevelCard
                      key={lvl.level}
                      levelInfo={lvl}
                      isUnlocked={isUnlocked}
                      isCompleted={isDone}
                      rewardXp={lvl.difficulty === 'easy' ? 10 : lvl.difficulty === 'medium' ? 20 : 30}
                      levelBonus={20}
                      onPlay={() => handleStartLevel(lvl)}
                    />
                  );
                })}
              </div>

              {/* "Little wins add up" info card */}
              <Card className="p-5 space-y-3.5 bg-white border border-[#dbeafe]">
                <h4 className="text-lg font-black text-[#1f2937]">Little wins add up.</h4>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <Star className="w-4 h-4 text-[#2563eb] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1f2937] block font-extrabold">Earn XP as you learn</strong>
                      <span className="text-[#6b7280]">
                        Easy +10 • Medium +20 • Hard +30 per correct answer. Complete a level: +20. Complete all 3 topic levels: +50.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Flame className="w-4 h-4 text-[#ea580c] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1f2937] block font-extrabold">Keep a correct-answer combo</strong>
                      <span className="text-[#6b7280]">
                        Get +5 XP every 3 correct answers in a row. A wrong answer resets the combo.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Heart className="w-4 h-4 text-[#e11d48] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1f2937] block font-extrabold">Five hearts, fresh chances</strong>
                      <span className="text-[#6b7280]">
                        Start with 5 hearts. Each wrong answer costs 1 heart. Regenerate 1 heart every 30 minutes.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Lock className="w-4 h-4 text-[#2563eb] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1f2937] block font-extrabold">Pass to open the next level</strong>
                      <span className="text-[#6b7280]">
                        Reach ≥70% accuracy to pass. Completing a level unlocks the next. Retry whenever you need practice.
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 4: QUIZ (Exact match of Figma node 3:11219) */}
          {/* ========================================================= */}
          {currentScreen === 'quiz' && (
            <div className="animate-fade-in">
              <StatHeader
                hearts={hearts}
                maxHearts={5}
                xp={xp}
                streak={streak}
                quizProgress={Math.round(((activeQuestionIdx + 1) / (activeQuestions.length || 1)) * 100)}
                onCloseQuiz={() => setCurrentScreen('levels')}
                isHeartsShaking={isHeartsShaking}
              />

              <QuizComponent
                key={`${selectedTopic.topic}-${selectedLevel.level}-${activeQuestionIdx}`}
                question={currentQuestion}
                questionNumber={activeQuestionIdx + 1}
                totalQuestions={activeQuestions.length}
                remainingHearts={hearts}
                earnedXpForThisLevel={selectedLevel.difficulty === 'easy' ? 10 : selectedLevel.difficulty === 'medium' ? 20 : 30}
                onAnswerSubmit={handleAnswerSubmit}
                onNextQuestion={handleNextQuestion}
              />
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 5: RESULT (Exact match of Figma node 3:11354) */}
          {/* ========================================================= */}
          {currentScreen === 'result' && (
            <div className="px-5 pt-3 pb-8 space-y-4 animate-fade-in">
              {/* Header Badge */}
              <div className="flex justify-center">
                <span className="bg-[#eff6ff] text-[#1e3a8a] text-xs font-black uppercase px-3 py-1.5 rounded-full border border-[#bfdbfe]">
                  {selectedTopic.topic} • {selectedLevel.name}
                </span>
              </div>

              {/* CELEBRATION TROPHY GRAPHIC */}
              <div className="flex justify-center py-1">
                <img
                  src={trophyImg}
                  alt="Level Trophy Celebration"
                  className="w-[180px] h-[147px] object-contain drop-shadow-lg"
                />
              </div>

              {/* Heading */}
              <div className="text-center space-y-1">
                <h2 className="text-3xl font-black text-[#1f2937] tracking-tight">
                  Level Complete
                </h2>
                <p className="text-xs text-[#6b7280]">
                  One question. One big win. You're getting the hang of this!
                </p>
              </div>

              {/* Accuracy Card */}
              <Card className="p-4 bg-[#eff6ff] border border-[#bfdbfe] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-[#1e3a8a]">100%</span>
                  <span className="flex items-center gap-1 text-xs font-black text-[#2563eb]">
                    ✓ PASSED
                  </span>
                </div>
                <p className="text-xs font-bold text-[#1e3a8a]">
                  Accuracy • 1/1 score
                </p>
                <p className="text-xs text-[#6b7280]">
                  Pass target: ≥70% • You nailed it.
                </p>
              </Card>

              {/* 1 Correct / 0 Incorrect */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3 text-center space-y-1">
                  <div className="w-7 h-7 rounded-full bg-[#eff6ff] text-[#2563eb] flex items-center justify-center mx-auto border border-[#bfdbfe]">
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="text-2xl font-black text-[#1f2937] block leading-none">{levelCorrectCount}</span>
                  <span className="text-xs font-semibold text-[#6b7280]">Correct</span>
                </Card>

                <Card className="p-3 text-center space-y-1">
                  <div className="w-7 h-7 rounded-full bg-[#fef2f2] text-[#ef4444] flex items-center justify-center mx-auto border border-[#fecaca]">
                    <XCircle className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="text-2xl font-black text-[#1f2937] block leading-none">{levelIncorrectCount}</span>
                  <span className="text-xs font-semibold text-[#6b7280]">Incorrect</span>
                </Card>
              </div>

              {/* XP Earned Breakdown Card */}
              <Card className="p-4.5 bg-[#fefce8] border border-[#fef08a] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-[#1f2937]">XP earned</span>
                  <span className="font-black text-lg text-[#ca8a04]">+{levelXpEarned} XP</span>
                </div>

                <div className="space-y-1 text-xs text-[#4b5563]">
                  <div className="flex justify-between">
                    <span>1 correct Easy answer</span>
                    <span className="font-bold">+10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Level completion bonus</span>
                    <span className="font-bold">+20</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#fef08a] flex items-center justify-between font-black text-sm text-[#1f2937]">
                  <span>Total XP</span>
                  <span>{xp - levelXpEarned} → {xp}</span>
                </div>

                <p className="text-[11px] text-[#6b7280] leading-snug">
                  Combo: 1 correct, so no +5 bonus yet. Topic +50 is earned only after all 3 levels.
                </p>
              </Card>

              {/* 7-day streak achieved */}
              <div className="flex items-center gap-3 p-2 text-xs">
                <Flame className="w-6 h-6 text-[#ea580c] flex-shrink-0" />
                <div>
                  <h4 className="font-black text-[#1f2937] text-sm">7-day streak achieved</h4>
                  <p className="text-[#6b7280]">Today's practice is done. Keep it glowing!</p>
                </div>
              </div>

              {/* Explorer Unlocked Banner */}
              <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-[18px] p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0">
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-black text-[#1e3a8a] text-sm leading-tight">Explorer unlocked!</h4>
                  <p className="text-xs text-[#2563eb]">Level 2 • Medium • +20 XP per correct</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setCurrentScreen('leaderboard')}
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                >
                  Next
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => handleStartLevel(selectedLevel)}
                  icon={<RotateCcw className="w-4 h-4" />}
                >
                  Retry Level
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 6: STREAK & LEADERBOARD (Figma node 3:11419) */}
          {/* ========================================================= */}
          {currentScreen === 'leaderboard' && (
            <div className="px-5 pt-2 pb-6 space-y-4 animate-fade-in">
              {/* Back Header */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="w-10 h-10 rounded-[14px] border-2 border-[#dbeafe] flex items-center justify-center text-[#1f2937] hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#6b7280] block">
                    LOOK AT YOU GROW
                  </span>
                  <h2 className="text-xl font-black text-[#1f2937] leading-none">
                    Streak & Leaderboard
                  </h2>
                </div>
              </div>

              {/* 7-Day Streak Card */}
              <Card className="p-5 bg-[#fffbeb] border border-[#fef08a] space-y-3">
                <div className="flex items-start gap-3">
                  <Flame className="w-8 h-8 text-[#ea580c] stroke-[2.2] flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-black text-[#1f2937] leading-none">7-day streak</h3>
                    <p className="text-xs font-semibold text-[#6b7280] mt-1">Longest streak: 12 days</p>
                  </div>
                </div>

                {/* Weekday Circles (M, T, W, T, F, S, S) */}
                <div className="flex items-center justify-between pt-1">
                  {[
                    { day: 'M', done: true },
                    { day: 'T', done: true },
                    { day: 'W', done: true },
                    { day: 'T', done: true },
                    { day: 'F', done: true },
                    { day: 'S', done: true },
                    { day: 'S', flame: true },
                  ].map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${
                          d.flame
                            ? 'bg-[#eaa400] text-white'
                            : d.done
                            ? 'bg-[#2563eb] text-white'
                            : 'bg-[#f3f4f6] text-[#9ca3af]'
                        }`}
                      >
                        {d.flame ? (
                          <Flame className="w-4 h-4 fill-white" />
                        ) : (
                          <span>✓</span>
                        )}
                      </div>
                      <span className="text-[10px] font-extrabold text-[#6b7280]">{d.day}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-[#6b7280] leading-relaxed pt-1">
                  A whole week of showing up. That's a habit worth celebrating.
                </p>
              </Card>

              {/* Your Total XP Card */}
              <Card className="p-4 flex items-center justify-between border border-[#dbeafe]">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-[#eaa400] stroke-[2.2]" />
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#6b7280] block">YOUR TOTAL XP</span>
                    <span className="text-xl font-black text-[#1f2937]">{xp} XP</span>
                  </div>
                </div>
                <span className="bg-[#eff6ff] text-[#2563eb] text-xs font-black px-3 py-1 rounded-full border border-[#bfdbfe]">
                  +30 today
                </span>
              </Card>

              {/* The Leaderboard */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-[#1f2937]">The leaderboard</h3>
                  <Trophy className="w-5 h-5 text-[#eaa400]" />
                </div>

                {/* Tabs */}
                <div className="flex items-center bg-[#f3f4f6] p-1 rounded-2xl">
                  {(['global', 'friends', 'weekly'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setLeaderboardTab(tab)}
                      className={`flex-1 py-2 text-xs font-black capitalize rounded-xl transition-all ${
                        leaderboardTab === tab
                          ? 'bg-[#2563eb] text-white shadow-sm'
                          : 'text-[#6b7280] hover:text-[#1f2937]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Leaderboard entries */}
                <div className="space-y-2">
                  {/* 1st Place */}
                  <div className="bg-[#fefce8] border border-[#fef08a] rounded-[18px] p-3.5 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-[#ca8a04] bg-[#fef08a] px-2 py-0.5 rounded-lg">1st</span>
                      <span className="font-extrabold text-sm text-[#1f2937]">Player One</span>
                    </div>
                    <span className="font-black text-xs text-[#ca8a04]">1,250 XP</span>
                  </div>

                  {/* 2nd Place */}
                  <div className="bg-[#f8fafc] border border-slate-200 rounded-[18px] p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-600 bg-slate-200 px-2 py-0.5 rounded-lg">2nd</span>
                      <span className="font-extrabold text-sm text-[#1f2937]">Player Two</span>
                    </div>
                    <span className="font-black text-xs text-slate-700">1,100 XP</span>
                  </div>

                  {/* 3rd Place */}
                  <div className="bg-[#fff7ed] border border-[#ffedd5] rounded-[18px] p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-[#c2410c] bg-[#ffedd5] px-2 py-0.5 rounded-lg">3rd</span>
                      <span className="font-extrabold text-sm text-[#1f2937]">Player Three</span>
                    </div>
                    <span className="font-black text-xs text-[#c2410c]">950 XP</span>
                  </div>

                  {/* Current User (Joy) */}
                  <div className="bg-[#eff6ff] border-2 border-[#2563eb] rounded-[18px] p-3.5 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-white bg-[#2563eb] px-2 py-0.5 rounded-lg">24th</span>
                      <span className="font-black text-sm text-[#1e3a8a]">{studentName} (you)</span>
                    </div>
                    <span className="font-black text-xs text-[#2563eb]">{xp} XP</span>
                  </div>
                </div>
              </div>

              {/* Your badge shelf */}
              <div className="space-y-3 pt-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#1f2937]">Your badge shelf</h3>
                  <span className="text-xs font-extrabold text-[#2563eb]">2 of 6 earned</span>
                </div>

                <div className="space-y-2">
                  {/* Badge 1: First Steps (Earned) */}
                  <div className="bg-white border-2 border-[#2563eb] rounded-[18px] p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#fff8dc] text-[#eaa400] flex items-center justify-center">
                        <Footprints className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-[#1f2937] leading-tight">First Steps</h4>
                        <p className="text-[11px] text-[#6b7280]">Earned • Complete your first level</p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-[#2563eb]" />
                  </div>

                  {/* Badge 2: Perfect Score (Earned) */}
                  <div className="bg-white border-2 border-[#2563eb] rounded-[18px] p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#fff8dc] text-[#eaa400] flex items-center justify-center">
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-[#1f2937] leading-tight">Perfect Score</h4>
                        <p className="text-[11px] text-[#6b7280]">Earned • Get 100% in a level</p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-[#2563eb]" />
                  </div>

                  {/* Badge 3: On Fire (Locked) */}
                  <div className="bg-[#f8fafc] border border-slate-200 rounded-[18px] p-3 flex items-center justify-between opacity-70">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-slate-700 leading-tight">On Fire</h4>
                        <p className="text-[11px] text-slate-400">Locked • 5 correct in a row (best: 2/5)</p>
                      </div>
                    </div>
                  </div>

                  {/* Badge 4: Hardware Master (Locked) */}
                  <div className="bg-[#f8fafc] border border-slate-200 rounded-[18px] p-3 flex items-center justify-between opacity-70">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-slate-700 leading-tight">Hardware Master</h4>
                        <p className="text-[11px] text-slate-400">Locked • Complete 3/3 Hardware levels</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Home Button */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setCurrentScreen('home')}
                  icon={<House className="w-5 h-5" />}
                  iconPosition="right"
                >
                  Return Home
                </Button>
              </div>
            </div>
          )}

        </div>

        {/* ========================================================= */}
        {/* EXACT FIGMA BOTTOM TAB BAR (Home • Learn • Ranks) */}
        {/* ========================================================= */}
        <nav className="absolute bottom-0 inset-x-0 bg-white border-t border-[#dbeafe] h-[72px] px-6 flex items-center justify-around z-30 select-none">
          {/* Home */}
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              currentScreen === 'home' ? 'text-[#2563eb]' : 'text-[#6b7280] hover:text-[#1f2937]'
            }`}
          >
            <House className="w-6 h-6 stroke-[2.2]" />
            <span className="text-[11px] font-extrabold">Home</span>
          </button>

          {/* Learn / Topics */}
          <button
            onClick={() => setCurrentScreen('topics')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              currentScreen === 'topics' || currentScreen === 'levels' || currentScreen === 'quiz'
                ? 'text-[#2563eb]'
                : 'text-[#6b7280] hover:text-[#1f2937]'
            }`}
          >
            <Map className="w-6 h-6 stroke-[2.2]" />
            <span className="text-[11px] font-extrabold">Learn</span>
          </button>

          {/* Ranks / Leaderboard */}
          <button
            onClick={() => setCurrentScreen('leaderboard')}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              currentScreen === 'leaderboard' || currentScreen === 'result'
                ? 'text-[#2563eb]'
                : 'text-[#6b7280] hover:text-[#1f2937]'
            }`}
          >
            <Trophy className="w-6 h-6 stroke-[2.2]" />
            <span className="text-[11px] font-extrabold">Ranks</span>
          </button>
        </nav>

        {/* iOS Home Indicator Bar */}
        <div className="absolute bottom-1 inset-x-0 h-4 flex items-center justify-center pointer-events-none z-40">
          <div className="w-32 h-1 bg-[#1f2937] rounded-full" />
        </div>
      </div>

      {/* Out of Hearts Modal */}
      <OutOfHeartsModal
        isOpen={isOutOfHeartsOpen}
        onRefill={() => {
          setHearts(5);
          setIsOutOfHeartsOpen(false);
        }}
        onExit={() => {
          setIsOutOfHeartsOpen(false);
          setCurrentScreen('home');
        }}
        recoveryMinutes={30}
      />
    </div>
  );
};
