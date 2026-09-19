'use client'
import { useState, useEffect } from 'react'
import { useQueue } from '@/lib/useQueue'
import { getFollowUps, scheduleFollowUp, type FollowUpItem } from '@/lib/apiClient'
import RedFlagPanel from '@/components/RedFlagPanel'

export default function FollowUpPage() {
  const { data: queue } = useQueue()
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([])
  const [loading, setLoading] = useState(true)
  const [scheduleConsultId, setScheduleConsultId] = useState('')
  const [scheduleDestination, setScheduleDestination] = useState('')
  const [scheduleHours, setScheduleHours] = useState('24')
  const [scheduling, setScheduling] = useState(false)

  useEffect(() => {
    if (!queue || queue.length === 0) { setLoading(false); return }
    // Fetch follow-ups for all queued consultations in parallel
    Promise.all(
      queue.map(item => getFollowUps(item.consultation_id).catch(() => [] as FollowUpItem[]))
    )
      .then(results => setFollowUps(results.flat()))
      .finally(() => setLoading(false))
  }, [queue])

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!scheduleConsultId || !scheduleDestination) return
    setScheduling(true)
    try {
      const item = await scheduleFollowUp(scheduleConsultId, scheduleDestination, Number(scheduleHours) || 24)
      setFollowUps(prev => [...prev, item])
      setScheduleConsultId('')
      setScheduleDestination('')
    } finally {
      setScheduling(false)
    }
  }

  const escalated = followUps.filter(f => f.status === 'escalated')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-royal-gold">Post-Visit Follow-Up</h1>
        <p className="text-royal-ivory/70 mt-1">Monitor patient progress and post-consultation check-ins</p>
      </div>

      {escalated.length > 0 && (
        <div className="mb-6">
          <RedFlagPanel flags={escalated.map(e => ({ id: e.id, text: `Follow-up overdue: ${e.destination}`, source: 'Follow-up Service', timestamp: e.due_at }))} />
        </div>
      )}

      {/* Schedule new follow-up */}
      <section className="gold-card p-5 md:p-6">
        <h2 className="font-display text-xl font-semibold mb-4">Schedule Follow-Up</h2>
        <form onSubmit={handleSchedule} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-1">
            <label className="soft-label mb-1 block">Consultation ID</label>
            <select value={scheduleConsultId} onChange={e => setScheduleConsultId(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: 'rgba(255,253,248,0.90)', border: '1.5px solid #E8D9BC', color: '#3E2E1E' }}>
              <option value="">Select consultation…</option>
              {(queue ?? []).map(item => (
                <option key={item.consultation_id} value={item.consultation_id}>
                  {item.patient_name} ({item.status})
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="soft-label mb-1 block">Destination (phone / email)</label>
            <input value={scheduleDestination} onChange={e => setScheduleDestination(e.target.value)}
              placeholder="+91-9XXXXXXXXX"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: 'rgba(255,253,248,0.90)', border: '1.5px solid #E8D9BC', color: '#3E2E1E' }} />
          </div>
          <div>
            <label className="soft-label mb-1 block">After (hours)</label>
            <input type="number" min="1" max="8760" value={scheduleHours} onChange={e => setScheduleHours(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: 'rgba(255,253,248,0.90)', border: '1.5px solid #E8D9BC', color: '#3E2E1E' }} />
          </div>
          <button type="submit" disabled={scheduling || !scheduleConsultId || !scheduleDestination}
            className="gold-button py-2 text-sm disabled:opacity-50">
            {scheduling ? 'Scheduling…' : 'Schedule Follow-Up'}
          </button>
        </form>
      </section>

      {/* Follow-up list */}
      <section className="gold-card overflow-hidden">
        <div className="p-5 md:p-6">
          <h2 className="font-display text-xl font-semibold">Scheduled Follow-Ups</h2>
        </div>
        {loading ? (
          <div className="px-6 py-8 text-center text-[#8A745A] text-sm">Loading follow-ups…</div>
        ) : followUps.length === 0 ? (
          <div className="px-6 py-8 text-center text-[#8A745A] text-sm">No follow-ups scheduled yet.</div>
        ) : (
          <table className="w-full text-left min-w-[540px]">
            <thead className="bg-[#F0DEC0]/55 text-[#8A745A] text-[10px] uppercase tracking-[.12em]">
              <tr>
                <th className="px-5 py-3 font-extrabold">Destination</th>
                <th className="px-3 py-3 font-extrabold">Due At</th>
                <th className="px-3 py-3 font-extrabold">Status</th>
              </tr>
            </thead>
            <tbody>
              {followUps.map(item => (
                <tr key={item.id} className="border-t border-[#E8D9BC]/70">
                  <td className="px-5 py-3 text-sm font-medium">{item.destination}</td>
                  <td className="px-3 py-3 text-xs text-[#8A745A]">{new Date(item.due_at).toLocaleString()}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                      item.status === 'escalated' ? 'bg-[#F5D5CE] text-[#A7685D]' :
                      item.status === 'scheduled' ? 'bg-[#F3E2C4] text-[#9A712F]' :
                      'bg-[#DCE4D5] text-[#64775B]'
                    }`}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
