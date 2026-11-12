import React, { useState } from 'react';
import {
  History,
  Search,
  MessageSquare,
  ArrowRight,
  Trash2,
  Edit2,
  Calendar,
  Check,
  X
} from 'lucide-react';
import { useJarvis } from '../context/JarvisContext.tsx';
import { Conversation } from '../types/jarvis.ts';

export const HistoryView: React.FC = () => {
  const {
    conversations,
    selectConversation,
    deleteConversationSession,
    startNewConversation,
    setActiveView
  } = useJarvis();

  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');

  const filtered = conversations.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessageSnippet.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenSession = async (conv: Conversation) => {
    await selectConversation(conv);
    setActiveView('conversation');
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#050b18]/80 border border-cyan-500/20">
        <div>
          <div className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase flex items-center gap-2">
            <History size={14} className="text-cyan-400" />
            <span>SESSION ARCHIVES // {conversations.length} SAVED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100 mt-1">
            Conversation History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Searchable historical dialogues with JARVIS. Re-open past sessions or manage private conversation logs.
          </p>
        </div>

        <button
          onClick={async () => {
            await startNewConversation();
            setActiveView('conversation');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
        >
          <span>Initiate New Session</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/60" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversation topics or message snippets..."
          className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
        />
      </div>

      {/* SESSIONS LIST */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-slate-950/40 border border-dashed border-cyan-500/20 text-center font-mono">
          <MessageSquare size={40} className="text-cyan-500/30 mb-3" />
          <div className="text-sm text-cyan-300 font-bold">No conversation sessions found</div>
          <div className="text-xs text-slate-500 mt-1">
            {search ? `No matches for "${search}"` : 'Past conversations with JARVIS will appear here.'}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((conv) => (
            <div
              key={conv.id}
              className="p-5 rounded-2xl bg-gradient-to-r from-[#060e20] to-[#040814] border border-cyan-500/20 hover:border-cyan-400/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-mono text-base font-bold text-slate-100 group-hover:text-cyan-200 transition-colors">
                    {conv.title}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {conv.messageCount || 0} MESSAGES
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-sans line-clamp-1">
                  {conv.lastMessageSnippet}
                </p>

                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 pt-1">
                  <Calendar size={12} />
                  <span>
                    {new Date(conv.updatedAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenSession(conv)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 text-xs font-mono transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => deleteConversationSession(conv.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-colors"
                  title="Delete Session"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
