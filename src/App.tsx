import React from 'react';
import { JarvisProvider, useJarvis } from './context/JarvisContext.tsx';
import { Navigation } from './components/Navigation.tsx';
import { InstallPrompt } from './components/InstallPrompt.tsx';

// Views
import { LandingPage } from './views/LandingPage.tsx';
import { DashboardView } from './views/DashboardView.tsx';
import { ConversationView } from './views/ConversationView.tsx';
import { MemoryView } from './views/MemoryView.tsx';
import { PersonalizationView } from './views/PersonalizationView.tsx';
import { DevicesView } from './views/DevicesView.tsx';
import { CommandsView } from './views/CommandsView.tsx';
import { AutomationsView } from './views/AutomationsView.tsx';
import { HistoryView } from './views/HistoryView.tsx';
import { AISettingsView } from './views/AISettingsView.tsx';
import { AccountView } from './views/AccountView.tsx';
import { ApkDownloadView } from './views/ApkDownloadView.tsx';
import { ContractView } from './views/ContractView.tsx';
import { HelpView } from './views/HelpView.tsx';

const MainLayout: React.FC = () => {
  const { activeView, systemNotification, clearNotification } = useJarvis();

  // If user is on the Landing Page, render full cinematic landing page without app sidebar
  if (activeView === 'landing') {
    return (
      <div className="min-h-screen bg-[#030712]">
        <LandingPage />
        <InstallPrompt />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#030712] font-sans text-slate-100">
      {/* HUD Navigation Sidebar & Mobile Nav */}
      <Navigation />

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col h-full overflow-hidden pb-16 md:pb-0 relative">
        {/* Subtle Background Scanning Lines */}
        <div 
          className="absolute inset-0 opacity-[0.025] pointer-events-none" 
          style={{
            backgroundImage: `linear-gradient(#00f0ff 1px, transparent 1px), linear-gradient(90deg, #00f0ff 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />

        {/* Global Toast Notification */}
        {systemNotification && (
          <div className="fixed top-4 right-4 z-50 max-w-md px-4 py-3 rounded-xl bg-[#060e24] border border-cyan-400 text-cyan-200 text-xs font-mono shadow-[0_0_20px_rgba(0,240,255,0.3)] animate-fade-in flex items-center justify-between gap-3">
            <span>{systemNotification}</span>
            <button
              onClick={clearNotification}
              className="text-cyan-400/60 hover:text-cyan-200"
            >
              ✕
            </button>
          </div>
        )}

        {/* Active Page View Switcher */}
        <div className="flex-1 h-full overflow-hidden">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'conversation' && <ConversationView />}
          {activeView === 'memory' && <MemoryView />}
          {activeView === 'personalization' && <PersonalizationView />}
          {activeView === 'devices' && <DevicesView />}
          {activeView === 'commands' && <CommandsView />}
          {activeView === 'automations' && <AutomationsView />}
          {activeView === 'history' && <HistoryView />}
          {activeView === 'ai-settings' && <AISettingsView />}
          {activeView === 'account' && <AccountView />}
          {activeView === 'apk' && <ApkDownloadView />}
          {activeView === 'contract' && <ContractView />}
          {activeView === 'help' && <HelpView />}
        </div>

        {/* PWA Install Banner */}
        <InstallPrompt />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <JarvisProvider>
      <MainLayout />
    </JarvisProvider>
  );
}
