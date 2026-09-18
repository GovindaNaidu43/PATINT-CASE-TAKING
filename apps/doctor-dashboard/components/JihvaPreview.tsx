import RoyalCard from './RoyalCard'
import SignalBadge from './SignalBadge'

export default function JihvaPreview({ signal }: { signal?: any }) {
  if (!signal) return null;
  return (
    <RoyalCard className="p-5 flex flex-col items-center">
      <SignalBadge />
      <h3 className="font-display text-xl text-royal-gold mt-4 mb-4">Jihva (Tongue) Analysis</h3>

      <div className="w-48 h-48 rounded-lg border flex items-center justify-center mb-6 relative overflow-hidden"
           style={{ background: 'rgba(232,217,188,0.35)', borderColor: '#E8D9BC' }}>
        {/* Placeholder SVG */}
        <svg viewBox="0 0 100 100" className="w-32 h-32" fill="rgba(184,134,60,0.18)">
          <path d="M50 10C30 10 20 30 20 50C20 70 30 90 50 90C70 90 80 70 80 50C80 30 70 10 50 10Z" />
          <path d="M50 10v80" stroke="rgba(184,134,60,0.35)" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(250,243,232,0.70)] to-transparent" />
        <span className="absolute bottom-4 text-xs" style={{ color: '#A89070' }}>
          Capture: {signal.captureTime}
        </span>
      </div>

      <div className="w-full space-y-3 p-4 rounded text-sm text-center"
           style={{ background: 'rgba(232,217,188,0.30)' }}>
        <div className="grid grid-cols-2 gap-2 text-left">
          <div style={{ color: '#8A745A' }}>Coating Color:</div>
          <div className="font-semibold" style={{ color: '#3E2E1E' }}>{signal.coatingColor || 'Mild white coating'}</div>
          <div style={{ color: '#8A745A' }}>Texture:</div>
          <div className="font-semibold" style={{ color: '#3E2E1E' }}>{signal.texture || 'Slightly dry'}</div>
          <div style={{ color: '#8A745A' }}>Moisture:</div>
          <div className="font-semibold" style={{ color: '#3E2E1E' }}>{signal.moisture || 'Normal'}</div>
        </div>
        <div className="pt-3 mt-3 font-semibold" style={{ borderTop: '1px solid rgba(184,134,60,0.15)', color: '#8CA383' }}>
          {signal.analysisNote || 'Kapha tendency noted'}
        </div>
      </div>

      <div className="text-[10px] mt-4 text-center max-w-xs uppercase tracking-wider" style={{ color: '#B8A090' }}>
        This is a supporting signal for physician consideration only
      </div>
    </RoyalCard>
  )
}
