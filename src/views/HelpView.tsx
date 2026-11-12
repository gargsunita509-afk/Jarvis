import React from 'react';
import {
  HelpCircle,
  Mic,
  Terminal,
  Brain,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useJarvis } from '../context/JarvisContext.tsx';

export const HelpView: React.FC = () => {
  const { setActiveView } = useJarvis();

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#050b18]/80 border border-cyan-500/20">
        <div>
          <div className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase flex items-center gap-2">
            <HelpCircle size={14} className="text-cyan-400" />
            <span>OPERATING MANUAL // PROTOCOLS & CHEATSHEETS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100 mt-1">
            JARVIS Documentation & Commands
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive guide to voice commands, multilingual prompts, offline local storage, and companion Android APK setup.
          </p>
        </div>
      </div>

      {/* VOICE COMMAND CHEATSHEET */}
      <div className="p-6 rounded-2xl bg-slate-950/60 border border-cyan-500/20 space-y-4">
        <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase flex items-center gap-2">
          <Mic size={16} />
          <span>VOICE COMMAND CHEATSHEET (ENGLISH, HINDI, HINGLISH)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* English Commands */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-cyan-500/20 space-y-2.5">
            <div className="text-cyan-300 font-bold text-sm">English Commands</div>
            <ul className="space-y-2 text-slate-300 font-sans text-xs">
              <li className="p-2 rounded bg-slate-950 border border-cyan-500/10">
                <span className="text-cyan-400 font-mono">"Jarvis, open my study project"</span>
                <span className="block text-[11px] text-slate-400 mt-0.5">Recalls authorized project memory</span>
              </li>
              <li className="p-2 rounded bg-slate-950 border border-cyan-500/10">
                <span className="text-cyan-400 font-mono">"Run daily morning diagnostics"</span>
                <span className="block text-[11px] text-slate-400 mt-0.5">Checks device status and neural core</span>
              </li>
              <li className="p-2 rounded bg-slate-950 border border-cyan-500/10">
                <span className="text-cyan-400 font-mono">"Remember that my flight is at 6 PM"</span>
                <span className="block text-[11px] text-slate-400 mt-0.5">Automatically stores memory archive</span>
              </li>
            </ul>
          </div>

          {/* Hinglish Commands */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-cyan-500/20 space-y-2.5">
            <div className="text-cyan-300 font-bold text-sm">Hinglish Natural Commands</div>
            <ul className="space-y-2 text-slate-300 font-sans text-xs">
              <li className="p-2 rounded bg-slate-950 border border-cyan-500/10">
                <span className="text-cyan-400 font-mono">"Jarvis, kya tumhe mera project yaad hai?"</span>
                <span className="block text-[11px] text-slate-400 mt-0.5">Queries saved memory vault</span>
              </li>
              <li className="p-2 rounded bg-slate-950 border border-cyan-500/10">
                <span className="text-cyan-400 font-mono">"Uska last update batao"</span>
                <span className="block text-[11px] text-slate-400 mt-0.5">Follow-up context-aware query</span>
              </li>
              <li className="p-2 rounded bg-slate-950 border border-cyan-500/10">
                <span className="text-cyan-400 font-mono">"Notes check karo aur routine start karo"</span>
                <span className="block text-[11px] text-slate-400 mt-0.5">Multi-step action sequence</span>
              </li>
            </ul>
          </div>

          {/* Hindi Commands */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-cyan-500/20 space-y-2.5">
            <div className="text-cyan-300 font-bold text-sm">Pure Hindi Commands</div>
            <ul className="space-y-2 text-slate-300 font-sans text-xs">
              <li className="p-2 rounded bg-slate-950 border border-cyan-500/10">
                <span className="text-cyan-400 font-mono">"जार्विस, सिस्टम का क्या हाल है?"</span>
                <span className="block text-[11px] text-slate-400 mt-0.5">Diagnostic system status report</span>
              </li>
              <li className="p-2 rounded bg-slate-950 border border-cyan-500/10">
                <span className="text-cyan-400 font-mono">"मेरी नई मेमोरी सेव करो"</span>
                <span className="block text-[11px] text-slate-400 mt-0.5">Triggers memory creation prompt</span>
              </li>
              <li className="p-2 rounded bg-slate-950 border border-cyan-500/10">
                <span className="text-cyan-400 font-mono">"कनेक्टेड डिवाइसेस दिखाओ"</span>
                <span className="block text-[11px] text-slate-400 mt-0.5">Lists paired companion devices</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <div className="p-6 rounded-2xl bg-slate-950/60 border border-cyan-500/20 space-y-4">
        <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
          FREQUENTLY ASKED QUESTIONS & ARCHITECTURAL SPECS
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 rounded-xl bg-slate-900/30 border border-cyan-500/10">
            <div className="text-slate-100 font-bold text-sm">How do the Web PWA and Native Android APK connect?</div>
            <p className="text-slate-400 font-sans text-xs mt-1 leading-relaxed">
              Both applications share the exact same Firebase Project ID, Firebase Authentication accounts, and Firestore database collections.
              When you add a memory or calibrate your Arc Reactor on the web, it instantly synchronizes to your Android companion phone.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/30 border border-cyan-500/10">
            <div className="text-slate-100 font-bold text-sm">Can the Web PWA monitor the microphone 24/7 in the background?</div>
            <p className="text-slate-400 font-sans text-xs mt-1 leading-relaxed">
              No. Modern web browsers sandbox background microphone access for battery and privacy protection.
              24/7 background wake-word listening will run through the separately developed native Android companion APK using a dedicated Android Foreground Service.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/30 border border-cyan-500/10">
            <div className="text-slate-100 font-bold text-sm">Is my data protected under the ₹0 Free Spark Plan?</div>
            <p className="text-slate-400 font-sans text-xs mt-1 leading-relaxed">
              Yes. All security is enforced directly at the database layer via Cloud Firestore Security Rules (ABAC).
              Even without paid Firebase servers, your private documents are strictly restricted to your authenticated UID.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
