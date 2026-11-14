import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Zap,
  Brain,
  Smartphone,
  Sparkles,
  Terminal,
  Volume2,
  Sliders,
  Download,
  Cpu,
  History,
  Activity,
  Database,
  Radio,
  Layers
} from 'lucide-react';
import { ArcReactor } from '../components/ArcReactor.tsx';
import { useJarvis } from '../context/JarvisContext.tsx';
import { PageView } from '../types/jarvis.ts';

export const DashboardView: React.FC = () => {
  const {
    reactorState,
    preferences,
    memories,
    devices,
    customCommands,
    conversations,
    messages,
    runCommand,
    isVoiceListening,
    isSpeaking,
    interimTranscript,
    startVoiceInput,
    stopVoiceInput,
    stopSpeakingOutput,
    sendChatMessage,
    setActiveView,
    syncStatus
  } = useJarvis();

  const [textInput, setTextInput] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = preferences.preferredName || 'Sir';
    if (hour < 12) return `Good Morning, ${name}.`;
    if (hour < 17) return `Good Afternoon, ${name}.`;
    return `Good Evening, ${name}.`;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const q = textInput.trim();
    setTextInput('');
    sendChatMessage(q);
  };

  const toggleVoice = () => {
    if (isSpeaking) {
      stopSpeakingOutput();
    } else if (isVoiceListening) {
      stopVoiceInput();
    } else {
      startVoiceInput();
    }
  };

  const activeDevicesCount = devices.filter((d) => d.status === 'online').length;
  const lastModelMsg = [...messages].reverse().find((m) => m.role === 'model');

  const mobileQuickTiles: {
    id: PageView;
    title: string;
    subtitle: string;
    icon: React.ElementType;
  }[] = [
    { id: 'conversation', title: 'Voice Room', subtitle: 'Talk with JARVIS', icon: Mic },
    { id: 'memory', title: 'Memory', subtitle: `${memories.length} Saved Vaults`, icon: Brain },
    { id: 'commands', title: 'Commands', subtitle: `${customCommands.length} Voice Macros`, icon: Terminal },
    { id: 'devices', title: 'Devices', subtitle: `${activeDevicesCount} Nodes Online`, icon: Smartphone },
    { id: 'apk', title: 'APK Centre', subtitle: 'Android App', icon: Download },
    { id: 'personalization', title: 'Settings', subtitle: 'Customize JARVIS', icon: Sliders }
  ];

  const smartBoardQuickActions: {
    label: string;
    icon: React.ElementType;
    onClick: () => void;
  }[] = [
    { label: 'Ask AI', icon: Sparkles, onClick: () => setActiveView('conversation') },
    { label: 'Voice Room', icon: Mic, onClick: () => setActiveView('conversation') },
    { label: 'Memory Vault', icon: Brain, onClick: () => setActiveView('memory') },
    { label: 'Commands', icon: Terminal, onClick: () => setActiveView('commands') },
    { label: 'Devices', icon: Smartphone, onClick: () => setActiveView('devices') },
    { label: 'Customize', icon: Sliders, onClick: () => setActiveView('personalization') }
  ];

  const smartBoardBottomDock: {
    id: PageView;
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: 'conversation', label: 'Voice Core', icon: Mic },
    { id: 'history', label: 'Session Archives', icon: History },
    { id: 'automations', label: 'Automations', icon: Cpu },
    { id: 'ai-settings', label: 'AI Core Config', icon: Sparkles },
    { id: 'memory', label: 'Memory Bank', icon: Brain },
    { id: 'apk', label: 'APK Centre', icon: Download }
  ];

  const barHeights = [35, 62, 48, 84, 58, 96, 70, 50, 80, 42];

  return (
    <>
      {/* =================================================================== */}
      {/* 1. MOBILE & PORTRAIT TABLET LAYOUT (< lg)                           */}
      {/* =================================================================== */}
      <div className="lg:hidden h-full w-full overflow-y-auto overflow-x-hidden px-3.5 sm:px-6 pt-3 pb-8 space-y-4">
        {/* Reactor Centerpiece with Flanked HUD Status Badges */}
        <section className="relative rounded-3xl hud-panel px-3 py-5 sm:p-6 overflow-hidden">
          {/* Flanked Top Status Cards */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="px-2.5 py-1.5 rounded-xl bg-slate-950/85 border border-cyan-500/30 font-mono text-[10px] leading-tight">
              <div className="text-slate-400 tracking-wider">CORE</div>
              <div className="text-cyan-300 font-bold flex items-center gap-1.5 mt-0.5">
                <span>ONLINE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>

            <div className="px-2.5 py-1.5 rounded-xl bg-slate-950/85 border border-cyan-500/30 font-mono text-[10px] text-right leading-tight">
              <div className="text-slate-400 tracking-wider">MODE</div>
              <div className="text-cyan-300 font-bold flex items-center justify-end gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>{reactorState.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Fluid Responsive Arc Reactor */}
          <div className="flex justify-center my-1">
            <ArcReactor
              state={reactorState}
              colorTheme={preferences.reactorColor}
              className="w-[min(210px,56vw)]"
              interactive={true}
              onClick={toggleVoice}
            />
          </div>

          {/* Greeting */}
          <div className="text-center mt-4 px-1">
            <h1 className="text-[clamp(1.35rem,5.4vw,1.95rem)] font-bold tracking-tight text-white leading-tight break-words">
              {getGreeting()}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/85 mt-1">
              {isVoiceListening
                ? interimTranscript || 'Listening... speak naturally in English, Hindi, or Hinglish.'
                : isSpeaking
                ? 'JARVIS is speaking... tap reactor to interrupt.'
                : 'JARVIS is online and ready to assist you.'}
            </p>
          </div>
        </section>

        {/* Unified Voice & Text Prompt Bar */}
        <form
          onSubmit={handleSend}
          className="w-full min-w-0 rounded-2xl hud-panel border-cyan-400/45 p-1.5 flex items-center gap-2 shadow-[0_0_22px_rgba(0,240,255,0.14)]"
        >
          <button
            type="button"
            onClick={toggleVoice}
            aria-label={isVoiceListening ? 'Stop Listening' : 'Start Voice Input'}
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all border ${
              isVoiceListening
                ? 'bg-red-500 border-red-300 text-white animate-pulse shadow-[0_0_16px_rgba(239,68,68,0.6)]'
                : 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/30'
            }`}
          >
            {isVoiceListening ? <MicOff size={19} /> : <Mic size={19} />}
          </button>

          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Ask JARVIS anything..."
            className="flex-1 min-w-0 bg-transparent px-2 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none font-sans"
          />

          <button
            type={textInput.trim() ? 'submit' : 'button'}
            onClick={() => {
              if (!textInput.trim()) setActiveView('conversation');
            }}
            aria-label={textInput.trim() ? 'Send Command' : 'Open Voice Room'}
            className="w-11 h-11 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/45 text-cyan-300 flex items-center justify-center shrink-0 transition-colors"
          >
            {textInput.trim() ? <Send size={17} /> : <Activity size={18} />}
          </button>
        </form>

        {/* Latest Reply Snippet (if active in session) */}
        {lastModelMsg && (
          <div
            onClick={() => setActiveView('conversation')}
            className="hud-panel rounded-2xl p-3.5 cursor-pointer flex items-start gap-3"
          >
            <Volume2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-wider">
                Latest Neural Output • Tap for Voice Room
              </div>
              <p className="text-xs text-slate-200 line-clamp-2 mt-0.5 break-words">{lastModelMsg.text}</p>
            </div>
          </div>
        )}

        {/* 3x2 / 2x3 Quick Module Grid */}
        <section className="grid grid-cols-2 min-[360px]:grid-cols-3 gap-2.5 sm:gap-3.5">
          {mobileQuickTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <button
                key={tile.title}
                onClick={() => setActiveView(tile.id)}
                className="hud-panel-interactive rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center min-h-[96px] active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/12 border border-cyan-400/35 flex items-center justify-center text-cyan-300 mb-2">
                  <Icon size={20} />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-100 leading-tight">{tile.title}</div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{tile.subtitle}</div>
              </button>
            );
          })}
        </section>

        {/* Quick Command Protocols Strip */}
        {customCommands.length > 0 && (
          <section className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase">
                Instant Macros
              </span>
              <button
                onClick={() => setActiveView('commands')}
                className="text-[10px] font-mono text-cyan-300 hover:underline"
              >
                Manage →
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {customCommands.slice(0, 4).map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => runCommand(cmd)}
                  className="shrink-0 min-h-[42px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-xs font-mono text-cyan-200 active:scale-95 transition-transform"
                >
                  <Zap size={13} className="text-cyan-400" />
                  <span>{cmd.name}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* SYSTEM STATUS BAR CARD */}
        <section className="hud-panel rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
              SYSTEM STATUS
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 text-[11px] text-slate-200">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Core Online
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Voice Ready
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {syncStatus === 'cloud_synced' ? 'Cloud Synced' : 'Memory Active'}
              </span>
            </div>
          </div>

          <div className="flex items-end gap-1 h-8 shrink-0" aria-hidden="true">
            {barHeights.map((h, idx) => (
              <span
                key={idx}
                className="w-1 rounded-full bg-gradient-to-t from-cyan-600 to-cyan-300"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </section>
      </div>

      {/* =================================================================== */}
      {/* 2. SMART BOARD / WIDE TOUCHSCREEN LANDSCAPE LAYOUT (lg+)            */}
      {/* =================================================================== */}
      <div className="hidden lg:flex flex-col h-full w-full overflow-hidden p-4 xl:p-5 gap-4">
        {/* Main 3-Column Smart Board HUD Grid */}
        <div className="flex-1 min-h-0 grid grid-cols-12 gap-4 xl:gap-5 items-stretch">
          {/* LEFT COLUMN: Greeting HUD + Quick Actions */}
          <div className="col-span-4 xl:col-span-3 flex flex-col gap-4 min-h-0">
            {/* Greeting HUD Card */}
            <div className="hud-panel rounded-2xl p-4 xl:p-5 flex items-center gap-4 shrink-0">
              {/* Holographic Mark Emblem */}
              <div className="w-14 h-16 xl:w-16 xl:h-18 rounded-xl bg-cyan-950/40 border border-cyan-400/35 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(0,240,255,0.16)]">
                <svg viewBox="0 0 64 76" className="w-10 h-12 text-cyan-300" fill="none">
                  <path
                    d="M32 4 L52 14 L56 38 L46 66 L32 72 L18 66 L8 38 L12 14 Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                  <path d="M22 20 L32 25 L42 20" stroke="currentColor" strokeWidth="1.5" opacity="0.65" />
                  <path d="M16 34 L27 37 L25 41 L16 38 Z" fill="#00f0ff" opacity="0.9" />
                  <path d="M48 34 L37 37 L39 41 L48 38 Z" fill="#00f0ff" opacity="0.9" />
                  <path d="M24 56 L32 59 L40 56" stroke="currentColor" strokeWidth="2" opacity="0.85" />
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg xl:text-2xl font-bold text-white leading-tight truncate">
                  {getGreeting()}
                </h1>
                <p className="text-xs xl:text-sm text-slate-300 mt-1 leading-snug">
                  JARVIS is online and ready to assist you.
                </p>
                <div className="w-20 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-transparent mt-3" />
              </div>
            </div>

            {/* Quick Actions 2x3 Grid */}
            <div className="hud-panel rounded-2xl p-4 xl:p-5 flex-1 min-h-0 flex flex-col">
              <div className="flex items-center gap-2 text-sm xl:text-base font-bold text-slate-100 shrink-0">
                <Zap size={17} className="text-cyan-400" />
                <span>Quick Actions</span>
              </div>

              <div className="grid grid-cols-2 xl:grid-cols-3 gap-2.5 xl:gap-3 mt-3 flex-1 content-start overflow-y-auto pr-0.5">
                {smartBoardQuickActions.map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.label}
                      onClick={act.onClick}
                      className="hud-panel-interactive rounded-xl p-2.5 xl:p-3 flex flex-col items-center justify-center text-center min-h-[70px] xl:min-h-[82px]"
                    >
                      <Icon size={20} className="text-cyan-300 mb-1.5" />
                      <span className="text-xs font-medium text-slate-200 leading-tight">{act.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: Arc Reactor + Interactive Speak/Prompt Dock */}
          <div className="col-span-4 xl:col-span-6 flex flex-col items-center justify-between min-h-0 py-1 px-2 relative">
            {/* Subtle Telemetry Label */}
            <div className="px-4 py-1.5 rounded-full bg-slate-900/75 border border-cyan-500/25 text-xs font-mono tracking-widest text-cyan-300 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>
                CORE: {reactorState.toUpperCase()} • {preferences.language.toUpperCase()}
              </span>
            </div>

            {/* Centerpiece Metallic & Cyan Arc Reactor */}
            <div className="flex-1 min-h-0 flex items-center justify-center w-full my-1">
              <ArcReactor
                state={reactorState}
                colorTheme={preferences.reactorColor}
                className="w-[clamp(185px,27vh,280px)]"
                interactive={true}
                onClick={toggleVoice}
              />
            </div>

            {/* Live Transcript / Response Readout */}
            <div className="w-full max-w-xl text-center min-h-[28px] flex items-center justify-center px-3 mb-2">
              {isVoiceListening ? (
                <span className="text-xs xl:text-sm font-mono text-cyan-300 animate-pulse truncate">
                  {interimTranscript || 'Listening... Speak command in English, Hindi, or Hinglish'}
                </span>
              ) : isSpeaking ? (
                <button
                  onClick={stopSpeakingOutput}
                  className="text-xs font-mono px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/50 text-sky-200 hover:bg-sky-500/30"
                >
                  JARVIS Speaking • Tap to Interrupt
                </button>
              ) : lastModelMsg ? (
                <p className="text-xs text-slate-400 truncate max-w-lg">
                  Last reply: <span className="text-slate-200">{lastModelMsg.text}</span>
                </p>
              ) : (
                <span className="text-xs font-mono text-slate-400">
                  Tap reactor or microphone below to speak
                </span>
              )}
            </div>

            {/* Smart Board Center Mic & Prompt Dock with Symmetrical Waveforms */}
            <div className="w-full max-w-2xl relative pt-5 shrink-0">
              {/* Elevated Circular Mic Trigger */}
              <div className="flex justify-center absolute top-0 left-1/2 -translate-x-1/2 z-20">
                <button
                  type="button"
                  onClick={toggleVoice}
                  aria-label={isVoiceListening ? 'Stop Listening' : 'Tap or Speak to JARVIS'}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all active:scale-95 ${
                    isVoiceListening
                      ? 'bg-red-500 border-red-200 text-white shadow-[0_0_24px_rgba(239,68,68,0.8)] animate-pulse'
                      : 'bg-slate-900 border-cyan-300 text-cyan-200 shadow-[0_0_22px_rgba(0,240,255,0.55)] hover:bg-cyan-950'
                  }`}
                >
                  {isVoiceListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              </div>

              {/* Symmetrical Waveforms + Beveled Prompt Input Bar */}
              <div className="flex items-center gap-3">
                <div className="hidden xl:flex items-center gap-1 h-6 shrink-0" aria-hidden="true">
                  {[25, 45, 75, 100, 65, 40, 25].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-cyan-400/75"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                <form
                  onSubmit={handleSend}
                  className="flex-1 min-w-0 hud-panel border-cyan-400/50 rounded-2xl px-4 pt-5 pb-2 flex items-center gap-2 shadow-[0_0_26px_rgba(0,240,255,0.16)]"
                >
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Tap mic or ask JARVIS anything..."
                    className="flex-1 min-w-0 bg-transparent py-1.5 text-sm xl:text-base text-slate-100 placeholder-slate-400 text-center focus:outline-none font-sans"
                  />
                  {textInput.trim() && (
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase shrink-0 flex items-center gap-1.5"
                    >
                      <span>Send</span>
                      <Send size={14} />
                    </button>
                  )}
                </form>

                <div className="hidden xl:flex items-center gap-1 h-6 shrink-0" aria-hidden="true">
                  {[25, 40, 65, 100, 75, 45, 25].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-cyan-400/75"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: System Status + Ecosystem Overview */}
          <div className="col-span-4 xl:col-span-3 flex flex-col gap-4 min-h-0">
            {/* System Status Card */}
            <div className="hud-panel rounded-2xl p-4 xl:p-5 shrink-0">
              <div className="flex items-center gap-2 text-sm xl:text-base font-bold text-slate-100 mb-3">
                <Activity size={17} className="text-cyan-400" />
                <span>System Status</span>
              </div>

              <div className="space-y-2.5 text-xs xl:text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Cpu size={14} className="text-cyan-400/80" />
                    Core Engine
                  </span>
                  <span className="text-emerald-400 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Online
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Radio size={14} className="text-cyan-400/80" />
                    Voice Module
                  </span>
                  <span className="text-emerald-400 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {isVoiceListening ? 'Listening' : isSpeaking ? 'Speaking' : 'Ready'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Sparkles size={14} className="text-cyan-400/80" />
                    AI Model
                  </span>
                  <span className="text-emerald-400 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Database size={14} className="text-cyan-400/80" />
                    Storage Cache
                  </span>
                  <span className="text-emerald-400 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {syncStatus === 'cloud_synced' ? 'Synced' : 'Enabled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Ecosystem Overview Card (Real Data Counts) */}
            <div className="hud-panel rounded-2xl p-4 xl:p-5 flex-1 min-h-0 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-sm xl:text-base font-bold text-slate-100 mb-2">
                <Layers size={17} className="text-cyan-400" />
                <span>Ecosystem Overview</span>
              </div>

              <div className="space-y-2 flex-1 flex flex-col justify-around text-xs xl:text-sm">
                <button
                  onClick={() => setActiveView('memory')}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900/55 hover:bg-slate-800/75 border border-cyan-500/15 hover:border-cyan-400/40 transition-colors text-left"
                >
                  <span className="text-slate-200 truncate">Memories Vault</span>
                  <span className="font-mono text-cyan-300 shrink-0">{memories.length} Stored</span>
                </button>

                <button
                  onClick={() => setActiveView('history')}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900/55 hover:bg-slate-800/75 border border-cyan-500/15 hover:border-cyan-400/40 transition-colors text-left"
                >
                  <span className="text-slate-200 truncate">Saved Sessions</span>
                  <span className="font-mono text-cyan-300 shrink-0">{conversations.length} Logs</span>
                </button>

                <button
                  onClick={() => setActiveView('commands')}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900/55 hover:bg-slate-800/75 border border-cyan-500/15 hover:border-cyan-400/40 transition-colors text-left"
                >
                  <span className="text-slate-200 truncate">Voice Commands</span>
                  <span className="font-mono text-cyan-300 shrink-0">{customCommands.length} Active</span>
                </button>

                <button
                  onClick={() => setActiveView('devices')}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900/55 hover:bg-slate-800/75 border border-cyan-500/15 hover:border-cyan-400/40 transition-colors text-left"
                >
                  <span className="text-slate-200 truncate">Paired Devices</span>
                  <span className="font-mono text-cyan-300 shrink-0">{activeDevicesCount} Online</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Smart Board Quick-Module Strip */}
        <div className="shrink-0 grid grid-cols-6 gap-3">
          {smartBoardBottomDock.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className="hud-panel-interactive rounded-2xl py-3 px-2 flex flex-col items-center justify-center gap-1.5 min-h-[72px]"
              >
                <Icon size={20} className="text-cyan-300" />
                <span className="text-xs font-medium text-slate-100 truncate max-w-full">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
