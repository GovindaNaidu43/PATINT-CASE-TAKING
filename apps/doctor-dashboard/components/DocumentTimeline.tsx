import RoyalCard from './RoyalCard'
import { FileText, FileImage } from 'lucide-react'

export default function DocumentTimeline({ documents }: { documents: any[] }) {
  if (!documents || documents.length === 0) {
    return (
      <div className="p-8 text-center rounded-lg text-sm"
           style={{ color: '#8A745A', background: 'rgba(232,217,188,0.35)' }}>
        No documents available
      </div>
    );
  }

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-12 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-royal-gold/30 before:to-transparent">
      {documents.map((doc, idx) => (
        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Timeline node */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-royal-gold"
               style={{ background: 'rgba(255,253,248,0.95)', borderColor: '#E8D9BC', boxShadow: '0 4px 12px rgba(184,134,60,0.12)' }}>
            {doc.type === 'Radiology' ? <FileImage size={18} /> : <FileText size={18} />}
          </div>

          {/* Card */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg cursor-pointer transition-all"
               style={{ background: 'rgba(255,253,248,0.88)', border: '1px solid #E8D9BC', boxShadow: '0 6px 18px rgba(184,134,60,0.08)' }}
               onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = '#B8863C')}
               onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = '#E8D9BC')}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-royal-gold">{doc.filename}</span>
              <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(232,217,188,0.50)', color: '#8A745A' }}>
                {doc.date}
              </span>
            </div>
            <div className="text-sm mb-3" style={{ color: '#8A745A' }}>{doc.type}</div>
            <div className="flex justify-between items-end">
              <span className={`text-xs px-2 py-1 rounded font-bold ${
                doc.confidence > 80 ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
              }`}>
                OCR Confidence: {doc.confidence}%
              </span>
              <button className="text-xs text-royal-gold hover:underline">View Details →</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
