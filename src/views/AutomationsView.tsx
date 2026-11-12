import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Play,
  Pause,
  Trash2,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Info
} from 'lucide-react';
import { useJarvis } from '../context/JarvisContext.tsx';
import { Automation } from '../types/jarvis.ts';

export const AutomationsView: React.FC = () => {
  const { automations, saveAutomationItem, deleteAutomationItem } = useJarvis();
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [triggerType, setTriggerType] = useState<Automation['triggerType']>('Schedule (Time)');
  const [triggerConfig, setTriggerConfig] = useState('08:00 AM Daily');
  const [actionType, setActionType] = useState<Automation['actionType']>('Daily Briefing');
  const [actionPayload, setActionPayload] = useState('Voice summary of pending projects and battery levels');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await saveAutomationItem({
      name: name.trim(),
      triggerType,
      triggerConfig,
      actionType,
      actionPayload,
      isEnabled: true
    });

    setModalOpen(false);
    setName('');
  };

  const toggleAutomationState = async (auto: Automation) => {
    await saveAutomationItem({
      name: auto.name,
      triggerType: auto.triggerType,
      triggerConfig: auto.triggerConfig,
      actionType: auto.actionType,
      actionPayload: auto.actionPayload,
      isEnabled: !auto.isEnabled,
      lastRunAt: auto.lastRunAt
    }, auto.id);
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#050b18]/80 border border-cyan-500/20">
        <div>
          <div className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase flex items-center gap-2">
            <Cpu size={14} className="text-cyan-400" />
            <span>BACKGROUND ENGINE // {automations.length} PIPELINES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100 mt-1">
            Automations & Routines
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Scheduled workflows and event-triggered routines synchronized across the JARVIS personal ecosystem.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
        >
          <Plus size={16} />
          <span>New Automation</span>
        </button>
      </div>

      {/* CLOUD SCHEDULER ARCHITECTURE CLARIFICATION */}
      <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/20 flex items-start gap-3 text-xs font-sans text-slate-300">
        <Info size={18} className="text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-mono text-cyan-300">Scheduler Infrastructure Reality:</strong>
          <span className="block mt-0.5 text-slate-400">
            In compliance with our ₹0 Spark tier, time-based routines run while the web dashboard is open or when triggered natively by the companion Android APK (WorkManager). No costly always-on Cloud Run workers are provisioned.
          </span>
        </div>
      </div>

      {/* AUTOMATIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {automations.map((auto) => (
          <div
            key={auto.id}
            className={`p-6 rounded-2xl bg-gradient-to-b from-[#060e20] to-[#040814] border transition-all ${
              auto.isEnabled
                ? 'border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.05)]'
                : 'border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase">
                  {auto.triggerType}
                </span>
                <h3 className="font-mono text-base font-bold text-slate-100 mt-2">{auto.name}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAutomationState(auto)}
                  className={`p-2 rounded-lg border text-xs font-mono transition-colors ${
                    auto.isEnabled
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                  title={auto.isEnabled ? 'Pause Routine' : 'Resume Routine'}
                >
                  {auto.isEnabled ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                  onClick={() => deleteAutomationItem(auto.id)}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-red-400"
                  title="Delete Routine"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="my-4 pt-3 border-t border-cyan-500/10 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>TRIGGER RULE:</span>
                <span className="text-cyan-300">{auto.triggerConfig}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ACTION DISPATCH:</span>
                <span className="text-slate-200">{auto.actionType}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/10 text-xs font-sans text-slate-300">
              {auto.actionPayload}
            </div>

            <div className="mt-4 pt-3 border-t border-cyan-500/10 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                <span>Last run: {auto.lastRunAt ? new Date(auto.lastRunAt).toLocaleTimeString() : 'Awaiting trigger'}</span>
              </span>
              <span className={auto.isEnabled ? 'text-emerald-400' : 'text-slate-500'}>
                {auto.isEnabled ? 'ACTIVE MONITORING' : 'PAUSED'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE AUTOMATION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#060c1d] border border-cyan-500/40 p-6 shadow-[0_0_40px_rgba(0,240,255,0.2)]">
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
              <h2 className="text-lg font-mono font-bold text-slate-100 flex items-center gap-2">
                <Cpu size={18} className="text-cyan-400" />
                <span>CONFIGURE AUTOMATION</span>
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-cyan-300">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-cyan-400/80 mb-1">ROUTINE NAME</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 08:00 AM Morning Briefing"
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-400 font-sans text-sm"
                />
              </div>

              <div>
                <label className="block text-cyan-400/80 mb-1">TRIGGER EVENT</label>
                <select
                  value={triggerType}
                  onChange={(e) => setTriggerType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="Schedule (Time)">Schedule (Time)</option>
                  <option value="Device Connected">Device Connected</option>
                  <option value="Voice Shortcut">Voice Shortcut</option>
                  <option value="Geofence Entry">Geofence Entry (Companion APK)</option>
                </select>
              </div>

              <div>
                <label className="block text-cyan-400/80 mb-1">TRIGGER PARAMETER</label>
                <input
                  type="text"
                  required
                  value={triggerConfig}
                  onChange={(e) => setTriggerConfig(e.target.value)}
                  placeholder="e.g. 08:00 AM Daily or Pixel 9 Pro connected"
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 font-sans text-sm"
                />
              </div>

              <div>
                <label className="block text-cyan-400/80 mb-1">ACTION TYPE</label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="Daily Briefing">Daily Briefing</option>
                  <option value="Memory Snapshot">Memory Snapshot</option>
                  <option value="Device Routine">Device Routine</option>
                  <option value="Notification Ping">Notification Ping</option>
                </select>
              </div>

              <div>
                <label className="block text-cyan-400/80 mb-1">ACTION PAYLOAD / DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={actionPayload}
                  onChange={(e) => setActionPayload(e.target.value)}
                  placeholder="Details of the action to execute..."
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 font-sans text-sm"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider"
                >
                  Save Automation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
