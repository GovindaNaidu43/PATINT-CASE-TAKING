'use client'
import { useState } from 'react'
import RoyalCard from './RoyalCard'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function PhysicianConfirmGate({ onConfirm, isConfirmed }: any) {
  const [checks, setChecks] = useState({ cc: false, history: false, signals: false, flags: false })
  const allChecked = Object.values(checks).every(Boolean)

  if (isConfirmed) {
    return (
      <RoyalCard className="p-6" glowing>
        <div className="flex items-center gap-3 mb-2" style={{ color: '#5A7A55' }}>
          <CheckCircle2 size={24} />
          <h3 className="font-display text-xl font-bold">Record Confirmed &amp; Signed</h3>
        </div>
        <p className="text-sm ml-9" style={{ color: '#7A9A75' }}>
          This patient record has been clinically validated and digitally signed.
        </p>
      </RoyalCard>
    )
  }

  const handleConfirm = () => {
    if (confirm('This action is irreversible. Confirm patient record?')) {
      onConfirm()
    }
  }

  const checkboxClass = 'mt-1 w-4 h-4 accent-royal-gold'
  const labelTextStyle = { color: '#5A4030' }

  return (
    <RoyalCard className="p-6 relative overflow-hidden">
      {/* Gold accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full" style={{ background: '#C9974B' }} />

      <div className="flex items-center gap-2 mb-4" style={{ color: '#8A5C1A' }}>
        <AlertTriangle size={20} />
        <h3 className="font-display text-lg font-bold">Physician Write-Lock Gate</h3>
      </div>

      <div className="space-y-3 mb-6">
        {[
          { key: 'cc',      label: 'I have reviewed and verified the Chief Complaint' },
          { key: 'history', label: 'I have reviewed the Medical History and Medications' },
          { key: 'signals', label: 'I acknowledge Jihva/Prakriti as supporting signals, NOT clinical diagnoses' },
          { key: 'flags',   label: 'I have reviewed all flagged concerns' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className={checkboxClass}
              checked={(checks as any)[key]}
              onChange={e => setChecks({ ...checks, [key]: e.target.checked })}
            />
            <span className="text-sm group-hover:text-royal-gold transition-colors" style={labelTextStyle}>
              {label}
            </span>
          </label>
        ))}
      </div>

      <button
        onClick={handleConfirm}
        disabled={!allChecked}
        className="w-full py-3 rounded font-bold font-display text-lg transition-all duration-300"
        style={
          allChecked
            ? { background: 'linear-gradient(135deg,#C9974B,#B8863C)', color: '#fff', boxShadow: '0 8px 20px rgba(184,134,60,0.25)' }
            : { background: 'rgba(232,217,188,0.40)', color: 'rgba(62,46,30,0.35)', border: '1px solid #E8D9BC', cursor: 'not-allowed' }
        }
      >
        Confirm &amp; Sign Record
      </button>
    </RoyalCard>
  )
}
