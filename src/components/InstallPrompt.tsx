import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, CheckCircle2, Info } from 'lucide-react';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt if not already dismissed in session
      if (!sessionStorage.getItem('jarvis_pwa_dismissed')) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert('To install JARVIS on iOS or Desktop: Open browser menu and select "Add to Home Screen" or "Install App".');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('jarvis_pwa_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 max-w-sm p-4 rounded-2xl bg-[#060c1d]/95 border border-cyan-400/60 shadow-[0_0_25px_rgba(0,240,255,0.25)] backdrop-blur-md animate-fade-in font-mono text-xs text-slate-100">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-cyan-300 font-bold">
          <Download size={16} className="text-cyan-400" />
          <span>INSTALL JARVIS (PWA)</span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-cyan-300 p-0.5"
        >
          <X size={16} />
        </button>
      </div>

      <p className="text-[11px] font-sans text-slate-300 leading-relaxed mb-3">
        Install JARVIS to your home screen or desktop dock for instant offline access and standalone command-centre viewport.
      </p>

      <div className="p-2 rounded-lg bg-slate-950/80 border border-cyan-500/20 text-[10px] font-sans text-slate-400 mb-3 flex items-start gap-1.5">
        <Info size={14} className="text-cyan-400 shrink-0 mt-0.5" />
        <span>
          Note: PWA runs in browser sandbox. Unrestricted background wake-word listening requires the companion Android APK.
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider transition-colors"
        >
          Install JARVIS
        </button>
        <button
          onClick={handleDismiss}
          className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
