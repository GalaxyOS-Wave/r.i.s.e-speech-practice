import React from 'react';
import { useApp } from '../context/AppContext';
import { Play, FileText, Plus, Target, Flame, BadgeHelp, Award, ArrowRight, Activity, Calendar } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, speeches, recentSessions, setView, loadSpeechForPractice, setEditingSpeechId } = useApp();

  if (!user) return null;

  const handleCreateNew = () => {
    setEditingSpeechId(null);
    setView('workspace');
  };

  const currentLevelXp = user.xp % 500;
  const xpNeeded = 500 - currentLevelXp;

  // Static speaking quotes for entrepreneurs & debaters
  const QUOTES = [
    { text: "Conviction will always outperform raw rhetoric. Find your authentic pace.", author: "Cadenx Public Speaking Collective" },
    { text: "Your audience notices clarity 10x more than they notice your vocabulary length.", author: "Eleanor Vance, Debate Captain" },
    { text: "Storytelling is cognitive compression. Eliminate fillers to deliver clarity.", author: "Startup Pitch Book" }
  ];
  const activeQuote = QUOTES[Math.floor((new Date().getDate()) % QUOTES.length)];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Top Banner section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-wider text-[#e6c387] sm:text-3xl uppercase">
            Welcome, <span className="text-gold-gradient font-bold">{user.name}</span>
          </h1>
          <p className="mt-1 text-xs text-gray-400 sm:text-sm font-cursive tracking-wide">
            Speak with majestic presence. Calibrate your speech drafts in elite alignment.
          </p>
        </div>

        <button 
          onClick={handleCreateNew}
          className="group flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 px-5 py-2.5 text-xs font-bold text-black shadow-[0_4px_22px_rgba(212,175,55,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_30px_rgba(212,175,55,0.4)] cursor-pointer"
        >
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 text-black" />
          <span>Write Imperial Speech</span>
        </button>
      </div>

      {/* Hero Bento Statistics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Metric 1: Calibration Match accuracy percentage */}
        <div className="relative overflow-hidden rounded-xl border border-gold-500/15 bg-[#0c0c0e] p-5 shadow-lg transition-all hover:border-gold-500/30 group gold-glow-subtle">
          <div className="absolute top-0 right-0 h-24 w-24 bg-gold-500/5 blur-2xl rounded-full" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#e6c387] font-semibold">Self Alignment</span>
            <div className="rounded-lg bg-gold-500/10 p-2 text-gold-400 border border-gold-500/20">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="font-display text-4xl font-bold text-white">{user.matchRate}%</span>
            <span className="font-mono text-[9px] font-bold text-gold-400 bg-gold-500/15 px-2 py-0.5 rounded-full border border-gold-500/20">Calibrated</span>
          </div>
          <p className="mt-2 text-[10.5px] leading-relaxed text-gray-400">
            Precision of self-evaluation vs algorithmic system assessment. Represents optimal self-awareness.
          </p>
        </div>

        {/* Metric 2: Experience level progress */}
        <div className="relative overflow-hidden rounded-xl border border-gold-500/15 bg-[#0c0c0e] p-5 shadow-lg transition-all hover:border-gold-500/30 group gold-glow-subtle">
          <div className="absolute top-0 right-0 h-24 w-24 bg-gold-500/5 blur-2xl rounded-full" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#e6c387] font-semibold">Imperial Rank</span>
            <div className="rounded-lg bg-gold-500/10 p-2 text-gold-400 border border-gold-500/20">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="font-display text-3xl font-bold text-gold-200">Tier {user.level}</span>
            <span className="font-mono text-[9px] text-gold-500 font-semibold bg-gold-500/10 px-2 py-0.5 rounded-full border border-gold-500/10">({user.xp} Total XP)</span>
          </div>
          <p className="mt-2 text-[10.5px] text-gray-400">
            Ascend tiers, streaks and matches. Next tier ascension requires <span className="font-bold text-gold-400 font-mono">{xpNeeded} XP</span>.
          </p>
        </div>

        {/* Metric 3: Active Day Practice Streaks */}
        <div className="relative overflow-hidden rounded-xl border border-gold-500/15 bg-[#0c0c0e] p-5 shadow-lg transition-all hover:border-gold-500/30 group gold-glow-subtle">
          <div className="absolute top-0 right-0 h-24 w-24 bg-gold-500/5 blur-2xl rounded-full" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#e6c387] font-semibold">Streak Record</span>
            <div className="rounded-lg bg-gold-500/10 p-2 text-gold-400 border border-gold-500/20">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="font-display text-3xl font-bold text-white">{user.streak} Total Practices</span>
            <span className="font-mono text-[9px] font-bold text-gold-400 bg-gold-500/15 px-2 py-0.5 rounded-full border border-gold-500/20 animate-pulse">Imperial Medal</span>
          </div>
          <p className="mt-2 text-[10.5px] text-gray-400">
            Rehearse speeches daily to capture and double your gold alignment multiplier rewards.
          </p>
        </div>

        {/* Metric 4: Direct Activity Duration */}
        <div className="relative overflow-hidden rounded-xl border border-gold-500/15 bg-[#0c0c0e] p-5 shadow-lg transition-all hover:border-gold-500/30 group gold-glow-subtle">
          <div className="absolute top-0 right-0 h-24 w-24 bg-gold-500/5 blur-2xl rounded-full" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#e6c387] font-semibold">Rehearsal Time</span>
            <div className="rounded-lg bg-gold-500/10 p-2 text-gold-400 border border-gold-500/20">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="font-display text-3xl font-bold text-white">
              {Math.floor(user.totalPracticeDuration / 60)}m {user.totalPracticeDuration % 60}s
            </span>
          </div>
          <p className="mt-2 text-[10.5px] text-gray-400">
            Cumulative speaking clock spent on physical vocal training & target speed alignment.
          </p>
        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column (2 cols wide): Speeches & Practice logs */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gold-400" />
              <h2 className="font-display text-base tracking-widest font-semibold text-[#e6c387]">Speaking Blueprints</h2>
            </div>
            <span className="font-mono text-[10px] text-gold-500 uppercase tracking-widest font-semibold">
              {speeches.length} Active Manuscripts
            </span>
          </div>

          {speeches.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gold-500/20 bg-black/40 py-12 text-center">
              <Plus className="mx-auto h-8 w-8 text-gold-600/50" />
              <p className="mt-2 text-xs font-semibold text-gold-400 font-display uppercase tracking-widest">No speaking blueprints found</p>
              <p className="mt-1 text-xs text-gray-500 font-cursive">Create your first speech draft in the Speech Sanctum to practice.</p>
              <button
                onClick={handleCreateNew}
                className="mt-4 inline-flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-gold-600 to-gold-500 px-4 py-2 text-xs font-bold text-black"
              >
                <span>Write Draft</span>
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {speeches.map((speech) => (
                <div 
                  key={speech.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-gold-500/10 bg-[#0c0c0e] p-5 shadow-lg transition-all hover:border-gold-500/30"
                >
                  <div>
                    {/* Category pill */}
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] rounded-full bg-gold-500/5 px-2.5 py-0.5 font-mono text-gold-300 border border-gold-500/10">
                        {speech.category}
                      </span>
                      <span className="font-mono text-[10px] text-gold-600 font-medium">
                        ~{speech.estimatedDuration}s pace
                      </span>
                    </div>

                    <h3 className="mt-3 font-sans text-sm font-semibold text-white transition-colors group-hover:text-gold-400">
                      {speech.title}
                    </h3>
                    
                    <p className="mt-1.5 line-clamp-2 text-2xs text-gray-500 font-cursive leading-normal">
                      {speech.content}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gold-500/10 pt-3">
                    <span className="font-mono text-[10px] text-gold-600 font-medium">
                      {speech.wordCount} Words
                    </span>

                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setEditingSpeechId(speech.id);
                          setView('workspace');
                        }}
                        className="rounded-lg bg-gold-500/5 border border-gold-500/10 px-2.5 py-1 text-2xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-black transition-colors"
                      >
                        Edit
                      </button>
                      
                      <button 
                        onClick={() => loadSpeechForPractice(speech)}
                        className="flex items-center space-x-1 rounded-lg bg-gold-500/10 border border-gold-500/20 px-2.5 py-1 text-2xs font-bold text-gold-400 hover:bg-gradient-to-r hover:from-gold-600 hover:to-gold-500 hover:text-black hover:border-transparent transition-all"
                      >
                        <Play className="h-3 w-3 fill-current text-gold-500 group-hover:text-black" />
                        <span>Practice</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Alignment and Calibration Guide Info Box */}
          <div className="rounded-xl border border-gold-500/10 bg-[#0c0c0e]/60 p-5 shadow-inner">
            <div className="flex space-x-3.5">
              <div className="rounded-lg bg-gold-500/5 p-2.5 h-max text-gold-400 border border-gold-500/20">
                <BadgeHelp className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-xs tracking-wider font-semibold text-[#e6c387]">How the Alignment Score works:</h4>
                <p className="mt-1.5 text-2xs text-gray-400 leading-relaxed font-cursive">
                  R.I.S.E analyzes your speaking cadence, target timing, category benchmarks, and practice consistency. Post-practice, you rate your delivery clarity and impact. A narrow evaluation match confirms master public speaking alignment, granting a <strong className="text-gold-400">+100 XP Golden Alignment bonus</strong>.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right column (1 col wide): Streak and Recent activity log */}
        <div className="space-y-6">
          
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-gold-400" />
            <h2 className="font-display text-base tracking-widest font-semibold text-[#e6c387]">Calibration Ledger</h2>
          </div>

          {/* Daily speaking wisdom */}
          <div className="rounded-xl border border-gold-500/15 bg-[#0c0c0e]/80 p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700" />
            <div className="flex items-center space-x-2 text-gold-400">
              <Calendar className="h-3.5 w-3.5" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest">Imperial Voice Mandates</span>
            </div>
            <p className="mt-3.5 font-serif text-[12.5px] italic leading-relaxed text-gold-100 font-light">
              "{activeQuote.text}"
            </p>
            <span className="mt-2 block font-mono text-[9px] text-gold-600 tracking-wider">
              — {activeQuote.author}
            </span>
          </div>

          {/* Recent sessions log list */}
          <div className="space-y-3">
            <span className="font-mono text-[9px] text-[#e6c387] uppercase tracking-widest font-semibold block">
              Historical Calibration Record
            </span>

            {recentSessions.length === 0 ? (
              <p className="text-center text-xs text-gray-600 py-6 font-cursive">No speak calibration history registered yet.</p>
            ) : (
              <div className="space-y-2">
                {recentSessions.map((session) => (
                  <div 
                    key={session.id}
                    className="flex flex-col rounded-xl border border-gold-500/10 bg-[#0c0c0e] p-3 text-xs hover:border-gold-500/20 transition-all shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-semibold text-white truncate max-w-[130px]">
                        {session.speechTitle}
                      </span>
                      <span className="font-mono text-[9px] text-gray-500">
                        {new Date(session.completedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="rounded bg-gold-500/5 border border-gold-500/15 px-1.5 py-0.5 font-mono text-[9px] text-gold-300">
                          Self: {session.selfEvaluation.overall}
                        </span>
                        <span className="rounded bg-gold-500/10 border border-gold-500/20 px-1.5 py-0.5 font-mono text-[9px] text-gold-400">
                          Sys: {session.systemEvaluation.overall}
                        </span>
                      </div>

                      {session.isMatched ? (
                        <span className="flex items-center space-x-1.5 font-display text-[9px] font-bold text-gold-400 tracking-wider uppercase">
                          <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
                          <span>Matched</span>
                        </span>
                      ) : (
                        <span className="font-sans text-[9px] text-gray-600 font-medium">
                          Mismatched
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t border-gold-500/10 pt-2 font-mono text-[9px] text-gold-600">
                      <span>{session.durationSeconds}s runtime</span>
                      <span className="text-[#fbf5df]">+{session.xpEarned} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>



        </div>
      </div>

    </div>
  );
};
