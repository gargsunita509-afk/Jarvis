import React from 'react';
import { JarvisProvider, useJarvis } from './context/JarvisContext.tsx';
import { NavigationShell } from './components/Navigation.tsx';
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

  if (activeView === 'landing') {
    return (
      <div className="min-h-[100dvh] w-full overflow-x-hidden bg-[#020611]">
        <LandingPage />
        <InstallPrompt />
      </div>
    );
  }

  return (
    <NavigationShell>
      <main className="flex-1 min-w-0 min-h-0 flex flex-col relative overflow-hidden">
        {/* Subtle Background Scanning Grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#00f0ff 1px, transparent 1px), linear-gradient(90deg, #00f0ff 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />

        {/* Global Toast Notification */}
        {systemNotification && (
          <div className="fixed top-16 md:top-20 left-3 right-3 sm:left-auto sm:right-5 z-50 sm:max-w-md px-4 py-3 rounded-xl bg-[#060e24]/95 border border-cyan-400/80 text-cyan-100 text-xs font-mono shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center justify-between gap-3 backdrop-blur-md">
            <span className="min-w-0 break-words">{systemNotification}</span>
            <button
              onClick={clearNotification}
              className="text-cyan-400/70 hover:text-cyan-200 shrink-0 p-1"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        )}

        {/* Active Page View Switcher */}
        <div className="relative z-10 flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
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
    </NavigationShell>
  );
};

export default function App() {
  return (
    <JarvisProvider>
      <MainLayout />
    </JarvisProvider>
  );
}
