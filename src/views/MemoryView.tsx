import React, { useState, useMemo } from 'react';
import {
  Brain,
  Search,
  Plus,
  Trash2,
  Download,
  Pin,
  Tag,
  Clock,
  Edit2,
  X,
  Check,
  Filter,
  Sparkles,
  SlidersHorizontal,
  FolderX
} from 'lucide-react';
import { useJarvis } from '../context/JarvisContext.tsx';
import { Memory, MemoryCategory } from '../types/jarvis.ts';

const CATEGORIES: MemoryCategory[] = [
  'Personal information',
  'Preferences',
  'Projects',
  'Conversations',
  'Routines',
  'Knowledge',
  'Custom instructions',
  'Device information'
];

export const MemoryView: React.FC = () => {
  const {
    memories,
    addMemory,
    updateMemory,
    removeMemory,
    removeCategoryMemories,
    exportMemoriesJSON,
    preferences,
    updatePreferences
  } = useJarvis();

  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  // Form State
  const [formCategory, setFormCategory] = useState<MemoryCategory>('Projects');
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('');

  // Filter memories
  const filteredMemories = useMemo(() => {
    return memories.filter(m => {
      const matchesCat = selectedCategory === 'ALL' || m.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesQuery = !searchQuery || 
        m.title.toLowerCase().includes(q) || 
        m.content.toLowerCase().includes(q) ||
        (m.tags && m.tags.some(t => t.toLowerCase().includes(q)));
      return matchesCat && matchesQuery;
    });
  }, [memories, selectedCategory, searchQuery]);

  const handleOpenAdd = () => {
    setEditingMemory(null);
    setFormCategory(selectedCategory === 'ALL' ? 'Projects' : selectedCategory);
    setFormTitle('');
    setFormContent('');
    setFormTags('');
    setModalOpen(true);
  };

  const handleOpenEdit = (m: Memory) => {
    setEditingMemory(m);
    setFormCategory(m.category);
    setFormTitle(m.title);
    setFormContent(m.content);
    setFormTags(m.tags ? m.tags.join(', ') : '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const tagsArray = formTags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingMemory) {
      await updateMemory({
        ...editingMemory,
        category: formCategory,
        title: formTitle.trim(),
        content: formContent.trim(),
        tags: tagsArray,
        updatedAt: new Date().toISOString()
      });
    } else {
      await addMemory(formCategory, formTitle.trim(), formContent.trim(), tagsArray);
    }
    setModalOpen(false);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportMemoriesJSON());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `jarvis_memories_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20">
      {/* HEADER & AUTO-LEARN CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#050b18]/80 border border-cyan-500/20">
        <div>
          <div className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase flex items-center gap-2">
            <Brain size={14} className="text-cyan-400" />
            <span>NEURAL REPOSITORY // {memories.length} RECORDS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100 mt-1">
            Long-Term Memory Vault
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authorized memory bank referenced by JARVIS during conversations to recall projects, routines, and user preferences.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Automatic Memory Toggle */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-mono">
            <span className="text-slate-300">Auto-Learn:</span>
            <button
              onClick={() => updatePreferences({ autoMemoryEnabled: !preferences.autoMemoryEnabled })}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                preferences.autoMemoryEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {preferences.autoMemoryEnabled ? 'ENABLED' : 'PAUSED'}
            </button>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition-colors"
            title="Export all memories to JSON"
          >
            <Download size={14} />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            <Plus size={16} />
            <span>New Memory</span>
          </button>
        </div>
      </div>

      {/* SEARCH & CATEGORY FILTER BAR */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memory titles, content, projects, or tags..."
            className="w-full bg-slate-950 border border-cyan-500/20 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_#00f0ff]'
                : 'bg-slate-900/60 text-slate-400 hover:text-cyan-300 border border-cyan-500/20'
            }`}
          >
            ALL ARCHIVES ({memories.length})
          </button>

          {CATEGORIES.map((cat) => {
            const count = memories.filter(m => m.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_#00f0ff]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-cyan-300 border border-cyan-500/20'
                }`}
              >
                {cat.toUpperCase()} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* CATEGORY BULK ACTIONS (IF FILTERED) */}
      {selectedCategory !== 'ALL' && (
        <div className="flex items-center justify-between px-2 py-1 text-xs font-mono text-slate-400">
          <span>Viewing category: <strong className="text-cyan-300">{selectedCategory}</strong></span>
          {filteredMemories.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm(`Clear all memories in [${selectedCategory}]?`)) {
                  removeCategoryMemories(selectedCategory);
                }
              }}
              className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
            >
              <FolderX size={14} />
              <span>Clear Category</span>
            </button>
          )}
        </div>
      )}

      {/* MEMORY CARDS GRID */}
      {filteredMemories.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-slate-950/40 border border-dashed border-cyan-500/20 text-center font-mono">
          <Brain size={40} className="text-cyan-500/30 mb-3" />
          <div className="text-sm text-cyan-300 font-bold">No memories found</div>
          <div className="text-xs text-slate-500 mt-1 max-w-md">
            {searchQuery
              ? `No records matching "${searchQuery}". Try modifying your search filter.`
              : 'Add your first memory record to equip JARVIS with project context and preferences.'}
          </div>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs"
          >
            + Create New Memory
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMemories.map((m) => (
            <div
              key={m.id}
              className={`p-5 rounded-2xl bg-gradient-to-b from-[#060e20]/90 to-[#040814]/90 border transition-all flex flex-col justify-between group ${
                m.isPinned
                  ? 'border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.12)]'
                  : 'border-cyan-500/20 hover:border-cyan-400/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase">
                    {m.category}
                  </span>
                  <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => updateMemory({ ...m, isPinned: !m.isPinned })}
                      className={`p-1 rounded hover:text-cyan-300 ${m.isPinned ? 'text-cyan-400' : 'text-slate-500'}`}
                      title={m.isPinned ? 'Unpin' : 'Pin to Top'}
                    >
                      <Pin size={14} />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(m)}
                      className="p-1 rounded text-slate-400 hover:text-cyan-300"
                      title="Edit Memory"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => removeMemory(m.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-400"
                      title="Delete Memory"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="font-mono text-base font-bold text-slate-100 group-hover:text-cyan-200 transition-colors">
                  {m.title}
                </h3>

                <p className="text-xs text-slate-300 mt-2 font-sans leading-relaxed whitespace-pre-wrap">
                  {m.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-cyan-500/10 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{new Date(m.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="text-cyan-400/60 uppercase">
                  SRC: {m.source}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MEMORY MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#060c1d] border border-cyan-500/40 p-6 shadow-[0_0_40px_rgba(0,240,255,0.2)]">
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
              <h2 className="text-lg font-mono font-bold text-slate-100 flex items-center gap-2">
                <Brain size={18} className="text-cyan-400" />
                <span>{editingMemory ? 'EDIT AUTHORIZED MEMORY' : 'STORE NEW MEMORY'}</span>
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-cyan-300"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-cyan-400/80 mb-1">CATEGORY</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as MemoryCategory)}
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-cyan-400/80 mb-1">MEMORY TITLE</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Project NEXORA Scope or Exam Schedule"
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-400 font-sans text-sm"
                />
              </div>

              <div>
                <label className="block text-cyan-400/80 mb-1">CONTENT / KNOWLEDGE BODY</label>
                <textarea
                  required
                  rows={4}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Details JARVIS should retain and recall when prompted..."
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-400 font-sans text-sm"
                />
              </div>

              <div>
                <label className="block text-cyan-400/80 mb-1">TAGS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="study, sprint-1, priorities"
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
                  {editingMemory ? 'Update Archive' : 'Save Archive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
