import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Mail, User, ShieldCheck, Loader2 } from 'lucide-react';
const goldenCrest = '/src/assets/images/golden_orator_crest_1779762359658.png';

export const Auth: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, loading } = useApp();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim()) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    try {
      const realName = name.trim() || 'Speaker';
      await loginWithEmail(email, realName);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during authentication.");
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setErrorMsg("Google Authentication cancelled or failed. Please check popup permissions.");
    }
  };

  const handleDeveloperQuickstart = async () => {
    setErrorMsg('');
    try {
      await loginWithEmail('cadenx.guest@gmail.com', 'Alex from Cadenx');
    } catch (err: any) {
      setErrorMsg(err.message || "Quickstart initiation failed.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 animate-fade-in bg-black">
      
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-gold-500/20 bg-[#0c0c0e] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] text-center relative overflow-hidden gold-glow-subtle">
        {/* Decorative corner glows */}
        <div className="absolute top-0 left-0 h-40 w-40 bg-gold-500/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 h-40 w-40 bg-gold-700/5 blur-3xl rounded-full" />

        <div className="space-y-2">
          {/* Majestic Golden Crest Picture Asset */}
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-2xl bg-black border border-gold-500/30 overflow-hidden shadow-lg shadow-gold-500/10 scale-105">
            <img 
              src={goldenCrest} 
              alt="R.I.S.E Golden Crest" 
              className="h-full w-full object-cover p-1 scale-110" 
              referrerPolicy="no-referrer"
            />
          </div>
          
          <h2 className="font-display text-2xl font-semibold tracking-widest text-[#e6c387] pt-2 uppercase">
            R.I.S.E Cabinet
          </h2>
          
          <p className="font-cursive text-sm text-gold-400 italic">
            Chamber of Golden Alignment
          </p>

          <p className="text-xs text-gray-400 max-w-xs mx-auto pt-1 leading-relaxed">
            Imperial speech self-evaluation and vocal calibration system. Authenticate via Google or email profile to begin.
          </p>
        </div>

        {/* Status Error Feedback */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-2xs p-3 rounded-xl font-medium tracking-wide">
            {errorMsg}
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="flex flex-col items-center justify-center space-y-2 py-4">
            <Loader2 className="h-6 w-6 text-gold-500 animate-spin" />
            <span className="text-xs font-mono text-gold-400">Contacting Imperial Authentication Gate...</span>
          </div>
        )}

        {!loading && (
          <div className="space-y-4">
            
            {/* Google Authentication Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center space-x-2.5 rounded-xl bg-[#121214] border border-gold-500/20 py-3 text-xs font-semibold text-gold-200 hover:text-black hover:bg-gradient-to-r hover:from-gold-600 hover:to-gold-500 hover:border-transparent transition-all duration-300 cursor-pointer shadow-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.5-.14 3.01-1.12 4.01v3.31h1.79c1.05-.97 1.77-2.39 1.77-4.07 1-1.39 1.69-3.04 1.69-5.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.31-2.57c-.92.62-2.1.99-3.33.99-2.57 0-4.75-1.74-5.53-4.07H1.31v1.94C3.29 21.12 7.37 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.47 15.44c-.2-.62-.32-1.28-.32-1.96s.12-1.34.32-1.96V9.58H1.31c-.68 1.4-1.31 3.03-1.31 4.9s.63 3.5 1.31 4.9l5.16-3.94z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.97 1.19 15.24 0 12 0 7.37 0 3.29 2.88 1.31 6.56l5.16 3.94c.78-2.33 2.96-4.07 5.53-4.07z"
                />
              </svg>
              <span>Authenticate with Google</span>
            </button>

            <div className="flex items-center justify-between py-2">
              <span className="w-full border-t border-gold-500/10" />
              <span className="px-3 font-mono text-[8px] text-gold-600 tracking-widest uppercase shrink-0">SECURE DISPATCH</span>
              <span className="w-full border-t border-gold-500/10" />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              {isSignUp && (
                <div>
                  <label className="block font-mono text-3xs font-bold uppercase tracking-widest text-[#e6c387] mb-1">
                    Your Orator Profile Name
                  </label>
                  <div className="relative">
                    <User className="absolute top-3 left-3 h-4 w-4 text-gold-600" />
                    <input 
                      type="text" 
                      placeholder="e.g. Master Orator"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-gold-500/10 bg-black/50 py-2.5 pl-10 pr-4 text-xs text-[#fbf5df] placeholder-gray-600 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-gold-500/10"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-mono text-3xs font-bold uppercase tracking-widest text-[#e6c387] mb-1">
                  Your Account Email
                </label>
                <div className="relative">
                  <Mail className="absolute top-3 left-3 h-4 w-4 text-gold-600" />
                  <input 
                    type="email" 
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gold-500/10 bg-black/50 py-2.5 pl-10 pr-4 text-xs text-[#fbf5df] placeholder-gray-600 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-gold-500/10"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center space-x-1.5 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 py-2.5 text-xs font-bold text-black shadow-md hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <span>{isSignUp ? "Register Custom Profile" : "Login to Core Workspace"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

            </form>

            {/* Form Mode Toggle */}
            <div className="text-[11px] text-gray-500">
              {isSignUp ? (
                <span>Already registered? <button type="button" onClick={() => setIsSignUp(false)} className="text-gold-400 font-bold hover:underline">Access Login</button></span>
              ) : (
                <span>New orator? <button type="button" onClick={() => setIsSignUp(true)} className="text-gold-400 font-bold hover:underline">Create Account</button></span>
              )}
            </div>

            {/* Quick Access Dev */}
            <div className="pt-4 border-t border-gold-500/10 space-y-2">
              <span className="block font-mono text-[9px] tracking-widest text-[#e6c387] uppercase">
                DEMO PROFILE GENERATOR
              </span>
              
              <button
                type="button"
                onClick={handleDeveloperQuickstart}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gold-500/5 border border-gold-500/20 px-4 py-2.5 text-xs font-bold text-gold-400 hover:bg-gold-500/10 transition-all cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4 text-gold-400" />
                <span>Initialize Empty Seed Account</span>
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
