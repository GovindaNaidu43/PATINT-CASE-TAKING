'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePatient } from '@/lib/usePatient'
import { createPrescription, createSummary, scheduleFollowUp } from '@/lib/apiClient'
import RoyalCard from '@/components/RoyalCard'
import SummaryReviewPanel from '@/components/SummaryReviewPanel'
import RedFlagPanel from '@/components/RedFlagPanel'
import SignalBadge from '@/components/SignalBadge'

export default function PatientPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: consultation, isLoading, mutate } = usePatient(id as string)
  const [activeTab, setActiveTab] = useState('summary')
  const [prescribing, setPrescribing] = useState(false)
  const [prescriptionForm, setPrescriptionForm] = useState({ remedy: '', potency: '', dosage: '', schedule: '', duration: '', instructions: '' })
  const [confirmingId, setConfirmingId] = useState('')
  const [scheduling, setScheduling] = useState(false)

  if (isLoading || !consultation) return <div className="p-8 text-center text-royal-gold font-display text-xl">Loading consultation record…</div>

  const inputStyle = { background: 'rgba(255,253,248,0.90)', border: '1.5px solid #E8D9BC', color: '#3E2E1E' }

  const handlePrescription = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consultation) return
    setPrescribing(true)
    try {
      await createPrescription(consultation.id, { ...prescriptionForm, consultation_id: consultation.id })
      await mutate()
      setPrescriptionForm({ remedy: '', potency: '', dosage: '', schedule: '', duration: '', instructions: '' })
    } finally {
      setPrescribing(false)
    }
  }

  const handleGenSummary = async () => {
    if (!consultation) return
    const facts = consultation.turns.filter(t => t.answer_key).map(t => `${t.answer_key}: ${t.text}`)
    const sources = ['dialogue']
    try {
      const draft = await createSummary(consultation.id, facts, sources)
      setConfirmingId(draft.id)
    } catch { /* surface error via toast if needed */ }
  }

  const handleScheduleFollowUp = async () => {
    if (!consultation) return
    setScheduling(true)
    try {
      await scheduleFollowUp(consultation.id, consultation.patient.contact ?? 'clinic', 24)
      await mutate()
    } finally {
      setScheduling(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-3xl text-royal-gold">{consultation.patient.name}</h1>
          <p className="text-royal-ivory mt-1">
            {consultation.patient.age && `${consultation.patient.age}y`}
            {consultation.patient.gender && ` · ${consultation.patient.gender}`}
            {consultation.patient.abha_id && ` | ABHA: ${consultation.patient.abha_id}`}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-end">
          <div className="px-4 py-2 rounded-full text-sm font-medium"
            style={{ background: 'rgba(255,253,248,0.90)', border: '1px solid #E8D9BC', color: '#3E2E1E' }}>
            Status: <span style={{
              color: consultation.status === 'priority_review' ? '#A7685D' :
                consultation.status === 'awaiting_review' ? '#9A712F' : '#64775B'
            }}>
              {consultation.status.replace(/_/g, ' ')}
            </span>
          </div>
          <button onClick={handleGenSummary}
            className="gold-button px-4 py-2 text-sm">
            Generate Summary
          </button>
          <button onClick={() => void handleScheduleFollowUp()} disabled={scheduling}
            className="outline-button px-4 py-2 text-sm disabled:opacity-50">
            {scheduling ? 'Scheduling…' : 'Schedule Follow-Up'}
          </button>
          <button onClick={() => router.push(`/patient/${id}/review`)}
            className="gold-button px-4 py-2 text-sm">
            Enter Review Mode
          </button>
        </div>
      </div>

      {/* Red Flags */}
      {consultation.red_flags.length > 0 && (
        <RedFlagPanel flags={consultation.red_flags.map((f, i) => ({
          id: String(i), text: `${f.phrase} — ${f.action}`, source: 'Dialogue AI', timestamp: consultation.updated_at
        }))} />
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[#E8D9BC]">
        {['Summary', 'History', 'Prescriptions', 'Signals'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-6 py-3 font-display ${activeTab === tab.toLowerCase() ? 'text-royal-gold border-b-2 border-royal-gold' : 'text-royal-ivory/60 hover:text-royal-ivory'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {/* Summary tab */}
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RoyalCard className="p-6">
                <h3 className="font-display text-royal-gold mb-4">Consultation Summary</h3>
                {consultation.turns.length > 0 ? (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {consultation.turns.filter(t => t.answer_key).map((turn, i) => (
                      <div key={i} className="text-sm">
                        <span className="text-royal-muted text-xs font-semibold mr-2">{turn.answer_key}:</span>
                        <span className="text-royal-ivory">{turn.text}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-royal-ivory/60">No dialogue turns recorded.</p>
                )}
                {confirmingId && (
                  <div className="mt-4 px-4 py-3 rounded-lg text-sm"
                    style={{ background: 'rgba(140,163,131,0.15)', border: '1px solid #8CA383', color: '#5A7A55' }}>
                    ✓ Summary draft ready (ID: {confirmingId}) — confirm in Review Mode.
                  </div>
                )}
              </RoyalCard>
            </div>
            <div>
              <RoyalCard className="p-4 mb-6">
                <h3 className="font-display text-royal-gold mb-4">Patient Details</h3>
                <div className="space-y-2 text-royal-ivory text-sm">
                  {consultation.patient.contact && <p>📞 {consultation.patient.contact}</p>}
                  {consultation.patient.blood_group && <p>🩸 {consultation.patient.blood_group}</p>}
                  {consultation.patient.occupation && <p>💼 {consultation.patient.occupation}</p>}
                  {consultation.consent && (
                    <p className="text-xs text-royal-muted mt-2">
                      Consent: {consultation.consent.purposes.join(', ')}
                    </p>
                  )}
                </div>
              </RoyalCard>
              <SignalBadge />
            </div>
          </div>
        )}

        {/* History tab */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {consultation.turns.length === 0 ? (
              <div className="text-center p-12 text-royal-ivory/60">No dialogue turns recorded.</div>
            ) : consultation.turns.map((turn, i) => (
              <RoyalCard key={i} className="p-4 flex gap-4">
                <span className="text-xs font-semibold px-2 py-1 rounded"
                  style={{ background: 'rgba(184,134,60,0.10)', color: '#B8863C', whiteSpace: 'nowrap' }}>
                  {turn.answer_key ?? `Turn ${i + 1}`}
                </span>
                <div className="flex-1">
                  <p className="text-royal-ivory text-sm">{turn.text}</p>
                  <p className="text-royal-muted text-xs mt-1">{turn.modality} · {turn.language}</p>
                </div>
              </RoyalCard>
            ))}
          </div>
        )}

        {/* Prescriptions tab */}
        {activeTab === 'prescriptions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Existing prescriptions */}
            <div className="space-y-4">
              <h3 className="font-display text-royal-gold text-xl">Existing Prescriptions</h3>
              {consultation.prescriptions.length === 0 ? (
                <p className="text-royal-ivory/60 text-sm">No prescriptions yet.</p>
              ) : consultation.prescriptions.map(rx => (
                <RoyalCard key={rx.id} className="p-4 space-y-1">
                  <div className="flex justify-between">
                    <p className="font-bold text-royal-ivory">{rx.remedy} <span className="text-royal-muted text-xs">({rx.potency})</span></p>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${rx.status === 'signed' ? 'bg-[#DCE4D5] text-[#64775B]' : 'bg-[#F3E2C4] text-[#9A712F]'}`}>{rx.status}</span>
                  </div>
                  <p className="text-royal-muted text-xs">{rx.dosage} · {rx.schedule} · {rx.duration}</p>
                  {rx.instructions && <p className="text-royal-ivory text-xs">{rx.instructions}</p>}
                </RoyalCard>
              ))}
            </div>

            {/* New prescription form */}
            <RoyalCard className="p-6">
              <h3 className="font-display text-royal-gold text-lg mb-4">Add Prescription</h3>
              <form onSubmit={handlePrescription} className="space-y-3">
                {[
                  { label: 'Remedy', key: 'remedy', placeholder: 'e.g. Arnica Montana' },
                  { label: 'Potency', key: 'potency', placeholder: 'e.g. 30C' },
                  { label: 'Dosage', key: 'dosage', placeholder: 'e.g. 2 pills' },
                  { label: 'Schedule', key: 'schedule', placeholder: 'e.g. Twice daily' },
                  { label: 'Duration', key: 'duration', placeholder: 'e.g. 7 days' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="soft-label mb-1 block">{label}</label>
                    <input
                      value={prescriptionForm[key as keyof typeof prescriptionForm]}
                      onChange={e => setPrescriptionForm(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                      style={inputStyle}
                    />
                  </div>
                ))}
                <div>
                  <label className="soft-label mb-1 block">Instructions (optional)</label>
                  <textarea value={prescriptionForm.instructions}
                    onChange={e => setPrescriptionForm(prev => ({ ...prev, instructions: e.target.value }))}
                    placeholder="Any special instructions…" rows={2}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                    style={inputStyle} />
                </div>
                <button type="submit" disabled={prescribing || !prescriptionForm.remedy}
                  className="gold-button w-full py-2 text-sm disabled:opacity-50">
                  {prescribing ? 'Adding…' : 'Add Prescription'}
                </button>
              </form>
            </RoyalCard>
          </div>
        )}

        {/* Signals tab */}
        {activeTab === 'signals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RoyalCard className="p-6">
              <h3 className="font-display text-royal-gold mb-4">Dialogue Signals</h3>
              {consultation.turns.some(t => (t.rubrics ?? []).length > 0) ? (
                <div className="space-y-2">
                  {consultation.turns.flatMap(t => t.rubrics ?? []).map((rubric, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-royal-ivory">{rubric.rubric}</span>
                      <span className="text-royal-gold font-bold">{rubric.score}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-royal-ivory/60 text-sm">No rubric signals detected.</p>
              )}
            </RoyalCard>
            <div className="space-y-4">
              <SignalBadge />
              <RoyalCard className="p-6">
                <h3 className="font-display text-royal-gold mb-4">Tongue Signal (Jihva)</h3>
                <p className="text-royal-ivory text-sm">Capture and analysis available in the Kiosk.</p>
              </RoyalCard>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
