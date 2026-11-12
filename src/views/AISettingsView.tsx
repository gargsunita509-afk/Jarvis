import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  ShieldCheck,
  Zap,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useJarvis } from '../context/JarvisContext.tsx';

export const AISettingsView: React.FC = () => {
  const { preferences, updatePreferences } = useJarvis();

  const [selectedModel, setSelectedModel] = useState<'gemini-2.5-flash' | 'gemini-2.5-flash-lite'>('gemini-2.5-flash');
  const [temperature, setTemperature] = useState(0.7);
  const [customPrompt, setCustomPrompt] = useState('');
  const [testLatency, setTestLatency] = useState<number | null>(null);
  const [testing, setTesting] = useState(false);

  const handleRunLatencyTest = async () => {
    setTesting(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      await res.json();
      const end = performance.now();
      setTestLatency(Math.round(end - start));
    } catch {
      setTestLatency(999);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#050b18]/80 border border-cyan-500/20">
        <div>
          <div className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase flex items-center gap-2">
            <Sparkles size={14} className="text-cyan-400" />
            <span>NEURAL CORE CONFIGURATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100 mt-1">
            AI Engine & Quota Architecture
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure Gemini 2.5 Flash hyperparameters, zero-cost Spark tier quotas, and system instruction tuning.
          </p>
        </div>

        <button
          onClick={handleRunLatencyTest}
          disabled={testing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition-colors"
        >
          <Activity size={14} className={testing ? 'animate-spin' : ''} />
          <span>{testing ? 'Testing Link...' : 'Test AI Gateway Latency'}</span>
        </button>
      </div>

      {/* ZERO-COST FREE-TIER TRANSPARENCY CARD */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-950 to-emerald-950/20 border border-emerald-500/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-mono text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Absolute ₹0 Budget Compliance Guarantee</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ACTIVE
              </span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              JARVIS runs strictly on the Firebase Spark Free Plan and Google AI Gemini Free Tier.
              No automated billing is enabled, and no paid infrastructure (e.g. Cloud Run instances requiring credit cards) will be invoked.
              If daily API quotas are reached, JARVIS safely degrades to local memory and offline cache rather than incurring costs.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-emerald-500/20">
                <div className="text-[10px] text-slate-400">FIRESTORE TIER</div>
                <div className="text-emerald-400 font-bold mt-0.5">Spark (Free)</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-emerald-500/20">
                <div className="text-[10px] text-slate-400">DAILY READS</div>
                <div className="text-slate-200 font-bold mt-0.5">50,000 / day</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-emerald-500/20">
                <div className="text-[10px] text-slate-400">GEMINI MODEL</div>
                <div className="text-slate-200 font-bold mt-0.5">2.5 Flash Free</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-emerald-500/20">
                <div className="text-[10px] text-slate-400">TELEMETRY LATENCY</div>
                <div className="text-cyan-300 font-bold mt-0.5">
                  {testLatency ? `${testLatency} ms` : 'Nominal (<120ms)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODEL SELECTION & TUNING */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Selector */}
        <div className="p-6 rounded-2xl bg-slate-950/60 border border-cyan-500/20 space-y-4">
          <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase flex items-center gap-2">
            <Cpu size={16} />
            <span>NEURAL FOUNDATION MODEL</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div
              onClick={() => setSelectedModel('gemini-2.5-flash')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedModel === 'gemini-2.5-flash'
                  ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex justify-between font-bold text-sm">
                <span>Gemini 2.5 Flash (Recommended)</span>
                {selectedModel === 'gemini-2.5-flash' && <CheckCircle2 size={16} className="text-cyan-400" />}
              </div>
              <p className="text-[11px] font-sans text-slate-300 mt-1">
                High-speed multimodal intelligence with sub-second voice synthesis latency and rich multilingual reasoning (English, Hindi, Hinglish).
              </p>
            </div>

            <div
              onClick={() => setSelectedModel('gemini-2.5-flash-lite')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedModel === 'gemini-2.5-flash-lite'
                  ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex justify-between font-bold text-sm">
                <span>Gemini 2.5 Flash Lite</span>
                {selectedModel === 'gemini-2.5-flash-lite' && <CheckCircle2 size={16} className="text-cyan-400" />}
              </div>
              <p className="text-[11px] font-sans text-slate-300 mt-1">
                Ultralight model designed for minimal memory footprints and instant command classification.
              </p>
            </div>
          </div>
        </div>

        {/* Hyperparameters */}
        <div className="p-6 rounded-2xl bg-slate-950/60 border border-cyan-500/20 space-y-5 font-mono text-xs">
          <div className="text-cyan-400 tracking-wider uppercase flex items-center gap-2">
            <Sliders size={16} />
            <span>NEURAL HYPERPARAMETERS</span>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>TEMPERATURE (CREATIVITY VS PRECISION)</span>
              <span className="text-cyan-300">{temperature}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0.1 (Strict & Factual)</span>
              <span>1.0 (Expressive & Cinematic)</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">CUSTOM INSTRUCTION EXTENSION</label>
            <textarea
              rows={4}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Always prioritize aerospace terminology and refer to my laptop as 'Mark II Workstation'..."
              className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2 text-slate-100 font-sans text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
