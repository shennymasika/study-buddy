import React, { useState } from 'react';
import { initialQuizData } from '../../data/quizData';
import type { Topic, LevelInfo, Question } from '../../types/quiz';
import { StatHeader } from '../gamification/StatHeader';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { TopicCard } from '../cards/TopicCard';
import { LevelCard } from '../cards/LevelCard';
import { QuizComponent } from '../quiz/QuizComponent';
import { OutOfHeartsModal } from '../quiz/OutOfHeartsModal';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  Zap,
  Target,
} from 'lucide-react';

export const QuestAppFlow: React.FC = () => {
  // Navigation Flow: 'home' | 'topics' | 'levels' | 'quiz' | 'result' | 'leaderboard'
  const [currentScreen, setCurrentScreen] = useState<'home' | 'topics' | 'levels' | 'quiz' | 'result' | 'leaderboard'>('home');

  // Check for PHP session user if running under PHP backend
  const phpUser = typeof window !== 'undefined' && (window as any).PHP_USER ? (window as any).PHP_USER : null;

  // Player Game State
  const [hearts, setHearts] = useState(
    phpUser?.hearts ?? initialQuizData.game_mechanics.hearts_and_lives.starting_hearts
  );
  const [isHeartsShaking, setIsHeartsShaking] = useState(false);
  const [xp, setXp] = useState(phpUser?.xp ?? 0);
  const [streak, setStreak] = useState(phpUser?.streak ?? 0);
  const [isOutOfHeartsOpen, setIsOutOfHeartsOpen] = useState(false);

  // Sync to PHP backend helper
  const syncWithBackend = (newXp: number, newStreak: number, newHearts: number) => {
    if (phpUser) {
      fetch('index.php?api=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xp: newXp, streak: newStreak, hearts: newHearts }),
      }).catch(() => {});
    }
  };

  // Selected Topic & Level for active gameplay
  const [selectedTopic, setSelectedTopic] = useState<Topic>(initialQuizData.topics[0]);
  const [selectedLevel, setSelectedLevel] = useState<LevelInfo>(initialQuizData.topics[0].levels[0]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  // Level Quiz Performance Tracking
  const [levelCorrectCount, setLevelCorrectCount] = useState(0);
  const [levelIncorrectCount, setLevelIncorrectCount] = useState(0);
  const [levelXpEarned, setLevelXpEarned] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<Record<string, number[]>>({
    'Computer Hardware': [],
    'Computer Software': [],
  });

  // Filter questions for the selected topic and level
  const activeQuestions = initialQuizData.questions.filter(
    (q) => q.topic === selectedTopic.topic && q.level === selectedLevel.level
  );

  const currentQuestion: Question | undefined = activeQuestions[activeQuestionIdx] || initialQuizData.questions[0];

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
      const questionXp =
        selectedLevel.difficulty === 'easy'
          ? initialQuizData.game_mechanics.experience_points.easy_correct
          : selectedLevel.difficulty === 'medium'
          ? initialQuizData.game_mechanics.experience_points.medium_correct
          : initialQuizData.game_mechanics.experience_points.hard_correct;

      const newStreak = streak + 1;
      const isStreakBonus = newStreak % 3 === 0;
      const totalGain = questionXp + (isStreakBonus ? 5 : 0);
      const updatedXp = xp + totalGain;

      setXp(updatedXp);
      setLevelXpEarned((prev) => prev + totalGain);
      setStreak(newStreak);
      setLevelCorrectCount((prev) => prev + 1);
      syncWithBackend(updatedXp, newStreak, hearts);
    } else {
      setIsHeartsShaking(true);
      setTimeout(() => setIsHeartsShaking(false), 500);
      setStreak(0);
      setLevelIncorrectCount((prev) => prev + 1);
      const remaining = Math.max(0, hearts - 1);
      setHearts(remaining);
      if (remaining === 0) {
        setIsOutOfHeartsOpen(true);
      }
      syncWithBackend(xp, 0, remaining);
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIdx + 1 < activeQuestions.length) {
      setActiveQuestionIdx((prev) => prev + 1);
    } else {
      // Completed the level!
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });

      // Mark level completed if passed accuracy (70%)
      const accuracy = (levelCorrectCount / (levelCorrectCount + levelIncorrectCount || 1)) * 100;
      if (accuracy >= 50) { // relaxed passing for demo
        setCompletedLevels((prev) => ({
          ...prev,
          [selectedTopic.topic]: Array.from(new Set([...(prev[selectedTopic.topic] || []), selectedLevel.level])),
        }));
      }

      setCurrentScreen('result');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Header Bar */}
      <StatHeader
        hearts={hearts}
        maxHearts={5}
        xp={xp}
        streak={streak}
        quizProgress={
          currentScreen === 'quiz'
            ? Math.round(((activeQuestionIdx + 1) / (activeQuestions.length || 1)) * 100)
            : undefined
        }
        onCloseQuiz={currentScreen === 'quiz' ? () => setCurrentScreen('levels') : undefined}
        isHeartsShaking={isHeartsShaking}
      />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* SCREEN 1: HOME */}
        {currentScreen === 'home' && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Welcome Card */}
            <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-4 max-w-lg">
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white">
                  <Sparkles className="w-3.5 h-3.5 fill-white" /> Welcome, {phpUser?.username || 'Cadet'}!
                </span>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                  Master Computer Studies the Fun Way!
                </h1>
                <p className="text-sky-100 font-medium text-sm sm:text-base">
                  Sharpen your skills in Computer Hardware & Software with quick bite-sized gamified quizzes.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setCurrentScreen('topics')}
                    icon={<ArrowRight className="w-5 h-5" />}
                    iconPosition="right"
                  >
                    Start Learning
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => setCurrentScreen('leaderboard')}
                    icon={<Trophy className="w-5 h-5" />}
                  >
                    Leaderboard
                  </Button>
                </div>
              </div>

              {/* Decorative Background Circles */}
              <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card className="text-center p-4">
                <Zap className="w-6 h-6 text-purple-500 fill-purple-100 mx-auto mb-1" />
                <div className="text-xl font-black text-slate-800">{xp}</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Total XP</div>
              </Card>

              <Card className="text-center p-4">
                <Flame className="w-6 h-6 text-amber-500 fill-amber-100 mx-auto mb-1" />
                <div className="text-xl font-black text-slate-800">{streak}</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Current Streak</div>
              </Card>

              <Card className="text-center p-4">
                <Target className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                <div className="text-xl font-black text-slate-800">
                  {Object.values(completedLevels).flat().length} / 6
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Levels Won</div>
              </Card>

              <Card className="text-center p-4">
                <Award className="w-6 h-6 text-sky-500 mx-auto mb-1" />
                <div className="text-xl font-black text-slate-800">100%</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Daily Goal</div>
              </Card>
            </div>

            {/* Topics Overview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">Your Study Topics</h2>
                <button
                  onClick={() => setCurrentScreen('topics')}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700"
                >
                  View All Topics
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {initialQuizData.topics.map((t) => (
                  <TopicCard
                    key={t.topic}
                    topic={t}
                    progressPercentage={(completedLevels[t.topic]?.length || 0) * 33}
                    onSelectTopic={(selected) => {
                      setSelectedTopic(selected);
                      setCurrentScreen('levels');
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 2: TOPIC MAP */}
        {currentScreen === 'topics' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Topic Map</h1>
                <p className="text-xs font-bold text-slate-500">Pick a topic to begin conquering levels</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentScreen('home')}>
                Back Home
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {initialQuizData.topics.map((topic) => (
                <TopicCard
                  key={topic.topic}
                  topic={topic}
                  progressPercentage={(completedLevels[topic.topic]?.length || 0) * 33}
                  isCompleted={(completedLevels[topic.topic]?.length || 0) >= 3}
                  onSelectTopic={(t) => {
                    setSelectedTopic(t);
                    setCurrentScreen('levels');
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* SCREEN 3: LEVEL SELECTION */}
        {currentScreen === 'levels' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-sky-600 uppercase tracking-wider">
                  {selectedTopic.topic}
                </span>
                <h1 className="text-2xl font-black text-slate-900">Select Difficulty Level</h1>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentScreen('topics')}>
                Change Topic
              </Button>
            </div>

            <div className="space-y-3">
              {selectedTopic.levels.map((lvl, index) => {
                const isUnlocked =
                  index === 0 || (completedLevels[selectedTopic.topic] || []).includes(index);
                const isCompleted = (completedLevels[selectedTopic.topic] || []).includes(lvl.level);

                return (
                  <LevelCard
                    key={lvl.level}
                    levelInfo={lvl}
                    isUnlocked={isUnlocked}
                    isCompleted={isCompleted}
                    starsEarned={isCompleted ? 3 : 0}
                    rewardXp={lvl.difficulty === 'easy' ? 10 : lvl.difficulty === 'medium' ? 20 : 30}
                    onPlay={() => handleStartLevel(lvl)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* SCREEN 4: ACTIVE QUIZ */}
        {currentScreen === 'quiz' && (
          <div className="animate-fade-in">
            <QuizComponent
              key={`${selectedTopic.topic}-${selectedLevel.level}-${activeQuestionIdx}`}
              question={currentQuestion}
              questionNumber={activeQuestionIdx + 1}
              totalQuestions={activeQuestions.length}
              earnedXpForThisLevel={selectedLevel.difficulty === 'easy' ? 10 : selectedLevel.difficulty === 'medium' ? 20 : 30}
              isStreakBonusAwarded={(streak + 1) % 3 === 0}
              onAnswerSubmit={handleAnswerSubmit}
              onNextQuestion={handleNextQuestion}
            />
          </div>
        )}

        {/* SCREEN 5: RESULT SCREEN */}
        {currentScreen === 'result' && (
          <div className="max-w-md mx-auto text-center space-y-6 animate-fade-in py-6">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-100 flex items-center justify-center text-amber-500 shadow-lg border-2 border-amber-200 animate-bounce">
              <Trophy className="w-12 h-12 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900">Level Completed!</h2>
              <p className="text-sm font-bold text-slate-500">
                You finished {selectedTopic.topic} - {selectedLevel.name}
              </p>
            </div>

            {/* Performance Stats Breakdown */}
            <Card className="grid grid-cols-3 gap-2 p-4 text-center">
              <div>
                <span className="text-xs font-black text-slate-400 uppercase">Correct</span>
                <p className="text-2xl font-black text-emerald-600">{levelCorrectCount}</p>
              </div>
              <div className="border-x border-slate-100">
                <span className="text-xs font-black text-slate-400 uppercase">XP Earned</span>
                <p className="text-2xl font-black text-purple-600">+{levelXpEarned}</p>
              </div>
              <div>
                <span className="text-xs font-black text-slate-400 uppercase">Streak</span>
                <p className="text-2xl font-black text-amber-600">{streak}</p>
              </div>
            </Card>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setCurrentScreen('levels')}
              >
                Continue to Levels
              </Button>
              <Button
                variant="outline"
                size="md"
                fullWidth
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={() => handleStartLevel(selectedLevel)}
              >
                Replay Level
              </Button>
            </div>
          </div>
        )}

        {/* SCREEN 6: LEADERBOARD & REWARDS */}
        {currentScreen === 'leaderboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Weekly Leaderboard</h1>
                <p className="text-xs font-bold text-slate-500">Resets every Monday at midnight</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentScreen('home')}>
                Back Home
              </Button>
            </div>

            {/* Leaderboard Ranks */}
            <Card className="p-0 overflow-hidden divide-y divide-slate-100">
              {[
                { rank: 1, name: 'Alex Johnson', xp: 540, streak: 12, isCurrent: false },
                { rank: 2, name: 'You (Cadet)', xp: xp || 380, streak: streak || 4, isCurrent: true },
                { rank: 3, name: 'Sarah Miller', xp: 320, streak: 5, isCurrent: false },
                { rank: 4, name: 'David Chen', xp: 210, streak: 2, isCurrent: false },
              ].map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center justify-between p-4 ${
                    user.isCurrent ? 'bg-sky-50 font-bold' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                        user.rank === 1
                          ? 'bg-amber-400 text-amber-950'
                          : user.rank === 2
                          ? 'bg-slate-300 text-slate-800'
                          : 'bg-amber-600/30 text-amber-900'
                      }`}
                    >
                      {user.rank}
                    </span>
                    <span className="font-extrabold text-sm text-slate-800">{user.name}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="flex items-center gap-1 text-amber-600">
                      <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                      {user.streak}
                    </span>
                    <span className="text-purple-600">{user.xp} XP</span>
                  </div>
                </div>
              ))}
            </Card>

            {/* Achievements Section */}
            <div className="space-y-3 pt-4">
              <h3 className="font-black text-base text-slate-800">Earned Achievements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {initialQuizData.game_mechanics.rewards_and_achievements.map((ach, idx) => (
                  <Card key={idx} className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">{ach.name}</h4>
                      <p className="text-xs text-slate-500">{ach.condition}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

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
