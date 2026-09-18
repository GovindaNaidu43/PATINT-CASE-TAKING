import RoyalCard from './RoyalCard'
import { AlertCircle, Check, X } from 'lucide-react'

export default function OCRConfirmPanel({ doc, onConfirm, onReject }: any) {
  if (!doc) return null;
  return (
    <RoyalCard className="p-6 border-warning/30 bg-royal-surface/50">
      <div className="bg-warning/10 border border-warning/50 text-warning px-4 py-3 rounded-md flex gap-3 items-start mb-6">
        <AlertCircle className="shrink-0 mt-0.5" size={18} />
        <div className="text-sm font-semibold">
          OCR output has not been clinically validated — review before accepting
        </div>
      </div>
      
      {doc.patientConfirmed && (
        <div className="inline-block bg-success/20 text-success text-xs px-3 py-1 rounded-full font-bold mb-4">
          ✓ Patient-confirmed at kiosk
        </div>
      )}

      <div className="mb-4">
        <h4 className="text-royal-gold font-display mb-2">{doc.filename} (Extracted Text)</h4>
        <textarea 
          className="w-full h-48 bg-royal-bg border border-royal-surface p-4 text-sm text-royal-ivory font-mono rounded focus:outline-none focus:border-royal-gold"
          defaultValue={doc.ocrText}
        />
      </div>

      <div className="flex gap-4">
        <button onClick={onReject} className="flex-1 flex items-center justify-center gap-2 py-2 border border-royal-crimson/50 text-royal-crimson rounded hover:bg-royal-crimson/10 transition-colors">
          <X size={18} /> Reject
        </button>
        <button onClick={onConfirm} className="flex-1 flex items-center justify-center gap-2 py-2 bg-royal-gold text-royal-bg font-bold rounded hover:bg-opacity-90 transition-colors">
          <Check size={18} /> Accept into Record
        </button>
      </div>
    </RoyalCard>
  )
}
