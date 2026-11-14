import React, { useState } from 'react';
import {
  Smartphone,
  Monitor,
  Tv,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  QrCode,
  KeyRound,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Info
} from 'lucide-react';
import { useJarvis } from '../context/JarvisContext.tsx';
import { Device } from '../types/jarvis.ts';

export const DevicesView: React.FC = () => {
  const { devices, pairNewDevice, revokeConnectedDevice, setActiveView } = useJarvis();
  const [modalOpen, setModalOpen] = useState(false);
  const [pairingDeviceName, setPairingDeviceName] = useState('Pixel 9 Pro');
  const [pairingType, setPairingType] = useState<Device['deviceType']>('Android Phone');
  const [activePairingDevice, setActivePairingDevice] = useState<Device | null>(null);

  const handleStartPairing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pairingDeviceName.trim()) return;
    const dev = await pairNewDevice(pairingDeviceName.trim(), pairingType);
    setActivePairingDevice(dev);
  };

  const handleFinishPairing = () => {
    setActivePairingDevice(null);
    setModalOpen(false);
  };

  return (
    <div className="h-full w-full min-w-0 flex flex-col p-3.5 sm:p-6 lg:p-8 pb-8 space-y-5 max-w-7xl mx-auto overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-cyan-500/20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#050b18]/80 border border-cyan-500/20">
        <div className="min-w-0">
          <div className="text-[11px] sm:text-xs font-mono text-cyan-400/70 tracking-widest uppercase flex items-center gap-2">
            <Smartphone size={14} className="text-cyan-400 shrink-0" />
            <span className="truncate">ECOSYSTEM NODES // {devices.length} REGISTERED</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono text-slate-100 mt-1">
            Connected Companion Devices
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage authorized native Android companion APKs, desktop workstations, and smart displays connected to your JARVIS ecosystem.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveView('contract')}
            className="flex items-center gap-2 px-3.5 py-2 min-h-[42px] rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition-colors"
          >
            <Info size={14} />
            <span>API Handshake Contract</span>
          </button>

          <button
            onClick={() => {
              setActivePairingDevice(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 min-h-[42px] rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            <Plus size={16} />
            <span>Pair New Device</span>
          </button>
        </div>
      </div>

      {/* ARCHITECTURE BOUNDARY NOTICE */}
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-3 text-xs font-sans text-slate-300">
        <Info size={18} className="text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-mono text-cyan-300">PWA vs Native Android Companion APK Boundary:</strong>
          <span className="block mt-0.5 text-slate-400 leading-relaxed">
            The web PWA operates in the browser sandbox. Background wake-word listening, deep accessibility services, and direct system intents will run exclusively through the separately developed companion Android APK connected via shared Firebase Firestore synchronization.
          </span>
        </div>
      </div>

      {/* DEVICES LIST */}
      {devices.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-slate-950/40 border border-dashed border-cyan-500/20 text-center font-mono">
          <Smartphone size={40} className="text-cyan-500/30 mb-3" />
          <div className="text-sm text-cyan-300 font-bold">No companion devices paired yet</div>
          <div className="text-xs text-slate-500 mt-1 max-w-md">
            Click "Pair New Device" to generate a secure 6-digit cryptographic handshake code for your companion Android phone or desktop workstation.
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs"
          >
            + Pair First Device
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {devices.map((device) => {
            const isRevoked = device.status === 'revoked';
            const Icon = device.deviceType === 'Android Phone' ? Smartphone : (device.deviceType === 'Windows PC' ? Monitor : Tv);
            return (
              <div
                key={device.id}
                className={`p-6 rounded-2xl bg-gradient-to-b from-[#060e20] to-[#040814] border transition-all ${
                  isRevoked
                    ? 'border-red-500/30 opacity-60'
                    : 'border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.05)]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                    <Icon size={24} />
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase ${
                        isRevoked
                          ? 'bg-red-500/20 border-red-500/40 text-red-300'
                          : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      }`}
                    >
                      {device.status}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-mono text-base font-bold text-slate-100">{device.deviceName}</h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{device.deviceType}</div>
                </div>

                <div className="my-4 pt-3 border-t border-cyan-500/10 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>PAIRING CODE:</span>
                    <span className="text-cyan-300 font-bold">{device.pairingCode}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>LAST SYNC:</span>
                    <span className="text-slate-200">
                      {new Date(device.lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Granular Permissions */}
                <div className="pt-3 border-t border-cyan-500/10 space-y-1.5 text-[11px] font-mono">
                  <div className="text-slate-400 uppercase text-[10px]">Companion Permissions</div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(device.permissions).map(([perm, enabled]) => (
                      <span
                        key={perm}
                        className={`px-2 py-0.5 rounded border text-[10px] ${
                          enabled
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                            : 'bg-slate-900 border-slate-800 text-slate-600'
                        }`}
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Revoke Action */}
                {!isRevoked && (
                  <div className="mt-5 pt-3 border-t border-cyan-500/10 flex justify-end">
                    <button
                      onClick={() => revokeConnectedDevice(device.id)}
                      className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>Revoke Device Access</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* PAIRING MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#060c1d] border border-cyan-500/40 p-6 shadow-[0_0_40px_rgba(0,240,255,0.2)]">
            {!activePairingDevice ? (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
                  <h2 className="text-lg font-mono font-bold text-slate-100 flex items-center gap-2">
                    <KeyRound size={18} className="text-cyan-400" />
                    <span>AUTHENTICATE COMPANION NODE</span>
                  </h2>
                </div>

                <form onSubmit={handleStartPairing} className="mt-4 space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-cyan-400/80 mb-1">DEVICE TYPE</label>
                    <select
                      value={pairingType}
                      onChange={(e) => setPairingType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Android Phone">Android Phone (Companion APK)</option>
                      <option value="Windows PC">Windows PC Workstation</option>
                      <option value="Smart Board">Smart Board / Conference Display</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-cyan-400/80 mb-1">DEVICE IDENTIFIER / NAME</label>
                    <input
                      type="text"
                      required
                      value={pairingDeviceName}
                      onChange={(e) => setPairingDeviceName(e.target.value)}
                      placeholder="e.g. Tony's Pixel 9 Pro"
                      className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-400 font-sans text-sm"
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
                      Generate Key
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 mx-auto shadow-[0_0_20px_#00f0ff]">
                  <CheckCircle2 size={32} />
                </div>

                <h3 className="font-mono text-lg font-bold text-slate-100">
                  Pairing Key Generated
                </h3>

                <p className="text-xs text-slate-400">
                  Enter this 6-digit cryptographic handshake code into your companion APK:
                </p>

                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-400/60 font-mono text-3xl font-black tracking-widest text-cyan-300">
                  {activePairingDevice.pairingCode}
                </div>

                <div className="text-[10px] font-mono text-slate-500">
                  Target: {activePairingDevice.deviceName} ({activePairingDevice.deviceType})
                </div>

                <button
                  onClick={handleFinishPairing}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider"
                >
                  Confirmed & Ready
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
