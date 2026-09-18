'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePatient } from '@/lib/usePatient'
import { useConfirm } from '@/lib/useConfirm'
import SummaryReviewPanel from '@/components/SummaryReviewPanel'
import PhysicianConfirmGate from '@/components/PhysicianConfirmGate'
import JihvaPreview from '@/components/JihvaPreview'
import RoyalCard from '@/components/RoyalCard'

export default function ReviewPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: patient, isLoading } = usePatient(id as string)
  const { confirm, isConfirmed, isLoading: isConfirming } = useConfirm(id as string)

  if (isLoading || !patient) return <div className="p-8 text-center text-royal-gold font-display text-xl">Loading...</div>

  return (
    <div className="min-h-screen bg-royal-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-royal-surface pb-4">
          <div>
            <button onClick={() => router.back()} className="text-royal-ivory/60 hover:text-royal-gold mb-2 text-sm">
              ← Back to Dashboard
            </button>
            <h1 className="font-display text-3xl text-royal-gold">Clinical Review: {patient.name}</h1>
          </div>
          <div className="text-right">
            <div className="text-royal-ivory text-lg">{patient.age}y {patient.sex}</div>
            <div className="text-royal-ivory/60 text-sm">ABHA: {patient.abha}</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 lg:w-[65%]">
            <SummaryReviewPanel summary={patient.summary} onUpdate={() => {}} onAcknowledge={() => {}} />
          </div>
          
          <div className="lg:w-[35%] space-y-6">
            <RoyalCard className="p-4">
              <h3 className="font-display text-xl text-royal-gold mb-4 border-b border-royal-surface pb-2">Vitals & Assessment</h3>
              <div className="grid grid-cols-2 gap-4 text-royal-ivory">
                <div className="bg-royal-surface p-3 rounded">
                  <div className="text-royal-ivory/60 text-xs">BP</div>
                  <div className="font-bold">120/80</div>
                </div>
                <div className="bg-royal-surface p-3 rounded">
                  <div className="text-royal-ivory/60 text-xs">Pulse</div>
                  <div className="font-bold">72 bpm</div>
                </div>
                <div className="bg-royal-surface p-3 rounded">
                  <div className="text-royal-ivory/60 text-xs">Temp</div>
                  <div className="font-bold">98.6 °F</div>
                </div>
                <div className="bg-royal-surface p-3 rounded">
                  <div className="text-royal-ivory/60 text-xs">SpO2</div>
                  <div className="font-bold">99%</div>
                </div>
              </div>
            </RoyalCard>

            <JihvaPreview signal={patient.jihvaSignal} />

            <PhysicianConfirmGate onConfirm={confirm} isConfirmed={isConfirmed || patient.physicianConfirmed} />
          </div>
        </div>
      </div>
    </div>
  )
}
