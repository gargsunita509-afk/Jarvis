import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  LogOut,
  Trash2,
  Download,
  Cloud,
  HardDrive,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Info,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useJarvis } from '../context/JarvisContext.tsx';
import { StorageService } from '../lib/storage.ts';

export const AccountView: React.FC = () => {
  const {
    user,
    signInGoogle,
    logout,
    syncStatus,
    preferences,
    updatePreferences,
    exportMemoriesJSON,
    enterGuestLocalMode
  } = useJarvis();

  const [wiping, setWiping] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleWipeLocalCache = async () => {
    if (window.confirm('Wipe all local IndexedDB cache? This clears local offline records.')) {
      setWiping(true);
      await StorageService.wipeLocalData();
      setWiping(false);
      window.location.reload();
    }
  };

  const handleExportFullBackup = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      user: user?.email || 'local_guest',
      preferences,
      memories: JSON.parse(exportMemoriesJSON() || '[]')
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `jarvis_ecosystem_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#050b18]/80 border border-cyan-500/20">
        <div>
          <div className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase flex items-center gap-2">
            <ShieldCheck size={14} className="text-cyan-400" />
            <span>SECURITY, AUTHENTICATION & PRIVACY AUDIT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100 mt-1">
            Account & Data Sovereignty
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inspect private user isolation, toggle cloud synchronization, export all ecosystem archives, or clear local storage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportFullBackup}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition-colors"
          >
            <Download size={14} />
            <span>Export Ecosystem JSON</span>
          </button>
        </div>
      </div>

      {/* ACTIVE IDENTITY CARD */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#060e20] to-[#040814] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-cyan-300 text-2xl font-mono font-bold shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            {user ? (user.displayName || user.email || 'U').charAt(0).toUpperCase() : 'G'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-mono font-bold text-slate-100">
                {user ? user.displayName || user.email : 'Local Guest Mode (Offline)'}
              </h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                user ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              }`}>
                {user ? 'AUTHENTICATED' : 'OFFLINE SANDBOX'}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              UID: {user ? user.uid : 'local_device_sandbox_idb'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-500/40 text-red-300 text-xs font-mono transition-colors"
            >
              <LogOut size={14} />
              <span>Sign Out Session</span>
            </button>
          ) : (
            <button
              onClick={signInGoogle}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              <Cloud size={14} />
              <span>Connect Firebase Cloud Sync</span>
            </button>
          )}
        </div>
      </div>

      {/* DATA TRANSPARENCY AUDIT: LOCAL VS CLOUD */}
      <div className="p-6 rounded-2xl bg-slate-950/60 border border-cyan-500/20 space-y-4">
        <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase flex items-center gap-2">
          <Info size={16} />
          <span>TRANSPARENT DATA LOCALIZATION BREAKDOWN</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* Local Mode Details */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-cyan-500/20 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <HardDrive size={16} />
              <span>Local Storage (IndexedDB)</span>
            </div>
            <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
              Stored locally inside your browser's persistent database sandbox. Functions 100% offline without network or cloud credentials.
            </p>
            <ul className="space-y-1 text-slate-400 text-[11px] pt-1">
              <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-400" /> Offline memory cache</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-400" /> Local conversation history</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-400" /> Instant startup with zero latency</li>
            </ul>
          </div>

          {/* Cloud Mode Details */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-cyan-500/20 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <Cloud size={16} />
              <span>Cloud Storage (Firestore ABAC)</span>
            </div>
            <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
              Enforces strict Firestore Security Rules. User records are partitioned by UID and mathematically inaccessible to any other user.
            </p>
            <ul className="space-y-1 text-slate-400 text-[11px] pt-1">
              <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-cyan-400" /> Synchronized with Android companion APK</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-cyan-400" /> Backup across multiple devices</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-cyan-400" /> Free Spark tier compliance ($0)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* DATA MANAGEMENT & DANGER ZONE */}
      <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-4">
        <div className="text-xs font-mono text-red-400 tracking-wider uppercase flex items-center gap-2">
          <AlertTriangle size={16} />
          <span>DATA PURGE & ACCOUNT DELETION ZONE</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-mono font-bold text-slate-200">Clear Local Browser Database</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Wipes all cached memories, messages, and device pairings from this device's IndexedDB.
            </div>
          </div>
          <button
            onClick={handleWipeLocalCache}
            disabled={wiping}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-mono transition-colors shrink-0"
          >
            {wiping ? 'Purging Cache...' : 'Wipe Local Database'}
          </button>
        </div>
      </div>
    </div>
  );
};
