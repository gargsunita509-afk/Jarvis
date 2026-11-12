import React, { useState } from 'react';
import {
  Mic,
  Brain,
  Smartphone,
  Shield,
  Download,
  Terminal,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Radio,
  Lock
} from 'lucide-react';
import { ArcReactor } from '../components/ArcReactor.tsx';
import { useJarvis } from '../context/JarvisContext.tsx';
import { voiceEngine } from '../services/voice.ts';

export const LandingPage: React.FC = () => {
  const { setActiveView, preferences, enterGuestLocalMode, signInGoogle, user } = useJarvis();
  const [demoInput, setDemoInput] = useState('');
  const [demoResponse, setDemoResponse] = useState<string | null>(
    'Good day, Sir. All biometric and neural diagnostics report optimal functionality. How may I assist your operations today?'
  );
  const [demoState, setDemoState] = useState<'standby' | 'listening' | 'thinking' | 'speaking'>('standby');

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoInput.trim()) return;

    const query = demoInput.trim();
    setDemoInput('');
    setDemoState('thinking');

    setTimeout(() => {
      let reply = `Understood. Analyzing query: "${query}". All authorized project memories and ecosystem nodes have verified the command.`;
      const lower = query.toLowerCase();
      if (lower.includes('hindi') || lower.includes('kya') || lower.includes('project')) {
        reply = `Haan Sir, main aapke Project NEXORA ka status monitor kar raha hoon. 3 memories synchronized hain.`;
      } else if (lower.includes('who are you') || lower.includes('jarvis')) {
        reply = `I am ${preferences.assistantName || 'JARVIS'}, your personal AI command core, engineered for voice precision, long-term memory, and cross-device operations.`;
      }

      setDemoResponse(reply);
      setDemoState('speaking');

      voiceEngine.speak(reply, {
        rate: preferences.speechRate,
        pitch: preferences.speechPitch,
        voiceName: preferences.voiceName,
        language: preferences.language,
        onEnd: () => setDemoState('standby'),
        onError: () => setDemoState('standby')
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Holographic Grid Effect */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/20 via-[#030712] to-[#02050e] pointer-events-none" />
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(#00f0ff 1px, transparent 1px), linear-gradient(90deg, #00f0ff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* TOP NAVIGATION HEADER */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-cyan-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-900 border border-cyan-400 flex items-center justify-center shadow-[0_0_12px_#00f0ff]">
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-300 animate-pulse" />
          </div>
          <div>
            <span className="font-mono font-bold tracking-widest text-xl text-cyan-300">J.A.R.V.I.S.</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              ECOSYSTEM OS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('apk')}
            className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyan-300/80 hover:text-cyan-200 px-3 py-1.5 rounded border border-cyan-500/30 hover:border-cyan-400 transition-colors"
          >
            <Download size={14} />
            <span>COMPANION APK</span>
          </button>
          {user ? (
            <button
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/60 text-cyan-200 text-xs font-mono tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              <span>ACCESS CORE</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={() => enterGuestLocalMode()}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/60 text-cyan-200 text-xs font-mono tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              <span>LAUNCH JARVIS</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 flex flex-col items-center text-center">
        {/* Subtitle Telemetry Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-8 backdrop-blur-md">
          <Sparkles size={14} className="text-cyan-400 animate-spin" />
          <span className="tracking-widest">NEXT-GENERATION PERSONAL AI OS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-slate-400">WEB + ANDROID PWA</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight font-mono mb-6 bg-gradient-to-b from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent max-w-5xl">
          YOUR WORLD.<br />YOUR COMMAND.
        </h1>

        <p className="max-w-2xl text-slate-400 text-base sm:text-lg mb-12 leading-relaxed font-sans">
          An ultra-advanced personal AI assistant inspired by Tony Stark's JARVIS.
          Featuring a responsive Arc Reactor core, continuous voice conversations in English, Hindi & Hinglish,
          long-term memory banks, and seamless companion APK synchronization.
        </p>

        {/* Centerpiece Interactive Arc Reactor */}
        <div className="relative my-6 group">
          <ArcReactor
            state={demoState}
            colorTheme={preferences.reactorColor}
            size={280}
            interactive={true}
            onClick={() => {
              if (demoState === 'standby') {
                setDemoState('listening');
                setTimeout(() => setDemoState('speaking'), 1500);
              } else {
                setDemoState('standby');
              }
            }}
            showStatusLabel={true}
          />
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold tracking-wider text-sm transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)]"
          >
            <Zap size={18} />
            <span>INITIALIZE COMMAND CENTRE</span>
          </button>

          <button
            onClick={() => setActiveView('apk')}
            className="flex items-center gap-3 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-mono text-sm transition-all"
          >
            <Smartphone size={18} />
            <span>COMPANION APK INFO</span>
          </button>
        </div>

        {/* Status Telemetry HUD Bar */}
        <div className="mt-16 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 font-mono text-left">
          <div className="p-3 border-r border-cyan-500/10">
            <div className="text-[10px] text-cyan-400/60 uppercase">Ecosystem Target</div>
            <div className="text-sm font-bold text-slate-200 mt-1">Web PWA + Android APK</div>
          </div>
          <div className="p-3 border-r border-cyan-500/10">
            <div className="text-[10px] text-cyan-400/60 uppercase">Voice Engine</div>
            <div className="text-sm font-bold text-slate-200 mt-1">Cinematic Male / Tri-lingual</div>
          </div>
          <div className="p-3 border-r border-cyan-500/10">
            <div className="text-[10px] text-cyan-400/60 uppercase">Memory Storage</div>
            <div className="text-sm font-bold text-slate-200 mt-1">IndexedDB + Firestore ABAC</div>
          </div>
          <div className="p-3">
            <div className="text-[10px] text-cyan-400/60 uppercase">Budget Tier</div>
            <div className="text-sm font-bold text-emerald-400 mt-1">₹0 Spark Plan Free</div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMONSTRATION SECTION */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 border-t border-cyan-500/20">
        <div className="text-center mb-8">
          <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">Live Simulation</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono text-slate-100 mt-2">
            Experience Neural Voice Response
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Test JARVIS in English, Hindi, or Hinglish right from your browser.
          </p>
        </div>

        {/* Terminal Chat Console */}
        <div className="p-6 rounded-2xl bg-[#050b18]/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.08)]">
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 text-xs font-mono text-cyan-400/70">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-cyan-400" />
              <span>TERMINAL // VOCAL PROTOCOL LINK</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">VOICE TTS READY</span>
            </div>
          </div>

          <div className="my-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-mono text-xs shrink-0">
                J
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-sm text-slate-200 leading-relaxed font-sans max-w-2xl">
                {demoResponse}
              </div>
            </div>
          </div>

          <form onSubmit={handleDemoSubmit} className="flex gap-2">
            <input
              type="text"
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              placeholder="Ask JARVIS in English, Hindi, or Hinglish (e.g., 'Kya tumhe mera study project yaad hai?')..."
              className="flex-1 bg-slate-950/80 border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 font-sans"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
            >
              Transmit
            </button>
          </form>
        </div>
      </section>

      {/* PILLARS & FEATURES SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-cyan-500/20">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">System Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono text-slate-100 mt-2">
            Engineered for Autonomous Intelligence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-cyan-500/20 hover:border-cyan-400/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-5">
              <Mic size={24} />
            </div>
            <h3 className="font-mono text-lg font-bold text-slate-100 mb-2">Cinematic Voice & Hinglish</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Speaks with a male cinematic AI tone. Seamlessly understands English, pure Hindi, and casual everyday Hinglish with real-time audio waveform feedback.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-cyan-500/20 hover:border-cyan-400/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-5">
              <Brain size={24} />
            </div>
            <h3 className="font-mono text-lg font-bold text-slate-100 mb-2">Long-Term Memory Vault</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              8 categorized memory repositories including Projects, Preferences, Routines, and Knowledge. Full control to view, edit, search, and export authorized memories.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-cyan-500/20 hover:border-cyan-400/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-5">
              <Smartphone size={24} />
            </div>
            <h3 className="font-mono text-lg font-bold text-slate-100 mb-2">Dual-Mode & Companion APK</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Offline-first with IndexedDB when offline, synced to Cloud Firestore when authenticated. Pre-configured integration contract for the companion native Android APK.
            </p>
          </div>
        </div>
      </section>

      {/* SECURITY & PRIVACY SECTION */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 border-t border-cyan-500/20">
        <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-950 via-[#060e20] to-slate-950 border border-cyan-500/30 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <Shield size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="font-mono text-xl font-bold text-slate-100">
              Zero-Trust Architecture & Private User Isolation
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every user receives an isolated private JARVIS profile. Firestore security rules enforce strict attribute-based access control (ABAC).
              No user data or memories are exposed to other accounts.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono text-cyan-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> ₹0 Spark Free-Tier Compliant</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> No Client API Key Leaks</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> Full Local Data Export</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-cyan-500/20 py-8 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            J.A.R.V.I.S. Personal AI Ecosystem © 2026 // Web & Companion APK Architecture
          </div>
          <div className="flex items-center gap-4 text-cyan-400/70">
            <button onClick={() => setActiveView('contract')} className="hover:text-cyan-300">APK Contract</button>
            <button onClick={() => setActiveView('help')} className="hover:text-cyan-300">Documentation</button>
            <button onClick={() => setActiveView('account')} className="hover:text-cyan-300">Privacy Audit</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
