import PatientQueueCard from '@/components/PatientQueueCard'
import { mockQueue } from '@/lib/mockQueue'
import RoyalCard from '@/components/RoyalCard'

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-3xl text-royal-gold">Today's OPD Queue</h1>
          <p className="text-royal-ivory/70 mt-1">{today}</p>
        </div>
        <div className="bg-royal-surface border border-royal-gold/30 px-4 py-2 rounded-full text-royal-gold font-bold">
          {mockQueue.length} Patients
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <RoyalCard className="p-4 text-center">
          <div className="text-3xl font-display text-royal-ivory">{mockQueue.length}</div>
          <div className="text-sm text-royal-ivory/70 mt-1">Total Patients</div>
        </RoyalCard>
        <RoyalCard className="p-4 text-center border-warning/50">
          <div className="text-3xl font-display text-warning">{mockQueue.filter(p => p.status === 'awaiting_review').length}</div>
          <div className="text-sm text-royal-ivory/70 mt-1">Awaiting Review</div>
        </RoyalCard>
        <RoyalCard className="p-4 text-center border-success/50">
          <div className="text-3xl font-display text-success">{mockQueue.filter(p => p.status === 'confirmed').length}</div>
          <div className="text-sm text-royal-ivory/70 mt-1">Confirmed</div>
        </RoyalCard>
        <RoyalCard className="p-4 text-center border-royal-crimson/50">
          <div className="text-3xl font-display text-royal-crimson">{mockQueue.reduce((acc, p) => acc + p.redFlags, 0)}</div>
          <div className="text-sm text-royal-ivory/70 mt-1">Red Flags</div>
        </RoyalCard>
      </div>

      <div className="flex space-x-2 border-b border-royal-surface pb-2">
        {['All', 'Awaiting Review', 'Priority', 'Confirmed'].map((tab, i) => (
          <button key={tab} className={`px-4 py-2 rounded-t-lg ${i === 0 ? 'bg-royal-surface text-royal-gold border-b-2 border-royal-gold' : 'text-royal-ivory/60 hover:text-royal-ivory'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockQueue.map(patient => (
          <PatientQueueCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  )
}
