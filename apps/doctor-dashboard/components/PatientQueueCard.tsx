import Link from 'next/link'
import RoyalCard from './RoyalCard'

export default function PatientQueueCard({ patient }: { patient: any }) {
  const isPriority = patient.status === 'priority'
  const isConfirmed = patient.status === 'confirmed'
  const isReview    = patient.status === 'awaiting_review'

  return (
    <RoyalCard
      className="p-5 flex flex-col justify-between"
      glowing={isPriority}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-display text-xl text-royal-gold">{patient.name}</h3>
            <div className="text-xs mt-1" style={{ color: '#8A745A' }}>ABHA: {patient.abha}</div>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-bold ${
            isPriority ? 'bg-royal-crimson/15 text-royal-crimson' :
            isConfirmed ? 'bg-success/20 text-success' :
            isReview    ? 'bg-warning/20 text-warning' :
            'bg-royal-teal/20 text-royal-teal'
          }`}>
            {isPriority ? 'Priority' : isConfirmed ? 'Confirmed' : isReview ? 'Awaiting' : 'In Progress'}
          </div>
        </div>
        <div className="text-sm mb-4 line-clamp-2" style={{ color: '#5A4030' }}>
          <span className="font-semibold">CC:</span> {patient.chiefComplaint}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 mt-2"
           style={{ borderTop: '1px solid #E8D9BC' }}>
        <div className="flex items-center gap-2 text-sm" style={{ color: '#8A745A' }}>
          <span className={`w-2 h-2 rounded-full ${
            patient.priority === 'high' ? 'bg-royal-crimson' :
            patient.priority === 'medium' ? 'bg-warning' : 'bg-success'
          }`} />
          {patient.timeRegistered}
        </div>
        <Link href={`/patient/${patient.id}`}>
          <button
            className="px-4 py-1.5 rounded font-semibold text-sm transition-all"
            style={{ background: 'rgba(232,217,188,0.50)', color: '#B8863C', border: '1px solid rgba(184,134,60,0.30)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg,#C9974B,#B8863C)';
              (e.currentTarget as HTMLElement).style.color = '#fff';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(232,217,188,0.50)';
              (e.currentTarget as HTMLElement).style.color = '#B8863C';
            }}
          >
            Review
          </button>
        </Link>
      </div>
    </RoyalCard>
  )
}
