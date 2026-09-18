import RoyalCard from './RoyalCard'
import SignalBadge from './SignalBadge'

export default function JihvaPreview({ signal }: { signal?: any }) {
  if (!signal) return null;
  return (
    <RoyalCard className="p-5 flex flex-col items-center">
      <SignalBadge />
      <h3 className="font-display text-xl text-royal-gold mt-4 mb-4">Jihva (Tongue) Analysis</h3>
      
      <div className="w-48 h-48 bg-royal-surface rounded-lg border border-royal-gold/20 flex items-center justify-center mb-6 relative overflow-hidden">
        {/* Placeholder SVG */}
        <svg viewBox="0 0 100 100" className="w-32 h-32 text-royal-gold/20" fill="currentColor">
          <path d="M50 10C30 10 20 30 20 50C20 70 30 90 50 90C70 90 80 70 80 50C80 30 70 10 50 10Z" />
          <path d="M50 10v80" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-royal-bg/80 to-transparent"></div>
        <span className="absolute bottom-4 text-xs text-royal-ivory/50">Capture: {signal.captureTime}</span>
      </div>

      <div className="w-full space-y-3 bg-royal-surface/50 p-4 rounded text-sm text-center">
        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="text-royal-ivory/60">Coating Color:</div>
          <div className="text-royal-ivory font-semibold">{signal.coatingColor || 'Mild white coating'}</div>
          <div className="text-royal-ivory/60">Texture:</div>
          <div className="text-royal-ivory font-semibold">{signal.texture || 'Slightly dry'}</div>
          <div className="text-royal-ivory/60">Moisture:</div>
          <div className="text-royal-ivory font-semibold">{signal.moisture || 'Normal'}</div>
        </div>
        <div className="pt-3 mt-3 border-t border-royal-gold/10 text-royal-teal">
          {signal.analysisNote || 'Kapha tendency noted'}
        </div>
      </div>
      
      <div className="text-[10px] text-royal-ivory/40 mt-4 text-center max-w-xs uppercase tracking-wider">
        This is a supporting signal for physician consideration only
      </div>
    </RoyalCard>
  )
}
