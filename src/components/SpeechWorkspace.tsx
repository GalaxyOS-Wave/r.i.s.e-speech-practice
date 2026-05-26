import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SpeechCategory } from '../types';
import { ArrowLeft, Save, Play, Trash2, HelpCircle, FileText, Check } from 'lucide-react';

const CATEGORIES: SpeechCategory[] = [
  'Public Speaking',
  'Debate',
  'Elevator Pitch',
  'Storytelling',
  'Presentation',
  'Interview Practice'
];

export const SpeechWorkspace: React.FC = () => {
  const { 
    speeches, 
    isEditingSpeechId, 
    setView, 
    addSpeech, 
    updateSpeech, 
    deleteSpeech, 
    loadSpeechForPractice,
    setEditingSpeechId
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SpeechCategory>('Public Speaking');
  const [content, setContent] = useState('');
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  // Load selected speech if editing
  useEffect(() => {
    if (isEditingSpeechId) {
      const speech = speeches.find((s) => s.id === isEditingSpeechId);
      if (speech) {
        setTitle(speech.title);
        setCategory(speech.category);
        setContent(speech.content);
      }
    } else {
      setTitle('');
      setCategory('Public Speaking');
      setContent('');
    }
  }, [isEditingSpeechId, speeches]);

  // Handle dynamic word count & duration estimate
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  // standard speaking rate is roughly 135 words per minute
  const estimatedSeconds = Math.ceil((wordCount / 135) * 60);
  const minutes = Math.floor(estimatedSeconds / 60);
  const seconds = estimatedSeconds % 60;

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      alert("Please enter a speech title.");
      return;
    }

    try {
      if (isEditingSpeechId) {
        await updateSpeech(isEditingSpeechId, {
          title,
          category,
          content
        });
      } else {
        const newSObj = await addSpeech(title, category, content);
        setEditingSpeechId(newSObj.id);
      }

      setShowSavedFeedback(true);
      setTimeout(() => {
        setShowSavedFeedback(false);
      }, 2000);
    } catch (err) {
      console.error("Error saving draft:", err);
      alert("Failed to save Draft. Check connection.");
    }
  };

  const handleLaunchPractice = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please enter a title and speech content before practicing.");
      return;
    }

    try {
      let activeId = isEditingSpeechId;
      if (!isEditingSpeechId) {
        const saved = await addSpeech(title, category, content);
        activeId = saved.id;
        setEditingSpeechId(saved.id);
      } else {
        await updateSpeech(isEditingSpeechId, { title, category, content });
      }

      const currentSpeech = speeches.find(s => s.id === activeId) || {
        id: activeId || '',
        title,
        category,
        content,
        wordCount,
        estimatedDuration: estimatedSeconds,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Launch practice
      loadSpeechForPractice(currentSpeech);
    } catch (err) {
      console.error("Error preparing practice:", err);
      alert("Failed to prepare speech practice.");
    }
  };

  const handleDelete = async () => {
    if (isEditingSpeechId) {
      if (window.confirm("Are you sure you want to delete this speaking asset?")) {
        try {
          await deleteSpeech(isEditingSpeechId);
          setEditingSpeechId(null);
          setView('dashboard');
        } catch (err) {
          console.error("Error deleting speech:", err);
          alert("Failed to delete speech blueprint.");
        }
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top action header */}
      <div className="flex items-center justify-between border-b border-gold-500/10 pb-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {
              setEditingSpeechId(null);
              setView('dashboard');
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500/5 border border-gold-500/15 text-gold-300 hover:bg-gold-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-display text-lg tracking-wider font-semibold text-white uppercase">
              {isEditingSpeechId ? "Edit Imperial Blueprint" : "Draft Speak Manuscript"}
            </h1>
            <p className="font-cursive text-2xs text-gold-500">Cadenx Elite Orator Workspace</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isEditingSpeechId && (
            <button 
              onClick={handleDelete}
              className="flex items-center space-x-1.5 rounded-lg border border-red-500/15 bg-red-500/5 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-colors"
              title="Delete Speech Asset"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Discard</span>
            </button>
          )}

          <button 
            onClick={handleSaveDraft}
            className="flex items-center space-x-1.5 rounded-lg bg-gold-500/5 border border-gold-500/15 px-3 py-1.5 text-xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-black transition-colors"
          >
            {showSavedFeedback ? <Check className="h-3.5 w-3.5 text-gold-500" /> : <Save className="h-3.5 w-3.5" />}
            <span>{showSavedFeedback ? "Saved!" : "Save Manuscript"}</span>
          </button>

          <button 
            onClick={handleLaunchPractice}
            className="flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-gold-600 to-gold-500 px-4 py-1.5 text-xs font-bold text-black shadow-lg hover:opacity-95 transition-all"
          >
            <Play className="h-3.5 w-3.5 fill-current text-black" />
            <span>Practice Now</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Input Fields (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Speech Title */}
          <div>
            <label className="block font-display text-[9px] font-semibold uppercase tracking-widest text-[#e6c387] mb-1.5">
              Manuscript Title
            </label>
            <input 
              type="text" 
              placeholder="e.g. Cadenx Seed Capital Pitch..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gold-500/10 bg-[#0c0c0e] px-4 py-3 text-sm text-white placeholder-gray-755 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
          </div>

          {/* Speech Category Selection */}
          <div>
            <label className="block font-display text-[9px] font-semibold uppercase tracking-widest text-[#e6c387] mb-2">
              Chamber Category Focus
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-lg border px-3 py-2 text-left text-2xs font-semibold transition-all cursor-pointer ${
                    category === cat
                      ? 'border-transparent bg-gradient-to-r from-gold-600 to-gold-500 text-black shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                      : 'border-gold-500/10 bg-[#0c0c0e] text-gray-400 hover:border-gold-500/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Large text editor content for speech rehearsal */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-display text-[9px] font-semibold uppercase tracking-widest text-[#e6c387]">
                Manuscript Exposition
              </label>
              <span className="font-cursive text-2xs text-[#e6c387]/60">
                Compose speech content
              </span>
            </div>
            
            <textarea 
              rows={12}
              placeholder="Good afternoon everyone, today I want to present R.I.S.E under Cadenx..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-xl border border-gold-500/10 bg-[#0c0c0e] px-4 py-3 font-sans text-xs sm:text-sm text-gray-200 placeholder-gray-700 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 leading-relaxed resize-y"
            />
          </div>

        </div>

        {/* Right HUD Guidance (1 Col) */}
        <div className="space-y-4">
          
          <div className="rounded-xl border border-gold-500/10 bg-[#0c0c0e] p-5 space-y-4 shadow">
            <h3 className="font-display text-3xs font-semibold uppercase tracking-widest text-[#e6c387] border-b border-gold-500/10 pb-2">
              Metric Prognostics
            </h3>

            {/* Speaking word density */}
            <div className="flex items-center justify-between border-b border-gold-500/10 pb-2 bg-transparent text-2xs">
              <span className="font-mono text-gray-500">Word Density</span>
              <span className="font-sans font-bold text-white">{wordCount}</span>
            </div>

            {/* Estimated execution speed */}
            <div className="flex items-center justify-between border-b border-gold-500/10 pb-2 bg-transparent text-2xs">
              <span className="font-mono text-gray-500">Est. Rehearsal Time</span>
              <span className="font-sans font-bold text-gold-400">
                {minutes > 0 ? `${minutes}m ` : ''}{seconds}s
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gold-500/10 pb-2 bg-transparent text-2xs">
              <span className="font-mono text-gray-500">Standard Tempo Rate</span>
              <span className="font-mono text-[10px] text-gold-600 font-semibold">135 words/min</span>
            </div>

            <div className="rounded bg-gold-500/5 border border-gold-500/10 p-2.5 text-center">
              <p className="font-mono text-[9px] text-gold-400 uppercase tracking-widest font-semibold">
                PRE-CALIBRATED MATRIX ACTIVE
              </p>
            </div>
          </div>

          {/* Dynamic contextual advice advice based on Category */}
          <div className="rounded-xl border border-gold-500/10 bg-[#0c0c0e]/80 p-5 space-y-3 shadow">
            <div className="flex items-center space-x-1.5 text-gold-400">
              <HelpCircle className="h-4 w-4" />
              <span className="font-display text-2xs tracking-widest font-semibold uppercase">Imperial Guidance</span>
            </div>

            {category === 'Elevator Pitch' && (
              <p className="text-2xs text-gray-400 leading-relaxed font-cursive">
                <strong>Elevator Pitch:</strong> Highly compressed parameters. Deliver a sharp hook, reveal core friction, introduce Cadenx solutions proofing, and state a dynamic CTA. Maintain brisk yet precise tempo (140 WPM).
              </p>
            )}
            {category === 'Debate' && (
              <p className="text-2xs text-gray-400 leading-relaxed font-cursive">
                <strong>Debate Strategy:</strong> Emphasis on evidence density, logic frameworks, and pre-emptive rebuttals. Cadence must feel highly controlled and analytical to command standard matches (+135 WPM).
              </p>
            )}
            {category === 'Storytelling' && (
              <p className="text-2xs text-gray-400 leading-relaxed font-cursive">
                <strong>Storytelling:</strong> Prioritize visual description, spatial metaphors, dynamic pauses, and emotional resonance. Intertwine strategic pauses between milestones (+110 WPM).
              </p>
            )}
            {category === 'Public Speaking' && (
              <p className="text-2xs text-gray-400 leading-relaxed font-cursive">
                <strong>Public Speaking:</strong> Deliver grand structural structures, pauses of extreme significance, and clear rhetorical inquiries. Maintain comfortable, projection-level tempo standards.
              </p>
            )}
            {category === 'Presentation' && (
              <p className="text-2xs text-gray-400 leading-relaxed font-cursive">
                <strong>Presentation:</strong> Correlate manuscript text segments with slide transition triggers. Focus on high level summary and structured conceptual delivery over raw reading.
              </p>
            )}
            {category === 'Interview Practice' && (
              <p className="text-2xs text-gray-400 leading-relaxed font-cursive">
                <strong>Interview Practice:</strong> Apply the STAR structural framework (Situation, Task, Action, Result). Maintain strict concise length and high personal credibility.
              </p>
            )}
          </div>

          {/* Speaking Workspace instructions summary */}
          <div className="rounded-xl border border-gold-500/10 bg-[#0c0c0e]/50 p-4 text-[10px] text-gray-500 font-cursive leading-normal">
            <div className="flex items-center space-x-1.5 mb-1 text-gold-500 font-display text-[9px] uppercase tracking-wider font-semibold">
              <FileText className="h-3.5 w-3.5" />
              <span>Autosave Engaged</span>
            </div>
            Your manuscript drafts are continuously packed in LocalStorage cache files. Cues generate instantly inside our teleprompter console upon launching practice mode.
          </div>

        </div>
      </div>

    </div>
  );
};
