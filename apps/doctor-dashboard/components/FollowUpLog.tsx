import RoyalCard from './RoyalCard'
import { Phone, MessageSquare, AlertTriangle } from 'lucide-react'

export default function FollowUpLog({ log }: { log: any }) {
  const isEscalated = log.log.some((l:any) => l.escalated)

  return (
    <RoyalCard className={`p-6 ${isEscalated ? 'border-royal-crimson/40' : ''}`}>
      <div className="flex justify-between items-center mb-6 border-b border-royal-surface pb-4">
        <div>
          <h3 className="font-display text-xl text-royal-gold">{log.name}</h3>
          <div className="text-sm text-royal-ivory/60 mt-1">ABHA: {log.abha} | Last Visit: {log.lastVisit}</div>
        </div>
        {isEscalated && (
          <div className="bg-royal-crimson text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
               style={{ boxShadow: '0 0 10px rgba(167,104,93,0.35)' }}>
            <AlertTriangle size={14} /> Escalated
          </div>
        )}
      </div>

      <div className="space-y-4">
        {log.log.map((entry: any, i: number) => (
          <div key={i} className={`p-4 rounded border`}
               style={{
                 background: entry.escalated ? 'rgba(167,104,93,0.08)' : 'rgba(232,217,188,0.30)',
                 borderColor: entry.escalated ? 'rgba(167,104,93,0.30)' : '#E8D9BC',
               }}>
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2 text-sm" style={{ color: '#5A4030' }}>
                {entry.method === 'IVR' ? <Phone size={14} className="text-royal-gold" /> : <MessageSquare size={14} style={{ color: '#8CA383' }} />}
                <span className="font-bold">{entry.method} Check-in</span>
                <span className="ml-2" style={{ color: '#A89070' }}>{entry.date}</span>
              </div>
              <div className="text-lg" title={`Sentiment: ${entry.sentiment}`}>
                {entry.sentiment === 'positive' ? '😊' : entry.sentiment === 'neutral' ? '😐' : '😟'}
              </div>
            </div>
            <div className="text-sm" style={{ color: '#3E2E1E' }}>
              {entry.summary}
            </div>
            {entry.escalated && (
              <div className="mt-2 text-xs font-bold" style={{ color: '#A7685D' }}>
                Reason: {entry.escalationReason}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2 text-sm text-royal-gold border border-royal-gold/20 hover:bg-royal-gold/10 rounded transition-colors">
        View Full Transcript
      </button>
    </RoyalCard>
  )
}
