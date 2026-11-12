import React, { useState } from 'react';
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
  Radio
} from 'lucide-react';
import { useJarvis } from '../context/JarvisContext.tsx';
import { PageView } from '../types/jarvis.ts';

interface NavItem {
  id: PageView;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Command Centre', icon: LayoutDashboard },
  { id: 'conversation', label: 'Voice Core', icon: Mic },
  { id: 'memory', label: 'Memory Bank', icon: Brain },
  { id: 'personalization', label: 'Customization', icon: Sliders },
  { id: 'devices', label: 'Ecosystem Devices', icon: Smartphone },
  { id: 'commands', label: 'Custom Commands', icon: Terminal },
  { id: 'automations', label: 'Automations', icon: Cpu },
  { id: 'history', label: 'Session Archives', icon: History },
  { id: 'ai-settings', label: 'AI Core Config', icon: Sparkles },
  { id: 'account', label: 'Security & Privacy', icon: ShieldCheck },
  { id: 'apk', label: 'APK Download', icon: Download, badge: 'APK' },
  { id: 'contract', label: 'Companion Contract', icon: FileCode2 },
  { id: 'help', label: 'User Manual', icon: HelpCircle },
  { id: 'landing', label: 'Landing Portal', icon: Home },
];

export const Navigation: React.FC = () => {
  const {
    activeView,
    setActiveView,
    reactorState,
    syncStatus,
    preferences,
    updatePreferences,
    user
  } = useJarvis();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    updatePreferences({ soundEffectsEnabled: !preferences.soundEffectsEnabled });
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col border-r border-cyan-500/20 bg-[#040814]/90 backdrop-blur-md transition-all duration-300 z-40 select-none ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Top Branding & Arc Mini Core */}
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
          <div
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Miniature Pulsing Reactor Icon */}
            <div className="relative w-9 h-9 flex items-center justify-center rounded-full bg-slate-900 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.4)]">
              <div
                className={`w-4 h-4 rounded-full border border-cyan-300 ${
                  reactorState === 'error'
                    ? 'bg-amber-400'
                    : 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]'
                } ${reactorState === 'listening' || reactorState === 'thinking' ? 'animate-ping' : 'animate-pulse'}`}
              />
            </div>

            {!collapsed && (
              <div>
                <div className="font-mono font-bold tracking-widest text-lg bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent">
                  {preferences.assistantName || 'J.A.R.V.I.S.'}
                </div>
                <div className="text-[10px] font-mono text-cyan-400/60 tracking-wider">
                  OS V2.5 // CORE STABLE
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded text-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Sync Status Badge */}
        {!collapsed && (
          <div className="px-4 py-2 border-b border-cyan-500/10 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              {syncStatus === 'cloud_synced' ? (
                <>
                  <Cloud size={14} className="text-emerald-400" />
                  <span className="text-emerald-400">CLOUD SYNCED</span>
                </>
              ) : syncStatus === 'syncing' ? (
                <>
                  <Radio size={14} className="text-cyan-400 animate-spin" />
                  <span className="text-cyan-400">SYNCING...</span>
                </>
              ) : (
                <>
                  <HardDrive size={14} className="text-amber-400" />
                  <span className="text-amber-400">LOCAL (IDB)</span>
                </>
              )}
            </div>
            <button
              onClick={toggleSound}
              className="text-cyan-400/70 hover:text-cyan-300 transition-colors"
              title={preferences.soundEffectsEnabled ? 'Mute HUD Audio' : 'Enable HUD Audio'}
            >
              {preferences.soundEffectsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-slate-500" />}
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin scrollbar-thumb-cyan-500/20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-200 border-l-2 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/40'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  size={19}
                  className={`shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
                  }`}
                />
                {!collapsed && (
                  <span className="truncate tracking-wide">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom User Profile */}
        <div className="p-3 border-t border-cyan-500/20">
          <div
            onClick={() => setActiveView('account')}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold">
              {user?.email ? user.email.charAt(0).toUpperCase() : 'G'}
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="text-xs font-mono text-slate-200 truncate">
                  {user ? user.displayName || user.email : 'Local Guest'}
                </div>
                <div className="text-[10px] text-cyan-400/70 font-mono">
                  {user ? 'Verified Profile' : 'Offline Mode'}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#040814]/95 border-b border-cyan-500/20 z-40 backdrop-blur-md">
        <div
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-slate-900 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_8px_#00f0ff]">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <span className="font-mono font-bold tracking-wider text-base text-cyan-300">
            {preferences.assistantName || 'J.A.R.V.I.S.'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 text-cyan-400/70"
            title="Toggle Sound"
          >
            {preferences.soundEffectsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-slate-500" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-300"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* MOBILE FULL-DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] bg-[#030712]/95 backdrop-blur-lg z-50 flex flex-col p-4 overflow-y-auto space-y-2 border-t border-cyan-500/20">
          <div className="text-xs font-mono text-cyan-400/60 uppercase tracking-widest px-2 pb-1">
            Navigation Console
          </div>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-200 border-l-2 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#040814]/95 border-t border-cyan-500/30 backdrop-blur-md z-40 flex items-center justify-around px-2">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'dashboard' ? 'text-cyan-300' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-mono">Core</span>
        </button>

        <button
          onClick={() => setActiveView('conversation')}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'conversation' ? 'text-cyan-300' : 'text-slate-400'
          }`}
        >
          <Mic size={20} className={activeView === 'conversation' ? 'animate-pulse text-cyan-400' : ''} />
          <span className="text-[10px] font-mono">Voice</span>
        </button>

        {/* Central Floating Quick Trigger Button */}
        <button
          onClick={() => setActiveView('conversation')}
          className="relative -top-4 w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-600 to-sky-400 border-2 border-cyan-200 flex items-center justify-center shadow-[0_0_15px_#00f0ff] active:scale-95 transition-transform"
        >
          <div className="w-5 h-5 rounded-full bg-white animate-pulse" />
        </button>

        <button
          onClick={() => setActiveView('memory')}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'memory' ? 'text-cyan-300' : 'text-slate-400'
          }`}
        >
          <Brain size={20} />
          <span className="text-[10px] font-mono">Memory</span>
        </button>

        <button
          onClick={() => setActiveView('apk')}
          className={`flex flex-col items-center gap-1 ${
            activeView === 'apk' ? 'text-cyan-300' : 'text-slate-400'
          }`}
        >
          <Download size={20} />
          <span className="text-[10px] font-mono">APK</span>
        </button>
      </nav>
    </>
  );
};
