import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediKiosk | Physician Dashboard",
  description: "A calm, connected physician workspace",
};

// ─── Ornate Mandala SVG (server component, pure SVG) ───────────────────────
function OrnateMandala({ color = "#B8863C" }: { color?: string }) {
  const petals8 = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180;
    const x = 100 + 72 * Math.cos(angle);
    const y = 100 + 72 * Math.sin(angle);
    const cx1 = 100 + 52 * Math.cos(angle - 0.35);
    const cy1 = 100 + 52 * Math.sin(angle - 0.35);
    const cx2 = 100 + 52 * Math.cos(angle + 0.35);
    const cy2 = 100 + 52 * Math.sin(angle + 0.35);
    return `M100,100 C${cx1},${cy1} ${cx2},${cy2} ${x},${y} Z`;
  });

  const petals16 = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * 22.5 * Math.PI) / 180;
    const x = 100 + 95 * Math.cos(angle);
    const y = 100 + 95 * Math.sin(angle);
    const cx1 = 100 + 68 * Math.cos(angle - 0.22);
    const cy1 = 100 + 68 * Math.sin(angle - 0.22);
    const cx2 = 100 + 68 * Math.cos(angle + 0.22);
    const cy2 = 100 + 68 * Math.sin(angle + 0.22);
    return `M100,100 C${cx1},${cy1} ${cx2},${cy2} ${x},${y} Z`;
  });

  const dots = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * 22.5 * Math.PI) / 180;
    return { cx: 100 + 87 * Math.cos(angle), cy: 100 + 87 * Math.sin(angle) };
  });

  const diamonds = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180;
    const tip  = { x: 100 + 42 * Math.cos(angle), y: 100 + 42 * Math.sin(angle) };
    const base = { x: 100 + 32 * Math.cos(angle), y: 100 + 32 * Math.sin(angle) };
    const lft  = { x: 100 + 37 * Math.cos(angle - 0.28), y: 100 + 37 * Math.sin(angle - 0.28) };
    const rgt  = { x: 100 + 37 * Math.cos(angle + 0.28), y: 100 + 37 * Math.sin(angle + 0.28) };
    return `${tip.x},${tip.y} ${lft.x},${lft.y} ${base.x},${base.y} ${rgt.x},${rgt.y}`;
  });

  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", color }}>
      {/* Rings */}
      <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="100" cy="100" r="88" stroke="currentColor" strokeWidth="0.6" strokeDasharray="4 3" />
      <circle cx="100" cy="100" r="78" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="100" cy="100" r="42" stroke="currentColor" strokeWidth="1.0" />
      <circle cx="100" cy="100" r="28" stroke="currentColor" strokeWidth="1.0" />
      <circle cx="100" cy="100" r="14" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="100" cy="100" r="8"  stroke="currentColor" strokeWidth="0.8" />
      <circle cx="100" cy="100" r="3.5" fill="currentColor" opacity="0.7" />

      {/* 16-petal outer lotus */}
      {petals16.map((d, i) => <path key={`p16-${i}`} d={d} stroke="currentColor" strokeWidth="0.9" fill="none" />)}

      {/* 8-petal mid lotus */}
      {petals8.map((d, i) => <path key={`p8-${i}`} d={d} stroke="currentColor" strokeWidth="1.1" fill="none" />)}

      {/* Diamonds */}
      {diamonds.map((pts, i) => <polygon key={`d-${i}`} points={pts} stroke="currentColor" strokeWidth="0.8" fill="none" />)}

      {/* 12 inner petals */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x = 100 + 28 * Math.cos(angle);
        const y = 100 + 28 * Math.sin(angle);
        const cx1 = 100 + 20 * Math.cos(angle - 0.25);
        const cy1 = 100 + 20 * Math.sin(angle - 0.25);
        const cx2 = 100 + 20 * Math.cos(angle + 0.25);
        const cy2 = 100 + 20 * Math.sin(angle + 0.25);
        return <path key={`ip-${i}`} d={`M100,100 C${cx1},${cy1} ${cx2},${cy2} ${x},${y} Z`} stroke="currentColor" strokeWidth="0.9" fill="none" />;
      })}

      {/* Dot accents */}
      {dots.map((d, i) => <circle key={`dot-${i}`} cx={d.cx} cy={d.cy} r="1.5" fill="currentColor" opacity="0.6" />)}

      {/* Star lines */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        return <line key={`sl-${i}`} x1={100 + 44 * Math.cos(a)} y1={100 + 44 * Math.sin(a)} x2={100 + 44 * Math.cos(a + Math.PI)} y2={100 + 44 * Math.sin(a + Math.PI)} stroke="currentColor" strokeWidth="0.7" />;
      })}
    </svg>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Nunito+Sans:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="watercolor-shell">
          {/* Top-right rotating mandala */}
          <div className="mandala mandala-top">
            <OrnateMandala color="#B8863C" />
          </div>
          {/* Bottom-right counter-rotating mandala */}
          <div className="mandala mandala-bottom">
            <OrnateMandala color="#C9974B" />
          </div>
          {/* Ink splatter dots */}
          <svg
            style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {[
              { cx: "62", cy: "28", r: "0.5", op: "0.50" },
              { cx: "68", cy: "31", r: "0.35", op: "0.40" },
              { cx: "71", cy: "26", r: "0.40", op: "0.45" },
              { cx: "75", cy: "33", r: "0.55", op: "0.55" },
              { cx: "78", cy: "29", r: "0.28", op: "0.35" },
              { cx: "65", cy: "37", r: "0.30", op: "0.38" },
              { cx: "60", cy: "55", r: "0.38", op: "0.42" },
              { cx: "63", cy: "60", r: "2.00", op: "0.70" },
              { cx: "67", cy: "62", r: "0.48", op: "0.45" },
              { cx: "72", cy: "57", r: "0.34", op: "0.38" },
              { cx: "55", cy: "65", r: "0.44", op: "0.40" },
              { cx: "58", cy: "68", r: "0.26", op: "0.35" },
            ].map((d, i) => (
              <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#C9974B" opacity={d.op} />
            ))}
          </svg>

          {children}
        </div>
      </body>
    </html>
  );
}
