import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Zap,
  Activity,
  Brain,
  Smartphone,
  ShieldAlert,
  Clock,
  Sparkles,
  ArrowUpRight,
  Terminal,
  Volume2,
  VolumeX,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { ArcReactor } from '../components/ArcReactor.tsx';
import { useJarvis } from '../context/JarvisContext.tsx';

export const DashboardView: React.FC = () => {
  const {
    reactorState,
    setReactorState,
    preferences,
    memories,
    devices,
    customCommands,
    runCommand,
    isVoiceListening,
    isSpeaking,
    interimTranscript,
    startVoiceInput,
    stopVoiceInput,
    stopSpeakingOutput,
    sendChatMessage,
    setActiveView,
    syncStatus,
    user
  } = useJarvis();

  const [textInput, setTextInput] = useState('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  // Live HUD Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = preferences.preferredName || 'Sir';
    if (hour < 12) return `Good morning, ${name}.`;
    if (hour < 17) return `Good afternoon, ${name}.`;
    return `Good evening, ${name}.`;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const q = textInput.trim();
    setTextInput('');
    sendChatMessage(q);
  };

  const projectMemories = memories.filter(m => m.category === 'Projects');
  const activeDevicesCount = devices.filter(d => d.status === 'online').length;

  return (
    <div className="min-h-full flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* TOP STATUS HUD BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#050b18]/80 border border-cyan-500/20 backdrop-blur-md">
        <div>
          <div className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            CORE ONLINE // {syncStatus === 'cloud_synced' ? 'FIREBASE CLOUD SYNCED' : 'LOCAL CACHE MODE'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100 mt-1">
            {getGreeting()}
          </h1>
        </div>

        {/* HUD Clock & Diagnostics */}
        <div className="flex items-center gap-6 font-mono text-right">
          <div className="hidden sm:block">
            <div className="text-lg font-bold text-cyan-300 tracking-wider flex items-center justify-end gap-2">
              <Clock size={16} className="text-cyan-400" />
              <span>{currentTime}</span>
            </div>
            <div className="text-xs text-slate-400">{currentDate}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('personalization')}
              className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 transition-colors"
              title="Calibrate Arc Reactor & Voice"
            >
              <Sliders size={18} />
            </button>
            <button
              onClick={() => setActiveView('conversation')}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-200 text-xs tracking-wider uppercase font-mono hover:bg-cyan-500/30 transition-all flex items-center gap-2 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
            >
              <Zap size={14} className="text-cyan-400" />
              <span>VOICE ROOM</span>
            </button>
          </div>
        </div>
      </div>

      {/* CENTRAL COMMAND REACTOR AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Telemetry Card */}
        <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
          {/* Memory Archive Card */}
          <div
            onClick={() => setActiveView('memory')}
            className="p-5 rounded-2xl bg-slate-950/60 border border-cyan-500/20 hover:border-cyan-400/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400/70 mb-2">
              <span className="flex items-center gap-1.5"><Brain size={14} /> AUTHORIZED MEMORIES</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="text-2xl font-mono font-bold text-slate-100">{memories.length}</div>
            <div className="text-xs text-slate-400 mt-1">
              {projectMemories.length > 0 ? `Latest: ${projectMemories[0].title}` : 'Long-term vault active'}
            </div>
          </div>

          {/* Ecosystem Companion APK Card */}
          <div
            onClick={() => setActiveView('devices')}
            className="p-5 rounded-2xl bg-slate-950/60 border border-cyan-500/20 hover:border-cyan-400/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400/70 mb-2">
              <span className="flex items-center gap-1.5"><Smartphone size={14} /> COMPANION NODES</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="text-2xl font-mono font-bold text-slate-100">
              {activeDevicesCount} <span className="text-xs font-normal text-slate-400">/ {devices.length} paired</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {devices.length === 0 ? 'No companion APK paired yet' : `${devices[0].deviceName} (${devices[0].deviceType})`}
            </div>
          </div>
        </div>

        {/* Centerpiece: Glowing Arc Reactor Command Core */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-[#050b18]/60 via-[#030712]/80 to-[#02050e]/90 border border-cyan-500/20 relative overflow-hidden order-1 lg:order-2 shadow-[0_0_50px_rgba(0,240,255,0.06)]">
          {/* Reactor Component */}
          <ArcReactor
            state={reactorState}
            colorTheme={preferences.reactorColor}
            size={280}
            interactive={true}
            onClick={() => {
              if (isSpeaking) {
                stopSpeakingOutput();
              } else if (isVoiceListening) {
                stopVoiceInput();
              } else {
                startVoiceInput();
              }
            }}
            showStatusLabel={true}
          />

          {/* Live Transcript / Feedback Indicator */}
          <div className="mt-6 min-h-[44px] flex items-center justify-center text-center px-4 w-full">
            {isVoiceListening ? (
              <div className="flex items-center gap-2 text-sm font-mono text-cyan-300 animate-pulse bg-cyan-950/40 px-4 py-2 rounded-xl border border-cyan-500/30">
                <Mic size={16} className="text-cyan-400" />
                <span>{interimTranscript || 'Listening to your voice... (Speak now)'}</span>
              </div>
            ) : isSpeaking ? (
              <div className="flex items-center gap-2 text-sm font-mono text-sky-300 bg-sky-950/40 px-4 py-2 rounded-xl border border-sky-500/30">
                <Volume2 size={16} className="text-sky-400 animate-pulse" />
                <span>JARVIS Speaking... Click to interrupt</span>
              </div>
            ) : (
              <div className="text-xs font-mono text-slate-400 tracking-wider">
                CLICK REACTOR OR MICROPHONE TO SPEAK // "JARVIS, OPEN MY STUDY PROJECT"
              </div>
            )}
          </div>

          {/* Voice & Speech Controls Bar */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={isVoiceListening ? stopVoiceInput : startVoiceInput}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all ${
                isVoiceListening
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)]'
              }`}
            >
              {isVoiceListening ? <MicOff size={16} /> : <Mic size={16} />}
              <span>{isVoiceListening ? 'STOP LISTENING' : 'ACTIVATE VOICE'}</span>
            </button>

            {isSpeaking && (
              <button
                onClick={stopSpeakingOutput}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs border border-slate-600"
              >
                Interrupt
              </button>
            )}
          </div>
        </div>

        {/* Right Telemetry Card */}
        <div className="lg:col-span-3 space-y-4 order-3">
          {/* AI Neural Latency Card */}
          <div
            onClick={() => setActiveView('ai-settings')}
            className="p-5 rounded-2xl bg-slate-950/60 border border-cyan-500/20 hover:border-cyan-400/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400/70 mb-2">
              <span className="flex items-center gap-1.5"><Sparkles size={14} /> AI NEURAL MODEL</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="text-base font-mono font-bold text-slate-100">Gemini 2.5 Flash</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Spark Free Tier ($0 Budget)</span>
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div
            onClick={() => setActiveView('commands')}
            className="p-5 rounded-2xl bg-slate-950/60 border border-cyan-500/20 hover:border-cyan-400/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400/70 mb-2">
              <span className="flex items-center gap-1.5"><Terminal size={14} /> CUSTOM COMMANDS</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="text-2xl font-mono font-bold text-slate-100">{customCommands.length}</div>
            <div className="text-xs text-slate-400 mt-1">
              Voice triggers configured
            </div>
          </div>
        </div>
      </div>

      {/* QUICK COMMAND ACTION CHIPS */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase flex items-center gap-2">
          <Terminal size={14} />
          <span>INSTANT COMMAND PROTOCOLS</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {customCommands.slice(0, 5).map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => runCommand(cmd)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-cyan-950/50 border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono text-cyan-200 transition-all hover:scale-[1.02] shadow-[0_0_10px_rgba(0,240,255,0.05)]"
            >
              <Zap size={14} className="text-cyan-400" />
              <span>{cmd.name}</span>
            </button>
          ))}
          <button
            onClick={() => setActiveView('commands')}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-cyan-300 border border-dashed border-slate-700 hover:border-cyan-500/40"
          >
            + Manage Commands
          </button>
        </div>
      </div>

      {/* DIRECT TEXT COMMAND TRANSMITTER */}
      <div className="p-4 rounded-2xl bg-[#050b18]/90 border border-cyan-500/20">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type a vocal prompt or command in English, Hindi, or Hinglish (e.g., 'Jarvis, kya tumhe mera project yaad hai?')..."
            className="flex-1 bg-slate-950 border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
          />
          <button
            type="submit"
            disabled={!textInput.trim()}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0"
          >
            <span>Execute</span>
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};
