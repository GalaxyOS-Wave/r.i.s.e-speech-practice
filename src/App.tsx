import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SpeechWorkspace } from './components/SpeechWorkspace';
import { PracticeMode } from './components/PracticeMode';
import { Profile } from './components/Profile';
import { Auth } from './components/Auth';
import { Layers, BookOpen, Trophy, Award, Flame, Sparkles, LogOut, Menu, X, Loader2 } from 'lucide-react';
const goldenCrest = '/src/assets/images/r.i.s.e.png';

function AppContent() {
  const { user, activeView, setView, logout, loading } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-[#130726] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 text-purple-500 animate-spin mx-auto" />
          <p className="font-mono text-xs text-purple-400">Contacting Golden Orator Node...</p>
        </div>
      </main>
    );
  }

  // If user is not authenticated, lock into Auth flow
  if (!user) {
    return (
      <main className="min-h-screen bg-[#601da8] text-slate-100 flex flex-col justify-between selection:bg-purple-500/30 selection:text-white">
        <Auth />
        <footer className="py-6 border-t border-purple-500/10 bg-black/80 text-center font-mono text-[9px] text-white-600">
          R.I.S.E v1-(beta)  — Designed by Cadenx Company.
        </footer>
      </main>
    );
  }

  // XP level up progress
  const xpiInCurrentLevel = user.xp % 500;
  const xpPercent = Math.min(100, Math.round((xpiInCurrentLevel / 500) * 100));

  const navItems = [
    { id: 'dashboard', label: 'Speech Library', icon: Layers, description: 'Overview & stats' },
    { id: 'workspace', label: 'Speech Workspace', icon: BookOpen, description: 'Write & edit' },
    { id: 'profile', label: 'Dashboard', icon: Award, description: 'Achievements' },
  ];

  return (
    <div className="min-h-screen bg-[#130726] text-[#f8fafc] flex flex-col md:flex-row selection:bg-gold-500/30 selection:text-white">
      
      {/* PERSISTENT SIDEBAR - SLEEK GOLD & OBSIDIAN THEME (DESKTOP) */}
      <aside className="hidden md:flex w-64 flex-shrink-0 bg-[#0c0c0e] border-r border-purple-500/10 flex-col justify-between p-6">
        <div>
          {/* Logo Brand with Majestic Gold Picture Emblem */}
          <div 
            onClick={() => setView('dashboard')} 
            className="flex cursor-pointer items-center space-x-3 mb-8 hover:opacity-90 transition-opacity"
          >
            <div className="relative h-11 w-11 flex items-center justify-center rounded-xl bg-black border border-purple-500/30 overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <img 
                src={goldenCrest} 
                alt="Golden Crest" 
                className="h-full w-full object-cover p-0.5 scale-110" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-display font-semibold text-base tracking-widest text-[#5e3d94] block leading-none">
                R.I.S.E
              </span>
              <span className="font-cursive text-xs text-gold-400 italic font-light tracking-wide block mt-0.5">
                Golden Alignment
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id || (item.id === 'workspace' && activeView === 'edit');
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center space-x-3 rounded-lg px-3 py-2.5 text-xs font-medium tracking-wide transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 text-black font-bold shadow-[0_2px_15px_rgba(212,175,55,0.25)]'
                      : 'text-gray-400 hover:bg-gold-500/5 hover:text-gold-200'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <div className="text-left">
                    <span className="block">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer with Gamified Stats */}
        <div className="space-y-4 pt-4 border-t border-gold-500/10">
          {/* Streak details */}
          <div className="bg-black/50 border border-gold-500/10 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1.5">
              <Flame className="h-4 w-4 fill-gold-500 text-gold-500 animate-pulse" />
              <span className="font-mono text-xs font-bold text-gold-400">{user.streak} Days Streak</span>
            </div>
            <p className="text-[10px] text-gray-500 font-cursive leading-tight">Keep speaking daily to secure elite match multipliers.</p>
          </div>

          {/* XP details */}
          <div className="space-y-1 bg-black/30 border border-gold-500/10 rounded-lg p-3">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-mono text-gray-400 font-bold">Orator Level {user.level}</span>
              <span className="font-mono text-gold-400">{user.xp} XP</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-gold-500 to-gold-700 transition-all duration-500" 
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <p className="text-[9px] text-gray-500 text-right font-mono">{500 - xpiInCurrentLevel} XP to ascension</p>
          </div>

          {/* Log Out button */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <span>Leave Chamber</span>
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER BAR */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0d0d0e] border-b border-gold-500/10">
        <div className="flex items-center space-x-2">
          <div className="relative h-8 w-8 flex items-center justify-center rounded-lg bg-black border border-gold-500/30 overflow-hidden">
            <img 
              src={goldenCrest} 
              alt="Golden Crest" 
              className="h-full w-full object-cover p-0.5" 
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-display font-semibold text-sm tracking-widest text-[#e6c387]">R.I.S.E.</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gold-500/10 py-0.5 px-2 rounded-full border border-gold-500/20">
            <Flame className="h-3 w-3 text-gold-500 fill-gold-500" />
            <span className="text-[10px] text-gold-400 font-bold font-mono">{user.streak}D</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV DROPDOWN PANEL */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0c0e] border-b border-gold-500/10 py-3 px-4 space-y-2 animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id || (item.id === 'workspace' && activeView === 'edit');
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isActive ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-black font-bold' : 'text-gray-400 hover:bg-gold-500/5'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="border-t border-gold-500/10 pt-2 flex justify-between items-center text-xs">
            <span className="text-gray-400 font-mono">Level {user.level} ({user.xp} XP)</span>
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="text-red-400 hover:text-red-300 font-semibold"
            >
              Leave Chamber
            </button>
          </div>
        </div>
      )}

      {/* PRIMARY APP WORKSPACE AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#050505] overflow-y-auto">
        {/* Sleek Header displaying Contextual Title, User Score, XP */}
        <Header />

        {/* Core dynamic views inside grid */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-6xl w-full mx-auto">
          {activeView === 'dashboard' && <Dashboard />}
          {activeView === 'workspace' && <SpeechWorkspace />}
          {activeView === 'practice' && <PracticeMode />}
          {activeView === 'profile' && <Profile />}
        </main>

        {/* Footnotes */}
        <footer className="py-6 px-4 md:px-8 border-t border-gold-500/10 text-center md:flex md:items-center md:justify-between text-[10px] text-gray-500 font-mono">
          <span>
            © 2026 Cadenx Company. Cadenx Speech Alignment Core v2.4 initialized.
          </span>
          <span className="mt-1 block md:mt-0 text-gold-400 font-cursive text-xs">
            Imperial Alignment / calibrated & secure
          </span>
        </footer>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

