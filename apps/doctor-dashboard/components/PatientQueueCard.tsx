import Link from 'next/link'
import RoyalCard from './RoyalCard'

export default function PatientQueueCard({ patient }: { patient: any }) {
  const isPriority = patient.status === 'priority'
  const isConfirmed = patient.status === 'confirmed'
  const isReview = patient.status === 'awaiting_review'

  return (
    <RoyalCard className={`p-5 flex flex-col justify-between ${isPriority ? 'border-royal-crimson/50 shadow-[0_0_15px_rgba(139,26,26,0.2)]' : ''}`}>
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-display text-xl text-royal-gold">{patient.name}</h3>
            <div className="text-xs text-royal-ivory/60 mt-1">ABHA: {patient.abha}</div>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-bold ${
            isPriority ? 'bg-royal-crimson/20 text-royal-crimson' :
            isConfirmed ? 'bg-success/20 text-success' :
            isReview ? 'bg-warning/20 text-warning' :
            'bg-royal-teal/20 text-royal-teal'
          }`}>
            {isPriority ? 'Priority' : 
             isConfirmed ? 'Confirmed' : 
             isReview ? 'Awaiting' : 'In Progress'}
          </div>
        </div>
        <div className="text-royal-ivory/90 text-sm mb-4 line-clamp-2">
          <span className="font-semibold">CC:</span> {patient.chiefComplaint}
        </div>
      </div>
      
      <div className="flex items-center justify-between border-t border-royal-surface pt-4 mt-2">
        <div className="flex items-center gap-2 text-sm text-royal-ivory/60">
          <span className={`w-2 h-2 rounded-full ${
            patient.priority === 'high' ? 'bg-royal-crimson' : 
            patient.priority === 'medium' ? 'bg-warning' : 'bg-success'
          }`}></span>
          {patient.timeRegistered}
        </div>
        <Link href={`/patient/${patient.id}`}>
          <button className="bg-royal-surface text-royal-gold border border-royal-gold/30 hover:bg-royal-gold hover:text-royal-bg px-4 py-1.5 rounded font-semibold text-sm transition-colors">
            Review
          </button>
        </Link>
      </div>
    </RoyalCard>
  )
}
