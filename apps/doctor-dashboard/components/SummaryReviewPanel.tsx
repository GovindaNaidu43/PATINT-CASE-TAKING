'use client'
import React from 'react'
import RoyalCard from './RoyalCard'
import SignalBadge from './SignalBadge'
import { Check } from 'lucide-react'

export default function SummaryReviewPanel({ summary, onUpdate, onAcknowledge }: any) {
  if (!summary) return null;
  return (
    <div className="space-y-4">
      <SectionCard title="Chief Complaint"        content={summary.chiefComplaint}  sourceId={summary.sources?.chiefComplaint} editable />
      <SectionCard title="History of Present Illness" content={summary.hpi}         sourceId={summary.sources?.hpi}           editable />
      <SectionCard title="Medical Background"     content={summary.medicalHistory}  sourceId={summary.sources?.medicalHistory} editable />

      <RoyalCard className="p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-display text-lg text-royal-gold">Jihva Analysis Summary</h3>
          <div className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(232,217,188,0.50)', color: '#8A745A' }}>
            Source: {summary.sources?.jihva || 'kiosk-vision'}
          </div>
        </div>
        <SignalBadge />
        <div className="mt-4 p-3 rounded text-sm" style={{ background: 'rgba(232,217,188,0.35)', color: '#3E2E1E' }}>
          {summary.jihvaSummary || 'No summary provided.'}
        </div>
      </RoyalCard>
    </div>
  )
}

function SectionCard({ title, content, sourceId, editable }: any) {
  const [acknowledged, setAcknowledged] = React.useState(false)
  return (
    <RoyalCard className={`p-5 transition-colors ${acknowledged ? '' : ''}`}
               glowing={acknowledged}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-display text-lg text-royal-gold">{title}</h3>
        <div className="flex items-center gap-3">
          <div className="text-xs px-2 py-1 rounded cursor-help" title={`Grounded to: ${sourceId}`}
               style={{ background: 'rgba(232,217,188,0.50)', color: '#8A745A' }}>
            Source: {sourceId || 'conv-turns'}
          </div>
          <button
            onClick={() => setAcknowledged(!acknowledged)}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors"
            style={{
              background: acknowledged ? 'rgba(140,163,131,0.15)' : 'rgba(232,217,188,0.40)',
              color:      acknowledged ? '#5A7A55' : '#8A745A',
              borderColor: acknowledged ? '#8CA383' : '#E8D9BC',
            }}
          >
            <Check size={14} /> Acknowledged
          </button>
        </div>
      </div>
      {editable ? (
        <textarea
          className="w-full rounded p-3 text-sm min-h-[80px] outline-none transition-colors"
          style={{
            background: 'rgba(255,253,248,0.90)',
            border: '1.5px solid #E8D9BC',
            color: '#3E2E1E',
          }}
          defaultValue={content}
          onFocus={e => (e.target.style.borderColor = '#B8863C')}
          onBlur={e  => (e.target.style.borderColor = '#E8D9BC')}
        />
      ) : (
        <div className="text-sm" style={{ color: '#3E2E1E' }}>{content}</div>
      )}
    </RoyalCard>
  )
}
