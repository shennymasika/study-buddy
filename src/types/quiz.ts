export interface Option {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface Question {
  id?: string;
  topic: string;
  level: number;
  question: string;
  options: Option[];
  answer: string;
  explanation: string;
}

export interface LevelInfo {
  level: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question_ids: string[];
}

export interface Topic {
  topic: string;
  description: string;
  key_terms: string[];
  levels: LevelInfo[];
}

export interface ProgressionRules {
  levels_per_topic: number;
  difficulty_order: ('easy' | 'medium' | 'hard')[];
  unlock_rule: string;
  completion_rule: string;
  replay_rule: string;
}

export interface ExperiencePoints {
  easy_correct: number;
  medium_correct: number;
  hard_correct: number;
  incorrect_answer: number;
  level_completion_bonus: number;
  topic_completion_bonus: number;
  streak_bonus: {
    trigger: string;
    points: number;
  };
}

export interface StreakRules {
  definition: string;
  increment: string;
  reset: string;
  bonus: string;
  daily_streak: string;
  streak_protection: string;
}

export interface HeartsAndLives {
  starting_hearts: number;
  maximum_hearts: number;
  correct_answer: string;
  incorrect_answer: string;
  zero_hearts: string;
  recovery: string;
  full_recovery: string;
  optional_reward: string;
}

export interface Achievement {
  name: string;
  condition: string;
  icon?: string;
  unlocked?: boolean;
}

export interface GameMechanics {
  progression: ProgressionRules;
  experience_points: ExperiencePoints;
  streak_rules: StreakRules;
  hearts_and_lives: HeartsAndLives;
  leaderboard: {
    types: string[];
    ranking_metric: string;
    tie_breaker: string;
    reset_schedule: string;
    rewards: Record<string, string>;
  };
  rewards_and_achievements: Achievement[];
}

export interface UserFlowStep {
  step: number;
  screen: string;
  purpose: string;
  elements: string[];
  behavior?: string[];
  next?: string;
}

export interface QuizData {
  app_name: string;
  version: string;
  topics: Topic[];
  questions: Question[];
  game_mechanics: GameMechanics;
  user_flow: UserFlowStep[];
}

export type QuizAnswerState = 'idle' | 'selected' | 'correct' | 'incorrect';

export interface PlayerStats {
  hearts: number;
  maxHearts: number;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  dailyStreak: number;
  completedTopics: string[];
  completedLevels: Record<string, number[]>; // topic -> completed level numbers
}
