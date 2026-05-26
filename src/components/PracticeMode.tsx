import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Pause, RotateCcw, CheckCircle, Eye, EyeOff, Volume2, Mic, Maximize, Minimize, Settings, ChevronRight } from 'lucide-react';
import { SelfEvaluation } from './SelfEvaluation'; // we'll render this state in App or swap in-place

export const PracticeMode: React.FC = () => {
  const { currentSpeechToPractice, setView } = useApp();

  if (!currentSpeechToPractice) return null;

  // View States
  const [prepCountdown, setPrepCountdown] = useState<number | null>(3); // start pre-practice count
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(2); // 1 = slow, 3 = normal, 5 = fast
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [mockVolLevel, setMockVolLevel] = useState<number[]>(Array(15).fill(2));
  const [showSelfEvaluation, setShowSelfEvaluation] = useState(false);

  const teleprompterRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Preparation Countdown counter
  useEffect(() => {
    if (prepCountdown === null) return;
    if (prepCountdown === 0) {
      setPrepCountdown(null);
      setIsPlaying(true);
      return;
    }

    const timer = setTimeout(() => {
      setPrepCountdown((prev) => (prev ? prev - 1 : 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [prepCountdown]);

  // Stopwatch timer counter
  useEffect(() => {
    if (isPlaying) {
      timerIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
        
        // Render fake mic fluctuations
        setMockVolLevel(
          Array(15)
            .fill(0)
            .map(() => Math.floor(Math.random() * 40) + 5)
        );
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isPlaying]);

  // Autoscroll logic inside Teleprompter
  useEffect(() => {
    if (isPlaying && scrollSpeed > 0) {
      scrollIntervalRef.current = setInterval(() => {
        if (teleprompterRef.current) {
          teleprompterRef.current.scrollTop += scrollSpeed * 0.45;
        }
      }, 35);
    } else {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    }

    return () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    };
  }, [isPlaying, scrollSpeed]);

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setDuration(0);
    if (teleprompterRef.current) {
      teleprompterRef.current.scrollTop = 0;
    }
  };

  const handleFinish = () => {
    setIsPlaying(false);
    setShowSelfEvaluation(true);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // If we decided to trigger Self-Evaluation post-completion, show it in-place
  if (showSelfEvaluation) {
    return (
      <SelfEvaluation 
        speech={currentSpeechToPractice} 
        durationSeconds={duration || 1} 
        onCancel={() => setShowSelfEvaluation(false)} 
      />
    );
  }

  return (
    <div className={`space-y-6 pb-12 ${isDistractionFree ? 'fixed inset-0 z-50 overflow-y-auto bg-black p-4 sm:p-8' : 'animate-fade-in'}`}>
      
      {/* Immersive Countdown Modal overlay if preparation is active */}
      {prepCountdown !== null && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl">
          <div className="text-center">
            <span className="block font-display text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold">
              SACRED SPEAKING CHAMBER
            </span>
            <span className="mt-4 block font-display text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-gold-300 to-gold-600 animate-ping">
              {prepCountdown}
            </span>
            <p className="mt-6 text-xs text-gray-400 font-cursive max-w-sm px-4">
              Check posture, focus voice range, prepare script cues.
            </p>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-gold-500/10 pb-4">
        <div>
          <span className="font-display text-[9px] font-semibold tracking-widest text-gold-500 uppercase block mb-1">
            Rehearsal Track: {currentSpeechToPractice.category}
          </span>
          <h1 className="font-display text-lg tracking-wider font-semibold text-white uppercase">
            {currentSpeechToPractice.title}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* Distraction Free Toggle */}
          <button
            onClick={() => setIsDistractionFree(!isDistractionFree)}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-2xs font-bold border transition-colors cursor-pointer ${
              isDistractionFree 
                ? 'border-gold-500/30 bg-gold-500/10 text-[#fbf5df]' 
                : 'border-gold-500/10 bg-gold-500/5 text-gold-300 hover:bg-gold-500 hover:text-black hover:border-transparent'
            }`}
          >
            {isDistractionFree ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">
              {isDistractionFree ? "Normal Stage" : "Immersive Focus"}
            </span>
          </button>

          {!isDistractionFree && (
            <button 
              onClick={() => setView('dashboard')}
              className="rounded-lg bg-gold-500/5 border border-gold-500/10 px-3 py-1.5 text-2xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-black transition-colors"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Teleprompter Screen (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Teleprompter Container Box */}
          <div className="relative rounded-2xl border border-gold-500/10 bg-[#0c0c0e] shadow-inner overflow-hidden">
            
            {/* Horizontal Alignment Cue Guide lines */}
            <div className="absolute top-1/2 left-0 right-0 z-10 h-16 -translate-y-1/2 pointer-events-none border-y border-gold-500/15 bg-gold-500/[0.01] shadow-[0_0_20px_rgba(212,175,55,0.02)]" />
            
            <div className="absolute top-2 left-4 z-10 flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse" />
              <span className="font-mono text-[9px] text-gold-600 uppercase tracking-widest font-semibold">
                Speech Monitor Transmitting
              </span>
            </div>

            {/* Scrollable teleprompter text */}
            <div 
              ref={teleprompterRef}
              className="h-[360px] overflow-y-auto px-6 py-40 text-center select-none scroll-smooth"
              style={{ scrollbarWidth: 'none' }}
            >
              <p className="mx-auto max-w-2xl font-sans text-lg sm:text-2xl font-light leading-relaxed tracking-wide text-gray-300 hover:text-white">
                {currentSpeechToPractice.content}
              </p>
            </div>

            {/* Visual gradient indicators at the top and bottom to create depth */}
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#0c0c0e] to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0c0c0e] to-transparent pointer-events-none" />
          </div>

          {/* Practice Action Control Bar */}
          <div className="flex flex-col gap-4 rounded-xl border border-gold-500/10 bg-[#0c0c0e] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-center space-x-3">
              {isPlaying ? (
                <button
                  onClick={handlePause}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-gold-600 to-gold-500 text-black hover:opacity-90 shadow-[0_0_15px_rgba(212,175,55,0.45)] cursor-pointer"
                >
                  <Pause className="h-5 w-5 text-black" />
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-gold-600 to-gold-500 text-black hover:opacity-90 shadow-[0_0_15px_rgba(212,175,55,0.45)] cursor-pointer"
                >
                  <Play className="h-5 w-5 fill-current text-black ml-0.5" />
                </button>
              )}

              <button
                onClick={handleReset}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/5 text-gold-400 hover:bg-gold-500 hover:text-black border border-gold-500/15"
                title="Reset stage"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Custom Teleprompter scroll speed slider */}
            <div className="flex flex-1 items-center justify-center space-x-3 max-w-xs mx-auto sm:mx-0">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#e6c387] font-semibold">Scroll Speed</span>
              <input 
                type="range" 
                min="0" 
                max="6" 
                step="1"
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(Number(e.target.value))}
                className="h-1 flex-1 cursor-pointer appearance-none rounded-lg bg-gold-500/15 accent-gold-500"
              />
              <span className="font-mono text-2xs text-gold-400 font-bold w-4 text-center">x{scrollSpeed}</span>
            </div>

            <button 
              onClick={handleFinish}
              className="flex items-center justify-center space-x-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-xs font-bold text-white hover:opacity-90 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)] cursor-pointer"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Complete Rehearsal</span>
            </button>
          </div>

        </div>

        {/* Sidebar Rehearsal HUD Widgets (1 Col) */}
        <div className="space-y-4">
          
          {/* Active Timing Gauge widget */}
          <div className="rounded-xl border border-gold-500/10 bg-[#0c0c0e] p-4 text-center">
            <span className="font-mono text-[9px] uppercase tracking-widest text-gold-500 font-semibold block">Speaking Duration</span>
            <div className="mt-2 text-3xl font-black font-mono tracking-tight text-white">
              {formatTimer(duration)}
            </div>
            
            {/* Target compare baseline */}
            <div className="mt-2 flex items-center justify-center space-x-1 font-mono text-[9px] text-gray-500">
              <span>Target script pacing:</span>
              <span className="text-gold-400 font-bold">
                {formatTimer(currentSpeechToPractice.estimatedDuration)}
              </span>
            </div>
          </div>

          {/* AI-Audio Feedback & Oscilloscope Wave Mock Visualizer */}
          <div className="rounded-xl border border-gold-500/10 bg-[#0c0c0e] p-4 space-y-3">
            <div className="flex items-center justify-between text-gold-400">
              <div className="flex items-center space-x-1.5">
                <Mic className="h-3.5 w-3.5 text-gold-500" />
                <span className="font-display text-2xs tracking-widest font-semibold">Vocal Projection</span>
              </div>
              <Volume2 className="h-3.5 w-3.5 text-gold-500" />
            </div>

            {/* Interactive Audio Fluctuating Bar meters */}
            <div className="flex h-12 items-end justify-center gap-[3px] rounded-lg bg-black/60 px-3 py-1">
              {mockVolLevel.map((height, i) => (
                <div 
                  key={i} 
                  className="w-1.5 rounded-t-sm bg-gradient-to-t from-gold-800 via-gold-500 to-gold-300 transition-all duration-150"
                  style={{ height: isPlaying ? `${height}%` : '5%' }}
                />
              ))}
            </div>

            <p className="text-[10px] text-gray-500 font-cursive leading-normal text-center">
              Vocal projection registers sound fluctuations dynamically during delivery.
            </p>
          </div>

          {/* Statistics summary brief */}
          <div className="rounded-xl border border-gold-500/10 bg-[#0c0c0e] p-4 space-y-3 font-mono text-[10px]">
            <h4 className="font-display text-2xs font-semibold text-[#e6c387] uppercase tracking-widest">Metrics Telemetry</h4>
            
            <div className="flex items-center justify-between border-b border-gold-500/10 pb-1.5">
              <span className="text-gray-500">Total Words</span>
              <span className="text-gold-300 font-bold">{currentSpeechToPractice.wordCount} words</span>
            </div>

            <div className="flex items-center justify-between border-b border-gold-500/10 pb-1.5">
              <span className="text-gray-500">Target Speed</span>
              <span className="text-gold-300 font-bold">135 WPM</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Self alignment bias</span>
              <span className="text-emerald-400 font-bold">Calibrating</span>
            </div>
          </div>

          {/* Guidance Info Tip */}
          <div className="rounded-xl border border-gold-500/10 bg-[#0c0c0e]/80 p-4 text-[10px] text-gray-400 leading-relaxed font-cursive">
            <strong>Platform Advice:</strong> When complete, click the green <strong>Complete Rehearsal</strong> button. The Platform will immediately guide you through self-assessments to align coordinates with the system scores.
          </div>

        </div>
      </div>

    </div>
  );
};
