import RoyalCard from './RoyalCard'
import { FileText, FileImage } from 'lucide-react'

export default function DocumentTimeline({ documents }: { documents: any[] }) {
  if (!documents || documents.length === 0) {
    return <div className="text-royal-ivory/60 p-8 text-center bg-royal-surface rounded-lg">No documents available</div>
  }

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-12 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-royal-gold/30 before:to-transparent">
      {documents.map((doc, idx) => (
        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-royal-bg bg-royal-surface text-royal-gold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            {doc.type === 'Radiology' ? <FileImage size={18} /> : <FileText size={18} />}
          </div>
          
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg bg-royal-surface border border-royal-surface hover:border-royal-gold/50 transition-colors shadow-lg cursor-pointer">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-royal-gold">{doc.filename}</span>
              <span className="text-xs bg-royal-bg px-2 py-1 rounded text-royal-ivory/80">{doc.date}</span>
            </div>
            <div className="text-sm text-royal-ivory/60 mb-3">{doc.type}</div>
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
