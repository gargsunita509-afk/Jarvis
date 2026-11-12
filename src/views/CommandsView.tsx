import React, { useState } from 'react';
import {
  Terminal,
  Plus,
  Zap,
  Play,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useJarvis } from '../context/JarvisContext.tsx';
import { CustomCommand } from '../types/jarvis.ts';

const VALIDATED_ACTIONS = [
  { id: 'ACTION_QUERY_PROJECT_NEXORA', label: 'Recall Authorized Study/Project Memory' },
  { id: 'ACTION_RUN_MORNING_DIAGNOSTIC', label: 'Execute Morning Ecosystem Diagnostics' },
  { id: 'ACTION_NAVIGATE_MEMORIES', label: 'Open Knowledge & Memory Repository' },
  { id: 'ACTION_TRIGGER_APK_SYNC', label: 'Dispatch Android APK Synchronization' },
  { id: 'ACTION_SYSTEM_STATUS_REPORT', label: 'Vocalize System & Battery Status' },
];

export const CommandsView: React.FC = () => {
  const { customCommands, saveCustomCommand, deleteCustomCommand, runCommand } = useJarvis();
  const [modalOpen, setModalOpen] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [triggerPhrase, setTriggerPhrase] = useState('');
  const [description, setDescription] = useState('');
  const [targetDevice, setTargetDevice] = useState<CustomCommand['targetDevice']>('Web App');
  const [actionIdentifier, setActionIdentifier] = useState(VALIDATED_ACTIONS[0].id);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !triggerPhrase.trim()) return;

    await saveCustomCommand({
      name: name.trim(),
      triggerPhrase: triggerPhrase.trim(),
      description: description.trim() || 'User defined command trigger',
      targetDevice,
      actionIdentifier,
      isEnabled: true
    });

    setModalOpen(false);
    setName('');
    setTriggerPhrase('');
    setDescription('');
  };

  const handleTestRun = async (cmd: CustomCommand) => {
    setExecutionResult(`Transmitting trigger: "${cmd.triggerPhrase}"...`);
    const result = await runCommand(cmd);
    setExecutionResult(result);
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#050b18]/80 border border-cyan-500/20">
        <div>
          <div className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase flex items-center gap-2">
            <Terminal size={14} className="text-cyan-400" />
            <span>MACRO PROTOCOLS // {customCommands.length} ACTIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100 mt-1">
            Custom Voice Commands
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure custom spoken phrases that trigger pre-validated ecosystem routines without arbitrary code execution.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
        >
          <Plus size={16} />
          <span>New Custom Command</span>
        </button>
      </div>

      {/* SECURITY INVARIANT CALLOUT */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-start gap-3 text-xs font-sans text-slate-300">
        <Info size={18} className="text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-mono text-cyan-300">Hardened Execution Security:</strong>
          <span className="block mt-0.5 text-slate-400">
            Commands map strictly to validated action identifiers. The engine forbids direct execution of arbitrary AI-generated JavaScript, eval(), or unverified shell commands.
          </span>
        </div>
      </div>

      {/* EXECUTION LIVE RESULT BANNER */}
      {executionResult && (
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-400 text-cyan-200 text-xs font-mono flex items-center justify-between animate-fade-in shadow-[0_0_15px_rgba(0,240,255,0.15)]">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-cyan-400 animate-pulse" />
            <span>{executionResult}</span>
          </div>
          <button onClick={() => setExecutionResult(null)} className="text-cyan-400/60 hover:text-cyan-300">
            <X size={16} />
          </button>
        </div>
      )}

      {/* COMMANDS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {customCommands.map((cmd) => (
          <div
            key={cmd.id}
            className="p-6 rounded-2xl bg-gradient-to-b from-[#060e20] to-[#040814] border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  TARGET: {cmd.targetDevice.toUpperCase()}
                </span>
                <button
                  onClick={() => deleteCustomCommand(cmd.id)}
                  className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                  title="Delete Command"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <h3 className="font-mono text-base font-bold text-slate-100 group-hover:text-cyan-200 transition-colors">
                {cmd.name}
              </h3>

              <div className="mt-2 p-2.5 rounded-xl bg-slate-950 border border-cyan-500/15 font-mono text-xs text-cyan-300">
                "{cmd.triggerPhrase}"
              </div>

              <p className="text-xs text-slate-400 mt-2 font-sans leading-relaxed">
                {cmd.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-cyan-500/10 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 truncate max-w-[140px]">
                {cmd.actionIdentifier}
              </span>

              <button
                onClick={() => handleTestRun(cmd)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 text-xs font-mono transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)]"
              >
                <Play size={12} className="fill-cyan-300" />
                <span>Test Run</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE COMMAND MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#060c1d] border border-cyan-500/40 p-6 shadow-[0_0_40px_rgba(0,240,255,0.2)]">
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
              <h2 className="text-lg font-mono font-bold text-slate-100 flex items-center gap-2">
                <Terminal size={18} className="text-cyan-400" />
                <span>CREATE CUSTOM COMMAND</span>
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-cyan-300">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-cyan-400/80 mb-1">COMMAND NAME</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Open Study Project"
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-400 font-sans text-sm"
                />
              </div>

              <div>
                <label className="block text-cyan-400/80 mb-1">TRIGGER PHRASE</label>
                <input
                  type="text"
                  required
                  value={triggerPhrase}
                  onChange={(e) => setTriggerPhrase(e.target.value)}
                  placeholder="e.g. Jarvis, open my study project"
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-400 font-sans text-sm"
                />
              </div>

              <div>
                <label className="block text-cyan-400/80 mb-1">TARGET ECOSYSTEM DEVICE</label>
                <select
                  value={targetDevice}
                  onChange={(e) => setTargetDevice(e.target.value as any)}
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="Web App">Web App</option>
                  <option value="Android Phone">Android Phone Companion</option>
                  <option value="Windows PC">Windows PC</option>
                  <option value="All Connected">All Connected Devices</option>
                </select>
              </div>

              <div>
                <label className="block text-cyan-400/80 mb-1">VALIDATED ACTION PROTOCOL</label>
                <select
                  value={actionIdentifier}
                  onChange={(e) => setActionIdentifier(e.target.value)}
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  {VALIDATED_ACTIONS.map(a => (
                    <option key={a.id} value={a.id}>{a.label} ({a.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-cyan-400/80 mb-1">DESCRIPTION</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explains what resources this command accesses"
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
                  Register Command
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
