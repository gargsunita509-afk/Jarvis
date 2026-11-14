import React, { useMemo } from 'react';
import { ReactorState } from '../types/jarvis.ts';

interface ArcReactorProps {
  state?: ReactorState;
  colorTheme?: 'cyan' | 'gold-crimson' | 'violet' | 'emerald' | 'monochrome';
  size?: number; // max size in px, scales responsively via CSS className or max-width
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  showStatusLabel?: boolean;
}

export const ArcReactor: React.FC<ArcReactorProps> = ({
  state = 'standby',
  colorTheme = 'cyan',
  size = 280,
  className = '',
  interactive = true,
  onClick,
  showStatusLabel = false
}) => {
  const theme = useMemo(() => {
    switch (colorTheme) {
      case 'gold-crimson':
        return {
          coreGlow: '#f59e0b',
          coreCenter: '#fef08a',
          primary: '#eab308',
          secondary: '#dc2626',
          ringBorder: 'rgba(234, 179, 8, 0.45)',
          accentGlow: 'rgba(220, 38, 38, 0.5)',
          coils: '#fbbf24',
          shadow: '0 0 42px rgba(234, 179, 8, 0.4)'
        };
      case 'violet':
        return {
          coreGlow: '#a855f7',
          coreCenter: '#f3e8ff',
          primary: '#c084fc',
          secondary: '#6366f1',
          ringBorder: 'rgba(168, 85, 247, 0.45)',
          accentGlow: 'rgba(99, 102, 241, 0.5)',
          coils: '#c084fc',
          shadow: '0 0 42px rgba(168, 85, 247, 0.4)'
        };
      case 'emerald':
        return {
          coreGlow: '#10b981',
          coreCenter: '#d1fae5',
          primary: '#34d399',
          secondary: '#059669',
          ringBorder: 'rgba(16, 185, 129, 0.45)',
          accentGlow: 'rgba(5, 150, 105, 0.5)',
          coils: '#34d399',
          shadow: '0 0 42px rgba(16, 185, 129, 0.4)'
        };
      case 'monochrome':
        return {
          coreGlow: '#e2e8f0',
          coreCenter: '#ffffff',
          primary: '#cbd5e1',
          secondary: '#64748b',
          ringBorder: 'rgba(226, 232, 240, 0.45)',
          accentGlow: 'rgba(148, 163, 184, 0.5)',
          coils: '#f1f5f9',
          shadow: '0 0 42px rgba(255, 255, 255, 0.35)'
        };
      case 'cyan':
      default:
        return {
          coreGlow: '#00f0ff',
          coreCenter: '#ecfeff',
          primary: '#38bdf8',
          secondary: '#0284c7',
          ringBorder: 'rgba(0, 240, 255, 0.45)',
          accentGlow: 'rgba(0, 240, 255, 0.55)',
          coils: '#7dd3fc',
          shadow: '0 0 46px rgba(0, 240, 255, 0.42)'
        };
    }
  }, [colorTheme]);

  const isError = state === 'error';
  const activeCoreGlow = isError ? '#f59e0b' : theme.coreGlow;
  const activePrimary = isError ? '#ef4444' : theme.primary;
  const activeSecondary = isError ? '#b91c1c' : theme.secondary;

  const outerSpinClass = useMemo(() => {
    switch (state) {
      case 'activation':
        return 'animate-[spin_4s_linear_infinite]';
      case 'thinking':
        return 'animate-[spin_6s_linear_infinite]';
      case 'listening':
        return 'animate-[spin_10s_linear_infinite]';
      case 'speaking':
        return 'animate-[spin_14s_linear_infinite]';
      case 'executing':
        return 'animate-[spin_3s_linear_infinite]';
      case 'error':
        return 'animate-none';
      case 'standby':
      default:
        return 'animate-[spin_28s_linear_infinite]';
    }
  }, [state]);

  const innerSpinClass = useMemo(() => {
    switch (state) {
      case 'activation':
        return 'animate-[spin_3s_linear_infinite_reverse]';
      case 'thinking':
        return 'animate-[spin_4s_linear_infinite_reverse]';
      case 'listening':
        return 'animate-[spin_8s_linear_infinite_reverse]';
      case 'speaking':
        return 'animate-[spin_12s_linear_infinite_reverse]';
      case 'executing':
        return 'animate-[spin_2s_linear_infinite_reverse]';
      case 'error':
        return 'animate-none';
      case 'standby':
      default:
        return 'animate-[spin_20s_linear_infinite_reverse]';
    }
  }, [state]);

  const corePulseClass = useMemo(() => {
    switch (state) {
      case 'activation':
        return 'animate-ping duration-1000';
      case 'listening':
        return 'animate-pulse scale-105 duration-700';
      case 'thinking':
        return 'animate-pulse scale-95 duration-500';
      case 'speaking':
        return 'animate-pulse scale-110 duration-500';
      case 'executing':
        return 'scale-110 transition-transform duration-300';
      case 'error':
        return 'animate-bounce duration-1000';
      case 'standby':
      default:
        return 'animate-pulse duration-3000';
    }
  }, [state]);

  // 10 Metallic Solenoid Segments (matching metallic titanium + cyan reference aesthetic)
  const coils = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      angle: (i * 360) / 10,
      id: i
    }));
  }, []);

  // 36 Perimeter HUD tick marks
  const tickMarks = useMemo(() => {
    return Array.from({ length: 36 }, (_, i) => ({
      angle: i * 10,
      isMajor: i % 3 === 0,
      id: i
    }));
  }, []);

  const uid = `reactor-${colorTheme}`;

  return (
    <div className="relative inline-flex flex-col items-center justify-center select-none max-w-full">
      {/* Main Fluid Reactor Body Container */}
      <div
        onClick={interactive ? onClick : undefined}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={
          interactive && onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        className={`relative aspect-square max-w-full flex items-center justify-center rounded-full transition-transform duration-300 ${
          interactive ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''
        } ${className}`}
        style={{
          width: className ? undefined : `min(${size}px, 68vw)`,
          boxShadow: isError ? '0 0 40px rgba(239, 68, 68, 0.45)' : theme.shadow
        }}
        title={`JARVIS Arc Reactor — Core Status: ${state.toUpperCase()}`}
        aria-label={`JARVIS Arc Reactor, core status ${state}`}
      >
        {/* Scaled Ambient Glow Aura (safe inside parent bounds) */}
        <div
          className="absolute inset-[-8%] rounded-full transition-all duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${isError ? 'rgba(239, 68, 68, 0.25)' : theme.accentGlow} 0%, rgba(0,0,0,0) 70%)`,
            filter: 'blur(18px)',
            opacity: state === 'listening' || state === 'speaking' || state === 'executing' ? 0.9 : 0.55
          }}
        />

        {/* SVG Mechanical Framework */}
        <svg
          viewBox="0 0 300 300"
          className="relative z-10 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`${uid}-titanium`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="30%" stopColor="#1e293b" />
              <stop offset="65%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id={`${uid}-coil-metal`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <radialGradient id={`${uid}-core-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="35%" stopColor={activeCoreGlow} stopOpacity="0.92" />
              <stop offset="72%" stopColor={activePrimary} stopOpacity="0.45" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            <radialGradient id={`${uid}-palladium-core`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="48%" stopColor={activeCoreGlow} />
              <stop offset="88%" stopColor={activeSecondary} />
              <stop offset="100%" stopColor="#030712" />
            </radialGradient>

            <filter id={`${uid}-glow`} x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Outer Metallic Titanium Chassis Ring */}
          <circle
            cx="150"
            cy="150"
            r="144"
            fill="#040914"
            stroke={`url(#${uid}-titanium)`}
            strokeWidth="4"
          />
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke={theme.ringBorder}
            strokeWidth="1.2"
          />

          {/* 2. Outer Rotating Segmented Track */}
          <g className={outerSpinClass} style={{ transformOrigin: '150px 150px' }}>
            <circle
              cx="150"
              cy="150"
              r="134"
              fill="none"
              stroke={activePrimary}
              strokeWidth="2.5"
              strokeDasharray="20 10 6 10"
              opacity="0.88"
            />
            <circle
              cx="150"
              cy="150"
              r="126"
              fill="none"
              stroke={theme.ringBorder}
              strokeWidth="1"
              strokeDasharray="4 8"
            />
            {/* 4 Cardinal Angular Brackets */}
            <path d="M 138 15 L 162 15 M 150 9 L 150 21" stroke={activeCoreGlow} strokeWidth="2" />
            <path d="M 138 285 L 162 285 M 150 279 L 150 291" stroke={activeCoreGlow} strokeWidth="2" />
            <path d="M 15 138 L 15 162 M 9 150 L 21 150" stroke={activeCoreGlow} strokeWidth="2" />
            <path d="M 285 138 L 285 162 M 279 150 L 291 150" stroke={activeCoreGlow} strokeWidth="2" />
          </g>

          {/* 3. Static Precision Tick Ring */}
          <g>
            <circle cx="150" cy="150" r="118" fill="none" stroke="rgba(226,232,240,0.18)" strokeWidth="1" />
            {tickMarks.map((t) => (
              <line
                key={t.id}
                x1="150"
                y1={t.isMajor ? '33' : '37'}
                x2="150"
                y2="43"
                stroke={t.isMajor ? activeCoreGlow : 'rgba(203,213,225,0.35)'}
                strokeWidth={t.isMajor ? '1.6' : '0.8'}
                transform={`rotate(${t.angle} 150 150)`}
              />
            ))}
          </g>

          {/* 4. 10 Metallic Brushed-Titanium & Illuminated Solenoid Coils */}
          <g>
            <circle
              cx="150"
              cy="150"
              r="96"
              fill="none"
              stroke="#1e293b"
              strokeWidth="26"
              opacity="0.7"
            />
            <circle
              cx="150"
              cy="150"
              r="96"
              fill="none"
              stroke={activeSecondary}
              strokeWidth="18"
              strokeDasharray="3 17"
              opacity="0.38"
            />

            {coils.map((c) => (
              <g key={c.id} transform={`rotate(${c.angle} 150 150)`}>
                {/* Brushed titanium housing block */}
                <rect
                  x="139"
                  y="45"
                  width="22"
                  height="28"
                  rx="3"
                  fill={`url(#${uid}-coil-metal)`}
                  stroke="rgba(226,232,240,0.45)"
                  strokeWidth="1"
                />
                {/* Illuminated core emitter bar */}
                <rect
                  x="144"
                  y="49"
                  width="12"
                  height="7"
                  rx="1.5"
                  fill={activeCoreGlow}
                  filter={`url(#${uid}-glow)`}
                />
                {/* Metallic windings */}
                <line x1="142" y1="60" x2="158" y2="60" stroke={theme.coils} strokeWidth="1.2" opacity="0.85" />
                <line x1="142" y1="65" x2="158" y2="65" stroke={theme.coils} strokeWidth="1.2" opacity="0.85" />
                <line x1="142" y1="69" x2="158" y2="69" stroke="rgba(226,232,240,0.4)" strokeWidth="1" />
              </g>
            ))}
          </g>

          {/* 5. Inner Counter-Rotating Gyroscopic Ring */}
          <g className={innerSpinClass} style={{ transformOrigin: '150px 150px' }}>
            <circle
              cx="150"
              cy="150"
              r="75"
              fill="none"
              stroke={activePrimary}
              strokeWidth="2.5"
              strokeDasharray="28 14 10 14"
              opacity="0.92"
            />
            <circle
              cx="150"
              cy="150"
              r="65"
              fill="none"
              stroke="rgba(226,232,240,0.35)"
              strokeWidth="1.5"
              strokeDasharray="8 6"
            />
          </g>

          {/* 6. Glowing Central Power Chamber */}
          <circle cx="150" cy="150" r="55" fill="#030816" stroke={activeCoreGlow} strokeWidth="2.2" />

          {/* 7. Quantum Core Aperture */}
          <g className={corePulseClass} style={{ transformOrigin: '150px 150px' }}>
            <circle cx="150" cy="150" r="50" fill={`url(#${uid}-core-glow)`} />

            {/* Geometric Reactor Shroud */}
            <polygon
              points="150,114 182,168 118,168"
              fill="none"
              stroke={activeCoreGlow}
              strokeWidth="2"
              opacity="0.88"
            />
            <polygon
              points="150,124 173,162 127,162"
              fill="none"
              stroke={theme.coreCenter}
              strokeWidth="1"
              opacity="0.65"
            />

            {/* Central Energy Sphere */}
            <circle
              cx="150"
              cy="150"
              r="24"
              fill={`url(#${uid}-palladium-core)`}
              filter={`url(#${uid}-glow)`}
            />
            <circle cx="150" cy="150" r="11" fill="#ffffff" />
          </g>

          {/* 8. Glass Convex Reflection */}
          <path
            d="M 108 30 A 132 132 0 0 1 192 30 A 142 142 0 0 0 108 30"
            fill="rgba(255, 255, 255, 0.16)"
          />
        </svg>

        {/* Ambient Ring Waveform for Listening State */}
        {state === 'listening' && (
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-70 pointer-events-none" />
        )}

        {/* Shockwave ripple for Executing State */}
        {state === 'executing' && (
          <div className="absolute inset-[-10px] rounded-full border-2 border-cyan-300 animate-ping opacity-80 pointer-events-none" />
        )}
      </div>

      {/* Optional Status Label HUD */}
      {showStatusLabel && (
        <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/35 text-[11px] font-mono tracking-widest uppercase">
          <span className={`w-2 h-2 rounded-full ${isError ? 'bg-amber-400' : 'bg-cyan-400'} animate-pulse`} />
          <span className="text-cyan-300">CORE: {state.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
};
