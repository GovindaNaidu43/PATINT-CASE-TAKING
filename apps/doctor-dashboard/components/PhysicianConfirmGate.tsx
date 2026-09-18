'use client'
import { useState } from 'react'
import RoyalCard from './RoyalCard'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function PhysicianConfirmGate({ onConfirm, isConfirmed }: any) {
  const [checks, setChecks] = useState({
    cc: false,
    history: false,
    signals: false,
    flags: false
  })
  
  const allChecked = Object.values(checks).every(Boolean)

  if (isConfirmed) {
    return (
      <RoyalCard className="p-6 border-success/50 bg-success/5">
        <div className="flex items-center gap-3 text-success mb-2">
          <CheckCircle2 size={24} />
          <h3 className="font-display text-xl font-bold">Record Confirmed & Signed</h3>
        </div>
        <p className="text-success/80 text-sm ml-9">
          This patient record has been clinically validated and digitally signed.
        </p>
      </RoyalCard>
    )
  }

  const handleConfirm = () => {
    if (confirm("This action is irreversible. Confirm patient record?")) {
      onConfirm()
    }
  }

  return (
    <RoyalCard className="p-6 border-royal-gold/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-warning"></div>
      
      <div className="flex items-center gap-2 text-warning mb-4">
        <AlertTriangle size={20} />
        <h3 className="font-display text-lg font-bold">Physician Write-Lock Gate</h3>
      </div>
      
      <div className="space-y-3 mb-6">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input type="checkbox" className="mt-1 w-4 h-4 accent-royal-gold bg-royal-surface border-royal-gold/30" checked={checks.cc} onChange={e => setChecks({...checks, cc: e.target.checked})} />
          <span className="text-sm text-royal-ivory group-hover:text-royal-gold transition-colors">I have reviewed and verified the Chief Complaint</span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input type="checkbox" className="mt-1 w-4 h-4 accent-royal-gold bg-royal-surface border-royal-gold/30" checked={checks.history} onChange={e => setChecks({...checks, history: e.target.checked})} />
          <span className="text-sm text-royal-ivory group-hover:text-royal-gold transition-colors">I have reviewed the Medical History and Medications</span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input type="checkbox" className="mt-1 w-4 h-4 accent-royal-gold bg-royal-surface border-royal-gold/30" checked={checks.signals} onChange={e => setChecks({...checks, signals: e.target.checked})} />
          <span className="text-sm text-royal-ivory group-hover:text-royal-gold transition-colors">I acknowledge Jihva/Prakriti as supporting signals, NOT clinical diagnoses</span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input type="checkbox" className="mt-1 w-4 h-4 accent-royal-gold bg-royal-surface border-royal-gold/30" checked={checks.flags} onChange={e => setChecks({...checks, flags: e.target.checked})} />
          <span className="text-sm text-royal-ivory group-hover:text-royal-gold transition-colors">I have reviewed all flagged concerns</span>
        </label>
      </div>

      <button
        onClick={handleConfirm}
        disabled={!allChecked}
        className={`w-full py-3 rounded font-bold font-display text-lg transition-all duration-300 ${
          allChecked 
            ? 'bg-royal-gold text-royal-bg shadow-[0_0_20px_rgba(201,168,76,0.4)] hover:bg-opacity-90 cursor-pointer' 
            : 'bg-royal-surface text-royal-ivory/30 cursor-not-allowed border border-royal-surface'
        }`}
      >
        Confirm & Sign Record
      </button>
    </RoyalCard>
  )
}
