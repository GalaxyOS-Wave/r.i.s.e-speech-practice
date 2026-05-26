export type SpeechCategory =
  | 'Public Speaking'
  | 'Debate'
  | 'Elevator Pitch'
  | 'Storytelling'
  | 'Presentation'
  | 'Interview Practice';

export interface Speech {
  id: string;
  title: string;
  category: SpeechCategory;
  content: string;
  wordCount: number;
  estimatedDuration: number; // in seconds
  createdAt: string;
  updatedAt: string;
}

export interface SelfEvaluation {
  confidence: number;
  clarity: number;
  fluency: number;
  energy: number;
  delivery: number;
  overall: number;
}

export interface SystemEvaluation {
  confidence: number;
  clarity: number;
  fluency: number;
  energy: number;
  delivery: number;
  overall: number;
  metricsExplanation: {
    tempo: string; // "Calm & Measured" | "Optimal Pace" | "Rapid / Expressive"
    completionRatio: number; // 0 - 100%
    streakBonus: number;
    engagementMetrics: string; // "Highly consistent timing" | "High pacing alignment" | "Needs moderate pacing adjustments"
    accuracyRate: number; // 0 - 100% alignment
  };
}

export interface PracticeSession {
  id: string;
  speechId: string;
  speechTitle: string;
  speechCategory: SpeechCategory;
  durationSeconds: number;
  completedAt: string;
  selfEvaluation: SelfEvaluation;
  systemEvaluation: SystemEvaluation;
  isMatched: boolean; // alignment match
  xpEarned: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  matchRate: number; // User vs. System score alignment rating
  isCurrentUser?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  xp: number;
  level: number;
  streak: number;
  lastPracticeDate?: string;
  totalSpeechesCount: number;
  totalPracticeDuration: number; // cumulative seconds
  matchRate: number; // self-awareness matchup score percentage (how close overall they match with System score)
  badges: Badge[];
}
