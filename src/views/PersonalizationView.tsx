import React, { useState } from 'react';
import {
  Sliders,
  Palette,
  Volume2,
  UserCheck,
  Sparkles,
  Zap,
  Globe,
  Check,
  RotateCcw
} from 'lucide-react';
import { ArcReactor } from '../components/ArcReactor.tsx';
import { useJarvis } from '../context/JarvisContext.tsx';
import { voiceEngine } from '../services/voice.ts';

export const PersonalizationView: React.FC = () => {
  const { preferences, updatePreferences } = useJarvis();

  // Local draft state for live preview
  const [colorDraft, setColorDraft] = useState(preferences.reactorColor);
  const [styleDraft, setStyleDraft] = useState(preferences.reactorStyle);
  const [assistantNameDraft, setAssistantNameDraft] = useState(preferences.assistantName || 'JARVIS');
  const [preferredNameDraft, setPreferredNameDraft] = useState(preferences.preferredName || 'Sir');
  const [speedDraft, setSpeedDraft] = useState(preferences.speechRate);
  const [pitchDraft, setPitchDraft] = useState(preferences.speechPitch);
  const [langDraft, setLangDraft] = useState(preferences.language);
  const [personalityDraft, setPersonalityDraft] = useState(preferences.personality);
  const [sfxDraft, setSfxDraft] = useState(preferences.soundEffectsEnabled);

  const [previewSpeaking, setPreviewSpeaking] = useState(false);

  const handleTestVoice = () => {
    setPreviewSpeaking(true);
    let sample = `Greetings, ${preferredNameDraft}. Visual and acoustic calibration protocols updated. Core operating at maximum output.`;
    if (langDraft === 'Hinglish') {
      sample = `Namaste ${preferredNameDraft}, sabhi visual aur acoustic systems check ho chuke hain. All clear.`;
    } else if (langDraft === 'Hindi') {
      sample = `नमस्ते ${preferredNameDraft}, आपके आदेश अनुसार सिस्टम तैयार है।`;
    }

    voiceEngine.speak(sample, {
      rate: speedDraft,
      pitch: pitchDraft,
      language: langDraft,
      onEnd: () => setPreviewSpeaking(false),
      onError: () => setPreviewSpeaking(false)
    });
  };

  const handleApplyChanges = async () => {
    await updatePreferences({
      reactorColor: colorDraft,
      reactorStyle: styleDraft,
      assistantName: assistantNameDraft,
      preferredName: preferredNameDraft,
      speechRate: speedDraft,
      speechPitch: pitchDraft,
      language: langDraft,
      personality: personalityDraft,
      soundEffectsEnabled: sfxDraft
    });
  };

  return (
    <div className="h-full w-full min-w-0 flex flex-col p-3.5 sm:p-6 lg:p-8 pb-8 space-y-5 max-w-7xl mx-auto overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-cyan-500/20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#050b18]/80 border border-cyan-500/20">
        <div className="min-w-0">
          <div className="text-[11px] sm:text-xs font-mono text-cyan-400/70 tracking-widest uppercase flex items-center gap-2">
            <Sliders size={14} className="text-cyan-400 shrink-0" />
            <span className="truncate">CALIBRATION PROTOCOL // LIVE PREVIEW</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono text-slate-100 mt-1">
            Personalization Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Customize Arc Reactor aesthetic themes, voice pitch, language modes, and identity honorifics.
          </p>
        </div>

        <button
          onClick={handleApplyChanges}
          className="flex items-center justify-center gap-2 px-6 py-2.5 min-h-[44px] rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] shrink-0"
        >
          <Check size={16} />
          <span>Apply Calibration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-6">
        {/* LEFT COLUMN: LIVE PREVIEW REACTOR */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#050b18] to-[#02050e] border border-cyan-500/30 lg:sticky lg:top-4 shadow-[0_0_40px_rgba(0,240,255,0.06)]">
          <div className="text-xs font-mono text-cyan-400/70 tracking-wider mb-4 uppercase text-center">
            Live Preview // {colorDraft.toUpperCase()} THEME
          </div>

          <ArcReactor
            state={previewSpeaking ? 'speaking' : 'standby'}
            colorTheme={colorDraft}
            className="w-[min(210px,58vw)] sm:w-[235px]"
            interactive={true}
            onClick={handleTestVoice}
            showStatusLabel={true}
          />

          <div className="mt-6 flex flex-col items-center gap-2 text-center">
            <button
              onClick={handleTestVoice}
              disabled={previewSpeaking}
              className="px-5 py-2.5 min-h-[44px] rounded-xl bg-cyan-500/20 border border-cyan-400/60 text-cyan-200 text-xs font-mono hover:bg-cyan-500/30 transition-all flex items-center gap-2"
            >
              <Volume2 size={16} />
              <span>{previewSpeaking ? 'Synthesizing...' : 'Test Cinematic Voice'}</span>
            </button>
            <span className="text-[10px] font-mono text-slate-500">
              Tap to hear audio output with current speed and pitch
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: CONFIGURATION CONTROLS */}
        <div className="lg:col-span-7 space-y-5 min-w-0">
          {/* 1. REACTOR COLOR THEMES */}
          <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/60 border border-cyan-500/20 space-y-4">
            <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase flex items-center gap-2">
              <Palette size={16} />
              <span>ARC REACTOR COLOR THEME</span>
            </div>

            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'cyan', label: 'Classic Stark', desc: 'Electric Cyan & Ice Blue', color: 'from-cyan-400 to-blue-600' },
                { id: 'gold-crimson', label: 'Mark 85', desc: 'Gold & Crimson Core', color: 'from-amber-400 to-red-600' },
                { id: 'violet', label: 'Quantum Matrix', desc: 'Ultraviolet & Purple', color: 'from-purple-400 to-indigo-600' },
                { id: 'emerald', label: 'Tactical Vanguard', desc: 'Mint & Neon Green', color: 'from-emerald-400 to-teal-600' },
                { id: 'monochrome', label: 'Vibranium Silver', desc: 'Pure White & Monolith', color: 'from-slate-200 to-slate-400' }
              ].map((theme) => {
                const isSelected = colorDraft === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setColorDraft(theme.id as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-full h-1.5 rounded-full bg-gradient-to-r ${theme.color} mb-2`} />
                    <div className="text-xs font-mono font-bold text-slate-100">{theme.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{theme.desc}</div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-cyan-400">
                        <Check size={14} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. IDENTITY & HONORIFICS */}
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-cyan-500/20 space-y-4 font-mono text-xs">
            <div className="text-cyan-400 tracking-wider uppercase flex items-center gap-2">
              <UserCheck size={16} />
              <span>IDENTITY & ADDRESSING PROTOCOLS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">ASSISTANT CORE NAME</label>
                <input
                  type="text"
                  value={assistantNameDraft}
                  onChange={(e) => setAssistantNameDraft(e.target.value)}
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">USER PREFERRED HONORIFIC / NAME</label>
                <input
                  type="text"
                  value={preferredNameDraft}
                  onChange={(e) => setPreferredNameDraft(e.target.value)}
                  placeholder="e.g. Sir, Tony, Boss"
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* 3. VOICE & MULTILINGUAL SETTINGS */}
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-cyan-500/20 space-y-4 font-mono text-xs">
            <div className="text-cyan-400 tracking-wider uppercase flex items-center gap-2">
              <Globe size={16} />
              <span>VOICE ENGINE & DIALECT</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">PRIMARY LANGUAGE MODE</label>
                <div className="grid grid-cols-3 gap-2">
                  {['English', 'Hinglish', 'Hindi'].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLangDraft(l as any)}
                      className={`py-2 rounded-xl border text-center transition-all ${
                        langDraft === l
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>SPEAKING RATE (SPEED)</span>
                  <span className="text-cyan-300">{speedDraft}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.3"
                  step="0.05"
                  value={speedDraft}
                  onChange={(e) => setSpeedDraft(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>SPEECH PITCH (CINEMATIC TONE)</span>
                  <span className="text-cyan-300">{pitchDraft}</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.2"
                  step="0.05"
                  value={pitchDraft}
                  onChange={(e) => setPitchDraft(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded"
                />
              </div>
            </div>
          </div>

          {/* 4. PERSONALITY ARCHETYPE */}
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-cyan-500/20 space-y-4 font-mono text-xs">
            <div className="text-cyan-400 tracking-wider uppercase flex items-center gap-2">
              <Sparkles size={16} />
              <span>AI PERSONALITY ARCHETYPE</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'professional', label: 'Professional Stark', desc: 'Poised, razor-sharp, polite, cinematic' },
                { id: 'concise', label: 'Tactical Concise', desc: 'Minimal words, bullet summaries, high velocity' },
                { id: 'friendly', label: 'Friendly Companion', desc: 'Warm, encouraging, conversational warmth' },
                { id: 'detailed', label: 'Deep Architectural', desc: 'Comprehensive explanations and technical depths' }
              ].map((p) => {
                const isSelected = personalityDraft === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPersonalityDraft(p.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold">{p.label}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
