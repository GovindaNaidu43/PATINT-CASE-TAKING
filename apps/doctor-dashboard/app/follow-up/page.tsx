import FollowUpLog from '@/components/FollowUpLog'
import { mockFollowUp } from '@/lib/mockFollowUp'
import RedFlagPanel from '@/components/RedFlagPanel'

export default function FollowUpPage() {
  const escalated = mockFollowUp.filter(f => f.log.some(l => l.escalated))
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-royal-gold">Post-Visit Follow-Up</h1>
        <p className="text-royal-ivory/70 mt-1">Monitor patient progress and IVR check-ins</p>
      </div>

      <div className="flex space-x-2 border-b border-royal-surface pb-2">
        {['All', 'Escalated', 'Pending', 'Completed'].map((tab, i) => (
          <button key={tab} className={`px-4 py-2 rounded-t-lg ${i === 0 ? 'bg-royal-surface text-royal-gold border-b-2 border-royal-gold' : 'text-royal-ivory/60 hover:text-royal-ivory'}`}>
            {tab}
          </button>
        ))}
      </div>

      {escalated.length > 0 && (
        <div className="mb-6">
          <RedFlagPanel flags={escalated.map(e => ({ id: e.id, text: `Follow-up escalation required for ${e.name}`, source: 'IVR System', timestamp: new Date().toISOString() }))} />
        </div>
      )}

      <div className="space-y-6">
        {mockFollowUp.map(record => (
          <FollowUpLog key={record.id} log={record} />
        ))}
      </div>
    </div>
  )
}
