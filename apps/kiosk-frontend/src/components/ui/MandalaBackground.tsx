import React from 'react';

/**
 * Full-page decorative background layer:
 *  - Two ornate corner mandalas that slowly rotate
 *  - Scattered golden ink-splatter dots
 * Place this as the first child inside any full-screen layout wrapper.
 */
const MandalaBackground: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>

    {/* ── Top-right mandala (partial, ~¼ visible) ── */}
    <div
      className="absolute animate-spin-slow"
      style={{
        top: '-110px',
        right: '-110px',
        width: '340px',
        height: '340px',
        opacity: 0.55,
        transformOrigin: 'center center',
      }}
    >
      <OrnateMandala color="#B8863C" />
    </div>

    {/* ── Bottom-right mandala (partial, ~½ visible, counter-rotate) ── */}
    <div
      className="absolute animate-spin-very-slow"
      style={{
        bottom: '-160px',
        right: '-120px',
        width: '500px',
        height: '500px',
        opacity: 0.62,
        transformOrigin: 'center center',
      }}
    >
      <OrnateMandala color="#C9974B" />
    </div>

    {/* ── Ink splatter dots ── */}
    <InkSplatter />
  </div>
);

/* ─── Ornate Mandala SVG ─────────────────────────────────── */
const OrnateMandala: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: '100%' }}>
    {/* Outer ring */}
    <circle cx="100" cy="100" r="95" stroke={color} strokeWidth="1.2" />
    <circle cx="100" cy="100" r="88" stroke={color} strokeWidth="0.6" strokeDasharray="4 3" />
    <circle cx="100" cy="100" r="78" stroke={color} strokeWidth="0.8" />

    {/* 16-petal outer lotus */}
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 22.5 * Math.PI) / 180;
      const x1 = 100 + 95 * Math.cos(angle);
      const y1 = 100 + 95 * Math.sin(angle);
      const cx1 = 100 + 68 * Math.cos(angle - 0.22);
      const cy1 = 100 + 68 * Math.sin(angle - 0.22);
      const cx2 = 100 + 68 * Math.cos(angle + 0.22);
      const cy2 = 100 + 68 * Math.sin(angle + 0.22);
      return (
        <path
          key={`outer-petal-${i}`}
          d={`M100,100 C${cx1},${cy1} ${cx2},${cy2} ${x1},${y1} Z`}
          stroke={color} strokeWidth="0.9" fill="none"
        />
      );
    })}

    {/* 8-petal mid lotus */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      const x1 = 100 + 72 * Math.cos(angle);
      const y1 = 100 + 72 * Math.sin(angle);
      const cx1 = 100 + 52 * Math.cos(angle - 0.35);
      const cy1 = 100 + 52 * Math.sin(angle - 0.35);
      const cx2 = 100 + 52 * Math.cos(angle + 0.35);
      const cy2 = 100 + 52 * Math.sin(angle + 0.35);
      return (
        <path
          key={`mid-petal-${i}`}
          d={`M100,100 C${cx1},${cy1} ${cx2},${cy2} ${x1},${y1} Z`}
          stroke={color} strokeWidth="1.1" fill="none"
        />
      );
    })}

    {/* Inner geometric star */}
    {Array.from({ length: 8 }).map((_, i) => {
      const a1 = ((i * 45) * Math.PI) / 180;
      const a2 = (((i * 45) + 22.5) * Math.PI) / 180;
      return (
        <g key={`star-${i}`}>
          <line
            x1={100 + 44 * Math.cos(a1)} y1={100 + 44 * Math.sin(a1)}
            x2={100 + 44 * Math.cos(a1 + Math.PI)} y2={100 + 44 * Math.sin(a1 + Math.PI)}
            stroke={color} strokeWidth="0.7"
          />
          <line
            x1={100 + 54 * Math.cos(a2)} y1={100 + 54 * Math.sin(a2)}
            x2={100 + 54 * Math.cos(a2 + Math.PI)} y2={100 + 54 * Math.sin(a2 + Math.PI)}
            stroke={color} strokeWidth="0.5"
          />
        </g>
      );
    })}

    {/* Middle ring + 8 diamond shapes */}
    <circle cx="100" cy="100" r="42" stroke={color} strokeWidth="1.0" />
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180;
      const tip = { x: 100 + 42 * Math.cos(angle), y: 100 + 42 * Math.sin(angle) };
      const base = { x: 100 + 32 * Math.cos(angle), y: 100 + 32 * Math.sin(angle) };
      const lft = { x: 100 + 37 * Math.cos(angle - 0.28), y: 100 + 37 * Math.sin(angle - 0.28) };
      const rgt = { x: 100 + 37 * Math.cos(angle + 0.28), y: 100 + 37 * Math.sin(angle + 0.28) };
      return (
        <polygon
          key={`diamond-${i}`}
          points={`${tip.x},${tip.y} ${lft.x},${lft.y} ${base.x},${base.y} ${rgt.x},${rgt.y}`}
          stroke={color} strokeWidth="0.8" fill="none"
        />
      );
    })}

    {/* Inner lotus ring */}
    <circle cx="100" cy="100" r="28" stroke={color} strokeWidth="1.0" />
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const x1 = 100 + 28 * Math.cos(angle);
      const y1 = 100 + 28 * Math.sin(angle);
      const cx1 = 100 + 20 * Math.cos(angle - 0.25);
      const cy1 = 100 + 20 * Math.sin(angle - 0.25);
      const cx2 = 100 + 20 * Math.cos(angle + 0.25);
      const cy2 = 100 + 20 * Math.sin(angle + 0.25);
      return (
        <path
          key={`inner-petal-${i}`}
          d={`M100,100 C${cx1},${cy1} ${cx2},${cy2} ${x1},${y1} Z`}
          stroke={color} strokeWidth="0.9" fill="none"
        />
      );
    })}

    {/* Centre circles */}
    <circle cx="100" cy="100" r="14" stroke={color} strokeWidth="1.2" />
    <circle cx="100" cy="100" r="8" stroke={color} strokeWidth="0.8" />
    <circle cx="100" cy="100" r="3.5" fill={color} opacity="0.7" />

    {/* Dot accents on outer ring */}
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 22.5 * Math.PI) / 180;
      return (
        <circle
          key={`dot-${i}`}
          cx={100 + 87 * Math.cos(angle)}
          cy={100 + 87 * Math.sin(angle)}
          r="1.5" fill={color} opacity="0.6"
        />
      );
    })}
  </svg>
);

/* ─── Ink Splatter dots ──────────────────────────────────── */
const InkSplatter: React.FC = () => {
  // Fixed positions tuned to match reference image (scattered centre-right)
  const dots: { x: string; y: string; r: number; op: number }[] = [
    { x: '62%', y: '28%', r: 1.4, op: 0.50 },
    { x: '68%', y: '31%', r: 0.9, op: 0.40 },
    { x: '71%', y: '26%', r: 1.1, op: 0.45 },
    { x: '75%', y: '33%', r: 1.6, op: 0.55 },
    { x: '78%', y: '29%', r: 0.7, op: 0.35 },
    { x: '65%', y: '37%', r: 0.8, op: 0.38 },
    { x: '60%', y: '55%', r: 1.0, op: 0.42 },
    { x: '63%', y: '60%', r: 5.5, op: 0.70 }, // the bold accent dot
    { x: '67%', y: '62%', r: 1.3, op: 0.45 },
    { x: '72%', y: '57%', r: 0.9, op: 0.38 },
    { x: '55%', y: '65%', r: 1.2, op: 0.40 },
    { x: '58%', y: '68%', r: 0.7, op: 0.35 },
  ];

  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill="#C9974B"
          opacity={d.op}
        />
      ))}
    </svg>
  );
};

export default MandalaBackground;
