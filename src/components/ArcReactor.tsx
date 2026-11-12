import React, { useMemo } from 'react';
import { ReactorState } from '../types/jarvis.ts';

interface ArcReactorProps {
  state?: ReactorState;
  colorTheme?: 'cyan' | 'gold-crimson' | 'violet' | 'emerald' | 'monochrome';
  size?: number; // size in px, default 280
  interactive?: boolean;
  onClick?: () => void;
  showStatusLabel?: boolean;
}

export const ArcReactor: React.FC<ArcReactorProps> = ({
  state = 'standby',
  colorTheme = 'cyan',
  size = 280,
  interactive = true,
  onClick,
  showStatusLabel = false
}) => {
  // Theme palette resolution
  const theme = useMemo(() => {
    switch (colorTheme) {
      case 'gold-crimson':
        return {
          coreGlow: '#f59e0b',
          coreCenter: '#fef08a',
          primary: '#eab308',
          secondary: '#dc2626',
          ringBorder: 'rgba(234, 179, 8, 0.4)',
          accentGlow: 'rgba(220, 38, 38, 0.5)',
          coils: '#fbbf24',
          shadow: '0 0 50px rgba(234, 179, 8, 0.45)'
        };
      case 'violet':
        return {
          coreGlow: '#a855f7',
          coreCenter: '#f3e8ff',
          primary: '#c084fc',
          secondary: '#6366f1',
          ringBorder: 'rgba(168, 85, 247, 0.4)',
          accentGlow: 'rgba(99, 102, 241, 0.5)',
          coils: '#c084fc',
          shadow: '0 0 50px rgba(168, 85, 247, 0.45)'
        };
      case 'emerald':
        return {
          coreGlow: '#10b981',
          coreCenter: '#d1fae5',
          primary: '#34d399',
          secondary: '#059669',
          ringBorder: 'rgba(16, 185, 129, 0.4)',
          accentGlow: 'rgba(5, 150, 105, 0.5)',
          coils: '#34d399',
          shadow: '0 0 50px rgba(16, 185, 129, 0.45)'
        };
      case 'monochrome':
        return {
          coreGlow: '#e2e8f0',
          coreCenter: '#ffffff',
          primary: '#cbd5e1',
          secondary: '#64748b',
          ringBorder: 'rgba(226, 232, 240, 0.4)',
          accentGlow: 'rgba(148, 163, 184, 0.5)',
          coils: '#f1f5f9',
          shadow: '0 0 50px rgba(255, 255, 255, 0.35)'
        };
      case 'cyan':
      default:
        return {
          coreGlow: '#00f0ff',
          coreCenter: '#f0fdf4',
          primary: '#38bdf8',
          secondary: '#0284c7',
          ringBorder: 'rgba(0, 240, 255, 0.4)',
          accentGlow: 'rgba(0, 240, 255, 0.6)',
          coils: '#38bdf8',
          shadow: '0 0 50px rgba(0, 240, 255, 0.45)'
        };
    }
  }, [colorTheme]);

  // Override colors for error state
  const isError = state === 'error';
  const activeCoreGlow = isError ? '#f59e0b' : theme.coreGlow;
  const activePrimary = isError ? '#ef4444' : theme.primary;
  const activeSecondary = isError ? '#b91c1c' : theme.secondary;

  // Animation parameters based on state
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
        return 'animate-[spin_25s_linear_infinite]';
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
        return 'animate-[spin_18s_linear_infinite_reverse]';
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
        return 'scale-125 transition-transform duration-300';
      case 'error':
        return 'animate-bounce duration-1000';
      case 'standby':
      default:
        return 'animate-pulse duration-3000';
    }
  }, [state]);

  // Generate 10 copper/cyan magnetic coils arranged in 360 degrees
  const coils = useMemo(() => {
    const list = [];
    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle = (i * 360) / count;
      list.push({ angle, id: i });
    }
    return list;
  }, []);

  // 60 perimeter tick marks
  const tickMarks = useMemo(() => {
    const ticks = [];
    for (let i = 0; i < 36; i++) {
      const angle = i * 10;
      const isMajor = i % 3 === 0;
      ticks.push({ angle, isMajor, id: i });
    }
    return ticks;
  }, []);

  return (
    <div className="relative inline-flex flex-col items-center justify-center select-none">
      {/* Outer Glow Aura */}
      <div
        className="absolute rounded-full transition-all duration-700 pointer-events-none"
        style={{
          width: size * 1.25,
          height: size * 1.25,
          background: `radial-gradient(circle, ${isError ? 'rgba(239, 68, 68, 0.25)' : theme.accentGlow} 0%, rgba(0,0,0,0) 70%)`,
          filter: 'blur(20px)',
          opacity: state === 'listening' || state === 'speaking' || state === 'executing' ? 0.9 : 0.6
        }}
      />

      {/* Main Reactor Body Container */}
      <div
        onClick={interactive ? onClick : undefined}
        className={`relative flex items-center justify-center rounded-full transition-all duration-500 ${
          interactive ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''
        }`}
        style={{
          width: size,
          height: size,
          boxShadow: isError ? '0 0 45px rgba(239, 68, 68, 0.5)' : theme.shadow
        }}
        title={`JARVIS Arc Reactor — Core Status: ${state.toUpperCase()}`}
      >
        {/* SVG Mechanical Framework */}
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Core Radial Gradients */}
            <radialGradient id={`core-glow-${colorTheme}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="35%" stopColor={activeCoreGlow} stopOpacity="0.9" />
              <stop offset="70%" stopColor={activePrimary} stopOpacity="0.5" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            <radialGradient id={`palladium-core-${colorTheme}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor={activeCoreGlow} />
              <stop offset="90%" stopColor={activeSecondary} />
              <stop offset="100%" stopColor="#030712" />
            </radialGradient>

            {/* Glowing Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Base Housing Rim */}
          <circle
            cx="150"
            cy="150"
            r="142"
            fill="#050a15"
            stroke={theme.ringBorder}
            strokeWidth="2.5"
          />

          {/* 2. Outer Rotating Segmented Track */}
          <g className={outerSpinClass} style={{ transformOrigin: '150px 150px' }}>
            {/* Outer segmented dashes */}
            <circle
              cx="150"
              cy="150"
              r="134"
              fill="none"
              stroke={activePrimary}
              strokeWidth="2"
              strokeDasharray="18 12 6 12"
              opacity="0.85"
            />
            {/* Outer notched markers */}
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
            <path
              d="M 140 16 L 160 16 M 150 10 L 150 22"
              stroke={activeCoreGlow}
              strokeWidth="2"
            />
            <path
              d="M 140 284 L 160 284 M 150 278 L 150 290"
              stroke={activeCoreGlow}
              strokeWidth="2"
            />
            <path
              d="M 16 140 L 16 160 M 10 150 L 22 150"
              stroke={activeCoreGlow}
              strokeWidth="2"
            />
            <path
              d="M 284 140 L 284 160 M 278 150 L 290 150"
              stroke={activeCoreGlow}
              strokeWidth="2"
            />
          </g>

          {/* 3. Static Precision Tick Ring */}
          <g>
            <circle
              cx="150"
              cy="150"
              r="118"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
            {tickMarks.map(t => (
              <line
                key={t.id}
                x1="150"
                y1={t.isMajor ? "34" : "37"}
                x2="150"
                y2="42"
                stroke={t.isMajor ? activeCoreGlow : 'rgba(255,255,255,0.3)'}
                strokeWidth={t.isMajor ? "1.5" : "0.75"}
                transform={`rotate(${t.angle} 150 150)`}
              />
            ))}
          </g>

          {/* 4. 10 Concentric Energy Coils (Arc Reactor Electromagnets) */}
          <g>
            <circle
              cx="150"
              cy="150"
              r="96"
              fill="none"
              stroke={activeSecondary}
              strokeWidth="18"
              strokeDasharray="2 18"
              opacity="0.3"
            />

            {coils.map(c => (
              <g key={c.id} transform={`rotate(${c.angle} 150 150)`}>
                {/* Copper/cyan electromagnetic solenoid block */}
                <rect
                  x="142"
                  y="48"
                  width="16"
                  height="24"
                  rx="2"
                  fill="#0b172a"
                  stroke={theme.coils}
                  strokeWidth="1.5"
                  filter="url(#glow)"
                />
                {/* Solenoid wire windings */}
                <line x1="144" y1="53" x2="156" y2="53" stroke={activeCoreGlow} strokeWidth="1" />
                <line x1="144" y1="58" x2="156" y2="58" stroke={activeCoreGlow} strokeWidth="1" />
                <line x1="144" y1="63" x2="156" y2="63" stroke={activeCoreGlow} strokeWidth="1" />
                <line x1="144" y1="68" x2="156" y2="68" stroke={activeCoreGlow} strokeWidth="1" />
              </g>
            ))}
          </g>

          {/* 5. Inner Counter-Rotating Gyroscopic Ring */}
          <g className={innerSpinClass} style={{ transformOrigin: '150px 150px' }}>
            <circle
              cx="150"
              cy="150"
              r="76"
              fill="none"
              stroke={activePrimary}
              strokeWidth="2.5"
              strokeDasharray="30 15 10 15"
              opacity="0.9"
            />
            {/* Inner mechanical notches */}
            <circle
              cx="150"
              cy="150"
              r="66"
              fill="none"
              stroke={activeSecondary}
              strokeWidth="1.5"
              strokeDasharray="8 6"
            />
          </g>

          {/* 6. Glowing Central Power Chamber */}
          <circle
            cx="150"
            cy="150"
            r="54"
            fill="#030816"
            stroke={activeCoreGlow}
            strokeWidth="2"
          />

          {/* 7. Quantum Core Triangle / Hexagonal Aperture */}
          <g className={corePulseClass} style={{ transformOrigin: '150px 150px' }}>
            {/* Core Glow Bloom */}
            <circle
              cx="150"
              cy="150"
              r="48"
              fill={`url(#core-glow-${colorTheme})`}
            />

            {/* Inverted Triangle Reactor Shroud (Classic Mark III / VI design) */}
            <polygon
              points="150,118 178,166 122,166"
              fill="none"
              stroke={activeCoreGlow}
              strokeWidth="2"
              opacity="0.85"
            />
            <polygon
              points="150,126 172,162 128,162"
              fill="none"
              stroke={theme.coreCenter}
              strokeWidth="1"
              opacity="0.6"
            />

            {/* Central Hyper-Energy Core */}
            <circle
              cx="150"
              cy="150"
              r="22"
              fill={`url(#palladium-core-${colorTheme})`}
              filter="url(#glow)"
            />
            <circle
              cx="150"
              cy="150"
              r="10"
              fill="#ffffff"
            />
          </g>

          {/* 8. Glass Convex Reflection Highlight */}
          <path
            d="M 110 30 A 130 130 0 0 1 190 30 A 140 140 0 0 0 110 30"
            fill="rgba(255, 255, 255, 0.15)"
          />
        </svg>

        {/* Ambient Ring Waveform for Listening State */}
        {state === 'listening' && (
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-75 pointer-events-none" />
        )}

        {/* Shockwave ripple for Executing State */}
        {state === 'executing' && (
          <div className="absolute inset-[-20px] rounded-full border-4 border-cyan-300 animate-ping opacity-90 pointer-events-none" />
        )}
      </div>

      {/* Optional Status Label HUD */}
      {showStatusLabel && (
        <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-mono tracking-widest uppercase">
          <span
            className={`w-2 h-2 rounded-full ${
              isError ? 'bg-amber-400' : 'bg-cyan-400'
            } animate-pulse`}
          />
          <span className="text-cyan-300">CORE: {state.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
};
