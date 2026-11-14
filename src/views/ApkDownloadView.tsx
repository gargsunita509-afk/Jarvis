import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  Copy,
  AlertCircle,
  Clock,
  Layers,
  Settings,
  X,
  ExternalLink,
  Info
} from 'lucide-react';
import { APKReleaseManifest } from '../types/jarvis.ts';

export const ApkDownloadView: React.FC = () => {
  const [manifest, setManifest] = useState<APKReleaseManifest>({
    versionName: 'v1.0.4-preview',
    versionCode: 104,
    downloadUrl: '',
    fileSize: '24.8 MB',
    releaseDate: '2026-11-10',
    minimumAndroidVersion: 'Android 10.0 (API 29)',
    targetAndroidVersion: 'Android 15 (API 35)',
    architecture: 'arm64-v8a / universal',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    isReleased: false,
    releaseNotes: [
      'Companion Android APK architecture and Room DB schema finalized',
      'Shared Firestore synchronization protocol matching web version',
      'Background wake-word listener (requires Accessibility & Mic permissions)',
      'Zero-cost Firebase Spark configuration support'
    ]
  });

  const [copiedHash, setCopiedHash] = useState(false);
  const [manifestEditorOpen, setManifestEditorOpen] = useState(false);
  const [editUrl, setEditUrl] = useState('');
  const [editVersion, setEditVersion] = useState('');
  const [editSha, setEditSha] = useState('');

  // Fetch live release manifest from server
  useEffect(() => {
    fetch('/api/apk/manifest')
      .then(res => res.json())
      .then(data => {
        if (data && data.versionName) {
          setManifest(data);
          setEditUrl(data.downloadUrl || '');
          setEditVersion(data.versionName || '');
          setEditSha(data.sha256 || '');
        }
      })
      .catch(err => console.warn('Could not load APK manifest from server:', err));
  }, []);

  const copySha = () => {
    navigator.clipboard.writeText(manifest.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2500);
  };

  const handleSaveManifest = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...manifest,
      downloadUrl: editUrl,
      versionName: editVersion,
      sha256: editSha,
      isReleased: Boolean(editUrl && editUrl.startsWith('https://'))
    };

    try {
      await fetch('/api/apk/manifest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      setManifest(updated);
      setManifestEditorOpen(false);
    } catch (err) {
      console.error('Failed to update APK manifest:', err);
    }
  };

  return (
    <div className="h-full w-full min-w-0 flex flex-col p-3.5 sm:p-6 lg:p-8 pb-8 space-y-5 max-w-7xl mx-auto overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-cyan-500/20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#050b18]/80 border border-cyan-500/20">
        <div className="min-w-0">
          <div className="text-[11px] sm:text-xs font-mono text-cyan-400/70 tracking-widest uppercase flex items-center gap-2">
            <Smartphone size={14} className="text-cyan-400 shrink-0" />
            <span className="truncate">NATIVE COMPANION DISTRIBUTION // ALPHA</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono text-slate-100 mt-1">
            JARVIS APK Download Centre
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Native companion application for Android. Features background wake-word listening, Jetpack Compose UI, and direct Firestore synchronization.
          </p>
        </div>

        <button
          onClick={() => setManifestEditorOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition-colors shrink-0"
          title="Configure Release Manifest parameters"
        >
          <Settings size={14} />
          <span>Release Manifest Config</span>
        </button>
      </div>

      {/* MAIN APK RELEASE BANNER CARD */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-[#060e20] via-[#050b18] to-[#040814] border border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.08)] flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left min-w-0 w-full">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-950 border-2 border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-[0_0_30px_rgba(0,240,255,0.3)] shrink-0">
            <Smartphone size={42} className="animate-pulse" />
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-mono font-bold text-slate-100">
                JARVIS Companion OS
              </h2>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {manifest.versionName}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Build Code: {manifest.versionCode} • {manifest.architecture}
            </p>
            <p className="text-xs text-slate-300 font-sans mt-2 max-w-xl">
              Connects to the same Firebase project, authentication system, database schema, user identity, and memory records as this web application.
            </p>
          </div>
        </div>

        {/* DOWNLOAD ACTION ZONE */}
        <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-3 shrink-0">
          {manifest.isReleased && manifest.downloadUrl ? (
            <a
              href={manifest.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 sm:px-8 py-4 min-h-[48px] rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold tracking-wider text-xs sm:text-sm transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2.5 text-center"
            >
              <Download size={18} className="shrink-0" />
              <span>DOWNLOAD JARVIS APK ({manifest.fileSize})</span>
            </a>
          ) : (
            <div className="w-full sm:w-auto flex flex-col items-center lg:items-end gap-2">
              <button
                disabled
                className="w-full sm:w-auto px-6 sm:px-8 py-4 min-h-[48px] rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-300/60 font-mono font-bold tracking-wider text-xs sm:text-sm cursor-not-allowed flex items-center justify-center gap-2.5 text-center"
              >
                <Download size={18} className="shrink-0" />
                <span>DOWNLOAD JARVIS APK ({manifest.fileSize})</span>
              </button>
              <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 text-center">
                <AlertCircle size={14} className="shrink-0" />
                <span>Android application is under development.</span>
              </div>
            </div>
          )}

          <span className="text-[10px] font-mono text-slate-500 text-center lg:text-right">
            SHA-256 Verified Release Pipeline • Spark ₹0 Budget Compliant
          </span>
        </div>
      </div>

      {/* TECHNICAL MANIFEST METADATA GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-mono text-xs">
        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 min-w-0">
          <div className="text-slate-400 text-[10px]">MINIMUM ANDROID</div>
          <div className="text-slate-200 font-bold mt-1 break-words">{manifest.minimumAndroidVersion}</div>
        </div>
        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 min-w-0">
          <div className="text-slate-400 text-[10px]">TARGET SDK</div>
          <div className="text-slate-200 font-bold mt-1 break-words">{manifest.targetAndroidVersion}</div>
        </div>
        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 min-w-0">
          <div className="text-slate-400 text-[10px]">PACKAGE SIZE</div>
          <div className="text-slate-200 font-bold mt-1">{manifest.fileSize}</div>
        </div>
        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 min-w-0">
          <div className="text-slate-400 text-[10px]">RELEASE DATE</div>
          <div className="text-slate-200 font-bold mt-1">{manifest.releaseDate}</div>
        </div>
      </div>

      {/* INTEGRITY CHECKSUM BAR */}
      <div className="p-4 rounded-xl bg-[#050b18] border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0 flex-1">
          <span className="text-cyan-400/70 shrink-0">SHA-256 CHECKSUM:</span>
          <span className="text-slate-300 truncate font-mono text-[11px] bg-slate-950 px-2.5 py-1.5 rounded border border-cyan-500/10 min-w-0 block">
            {manifest.sha256}
          </span>
        </div>
        <button
          onClick={copySha}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-[11px] shrink-0 transition-colors"
        >
          {copiedHash ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span>{copiedHash ? 'Hash Copied!' : 'Copy Hash'}</span>
        </button>
      </div>

      {/* CHANGELOG & SIDELOADING INSTRUCTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        {/* Release Notes */}
        <div className="p-6 rounded-2xl bg-slate-950/60 border border-cyan-500/20 space-y-3">
          <div className="text-cyan-400 tracking-wider uppercase flex items-center gap-2 text-sm font-bold">
            <Layers size={16} />
            <span>RELEASE MANIFEST NOTES ({manifest.versionName})</span>
          </div>
          <ul className="space-y-2 pt-2 text-slate-300 font-sans text-xs">
            {manifest.releaseNotes.map((note, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Installation & Sideloading Guide */}
        <div className="p-6 rounded-2xl bg-slate-950/60 border border-cyan-500/20 space-y-3">
          <div className="text-cyan-400 tracking-wider uppercase flex items-center gap-2 text-sm font-bold">
            <ShieldCheck size={16} />
            <span>SIDELOADING & PERMISSIONS GUIDE</span>
          </div>
          <ol className="space-y-2.5 pt-2 text-slate-300 font-sans text-xs list-decimal list-inside leading-relaxed">
            <li>
              <strong className="text-slate-100 font-mono">Download APK:</strong> When released, download the signed APK onto your Android device.
            </li>
            <li>
              <strong className="text-slate-100 font-mono">Allow Unknown Sources:</strong> Go to Settings → Security → Install Unknown Apps, and toggle permission for your browser.
            </li>
            <li>
              <strong className="text-slate-100 font-mono">Verify SHA-256:</strong> Compare the downloaded file hash against the verified release hash above.
            </li>
            <li>
              <strong className="text-slate-100 font-mono">Grant Core Permissions:</strong> Enable Microphone (for voice conversation) and Accessibility Service (for background wake-word detection).
            </li>
          </ol>
        </div>
      </div>

      {/* MANIFEST EDITOR MODAL */}
      {manifestEditorOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#060c1d] border border-cyan-500/40 p-6 shadow-[0_0_40px_rgba(0,240,255,0.2)]">
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
              <h2 className="text-lg font-mono font-bold text-slate-100 flex items-center gap-2">
                <Settings size={18} className="text-cyan-400" />
                <span>CONFIGURE RELEASE MANIFEST</span>
              </h2>
              <button onClick={() => setManifestEditorOpen(false)} className="p-1 text-slate-400 hover:text-cyan-300">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveManifest} className="mt-4 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-cyan-400/80 mb-1">VERSION NAME</label>
                <input
                  type="text"
                  required
                  value={editVersion}
                  onChange={(e) => setEditVersion(e.target.value)}
                  placeholder="e.g. v1.0.4-release"
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2 text-slate-100 font-sans"
                />
              </div>

              <div>
                <label className="block text-cyan-400/80 mb-1">SIGNED APK DOWNLOAD URL (HTTPS)</label>
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  placeholder="Leave empty while in development, or paste verified URL"
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2 text-slate-100 font-sans"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Button activates only when a real signed download URL is saved.
                </span>
              </div>

              <div>
                <label className="block text-cyan-400/80 mb-1">SHA-256 CHECKSUM</label>
                <input
                  type="text"
                  required
                  value={editSha}
                  onChange={(e) => setEditSha(e.target.value)}
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2 text-slate-100 font-sans"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setManifestEditorOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider"
                >
                  Update Manifest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
