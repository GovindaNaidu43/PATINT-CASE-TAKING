export default function RoyalCard({ children, className = '', glowing = false }: { children: React.ReactNode, className?: string, glowing?: boolean }) {
  return (
    <div className={`bg-royal-surface border border-royal-gold/20 rounded-xl ${glowing ? 'shadow-gold-glow' : 'shadow-lg'} ${className}`}>
      {children}
    </div>
  )
}
