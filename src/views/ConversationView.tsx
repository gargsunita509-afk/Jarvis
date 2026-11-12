import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  Plus,
  Sliders,
  Sparkles,
  StopCircle,
  Brain,
  Globe
} from 'lucide-react';
import { ArcReactor } from '../components/ArcReactor.tsx';
import { useJarvis } from '../context/JarvisContext.tsx';

export const ConversationView: React.FC = () => {
  const {
    reactorState,
    preferences,
    updatePreferences,
    messages,
    sendChatMessage,
    isVoiceListening,
    isSpeaking,
    interimTranscript,
    startVoiceInput,
    stopVoiceInput,
    stopSpeakingOutput,
    startNewConversation,
    conversations,
    activeConversation,
    selectConversation
  } = useJarvis();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript]);

  // Animated Audio Waveform Canvas simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isLive = isVoiceListening || isSpeaking || reactorState === 'thinking';

      const bars = 48;
      const barWidth = canvas.width / bars;
      const centerY = canvas.height / 2;

      for (let i = 0; i < bars; i++) {
        let height = 4;
        if (isLive) {
          const mult = isVoiceListening ? 28 : (isSpeaking ? 22 : 12);
          height = Math.sin(phase + i * 0.25) * mult + Math.cos(phase * 0.5 + i * 0.1) * (mult * 0.5) + 6;
          height = Math.abs(height);
        }

        const gradient = ctx.createLinearGradient(0, centerY - height, 0, centerY + height);
        gradient.addColorStop(0, '#00f0ff');
        gradient.addColorStop(0.5, '#38bdf8');
        gradient.addColorStop(1, '#0284c7');

        ctx.fillStyle = isLive ? gradient : 'rgba(56, 189, 248, 0.2)';
        ctx.fillRect(i * barWidth + 1, centerY - height / 2, barWidth - 2, height);
      }

      phase += 0.12;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isVoiceListening, isSpeaking, reactorState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const text = inputVal.trim();
    setInputVal('');
    sendChatMessage(text);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden bg-[#030712] text-slate-100">
      {/* SESSIONS SIDEBAR (DESKTOP) */}
      <div className="hidden lg:flex w-72 flex-col border-r border-cyan-500/20 bg-[#040814]/90 p-4 shrink-0">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
          <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">Dialogue Sessions</span>
          <button
            onClick={() => startNewConversation()}
            className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40"
            title="Start New Session"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-2 scrollbar-thin scrollbar-thumb-cyan-500/20">
          {conversations.length === 0 ? (
            <div className="text-xs text-slate-500 font-mono py-4 text-center">No previous sessions</div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={`p-3 rounded-xl cursor-pointer transition-all border text-left ${
                  activeConversation?.id === conv.id
                    ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-200'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-mono font-bold truncate">{conv.title}</div>
                <div className="text-[10px] text-slate-500 truncate mt-1">
                  {conv.lastMessageSnippet || 'No messages'}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Language & Voice Controls in Sidebar */}
        <div className="pt-3 border-t border-cyan-500/20 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-cyan-400/70">
            <span className="flex items-center gap-1.5"><Globe size={14} /> LANGUAGE</span>
            <select
              value={preferences.language}
              onChange={(e) => updatePreferences({ language: e.target.value as any })}
              className="bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs rounded px-2 py-1 focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Hinglish">Hinglish</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>VOICE SPEED</span>
              <span>{preferences.speechRate}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.3"
              step="0.05"
              value={preferences.speechRate}
              onChange={(e) => updatePreferences({ speechRate: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 h-1 bg-slate-800 rounded"
            />
          </div>
        </div>
      </div>

      {/* MAIN CONVERSATION CHAMBER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Arc Reactor & Waveform Chamber */}
        <div className="py-4 px-6 border-b border-cyan-500/20 bg-gradient-to-b from-[#050b18] to-[#030712] flex flex-col items-center shrink-0 relative">
          {/* Header Controls */}
          <div className="w-full flex items-center justify-between mb-2">
            <div className="text-xs font-mono text-cyan-400/70 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>VOCAL LINK // {preferences.language.toUpperCase()}</span>
            </div>

            <div className="flex items-center gap-2">
              {isSpeaking && (
                <button
                  onClick={stopSpeakingOutput}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono hover:bg-red-500/30 transition-colors"
                >
                  <StopCircle size={14} />
                  <span>Interrupt</span>
                </button>
              )}
              <button
                onClick={() => startNewConversation()}
                className="lg:hidden p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Central Reactor Visualizer */}
          <div className="my-1 scale-90 sm:scale-100 transition-transform">
            <ArcReactor
              state={reactorState}
              colorTheme={preferences.reactorColor}
              size={200}
              interactive={true}
              onClick={() => {
                if (isSpeaking) stopSpeakingOutput();
                else if (isVoiceListening) stopVoiceInput();
                else startVoiceInput();
              }}
            />
          </div>

          {/* Live Audio Waveform Canvas */}
          <div className="w-full max-w-lg mt-2">
            <canvas
              ref={canvasRef}
              width={400}
              height={32}
              className="w-full h-8 opacity-80"
            />
          </div>
        </div>

        {/* Scrollable Message Timeline */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/20">
          {messages.length === 0 && !interimTranscript && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 font-mono">
              <Brain size={36} className="text-cyan-500/40 mb-3 animate-pulse" />
              <div className="text-sm text-cyan-400/80">Neural vocal channel ready.</div>
              <div className="text-xs text-slate-500 mt-1 max-w-md">
                Click the Arc Reactor or microphone button below to converse in English, Hindi, or Hinglish.
              </div>
            </div>
          )}

          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 text-xs font-mono ${
                    isUser
                      ? 'bg-blue-950 border-blue-400 text-blue-200'
                      : 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_10px_#00f0ff]'
                  }`}
                >
                  {isUser ? 'YOU' : 'JAR'}
                </div>

                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-900/30 border border-blue-500/30 text-blue-100 rounded-tr-none font-sans'
                      : 'bg-[#050d20]/90 border border-cyan-500/30 text-slate-100 rounded-tl-none font-sans shadow-[0_0_20px_rgba(0,240,255,0.05)]'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div className="text-[10px] font-mono text-slate-500 mt-2 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Real-time Interim Live Voice Transcription Bubble */}
          {interimTranscript && (
            <div className="flex gap-3 max-w-2xl ml-auto flex-row-reverse animate-pulse">
              <div className="w-8 h-8 rounded-full bg-cyan-900 border border-cyan-400 flex items-center justify-center text-xs font-mono text-cyan-200">
                MIC
              </div>
              <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-400/50 text-cyan-200 text-sm font-sans italic">
                {interimTranscript}...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 border-t border-cyan-500/20 bg-[#040814]/95 shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-4xl mx-auto">
            <button
              type="button"
              onClick={isVoiceListening ? stopVoiceInput : startVoiceInput}
              className={`p-3.5 rounded-xl border transition-all shrink-0 ${
                isVoiceListening
                  ? 'bg-red-500 border-red-400 text-white animate-pulse shadow-[0_0_15px_#ef4444]'
                  : 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 hover:bg-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
              }`}
              title={isVoiceListening ? 'Stop Listening' : 'Activate Microphone'}
            >
              {isVoiceListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Message JARVIS (e.g., 'Project NEXORA ka update batao')..."
              className="flex-1 bg-slate-950 border border-cyan-500/30 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 transition-colors shrink-0"
              title="Transmit Query"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
