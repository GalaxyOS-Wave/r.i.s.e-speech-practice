import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Trophy, Award, User, Sparkles, Layers, BookOpen, Clock } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, activeView } = useApp();

  if (!user) return null;

  // Derive title & description based on current view
  let titlePlaceholder = "Orator Library";
  let descPlaceholder = "Welcome to R.I.S.E. Speech Alignment Chamber";
  
  switch(activeView) {
    case 'dashboard':
      titlePlaceholder = "R.I.S.E Library & Vault";
      descPlaceholder = "Review majestic speaking metrics, past runs, and manage speech blueprints";
      break;
    case 'workspace':
    case 'edit':
      titlePlaceholder = "Speech Sanctum";
      descPlaceholder = "Draft and refine pristine speeches, assign delivery speeds, or load template blueprints";
      break;
    case 'practice':
      titlePlaceholder = "Practice & Teleprompter";
      descPlaceholder = "Rehearse with real-time golden ratio pace monitoring and fluid timing guidelines";
      break;
    case 'profile':
      titlePlaceholder = "Master Profile & Seals";
      descPlaceholder = "Analyze category badges, milestone accomplishments, and user streaks";
      break;
    default:
      titlePlaceholder = "R.I.S.E Cabinet";
      descPlaceholder = "Premium Orator Coach & Calibration Engine";
  }

  return (
    <header className="h-20 flex items-center justify-between px-6 md:px-8 bg-black border-b border-gold-500/10 w-full shadow-md">
      {/* Title & Description Context */}
      <div>
        <h1 className="text-base md:text-lg font-display tracking-wider font-semibold text-[#e6c387] flex items-center gap-2">
          {titlePlaceholder}
        </h1>
        <p className="hidden sm:block text-[10px] text-gray-400 font-cursive tracking-wider mt-0.5">
          {descPlaceholder}
        </p>
      </div>

      {/* Mini Profile Status */}
      <div className="flex items-center gap-4">
        {/* Quick Active session status indicator */}
        <div className="hidden lg:flex items-center gap-2 text-2xs text-gold-400 font-mono bg-gold-500/5 py-1 px-3.5 rounded-full border border-gold-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
          <span>Working Status : SERVERS WORKING</span>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-3 border-l border-gold-500/10">
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-semibold text-[#fbf5df] leading-tight">{user.name || 'User'}</span>
            <span className="block text-[10px] text-gold-600 font-mono">Guild ID #{user.level * 107 + 1012}</span>
          </div>
          <div className="h-8 w-8 rounded-lg bg-black border border-gold-500/20 flex items-center justify-center text-xs text-gold-400 font-display font-bold shadow-[0_0_10px_rgba(212,175,55,0.1)] animate-fade-in">
            {(user.name || 'User').substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

