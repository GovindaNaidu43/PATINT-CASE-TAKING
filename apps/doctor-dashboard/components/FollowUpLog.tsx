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
          <div className="bg-royal-crimson text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(139,26,26,0.5)]">
            <AlertTriangle size={14} /> Escalated
          </div>
        )}
      </div>

      <div className="space-y-4">
        {log.log.map((entry: any, i: number) => (
          <div key={i} className={`p-4 rounded border ${entry.escalated ? 'bg-royal-crimson/10 border-royal-crimson/30' : 'bg-royal-surface/50 border-royal-surface'}`}>
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-royal-ivory/80">
                {entry.method === 'IVR' ? <Phone size={14} className="text-royal-gold" /> : <MessageSquare size={14} className="text-royal-teal" />}
                <span className="font-bold">{entry.method} Check-in</span>
                <span className="text-royal-ivory/40 ml-2">{entry.date}</span>
              </div>
              <div className="text-lg" title={`Sentiment: ${entry.sentiment}`}>
                {entry.sentiment === 'positive' ? '😊' : entry.sentiment === 'neutral' ? '😐' : '😟'}
              </div>
            </div>
            <div className="text-sm text-royal-ivory">
              {entry.summary}
            </div>
            {entry.escalated && (
              <div className="mt-2 text-xs font-bold text-royal-crimson">
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
