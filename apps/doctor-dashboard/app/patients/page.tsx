import Link from 'next/link'

export default function PatientsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-royal-teal font-semibold">Patient records</p>
        <h1 className="font-display text-3xl text-royal-gold mt-2">Patient directory</h1>
        <p className="text-royal-ivory/60 mt-2">Open a patient from the live consultation queue to review their protected case file.</p>
      </div>
      <div className="rounded-xl border border-royal-gold/20 bg-royal-surface p-6">
        <p className="text-royal-ivory/80">The directory view will populate from the authenticated patient search service.</p>
        <Link href="/dashboard" className="inline-flex mt-5 rounded-lg bg-royal-gold px-4 py-2 text-sm font-semibold text-royal-bg hover:bg-royal-ivory transition-colors">Open live queue</Link>
      </div>
    </div>
  )
}
