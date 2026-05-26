import React, { useState } from 'react';
import { Speech, SelfEvaluation as ISelfEvaluation, PracticeSession } from '../types';
import { useApp } from '../context/AppContext';
import { Sparkles, Trophy, Shuffle, TrendingUp, CheckCircle, ArrowRight, Star, Compass, Flame, AlertCircle } from 'lucide-react';

interface SelfEvaluationProps {
  speech: Speech;
  durationSeconds: number;
  onCancel: () => void;
}

export const SelfEvaluation: React.FC<SelfEvaluationProps> = ({ speech, durationSeconds, onCancel }) => {
  const { savePracticeSession, setView } = useApp();

  const [scores, setScores] = useState<ISelfEvaluation>({
    confidence: 6,
    clarity: 7,
    fluency: 6,
    energy: 7,
    delivery: 6,
    overall: 6.5,
  } as any);

  const [overallScore, setOverallScore] = useState<number>(7);
  const [submitted, setSubmitted] = useState(false);
  const [sessionResult, setSessionResult] = useState<PracticeSession | null>(null);

  const handleScoreChange = (category: keyof ISelfEvaluation, value: number) => {
    setScores((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const calculateUserOverallAvg = () => {
    const avg = (scores.confidence + scores.clarity + scores.fluency + scores.energy + scores.delivery) / 5;
    return Number(avg.toFixed(1));
  };

  const handleSubmit = async () => {
    const userOverall = Number(overallScore.toFixed(1));
    const fullSelfEval: ISelfEvaluation = {
      confidence: scores.confidence,
      clarity: scores.clarity,
      fluency: scores.fluency,
      energy: scores.energy,
      delivery: scores.delivery,
      overall: userOverall,
    };

    try {
      const result = await savePracticeSession(speech.id, durationSeconds, fullSelfEval);
      setSessionResult(result);
      setSubmitted(true);
    } catch (err) {
      console.error("Error saving practice session:", err);
      alert("Failed to save your calibration data. Please try again.");
    }
  };

  if (submitted && sessionResult) {
    const sysOverall = sessionResult.systemEvaluation.overall;
    const userOverall = sessionResult.selfEvaluation.overall;
    const isMatched = sessionResult.isMatched;
    const variance = Math.abs(userOverall - sysOverall).toFixed(1);

    return (
      <div className="space-y-8 animate-fade-in py-4 max-w-4xl mx-auto pb-12">
        
        {/* Alignment State Header */}
        <div className="text-center space-y-3">
          <span className="font-display text-[9px] font-semibold tracking-widest text-[#e6c387] uppercase block">
            SESSION CALIBRATION ASSESSMENT
          </span>

          <h1 className="font-display text-xl sm:text-2xl tracking-wider font-semibold text-white uppercase">
            {isMatched ? (
              <span className="text-gold-gradient font-bold drop-shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                Self-Awareness Matched!
              </span>
            ) : (
              <span className="text-gray-300">
                Calibration Accomplished
              </span>
            )}
          </h1>

          <p className="mx-auto max-w-xl text-xs text-gray-400 font-cursive leading-relaxed">
            Imperial rehearsal for "<span className="text-gold-300 font-semibold font-sans">{speech.title}</span>" is complete. Below are the aligned telemetry comparisons.
          </p>
        </div>

        {/* Core Double Score Glassmorphic Showcase Card */}
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          
          {/* User Evaluated Screen */}
          <div className="p-6 rounded-2xl border border-gold-500/10 bg-[#0c0c0e] text-center relative overflow-hidden shadow-lg hover:border-gold-500/25 transition-colors">
            <div className="absolute top-0 right-0 h-24 w-24 bg-gold-500/5 blur-xl rounded-full" />
            
            <h3 className="font-display text-[9px] font-semibold tracking-widest text-gold-400 uppercase">
              Your Subjective Score
            </h3>
            
            <div className="mt-4 flex items-center justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/5 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                <span className="font-display text-4xl font-bold text-white">{userOverall}</span>
              </div>
            </div>

            <p className="mt-4 text-[10px] text-gold-300 font-cursive leading-relaxed max-w-[250px] mx-auto">
              Extracted from your manual evaluation across confidence metrics and vocal impact traits.
            </p>
          </div>

          {/* System Telemetry Screen */}
          <div className="p-6 rounded-2xl border border-gold-500/10 bg-[#0c0c0e] text-center relative overflow-hidden shadow-lg hover:border-gold-500/25 transition-colors">
            <div className="absolute top-0 right-0 h-24 w-24 bg-gold-500/5 blur-xl rounded-full" />
            
            <h3 className="font-display text-[9px] font-semibold tracking-widest text-gold-400 uppercase">
              Algorithmic Telemetry
            </h3>
            
            <div className="mt-4 flex items-center justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 shadow-[0_0_20px_rgba(212,175,55,0.2)] animate-pulse">
                <span className="font-display text-4xl font-bold text-white">{sysOverall}</span>
              </div>
            </div>

            <p className="mt-4 text-[10px] text-gold-300 font-cursive leading-relaxed max-w-[250px] mx-auto">
              Generated via speaking limits, timing, and category density indicators ({speech.wordCount} words / {durationSeconds}s).
            </p>
          </div>

        </div>

        {/* Match / Multiplier Gamification Box */}
        <div className="max-w-4xl mx-auto">
          {isMatched ? (
            <div className="rounded-xl border border-gold-500/20 bg-gold-500/5 p-6 text-center relative overflow-hidden shadow">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500/0 via-gold-500 to-gold-500/0" />
              
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 mb-3">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              
              <h2 className="font-display text-xs tracking-wider font-semibold text-gold-200 uppercase">
                Self-Awareness Match Calibrated (+100 XP Bonus)
              </h2>
              
              <p className="mt-1.5 text-[11px] text-gray-400 max-w-xl mx-auto leading-relaxed font-cursive">
                Magnificent! Your self-assessments correlate within <strong>{variance}</strong> points of the system parameters. Demonstrating flawless metacognition triggers Tier XP multipliers!
              </p>

              <div className="mt-4 flex justify-center gap-6 text-[10px] text-gold-500 font-mono font-semibold uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <Flame className="h-3.5 w-3.5 text-gold-500 animate-bounce" />
                  <span>Streak Untouched!</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-3.5 w-3.5 text-gold-500" />
                  <span>Calibration Medal Earned</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-gold-500/10 bg-black/40 p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/5 text-gold-400 border border-gold-500/15 mb-3">
                <AlertCircle className="h-5 w-5" />
              </div>
              
              <h2 className="font-display text-xs tracking-wider font-semibold text-[#e6c387] uppercase">
                Metacognitive Gap Detected
              </h2>
              
              <p className="mt-1.5 text-[11px] text-gray-500 max-w-xl mx-auto leading-relaxed font-cursive">
                Your subjective evaluation variance is <strong>{variance}</strong>. Practice matching the tempo benchmarks closely on your next manuscripts to unlock glorious gold multipliers.
              </p>
            </div>
          )}
        </div>

        {/* Detailed Comparative Category Breakdown List */}
        <div className="max-w-4xl mx-auto p-6 rounded-2xl border border-gold-500/10 bg-[#0c0c0e] space-y-5 shadow">
          <h3 className="font-display text-3xs font-semibold uppercase tracking-widest text-[#e6c387] border-b border-gold-500/10 pb-2.5">
            Metacognitive Category Breakdown
          </h3>

          <div className="space-y-4 font-mono text-2xs">
            {[
              { label: 'Clarity of Sound', user: sessionResult.selfEvaluation.clarity, sys: sessionResult.systemEvaluation.clarity },
              { label: 'Fluency & Pacing', user: sessionResult.selfEvaluation.fluency, sys: sessionResult.systemEvaluation.fluency },
              { label: 'Vocal Confidence', user: sessionResult.selfEvaluation.confidence, sys: sessionResult.systemEvaluation.confidence },
              { label: 'Engagement Energy', user: sessionResult.selfEvaluation.energy, sys: sessionResult.systemEvaluation.energy },
              { label: 'Delivery Integrity', user: sessionResult.selfEvaluation.delivery, sys: sessionResult.systemEvaluation.delivery },
            ].map((metric) => (
              <div key={metric.label} className="space-y-1.5 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-sans font-medium text-xs">{metric.label}</span>
                  <div className="flex space-x-3 text-[10px] font-semibold">
                    <span className="text-gold-300">You: {metric.user}/10</span>
                    <span className="text-gold-500">Sys: {metric.sys}/10</span>
                  </div>
                </div>

                {/* Comparative Double Slider visually drawn */}
                <div className="relative h-2 w-full bg-gold-500/10 rounded-full overflow-hidden">
                  {/* User scored fill */}
                  <div 
                    className="absolute top-0 left-0 h-1 bg-gold-500 transition-all"
                    style={{ width: `${metric.user * 10}%` }}
                  />
                  {/* System scored fill */}
                  <div 
                    className="absolute bottom-0 left-0 h-1 bg-gold-200/50 transition-all"
                    style={{ width: `${metric.sys * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gold-500/10 flex flex-col gap-2 font-sans text-2xs text-[#94a3b8] leading-relaxed">
            <p>
              <strong className="text-gold-400 font-display text-[9px] uppercase tracking-wider block mb-0.5">Vocal Pace Report:</strong> Pacing template holds speed at <span className="text-white font-bold font-sans">"{sessionResult.systemEvaluation.metricsExplanation.tempo}"</span>.
            </p>
            <p>
              <strong className="text-gold-400 font-display text-[9px] uppercase tracking-wider block mb-0.5">Calibration Notes:</strong> <span className="text-gray-450 font-cursive leading-normal inline-block mt-0.5">{sessionResult.systemEvaluation.metricsExplanation.engagementMetrics}</span>
            </p>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto">
          <button 
            onClick={() => setView('dashboard')}
            className="w-full h-11 flex items-center justify-center space-x-1.5 rounded-xl bg-gold-500/5 border border-gold-500/15 px-5 text-2xs font-bold text-gold-300 hover:bg-gold-500 hover:text-black transition-all cursor-pointer"
          >
            <span>Return Dashboard</span>
          </button>

          <button 
            onClick={() => setView('profile')}
            className="w-full h-11 flex items-center justify-center space-x-1.5 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 px-5 text-2xs font-bold text-black shadow-lg hover:opacity-95 transition-all cursor-pointer"
          >
            <span>View Master Profile</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Top section */}
      <div className="border-b border-gold-500/10 pb-4">
        <span className="font-display text-[9px] font-semibold tracking-widest text-gold-500 uppercase block mb-1">
          REHEARSAL ENDED METRIC INTEGRITY
        </span>
        <h1 className="font-display text-lg tracking-wider font-semibold text-white uppercase">
          Speaking Self Calibration
        </h1>
        <p className="text-xs text-gray-400 mt-1 font-cursive">
          Evaluate your performance parameters honestly. Self integrity unlocks golden calibration modifiers.
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-gold-500/10 bg-[#0c0c0e] space-y-6 shadow-xl">
        
        {/* Basic Practice duration indicator */}
        <div className="flex items-center justify-between bg-gold-500/5 border border-gold-500/10 rounded-xl p-3.5 text-2xs">
          <span className="text-gold-400 font-display tracking-wider uppercase font-semibold">Speaking Airtime</span>
          <span className="font-mono font-bold text-white">
            {Math.floor(durationSeconds / 60)}m {durationSeconds % 60}s
          </span>
        </div>

        {/* Multi Slider Form */}
        <div className="space-y-6">
          {[
            { id: 'confidence', label: 'Confidence & Poise', desc: 'Inner posture, vocal projections, and minimal filler intervals.' },
            { id: 'clarity', label: 'Vocal Clarity & Diction', desc: 'Precise consonant endings, clean articulation, and consistent speed intervals.' },
            { id: 'fluency', label: 'Rhythm & Cadence', desc: 'Smooth flow transitions, pacing breaks, avoiding sudden breaks.' },
            { id: 'energy', label: 'Vocal Energy & Pitch Modulation', desc: 'Sincere pitch fluctuation appropriate for entrepreneurial pitches or formal statecraft.' },
            { id: 'delivery', label: 'Manuscript Mastery', desc: 'Unified articulation under target speech duration constraints.' },
          ].map((item) => (
            <div key={item.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans text-xs font-bold text-white">{item.label}</h3>
                  <p className="text-[10px] text-gray-450 leading-normal max-w-sm sm:max-w-md font-cursive">{item.desc}</p>
                </div>
                <span className="font-mono text-sm font-bold text-gold-400 w-12 text-right">
                  {scores[item.id as keyof ISelfEvaluation]}/10
                </span>
              </div>

              <input 
                type="range" 
                min="1" 
                max="10" 
                step="1"
                value={scores[item.id as keyof ISelfEvaluation]}
                onChange={(e) => handleScoreChange(item.id as keyof ISelfEvaluation, Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gold-500/10 accent-gold-500"
              />
            </div>
          ))}

          {/* Overall Custom Evaluated score */}
          <div className="pt-4 border-t border-gold-500/10 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xs tracking-wider text-gold-400 uppercase font-semibold">
                  Overall Target Impact Rating
                </h3>
                <p className="text-[10px] text-gray-500 font-cursive">
                  Integrative perception index.
                </p>
              </div>
              <span className="font-mono text-lg font-bold text-gold-400 w-16 text-right">
                {overallScore}/10
              </span>
            </div>

            <input 
              type="range" 
              min="1" 
              max="10" 
              step="0.5"
              value={overallScore}
              onChange={(e) => setOverallScore(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gradient-to-r from-gold-600 to-gold-500 accent-gold-500"
            />
          </div>

        </div>

        {/* Submit action panel */}
        <div className="flex items-center space-x-3 pt-4 border-t border-gold-500/10">
          <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 h-11 rounded-xl bg-gold-500/5 text-gold-300 border border-gold-500/10 text-2xs font-bold hover:bg-gold-500 hover:text-black transition-all cursor-pointer"
          >
            Cancel Rehearsal
          </button>
          
          <button 
            type="button" 
            onClick={handleSubmit}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 text-black font-bold text-2xs hover:opacity-95 shadow-[0_4px_22px_rgba(212,175,55,0.25)] transition-all cursor-pointer"
          >
            Submit Calibration Form
          </button>
        </div>

      </div>

    </div>
  );
};
