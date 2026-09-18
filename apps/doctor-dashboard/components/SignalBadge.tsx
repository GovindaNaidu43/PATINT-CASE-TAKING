import { Zap } from 'lucide-react'

export default function SignalBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-royal-teal/10 border border-royal-teal/40 text-royal-teal px-3 py-1.5 rounded-full text-xs font-bold">
      <Zap size={14} />
      <span>⚡ Supporting Signal — Not a Diagnosis</span>
    </div>
  )
}
