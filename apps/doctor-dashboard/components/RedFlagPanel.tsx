import { AlertTriangle, Check } from 'lucide-react'

export default function RedFlagPanel({ flags }: { flags: any[] }) {
  if (!flags || flags.length === 0) return null;

  return (
    <div className="bg-royal-crimson/10 border border-royal-crimson/30 rounded-lg overflow-hidden">
      <div className="bg-royal-crimson/20 px-4 py-3 border-b border-royal-crimson/30 flex items-center gap-2 text-royal-crimson font-bold font-display">
        <AlertTriangle size={18} />
        System Flagged Concerns ({flags.length})
      </div>
      <div className="divide-y divide-royal-crimson/10">
        {flags.map((flag, i) => (
          <div key={i} className="p-4 flex justify-between items-start">
            <div>
              <div className="text-royal-ivory font-semibold mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-royal-crimson animate-pulse"></span>
                {flag.text}
              </div>
              <div className="text-xs text-royal-ivory/50 flex gap-3">
                <span>Source: {flag.source}</span>
                <span>Time: {new Date(flag.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
            <button className="text-xs border border-royal-crimson/30 text-royal-crimson hover:bg-royal-crimson hover:text-white px-3 py-1 rounded transition-colors">
              Acknowledge
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
