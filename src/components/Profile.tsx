import React from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../types';
import * as LucideIcons from 'lucide-react';

const DEFAULT_BADGES_LIST: Badge[] = [
  { id: 'b1', name: 'First Ascent', description: 'Complete your first practice session.', icon: 'Mic' },
  { id: 'b2', name: 'Zen Alignment', description: 'Achieve a Self-Awareness score match of under 1.1 margin.', icon: 'CheckCircle2' },
  { id: 'b3', name: 'Pace Master', description: 'Maintain optimal talking speed (130-150 WPM) in Pitch category.', icon: 'Timer' },
  { id: 'b4', name: 'Rhetoric Titan', description: 'Write or practice a speech spanning over 500 words.', icon: 'BookOpen' },
  { id: 'b5', name: 'Streak Legend', description: 'Maintain a speaking streak of 5 consecutive days.', icon: 'Flame' },
  { id: 'b6', name: 'Perfect Cohesion', description: 'Three self-awareness matches in a row.', icon: 'Sparkles' },
];

export const Profile: React.FC = () => {
  const { user } = useApp();

  if (!user) return null;

  // Level Up progress indicator
  const currentLevelXp = user.xp % 500;
  const xpPercent = Math.min(100, Math.round((currentLevelXp / 500) * 100));

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      
      {/* Profile Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gold-500/10 pb-6">
        <div className="flex items-center space-x-4">
          
          {/* Main big profile badge orb */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-500 to-gold-700 font-display text-xl font-bold text-black shadow-[0_0_25px_rgba(212,175,55,0.35)] border border-gold-400/30">
            {user.name.substring(0, 2).toUpperCase()}
          </div>

          <div>
            <h1 className="font-display text-lg tracking-wider font-semibold text-white uppercase">{user.name}</h1>
            <p className="font-mono text-[10px] text-gold-500 font-semibold uppercase">{user.email}</p>
            <div className="mt-1 flex items-center space-x-2">
              <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/15">
                Level {user.level} Orator
              </span>
              <span className="text-3xs font-mono text-gray-500 uppercase tracking-wider font-semibold">
                {user.xp} Total XP
              </span>
            </div>
          </div>

        </div>

        {/* Level Progress visual in header */}
        <div className="w-full sm:max-w-xs space-y-1.5 bg-[#0c0c0e] p-4 rounded-xl border border-gold-500/10 shadow">
          <div className="flex items-center justify-between text-3xs font-mono text-gold-400 font-semibold uppercase tracking-wider">
            <span>XP calibration</span>
            <span>{currentLevelXp} / 500 XP</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-gold-950">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 transition-all duration-700"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <span className="block text-right font-mono text-[9px] text-gray-500 uppercase tracking-widest">
            {500 - currentLevelXp} XP to Level {user.level + 1}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        
        <div className="rounded-xl border border-gold-500/10 bg-[#0c0c0e] p-5 text-center hover:border-gold-500/25 transition-all shadow-sm">
          <span className="block font-display text-[9px] uppercase tracking-widest text-gold-400 font-semibold pb-1 border-b border-gold-500/5">Blueprints Drafted</span>
          <span className="mt-3 block font-display text-2xl font-bold text-white">{user.totalSpeechesCount}</span>
          <p className="mt-1.5 text-3xs text-gray-400 leading-normal font-cursive">Manuscripts cataloged within core safe storage.</p>
        </div>

        <div className="rounded-xl border border-gold-500/10 bg-[#0c0c0e] p-5 text-center hover:border-gold-500/25 transition-all shadow-sm">
          <span className="block font-display text-[9px] uppercase tracking-widest text-gold-400 font-semibold pb-1 border-b border-gold-500/5">Rehearsal Airtime</span>
          <span className="mt-3 block font-display text-2xl font-bold text-white">
            {Math.floor(user.totalPracticeDuration / 60)}m {user.totalPracticeDuration % 60}s
          </span>
          <p className="mt-1.5 text-3xs text-gray-400 leading-normal font-cursive">Accrued speech logs inside raw prompter session.</p>
        </div>

        <div className="rounded-xl border border-gold-500/10 bg-[#0c0c0e] p-5 text-center hover:border-gold-500/25 transition-all shadow-sm">
          <span className="block font-display text-[9px] uppercase tracking-widest text-gold-400 font-semibold pb-1 border-b border-gold-500/5">Pacing Alignment</span>
          <span className="mt-3 block font-display text-2xl font-bold text-gold-400">{user.matchRate}%</span>
          <p className="mt-1.5 text-3xs text-gray-400 leading-normal font-cursive">Metacognitive calibration rating overall balance.</p>
        </div>

      </div>

      {/* Badges and Trophies (The Gamification Heart) */}
      <div className="space-y-4">
        
        <div className="flex items-center space-x-2 border-b border-gold-500/10 pb-2.5">
          <LucideIcons.Award className="h-4 w-4 text-gold-400" />
          <h2 className="font-display text-sm uppercase tracking-wider font-semibold text-white">Imperial Achievements</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEFAULT_BADGES_LIST.map((defaultBadge) => {
            // Check if user has unlocked this badge
            const userUnlock = user.badges.find((b) => b.id === defaultBadge.id);
            const isUnlocked = !!userUnlock;

            // Dynamically fetch icon component
            const iconName = defaultBadge.icon as keyof typeof LucideIcons;
            const IconComponent = (LucideIcons[iconName] as React.ComponentType<any>) || LucideIcons.Award;

            return (
              <div 
                key={defaultBadge.id}
                className={`flex items-start space-x-3.5 rounded-xl border p-4 transition-all ${
                  isUnlocked 
                    ? 'border-gold-500/15 bg-[#0c0c0e] shadow-md' 
                    : 'border-white/5 bg-[#0c0c0e]/30 opacity-40'
                }`}
              >
                
                {/* Badge Orb Icon */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                  isUnlocked 
                    ? 'bg-gradient-to-tr from-gold-600 via-gold-50 to-gold-700 text-black border-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                    : 'bg-white/5 border-white/5 text-gray-650'
                }`}>
                  <IconComponent className="h-5 w-5" />
                </div>

                <div>
                  <h4 className={`font-sans text-xs font-bold ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                    {defaultBadge.name}
                  </h4>
                  <p className="mt-0.5 text-3xs text-gray-400 leading-normal font-cursive">
                    {defaultBadge.description}
                  </p>
                  
                  {isUnlocked ? (
                    <span className="mt-2 inline-block font-mono text-[9px] text-gold-400 font-semibold uppercase tracking-widest">
                      Unlocked {new Date(userUnlock.unlockedAt || '').toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="mt-2 inline-block font-mono text-[9px] text-gray-600 uppercase tracking-widest">
                      Locked
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Speaking History Analytics Section */}
      <div className="space-y-4 rounded-2xl border border-gold-500/10 bg-[#0c0c0e] p-6 shadow">
        <h3 className="font-display text-3xs font-semibold uppercase tracking-widest text-[#e6c387] border-b border-gold-500/10 pb-2">
          Competency Guidelines
        </h3>

        <p className="text-2xs text-gray-400 leading-relaxed max-w-2xl font-cursive">
          R.I.S.E measures metric parameters across category focus areas. Continue practicing in storytelling segments or entrepreneur lobbies to optimize your comprehensive vocal delivery and confidence rates.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 text-2xs font-mono">
          <div className="rounded bg-gold-500/5 p-3 space-y-1 border border-gold-500/5">
            <span className="text-gold-400 font-bold uppercase tracking-wider text-[10px] block">Optimal Pacing Standard</span>
            <p className="text-[#94a3b8] font-cursive">Pitch category optimal WPM sits at 130-165. Storytelling prefers slightly measured spacing (110-145 WPM).</p>
          </div>
          <div className="rounded bg-gold-500/5 p-3 space-y-1 border border-gold-500/5">
            <span className="text-gold-400 font-bold uppercase tracking-wider text-[10px] block">Calibration Balance Goal</span>
            <p className="text-[#94a3b8] font-cursive">Review system scores closely. The tighter your overall variance is maintained, the higher your alignment rating scales.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
