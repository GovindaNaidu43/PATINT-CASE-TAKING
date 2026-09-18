'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePatient } from '@/lib/usePatient'
import RoyalCard from '@/components/RoyalCard'
import SummaryReviewPanel from '@/components/SummaryReviewPanel'
import PhysicianConfirmGate from '@/components/PhysicianConfirmGate'
import DocumentTimeline from '@/components/DocumentTimeline'
import OCRConfirmPanel from '@/components/OCRConfirmPanel'
import JihvaPreview from '@/components/JihvaPreview'
import PrakritiRadar from '@/components/PrakritiRadar'
import RedFlagPanel from '@/components/RedFlagPanel'
import SignalBadge from '@/components/SignalBadge'

export default function PatientPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: patient, isLoading } = usePatient(id as string)
  const [activeTab, setActiveTab] = useState('summary')

  if (isLoading || !patient) return <div className="p-8 text-center text-royal-gold font-display text-xl">Loading patient record...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-3xl text-royal-gold">{patient.name}</h1>
          <p className="text-royal-ivory mt-1">
            {patient.age}y {patient.sex} | ABHA: {patient.abha}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-royal-surface border border-royal-gold/30 px-4 py-2 rounded-full text-royal-ivory">
            Status: <span className={patient.physicianConfirmed ? 'text-success' : 'text-warning'}>
              {patient.physicianConfirmed ? 'Confirmed' : 'Awaiting Review'}
            </span>
          </div>
          <button 
            onClick={() => router.push(`/patient/${id}/review`)}
            className="bg-royal-gold text-royal-bg px-6 py-2 rounded font-bold hover:bg-opacity-90"
          >
            Enter Review Mode
          </button>
        </div>
      </div>

      {patient.redFlags.length > 0 && <RedFlagPanel flags={patient.redFlags} />}

      <div className="flex space-x-2 border-b border-royal-surface">
        {['Summary', 'Documents', 'Signals', 'History'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-6 py-3 font-display ${activeTab === tab.toLowerCase() ? 'text-royal-gold border-b-2 border-royal-gold' : 'text-royal-ivory/60 hover:text-royal-ivory'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SummaryReviewPanel summary={patient.summary} onUpdate={() => {}} onAcknowledge={() => {}} />
            </div>
            <div>
              <RoyalCard className="p-4 mb-6">
                <h3 className="font-display text-royal-gold mb-4">Vitals</h3>
                <div className="space-y-2 text-royal-ivory">
                  <p>BP: 120/80 mmHg</p>
                  <p>HR: 72 bpm</p>
                  <p>Temp: 98.6 °F</p>
                  <p>SpO2: 99%</p>
                </div>
              </RoyalCard>
              <JihvaPreview signal={patient.jihvaSignal} />
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DocumentTimeline documents={patient.documents} />
            {patient.documents.length > 0 && (
              <div className="sticky top-6">
                <OCRConfirmPanel doc={patient.documents[0]} onConfirm={() => {}} onReject={() => {}} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'signals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <SignalBadge />
              <PrakritiRadar data={patient.prakritiData} />
            </div>
            <div className="space-y-4">
              <JihvaPreview signal={patient.jihvaSignal} />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="text-center p-12 text-royal-ivory/60">
            No previous visit history available for this patient.
          </div>
        )}
      </div>
    </div>
  )
}
