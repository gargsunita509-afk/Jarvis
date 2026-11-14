import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Mic,
  Brain,
  Sliders,
  Smartphone,
  Terminal,
  Cpu,
  History,
  Sparkles,
  ShieldCheck,
  Download,
  FileCode2,
  HelpCircle,
  Home,
  Volume2,
  VolumeX,
  Cloud,
  HardDrive,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Radio,
  LayoutGrid,
  Power,
  Calendar,
  UserCheck
} from 'lucide-react';
import { useJarvis } from '../context/JarvisContext.tsx';
import { PageView } from '../types/jarvis.ts';

interface NavItem {
  id: PageView;
  label: string;
  shortLabel?: string;
  icon: React.ElementType;
  badge?: string;
}

export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Command Centre', shortLabel: 'Dashboard', icon: LayoutDashboard },
  { id: 'conversation', label: 'Voice Core', shortLabel: 'Voice Core', icon: Mic },
  { id: 'memory', label: 'Memory Bank', shortLabel: 'Memory', icon: Brain },
  { id: 'personalization', label: 'Customization', shortLabel: 'Customize', icon: Sliders },
  { id: 'devices', label: 'Ecosystem Devices', shortLabel: 'Devices', icon: Smartphone },
  { id: 'commands', label: 'Custom Commands', shortLabel: 'Commands', icon: Terminal },
  { id: 'automations', label: 'Automations', shortLabel: 'Routines', icon: Cpu },
  { id: 'history', label: 'Session Archives', shortLabel: 'Archives', icon: History },
  { id: 'ai-settings', label: 'AI Core Config', shortLabel: 'AI Core', icon: Sparkles },
  { id: 'account', label: 'Security & Privacy', shortLabel: 'Security', icon: ShieldCheck },
  { id: 'apk', label: 'APK Download', shortLabel: 'APK Centre', icon: Download, badge: 'APK' },
  { id: 'contract', label: 'Companion Contract', shortLabel: 'Contract', icon: FileCode2 },
  { id: 'help', label: 'User Manual', shortLabel: 'Manual', icon: HelpCircle },
  { id: 'landing', label: 'Landing Portal', shortLabel: 'Portal', icon: Home },
];

interface NavigationShellProps {
  children: React.ReactNode;
}

export const NavigationShell: React.FC<NavigationShellProps> = ({ children }) => {
  const {
    activeView,
    setActiveView,
    reactorState,
    syncStatus,
    preferences,
    updatePreferences,
    user,
    devices,
    isVoiceListening,
    startVoiceInput,
    stopVoiceInput
  } = useJarvis();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clockTime, setClockTime] = useState('');
  const [clockDate, setClockDate] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClockTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setClockDate(now.toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 15000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    updatePreferences({ soundEffectsEnabled: !preferences.soundEffectsEnabled });
  };

  const onlineDevicesCount = devices.filter(d => d.status === 'online').length;
  const assistantTitle = preferences.assistantName || 'JARVIS';

  const handleCenterReactorTap = () => {
    setMobileMenuOpen(false);
    if (activeView === 'conversation') {
      if (isVoiceListening) {
        stopVoiceInput();
      } else {
        startVoiceInput();
      }
    } else {
      setActiveView('conversation');
    }
  };

  return (
    <div className="flex flex-col w-full h-[100dvh] overflow-hidden bg-[#020611] font-sans text-slate-100">
      {/* MOBILE TOP HUD BAR (< md) */}
      <header className="md:hidden h-14 shrink-0 px-3 flex items-center justify-between bg-[#040916]/95 border-b border-cyan-500/25 backdrop-blur-md z-40">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-11 h-11 rounded-xl bg-slate-900/90 border border-cyan-500/35 text-cyan-300 flex items-center justify-center active:scale-95 transition-transform"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <button
          onClick={() => {
            setActiveView('dashboard');
            setMobileMenuOpen(false);
          }}
          className="flex flex-col items-center justify-center px-4 py-1 rounded-xl border border-cyan-500/25 bg-[#071124]/90 shadow-[0_0_14px_rgba(0,240,255,0.12)]"
        >
          <span className="font-hud font-bold tracking-[0.22em] text-sm text-slate-100 leading-tight">
            {assistantTitle}
          </span>
          <span className="text-[9px] font-mono tracking-[0.18em] text-cyan-400/80 uppercase leading-tight">
            PERSONAL AI ASSISTANT
          </span>
        </button>

        <button
          onClick={toggleSound}
          className="relative w-11 h-11 rounded-xl bg-slate-900/90 border border-cyan-500/35 text-cyan-300 flex items-center justify-center active:scale-95 transition-transform"
          title={preferences.soundEffectsEnabled ? 'Mute HUD Audio' : 'Enable HUD Audio'}
          aria-label="Toggle HUD Audio"
        >
          {preferences.soundEffectsEnabled ? <Volume2 size={19} /> : <VolumeX size={19} className="text-slate-500" />}
          <span
            className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
              syncStatus === 'cloud_synced' ? 'bg-emerald-400' : 'bg-cyan-400'
            }`}
          />
        </button>
      </header>

      {/* TABLET & SMART BOARD TOP HUD BAR (md+) */}
      <header className="hidden md:flex h-16 shrink-0 px-4 lg:px-6 items-center justify-between gap-4 bg-[#030815]/95 border-b border-cyan-500/25 backdrop-blur-md z-40">
        {/* Left Brand */}
        <button
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-3 group shrink-0 text-left"
        >
          <div className="relative w-10 h-10 rounded-full bg-slate-900 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_14px_rgba(0,240,255,0.35)]">
            <div
              className={`w-4 h-4 rounded-full border border-cyan-200 ${
                reactorState === 'error'
                  ? 'bg-amber-400'
                  : 'bg-cyan-400 shadow-[0_0_10px_#00f0ff]'
              } ${reactorState === 'listening' || reactorState === 'thinking' ? 'animate-ping' : 'animate-pulse'}`}
            />
          </div>
          <div>
            <div className="font-hud font-extrabold tracking-[0.2em] text-lg lg:text-xl text-white leading-none">
              {assistantTitle}
            </div>
            <div className="text-[10px] font-mono tracking-[0.26em] text-cyan-400/75 uppercase mt-1">
              AI ASSISTANT // OS V2.5
            </div>
          </div>
        </button>

        {/* Center Real Telemetry Chips (Smart Board wide HUD) */}
        <div className="hidden lg:flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setActiveView('account')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/75 border border-cyan-500/25 hover:border-cyan-400/60 text-xs font-mono text-slate-200 transition-colors min-w-0"
          >
            <UserCheck size={14} className="text-cyan-400 shrink-0" />
            <span className="truncate max-w-[160px]">
              {user ? (user.displayName || user.email) : (preferences.preferredName || 'Local Operator')}
            </span>
          </button>

          <button
            onClick={() => setActiveView('ai-settings')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/75 border border-cyan-500/25 hover:border-cyan-400/60 text-xs font-mono transition-colors shrink-0"
          >
            {syncStatus === 'cloud_synced' ? (
              <>
                <Cloud size={14} className="text-emerald-400" />
                <span className="text-emerald-300">CLOUD SYNCED</span>
              </>
            ) : syncStatus === 'syncing' ? (
              <>
                <Radio size={14} className="text-cyan-400 animate-spin" />
                <span className="text-cyan-300">SYNCING</span>
              </>
            ) : (
              <>
                <HardDrive size={14} className="text-amber-400" />
                <span className="text-amber-300">LOCAL CACHE</span>
              </>
            )}
          </button>

          <button
            onClick={() => setActiveView('devices')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/75 border border-cyan-500/25 hover:border-cyan-400/60 text-xs font-mono text-slate-200 transition-colors shrink-0"
          >
            <Smartphone size={14} className="text-cyan-400" />
            <span>{onlineDevicesCount}/{devices.length} NODES</span>
            <span className="text-cyan-400/70">• {preferences.language.toUpperCase()}</span>
          </button>
        </div>

        {/* Right Clock, Date & Audio Control */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/65 border border-cyan-500/20">
            <Calendar size={16} className="text-cyan-400 shrink-0" />
            <div className="text-right leading-tight">
              <div className="font-hud text-sm lg:text-base font-bold text-cyan-200">{clockTime}</div>
              <div className="text-[10px] font-mono text-slate-400">{clockDate}</div>
            </div>
          </div>

          <button
            onClick={toggleSound}
            className="w-11 h-11 rounded-xl bg-slate-900/85 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 flex items-center justify-center transition-colors"
            title={preferences.soundEffectsEnabled ? 'Mute HUD Audio' : 'Enable HUD Audio'}
            aria-label="Toggle HUD Audio"
          >
            {preferences.soundEffectsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-slate-500" />}
          </button>
        </div>
      </header>

      {/* MIDDLE ROW: DESKTOP/SMARTBOARD SIDEBAR + MAIN VIEWPORT */}
      <div className="flex-1 min-h-0 flex flex-row w-full overflow-hidden">
        {/* LEFT NAVIGATION SIDEBAR (md+) */}
        <aside
          className={`hidden md:flex flex-col border-r border-cyan-500/20 bg-[#040916]/92 backdrop-blur-md transition-all duration-300 z-30 select-none shrink-0 ${
            collapsed ? 'w-20' : 'w-56 lg:w-64'
          }`}
        >
          <div className="px-3 py-2.5 border-b border-cyan-500/15 flex items-center justify-between">
            {!collapsed && (
              <span className="text-[10px] font-mono tracking-[0.2em] text-cyan-400/70 uppercase px-1">
                SYSTEM MODULES
              </span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg text-cyan-400/70 hover:text-cyan-200 hover:bg-cyan-500/10 transition-colors ml-auto"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Navigation Links (Touch-friendly >= 46px) */}
          <nav className="flex-1 overflow-y-auto py-2.5 px-2 space-y-1 scrollbar-thin scrollbar-thumb-cyan-500/20">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full min-h-[46px] lg:min-h-[48px] flex items-center gap-3 px-3 rounded-xl text-sm font-medium transition-all group ${
                    collapsed ? 'justify-center px-0' : ''
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/25 via-sky-500/15 to-transparent text-cyan-100 border border-cyan-400/50 shadow-[0_0_16px_rgba(0,240,255,0.18)]'
                      : 'text-slate-400 hover:text-cyan-200 hover:bg-slate-800/45 border border-transparent'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    size={20}
                    className={`shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-300'
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate tracking-wide text-left flex-1">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Power & Status Dock (inspired by Smart Board ref) */}
          <div className="p-3 border-t border-cyan-500/20 flex items-center justify-between gap-2">
            <div className={`flex items-center gap-2 text-xs font-mono ${collapsed ? 'mx-auto' : ''}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse shrink-0" />
              {!collapsed && <span className="text-emerald-300 truncate">System Online</span>}
            </div>
            {!collapsed && (
              <button
                onClick={() => setActiveView('landing')}
                className="w-9 h-9 rounded-full bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 flex items-center justify-center transition-colors shrink-0"
                title="Return to Landing Portal"
                aria-label="Return to Landing Portal"
              >
                <Power size={15} />
              </button>
            )}
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col relative pb-[76px] md:pb-0">
          {children}
        </div>
      </div>

      {/* MOBILE SLIDE-OVER DRAWER (< md) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-[#020611]/98 backdrop-blur-xl z-50 flex flex-col overflow-y-auto px-4 pt-4 pb-24 space-y-2 border-t border-cyan-500/25">
          {/* Quick Profile & Sync Strip */}
          <div className="p-3.5 rounded-xl hud-panel flex items-center justify-between gap-3 mb-2">
            <div className="min-w-0">
              <div className="text-xs font-mono font-bold text-slate-100 truncate">
                {user ? user.displayName || user.email : `Operator: ${preferences.preferredName || 'Sir'}`}
              </div>
              <div className="text-[11px] font-mono text-cyan-400/80 mt-0.5 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${syncStatus === 'cloud_synced' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span>{syncStatus === 'cloud_synced' ? 'Cloud Synced' : 'Offline Local Cache'}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveView('account');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 text-xs font-mono shrink-0"
            >
              Account
            </button>
          </div>

          <div className="text-[11px] font-mono text-cyan-400/70 uppercase tracking-widest px-1 pb-1">
            All JARVIS Modules
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full min-h-[48px] flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-400/60 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                      : 'text-slate-300 bg-slate-900/40 border border-cyan-500/10 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon size={19} className={isActive ? 'text-cyan-400 shrink-0' : 'text-slate-400 shrink-0'} />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MOBILE FIXED BOTTOM NAVIGATION (< md) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#040916]/95 border-t border-cyan-500/30 backdrop-blur-xl z-40 grid grid-cols-5 items-center px-1 shadow-[0_-8px_24px_rgba(0,0,0,0.6)]"
        aria-label="Mobile Primary Navigation"
      >
        <button
          onClick={() => {
            setActiveView('dashboard');
            setMobileMenuOpen(false);
          }}
          className={`h-full flex flex-col items-center justify-center gap-1 rounded-lg transition-colors ${
            activeView === 'dashboard' && !mobileMenuOpen ? 'text-cyan-300' : 'text-slate-400'
          }`}
        >
          <Home size={20} />
          <span className="text-[10px] font-mono leading-none">Home</span>
        </button>

        <button
          onClick={() => {
            setActiveView('conversation');
            setMobileMenuOpen(false);
          }}
          className={`h-full flex flex-col items-center justify-center gap-1 rounded-lg transition-colors ${
            activeView === 'conversation' && !mobileMenuOpen ? 'text-cyan-300' : 'text-slate-400'
          }`}
        >
          <Mic size={20} className={activeView === 'conversation' ? 'text-cyan-400' : ''} />
          <span className="text-[10px] font-mono leading-none">Voice</span>
        </button>

        {/* Central Elevated Arc Reactor Quick Trigger */}
        <div className="flex items-center justify-center">
          <button
            onClick={handleCenterReactorTap}
            aria-label="Activate JARVIS Voice Core"
            className={`relative -top-2.5 w-14 h-14 rounded-full bg-gradient-to-b from-slate-700 via-slate-900 to-slate-950 border-2 flex items-center justify-center active:scale-95 transition-all ${
              isVoiceListening
                ? 'border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.75)]'
                : 'border-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.65)]'
            }`}
          >
            <div className="w-10 h-10 rounded-full border border-cyan-400/70 bg-slate-950 flex items-center justify-center">
              <div
                className={`w-6 h-6 rounded-full ${
                  isVoiceListening
                    ? 'bg-red-400 animate-ping'
                    : 'bg-gradient-to-tr from-cyan-400 to-white shadow-[0_0_12px_#00f0ff] animate-pulse'
                }`}
              />
            </div>
          </button>
        </div>

        <button
          onClick={() => {
            setActiveView('memory');
            setMobileMenuOpen(false);
          }}
          className={`h-full flex flex-col items-center justify-center gap-1 rounded-lg transition-colors ${
            activeView === 'memory' && !mobileMenuOpen ? 'text-cyan-300' : 'text-slate-400'
          }`}
        >
          <Brain size={20} />
          <span className="text-[10px] font-mono leading-none">Memory</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`h-full flex flex-col items-center justify-center gap-1 rounded-lg transition-colors ${
            mobileMenuOpen ? 'text-cyan-300' : 'text-slate-400'
          }`}
        >
          <LayoutGrid size={20} />
          <span className="text-[10px] font-mono leading-none">More</span>
        </button>
      </nav>
    </div>
  );
};

export const Navigation = NavigationShell;
