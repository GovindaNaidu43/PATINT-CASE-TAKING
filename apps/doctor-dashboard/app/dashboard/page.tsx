import LiveQueue from '@/components/LiveQueue'

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-3xl text-royal-gold">Live OPD Queue</h1>
          <p className="text-royal-ivory/70 mt-1">{today} · refreshes every 5 seconds</p>
        </div>
      </div>
      <LiveQueue />
    </div>
  )
}
