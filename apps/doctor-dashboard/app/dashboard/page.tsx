 'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import LiveQueue from '@/components/LiveQueue'

const BiometricCaptureModal = dynamic(() => import('@/components/BiometricCaptureModal'), { ssr: false })

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const [biometricMode, setBiometricMode] = useState<'enroll' | 'verify' | null>(null)
  const [biometricMessage, setBiometricMessage] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
        <div>
          <h1 className="font-display text-3xl text-royal-gold">Live OPD Queue</h1>
          <p className="text-royal-ivory/70 mt-1">{today} · refreshes every 5 seconds</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setBiometricMessage(''); setBiometricMode('verify') }} className="rounded border border-royal-teal/50 px-3 py-2 text-xs font-semibold text-royal-teal hover:bg-royal-teal/10">Verify face</button>
          <button onClick={() => { setBiometricMessage(''); setBiometricMode('enroll') }} className="rounded border border-royal-gold/40 px-3 py-2 text-xs font-semibold text-royal-gold hover:bg-royal-gold/10">Enroll face</button>
        </div>
      </div>
      {biometricMessage && <p className="rounded border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">{biometricMessage}</p>}
      <LiveQueue />
      {biometricMode && <BiometricCaptureModal mode={biometricMode} onClose={() => setBiometricMode(null)} onComplete={(message) => { setBiometricMessage(message); setBiometricMode(null) }} />}
    </div>
  )
}
