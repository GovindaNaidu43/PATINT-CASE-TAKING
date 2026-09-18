'use client'
import React from 'react'
import RoyalCard from './RoyalCard'
import SignalBadge from './SignalBadge'
import { Check } from 'lucide-react'

export default function SummaryReviewPanel({ summary, onUpdate, onAcknowledge }: any) {
  if (!summary) return null;
  return (
    <div className="space-y-4">
      <SectionCard 
        title="Chief Complaint" 
        content={summary.chiefComplaint} 
        sourceId={summary.sources?.chiefComplaint}
        editable
      />
      <SectionCard 
        title="History of Present Illness" 
        content={summary.hpi} 
        sourceId={summary.sources?.hpi}
        editable
      />
      <SectionCard 
        title="Medical Background" 
        content={summary.medicalHistory} 
        sourceId={summary.sources?.medicalHistory}
        editable
      />
      <RoyalCard className="p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-display text-lg text-royal-gold">Jihva Analysis Summary</h3>
          <div className="text-xs bg-royal-surface px-2 py-1 rounded text-royal-ivory/60">
            Source: {summary.sources?.jihva || 'kiosk-vision'}
          </div>
        </div>
        <SignalBadge />
        <div className="mt-4 p-3 bg-royal-surface rounded text-royal-ivory text-sm">
          {summary.jihvaSummary || 'No summary provided.'}
        </div>
      </RoyalCard>
    </div>
  )
}

function SectionCard({ title, content, sourceId, editable }: any) {
  const [acknowledged, setAcknowledged] = React.useState(false)
  return (
    <RoyalCard className={`p-5 transition-colors ${acknowledged ? 'border-success/30' : ''}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-display text-lg text-royal-gold">{title}</h3>
        <div className="flex items-center gap-3">
          <div className="text-xs bg-royal-surface px-2 py-1 rounded text-royal-ivory/60 cursor-help" title={`Grounded to: ${sourceId}`}>
            Source: {sourceId || 'conv-turns'}
          </div>
          <button 
            onClick={() => setAcknowledged(!acknowledged)}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors ${
              acknowledged 
                ? 'bg-success/20 text-success border-success/30' 
                : 'bg-royal-surface text-royal-ivory/60 border-royal-surface hover:text-royal-ivory'
            }`}
          >
            <Check size={14} /> Acknowledged
          </button>
        </div>
      </div>
      {editable ? (
        <textarea 
          className="w-full bg-royal-surface/50 border border-royal-surface rounded p-3 text-royal-ivory text-sm min-h-[80px] focus:outline-none focus:border-royal-gold focus:ring-1 focus:ring-royal-gold"
          defaultValue={content}
        />
      ) : (
        <div className="text-sm text-royal-ivory">{content}</div>
      )}
    </RoyalCard>
  )
}
