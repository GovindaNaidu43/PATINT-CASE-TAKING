import { Bell, Shield } from 'lucide-react'

export default function TopBar() {
  return (
    <div className="h-16 bg-royal-bg border-b border-royal-gold/30 flex items-center justify-between px-6 flex-shrink-0">
      <div className="text-royal-ivory/80 font-semibold">
        Physician Dashboard
      </div>
      
      <div className="flex items-center gap-2 bg-success/10 text-success px-3 py-1.5 rounded-full text-sm font-semibold border border-success/30">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
        Kiosk Online
      </div>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer text-royal-ivory hover:text-royal-gold transition-colors">
          <Bell size={20} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-royal-crimson rounded-full text-[10px] flex items-center justify-center font-bold">
            3
          </div>
        </div>
        <div className="flex items-center gap-2 text-royal-ivory/80">
          <Shield size={16} className="text-royal-gold" />
          <span className="text-sm font-semibold hover:text-royal-gold cursor-pointer transition-colors">ABHA Linked</span>
        </div>
      </div>
    </div>
  )
}
