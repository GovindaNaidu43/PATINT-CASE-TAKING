export default function RoyalCard({
  children,
  className = '',
  glowing = false,
}: {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
}) {
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{
        background: 'rgba(255,253,248,0.88)',
        border: `1px solid ${glowing ? '#C9974B' : '#E8D9BC'}`,
        boxShadow: glowing
          ? '0 0 0 2px rgba(201,151,75,0.20), 0 12px 28px rgba(184,134,60,0.10)'
          : '0 8px 24px rgba(184,134,60,0.07)',
      }}
    >
      {children}
    </div>
  );
}
