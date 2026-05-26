import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signInAnonymously, signOut } from 'firebase/auth';
import { Speech, SpeechCategory, PracticeSession, UserProfile, LeaderboardEntry, Badge, SelfEvaluation, SystemEvaluation } from '../types';
import { auth, googleProvider, testConnection } from '../lib/firebase';
import {
  fetchUserProfile,
  createUserProfile,
  updateUserProfileInDb,
  fetchUserSpeeches,
  addSpeechToDb,
  updateSpeechInDb,
  deleteSpeechFromDb,
  fetchUserSessions,
  addSessionToDb
} from '../lib/db';

interface AppContextProps {
  user: UserProfile | null;
  speeches: Speech[];
  recentSessions: PracticeSession[];
  leaderboard: LeaderboardEntry[];
  currentSpeechToPractice: Speech | null;
  activeView: string;
  isEditingSpeechId: string | null;
  loading: boolean;
  setView: (view: string) => void;
  setEditingSpeechId: (id: string | null) => void;
  loadSpeechForPractice: (speech: Speech | null) => void;
  addSpeech: (title: string, category: SpeechCategory, content: string) => Promise<Speech>;
  updateSpeech: (id: string, updates: Partial<Speech>) => Promise<void>;
  deleteSpeech: (id: string) => Promise<void>;
  calculateSystemScore: (wordCount: number, durationSeconds: number, category: SpeechCategory) => SystemEvaluation;
  savePracticeSession: (speechId: string, durationSeconds: number, selfEval: SelfEvaluation) => Promise<PracticeSession>;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const DEFAULT_BADGES: Badge[] = [
  { id: 'b1', name: 'First Ascent', description: 'Complete your first practice session.', icon: 'Mic' },
  { id: 'b2', name: 'Zen Alignment', description: 'Achieve a Self-Awareness score match of under 1.5 margin.', icon: 'CheckCircle2' },
  { id: 'b3', name: 'Pace Master', description: 'Maintain optimal talking speed (130-150 WPM) in Pitch category.', icon: 'Timer' },
  { id: 'b4', name: 'Rhetoric Titan', description: 'Write or practice a speech spanning over 300 words.', icon: 'BookOpen' },
  { id: 'b5', name: 'Streak Legend', description: 'Maintain a speaking streak of 5 consecutive days.', icon: 'Flame' },
  { id: 'b6', name: 'Perfect Cohesion', description: 'Three self-awareness matches in a row.', icon: 'Sparkles' },
];

const INITIAL_MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'bot1', name: 'Eleanor Vance (St Andrews Principal)', avatar: 'EV', xp: 3200, level: 7, matchRate: 98 },
  { id: 'bot2', name: 'Julian Drake (Debate Coach)', avatar: 'JD', xp: 2850, level: 6, matchRate: 94 },
  { id: 'bot3', name: 'Marcus K. (Fintech Pitcher)', avatar: 'MK', xp: 2200, level: 5, matchRate: 92 },
  { id: 'bot4', name: 'Siddharth Roy (TEDx Alumni)', avatar: 'SR', xp: 1950, level: 4, matchRate: 88 },
  { id: 'bot5', name: 'Sienna Sterling (Storyteller)', avatar: 'SS', xp: 950, level: 2, matchRate: 85 },
  { id: 'bot6', name: 'Amara Lopez (Interview Sprint)', avatar: 'AL', xp: 620, level: 2, matchRate: 81 },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [recentSessions, setRecentSessions] = useState<PracticeSession[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentSpeechToPractice, setCurrentSpeechToPractice] = useState<Speech | null>(null);
  const [activeView, setView] = useState<string>('dashboard');
  const [isEditingSpeechId, setEditingSpeechId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Validate connection on load
  useEffect(() => {
    testConnection();
  }, []);

  // Firebase Auth Lifecycle hook
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        try {
          // 1. Fetch user profile from Firestore or create it
          let profile = await fetchUserProfile(fbUser.uid);
          if (!profile) {
            profile = await createUserProfile(
              fbUser.uid, 
              fbUser.email || '', 
              fbUser.displayName || fbUser.email?.split('@')[0] || 'Orator'
            );
          }
          setUser(profile);

          // 2. Fetch Speeches & Sessions from Firestore
          const listSpeeches = await fetchUserSpeeches(fbUser.uid);
          setSpeeches(listSpeeches);

          const listSessions = await fetchUserSessions(fbUser.uid);
          setRecentSessions(listSessions);

          // 3. Build Live Dynamic Leaderboard
          const userRankEntry: LeaderboardEntry = {
            id: fbUser.uid,
            name: `${profile.name} (You)`,
            avatar: profile.name.substring(0, 2).toUpperCase(),
            xp: profile.xp,
            level: profile.level,
            matchRate: profile.matchRate,
            isCurrentUser: true
          };

          const fullLeaderboard = [userRankEntry, ...INITIAL_MOCK_LEADERBOARD].sort((a, b) => b.xp - a.xp);
          setLeaderboard(fullLeaderboard);
          setView('dashboard');
        } catch (error) {
          console.error("Error setting up user session from Firebase:", error);
        }
      } else {
        setUser(null);
        setSpeeches([]);
        setRecentSessions([]);
        setLeaderboard(INITIAL_MOCK_LEADERBOARD);
        setView('dashboard');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Auth error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, name: string) => {
    try {
      setLoading(true);
      // We log in anonymously so we have an auth session, then we generate a firestore doc.
      const credential = await signInAnonymously(auth);
      const uid = credential.user.uid;
      
      // Force creation of specific name and email
      const profile = await createUserProfile(uid, email, name || 'Orator User');
      setUser(profile);
    } catch (error) {
      console.error("Email Fallback Auth error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSpeechForPractice = (speech: Speech | null) => {
    setCurrentSpeechToPractice(speech);
    if (speech) {
      setView('practice');
    }
  };

  const addSpeech = async (title: string, category: SpeechCategory, content: string) => {
    if (!user) throw new Error("User unauthorized");

    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const estimatedDuration = Math.ceil((words / 135) * 60);

    const newSpeech: Speech = {
      id: `s_${Date.now()}`,
      title: title || 'Untitled Speech',
      category: category,
      content: content,
      wordCount: words,
      estimatedDuration: estimatedDuration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to Firestore
    await addSpeechToDb(user.id, newSpeech);

    const updated = [newSpeech, ...speeches];
    setSpeeches(updated);

    // Update user speech count
    const updatedUser = {
      ...user,
      totalSpeechesCount: updated.length,
    };
    setUser(updatedUser);
    await updateUserProfileInDb(user.id, { totalSpeechesCount: updated.length });

    return newSpeech;
  };

  const updateSpeech = async (id: string, updates: Partial<Speech>) => {
    if (!user) throw new Error("User unauthorized");

    const updated = speeches.map((s) => {
      if (s.id === id) {
        const content = updates.content !== undefined ? updates.content : s.content;
        const words = content.trim().split(/\s+/).filter(Boolean).length;
        const estimatedDuration = Math.ceil((words / 135) * 60);
        return {
          ...s,
          ...updates,
          wordCount: words,
          estimatedDuration: estimatedDuration,
          updatedAt: new Date().toISOString(),
        };
      }
      return s;
    });
    setSpeeches(updated);

    // Save update to Database
    const matchedSpeech = updated.find(s => s.id === id);
    if (matchedSpeech) {
      await updateSpeechInDb(user.id, id, matchedSpeech);
    }
  };

  const deleteSpeech = async (id: string) => {
    if (!user) throw new Error("User unauthorized");

    const updated = speeches.filter((s) => s.id !== id);
    setSpeeches(updated);

    // Save delete to Database
    await deleteSpeechFromDb(user.id, id);

    const updatedUser = {
      ...user,
      totalSpeechesCount: updated.length,
    };
    setUser(updatedUser);
    await updateUserProfileInDb(user.id, { totalSpeechesCount: updated.length });
  };

  const calculateSystemScore = (
    wordCount: number,
    durationSeconds: number,
    category: SpeechCategory
  ): SystemEvaluation => {
    const wpm = durationSeconds > 0 ? (wordCount / durationSeconds) * 60 : 0;
    
    let targetWpmMin = 120;
    let targetWpmMax = 155;
    if (category === 'Elevator Pitch') {
      targetWpmMin = 130;
      targetWpmMax = 165;
    } else if (category === 'Storytelling') {
      targetWpmMin = 110;
      targetWpmMax = 145;
    }

    let tempo = 'Optimal Pace';
    let paceScore = 9.0;

    if (wpm < targetWpmMin) {
      tempo = 'Calm & Measured';
      const ratio = wpm / targetWpmMin;
      paceScore = Math.max(5.0, Number((9.0 * ratio).toFixed(1)));
    } else if (wpm > targetWpmMax) {
      tempo = 'Rapid / Expressive';
      const ratio = targetWpmMax / wpm;
      paceScore = Math.max(5.0, Number((9.0 * ratio).toFixed(1)));
    } else {
      paceScore = Number((8.8 + Math.random() * 1.2).toFixed(1));
    }

    const completionRatio = 100;
    const clarity = Number((paceScore + (Math.random() * 0.8 - 0.4)).toFixed(1));
    const fluency = Number((paceScore - (Math.random() * 0.6 - 0.2)).toFixed(1));
    const energy = Number((7.5 + Math.random() * 2.3).toFixed(1));
    const confidence = Number((7.0 + Math.random() * 2.8).toFixed(1));
    const delivery = Number((clarity * 0.5 + fluency * 0.5 + Math.random() * 0.4).toFixed(1));
    
    const averageRaw = (clarity + fluency + energy + confidence + delivery) / 5;
    const overall = Number(averageRaw.toFixed(1));

    let engagementMetrics = 'High pacing alignment';
    if (wpm < 100) {
      engagementMetrics = 'Pacing is slightly low; add dynamic storytelling pauses.';
    } else if (wpm > 180) {
      engagementMetrics = 'Highly accelerated timing; focus on pauses between points.';
    } else {
      engagementMetrics = 'Highly consistent tempo matching category standard.';
    }

    const currentStreak = user?.streak || 0;
    const streakBonus = Math.min(25, currentStreak * 5);

    return {
      confidence: Math.min(10, Math.max(1, confidence)),
      clarity: Math.min(10, Math.max(1, clarity)),
      fluency: Math.min(10, Math.max(1, fluency)),
      energy: Math.min(10, Math.max(1, energy)),
      delivery: Math.min(10, Math.max(1, delivery)),
      overall: Math.min(10, Math.max(1, overall)),
      metricsExplanation: {
        tempo,
        completionRatio,
        streakBonus,
        engagementMetrics,
        accuracyRate: 100
      }
    };
  };

  const savePracticeSession = async (
    speechId: string,
    durationSeconds: number,
    selfEval: SelfEvaluation
  ): Promise<PracticeSession> => {
    if (!user) throw new Error("User unauthorized");

    const parentSpeech = speeches.find((s) => s.id === speechId) || {
      title: 'Quick Practice Session',
      category: 'Public Speaking' as SpeechCategory,
      wordCount: 150
    };

    const systemEval = calculateSystemScore(
      parentSpeech.wordCount,
      durationSeconds,
      parentSpeech.category as SpeechCategory
    );

    const selfOverall = selfEval.overall;
    const sysOverall = systemEval.overall;
    const variance = Math.abs(selfOverall - sysOverall);
    
    const isMatched = variance <= 1.5;
    const matchAccuracyRate = Math.max(0, Math.round(100 - (variance / 10) * 100));
    systemEval.metricsExplanation.accuracyRate = matchAccuracyRate;

    let xpEarned = 50;
    if (isMatched) {
      xpEarned += 100;
    }
    if (systemEval.metricsExplanation.tempo === 'Optimal Pace') {
      xpEarned += 25;
    }

    const newSession: PracticeSession = {
      id: `ps_${Date.now()}`,
      speechId: speechId,
      speechTitle: parentSpeech.title,
      speechCategory: parentSpeech.category as SpeechCategory,
      durationSeconds: durationSeconds,
      completedAt: new Date().toISOString(),
      selfEvaluation: selfEval,
      systemEvaluation: systemEval,
      isMatched: isMatched,
      xpEarned: xpEarned,
    };

    // Save practice session to Database
    await addSessionToDb(user.id, newSession);

    const updatedSessions = [newSession, ...recentSessions];
    setRecentSessions(updatedSessions);

    // Update User parameters
    const nextStreak = user.streak === 0 ? 1 : user.streak + 1; // Safely increment streak
    const prevXp = user.xp;
    const nextXp = prevXp + xpEarned;
    const nextLevel = Math.floor(nextXp / 500) + 1;

    const completedSessionsWithMatches = updatedSessions.filter((s) => s.isMatched).length;
    const nextMatchRate = Math.round((completedSessionsWithMatches / updatedSessions.length) * 100);

    const updatedBadges = [...user.badges];
    
    // Zen Alignment badge
    if (isMatched && !updatedBadges.some((b) => b.id === 'b2')) {
      const b = DEFAULT_BADGES.find((badge) => badge.id === 'b2');
      if (b) updatedBadges.push({ ...b, unlockedAt: new Date().toISOString() });
    }
    // Pace Master badge
    if (systemEval.metricsExplanation.tempo === 'Optimal Pace' && parentSpeech.category === 'Elevator Pitch' && !updatedBadges.some((b) => b.id === 'b3')) {
      const b = DEFAULT_BADGES.find((badge) => badge.id === 'b3');
      if (b) updatedBadges.push({ ...b, unlockedAt: new Date().toISOString() });
    }
    // Rhetoric Titan badge
    if (parentSpeech.wordCount > 300 && !updatedBadges.some((b) => b.id === 'b4')) {
      const b = DEFAULT_BADGES.find((badge) => badge.id === 'b4');
      if (b) updatedBadges.push({ ...b, unlockedAt: new Date().toISOString() });
    }
    // Streak Legend badge
    if (nextStreak >= 5 && !updatedBadges.some((b) => b.id === 'b5')) {
      const b = DEFAULT_BADGES.find((badge) => badge.id === 'b5');
      if (b) updatedBadges.push({ ...b, unlockedAt: new Date().toISOString() });
    }
    // First Ascent badge
    if (!updatedBadges.some((b) => b.id === 'b1')) {
      const b = DEFAULT_BADGES.find((badge) => badge.id === 'b1');
      if (b) updatedBadges.push({ ...b, unlockedAt: new Date().toISOString() });
    }

    const updatedUser: UserProfile = {
      ...user,
      xp: nextXp,
      level: nextLevel,
      streak: nextStreak,
      lastPracticeDate: new Date().toISOString(),
      totalPracticeDuration: user.totalPracticeDuration + durationSeconds,
      matchRate: nextMatchRate,
      badges: updatedBadges,
    };

    setUser(updatedUser);
    
    // Save profile update to Firestore Database
    await updateUserProfileInDb(user.id, {
      xp: nextXp,
      level: nextLevel,
      streak: nextStreak,
      lastPracticeDate: new Date().toISOString(),
      totalPracticeDuration: user.totalPracticeDuration + durationSeconds,
      matchRate: nextMatchRate,
      badges: updatedBadges,
    });

    // Update leaderboard list
    const updatedLeaderboard = leaderboard.map((leader) => {
      if (leader.isCurrentUser) {
        return {
          ...leader,
          xp: nextXp,
          level: nextLevel,
          matchRate: nextMatchRate,
        };
      }
      return leader;
    });
    const sortedLeaderboard = [...updatedLeaderboard].sort((a,b) => b.xp - a.xp);
    setLeaderboard(sortedLeaderboard);

    return newSession;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        speeches,
        recentSessions,
        leaderboard,
        currentSpeechToPractice,
        activeView,
        isEditingSpeechId,
        loading,
        setView,
        setEditingSpeechId,
        loadSpeechForPractice,
        addSpeech,
        updateSpeech,
        deleteSpeech,
        calculateSystemScore,
        savePracticeSession,
        loginWithGoogle,
        loginWithEmail,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
