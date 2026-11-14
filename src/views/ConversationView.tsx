import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Plus,
  StopCircle,
  Brain,
  Globe,
  MessageSquare,
  X
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
  const [sessionsDrawerOpen, setSessionsDrawerOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript]);

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

      const bars = 40;
      const barWidth = canvas.width / bars;
      const centerY = canvas.height / 2;

      for (let i = 0; i < bars; i++) {
        let height = 4;
        if (isLive) {
          const mult = isVoiceListening ? 24 : isSpeaking ? 18 : 10;
          height =
            Math.sin(phase + i * 0.25) * mult +
            Math.cos(phase * 0.5 + i * 0.1) * (mult * 0.5) +
            6;
          height = Math.abs(height);
        }

        const gradient = ctx.createLinearGradient(0, centerY - height, 0, centerY + height);
        gradient.addColorStop(0, '#00f0ff');
        gradient.addColorStop(0.5, '#38bdf8');
        gradient.addColorStop(1, '#0284c7');

        ctx.fillStyle = isLive ? gradient : 'rgba(56, 189, 248, 0.22)';
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
    <div className="h-full w-full min-w-0 flex flex-col lg:flex-row overflow-hidden bg-[#020611] text-slate-100 relative">
      {/* SESSIONS SIDEBAR (DESKTOP / SMART BOARD) */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-cyan-500/20 bg-[#040916]/90 p-4 shrink-0">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
          <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
            Dialogue Sessions
          </span>
          <button
            onClick={() => startNewConversation()}
            className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 flex items-center justify-center"
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
              <button
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={`w-full p-3 rounded-xl cursor-pointer transition-all border text-left ${
                  activeConversation?.id === conv.id
                    ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-200'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-mono font-bold truncate">{conv.title}</div>
                <div className="text-[10px] text-slate-500 truncate mt-1">
                  {conv.lastMessageSnippet || 'No messages'}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Language & Voice Controls */}
        <div className="pt-3 border-t border-cyan-500/20 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between gap-2 text-cyan-400/70">
            <span className="flex items-center gap-1.5">
              <Globe size={14} /> LANGUAGE
            </span>
            <select
              value={preferences.language}
              onChange={(e) => updatePreferences({ language: e.target.value as any })}
              className="bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
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
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded"
            />
          </div>
        </div>
      </aside>

      {/* MOBILE SESSIONS SHEET (< lg) */}
      {sessionsDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex justify-end">
          <div className="w-[84vw] max-w-xs h-full bg-[#040916] border-l border-cyan-500/30 p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider">
                Sessions & Dialect
              </span>
              <button
                onClick={() => setSessionsDrawerOpen(false)}
                className="w-9 h-9 rounded-lg bg-slate-900 text-slate-300 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-3 border-b border-cyan-500/15 flex items-center justify-between gap-2 text-xs font-mono">
              <span className="text-cyan-400/80">Language</span>
              <select
                value={preferences.language}
                onChange={(e) => updatePreferences({ language: e.target.value as any })}
                className="bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs rounded-lg px-2.5 py-1.5"
              >
                <option value="English">English</option>
                <option value="Hinglish">Hinglish</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    selectConversation(conv);
                    setSessionsDrawerOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl border text-left ${
                    activeConversation?.id === conv.id
                      ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-200'
                      : 'bg-slate-900/50 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="text-xs font-mono font-bold truncate">{conv.title}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-1">
                    {conv.lastMessageSnippet || 'No messages'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONVERSATION CHAMBER */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
        {/* Top Arc Reactor & Waveform Chamber */}
        <div className="py-2.5 sm:py-4 px-3 sm:px-6 border-b border-cyan-500/20 bg-gradient-to-b from-[#050b18] to-[#020611] flex flex-col items-center shrink-0">
          {/* Header Controls */}
          <div className="w-full flex items-center justify-between gap-2 mb-1.5">
            <div className="text-[11px] sm:text-xs font-mono text-cyan-400/80 uppercase tracking-wider flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
              <span className="truncate">VOCAL LINK // {preferences.language.toUpperCase()}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {isSpeaking && (
                <button
                  onClick={stopSpeakingOutput}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono hover:bg-red-500/30 transition-colors"
                >
                  <StopCircle size={14} />
                  <span>Stop</span>
                </button>
              )}

              <button
                onClick={() => setSessionsDrawerOpen(true)}
                className="lg:hidden min-h-[36px] px-2.5 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1"
                title="Sessions & Language"
              >
                <MessageSquare size={14} />
                <span className="hidden xs:inline">Sessions</span>
              </button>

              <button
                onClick={() => startNewConversation()}
                className="lg:hidden w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center"
                title="New Session"
                aria-label="Start New Session"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Central Responsive Reactor Visualizer */}
          <div className="my-1">
            <ArcReactor
              state={reactorState}
              colorTheme={preferences.reactorColor}
              className="w-[min(126px,32vw)] sm:w-[168px] lg:w-[190px]"
              interactive={true}
              onClick={() => {
                if (isSpeaking) stopSpeakingOutput();
                else if (isVoiceListening) stopVoiceInput();
                else startVoiceInput();
              }}
            />
          </div>

          {/* Live Audio Waveform Canvas */}
          <div className="w-full max-w-md mt-1.5 px-2">
            <canvas ref={canvasRef} width={360} height={26} className="w-full h-6 opacity-85" />
          </div>
        </div>

        {/* Scrollable Message Timeline */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 sm:p-6 space-y-3.5 scrollbar-thin scrollbar-thumb-cyan-500/20">
          {messages.length === 0 && !interimTranscript && (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500 font-mono">
              <Brain size={34} className="text-cyan-500/40 mb-3 animate-pulse" />
              <div className="text-sm text-cyan-400/85">Neural vocal channel ready.</div>
              <div className="text-xs text-slate-500 mt-1 max-w-sm">
                Tap the Arc Reactor or microphone button below to converse in English, Hindi, or Hinglish.
              </div>
            </div>
          )}

          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 sm:gap-3 w-full max-w-3xl ${
                  isUser ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-mono ${
                    isUser
                      ? 'bg-blue-950 border-blue-400 text-blue-200'
                      : 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_10px_#00f0ff]'
                  }`}
                >
                  {isUser ? 'YOU' : 'JAR'}
                </div>

                <div
                  className={`min-w-0 max-w-[82%] sm:max-w-2xl p-3 sm:p-4 rounded-2xl text-sm leading-relaxed break-words ${
                    isUser
                      ? 'bg-blue-900/30 border border-blue-500/30 text-blue-100 rounded-tr-none font-sans'
                      : 'bg-[#050d20]/90 border border-cyan-500/30 text-slate-100 rounded-tl-none font-sans shadow-[0_0_18px_rgba(0,240,255,0.06)]'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1.5 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Real-time Interim Live Voice Transcription Bubble */}
          {interimTranscript && (
            <div className="flex gap-2.5 max-w-2xl ml-auto flex-row-reverse animate-pulse">
              <div className="w-8 h-8 rounded-full bg-cyan-900 border border-cyan-400 flex items-center justify-center text-[10px] font-mono text-cyan-200 shrink-0">
                MIC
              </div>
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-400/50 text-cyan-200 text-sm font-sans italic break-words min-w-0">
                {interimTranscript}...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Area (Strictly bounded with min-w-0 so Send button never clips!) */}
        <div className="p-2.5 sm:p-4 border-t border-cyan-500/25 bg-[#040916]/95 shrink-0">
          <form onSubmit={handleSubmit} className="w-full min-w-0 flex items-center gap-2 max-w-4xl mx-auto">
            <button
              type="button"
              onClick={isVoiceListening ? stopVoiceInput : startVoiceInput}
              className={`w-11 h-11 rounded-xl border transition-all shrink-0 flex items-center justify-center ${
                isVoiceListening
                  ? 'bg-red-500 border-red-400 text-white animate-pulse shadow-[0_0_15px_#ef4444]'
                  : 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 hover:bg-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
              }`}
              title={isVoiceListening ? 'Stop Listening' : 'Activate Microphone'}
              aria-label={isVoiceListening ? 'Stop Listening' : 'Activate Microphone'}
            >
              {isVoiceListening ? <MicOff size={19} /> : <Mic size={19} />}
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Message JARVIS..."
              className="flex-1 min-w-0 bg-slate-950 border border-cyan-500/35 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans h-11"
            />

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="w-11 h-11 sm:w-auto sm:px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center gap-2"
              title="Transmit Query"
              aria-label="Send Message"
            >
              <span className="hidden sm:inline">Transmit</span>
              <Send size={17} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
