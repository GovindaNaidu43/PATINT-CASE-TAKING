import RoyalCard from './RoyalCard'
import { AlertCircle, Check, X } from 'lucide-react'

export default function OCRConfirmPanel({ doc, onConfirm, onReject }: any) {
  if (!doc) return null;
  return (
    <RoyalCard className="p-6">
      {/* Warning banner */}
      <div className="px-4 py-3 rounded-md flex gap-3 items-start mb-6"
           style={{ background: 'rgba(201,151,75,0.10)', border: '1px solid rgba(184,134,60,0.35)', color: '#7A5520' }}>
        <AlertCircle className="shrink-0 mt-0.5" size={18} />
        <div className="text-sm font-semibold">
          OCR output has not been clinically validated — review before accepting
        </div>
      </div>

      {doc.patientConfirmed && (
        <div className="inline-block text-xs px-3 py-1 rounded-full font-bold mb-4"
             style={{ background: 'rgba(140,163,131,0.15)', color: '#5A7A55' }}>
          ✓ Patient-confirmed at kiosk
        </div>
      )}

      <div className="mb-4">
        <h4 className="text-royal-gold font-display mb-2">{doc.filename} (Extracted Text)</h4>
        <textarea
          className="w-full h-48 p-4 text-sm font-mono rounded outline-none"
          style={{
            background: 'rgba(255,253,248,0.95)',
            border: '1.5px solid #E8D9BC',
            color: '#3E2E1E',
          }}
          defaultValue={doc.ocrText}
          onFocus={e => (e.target.style.borderColor = '#B8863C')}
          onBlur={e  => (e.target.style.borderColor = '#E8D9BC')}
        />
      </div>

      <div className="flex gap-4">
        <button onClick={onReject}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded transition-colors"
                style={{ border: '1px solid rgba(167,104,93,0.50)', color: '#A7685D' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(167,104,93,0.08)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
          <X size={18} /> Reject
        </button>
        <button onClick={onConfirm}
                className="flex-1 flex items-center justify-center gap-2 py-2 font-bold rounded transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#C9974B,#B8863C)', color: '#fff' }}>
          <Check size={18} /> Accept into Record
        </button>
      </div>
    </RoyalCard>
  )
}
