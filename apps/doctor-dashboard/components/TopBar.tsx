'use client'
import { Bell, Search, Shield, Smartphone, Monitor } from 'lucide-react'

export default function TopBar() {
  return (
    <div className="min-h-20 bg-[#FAF3E8]/75 border-b border-[#E8D9BC] flex items-center justify-between gap-5 px-5 md:px-8 flex-shrink-0">
      <div>
        <p className="font-display text-2xl md:text-3xl font-semibold text-royal-ivory">Good morning, Dr. Priya</p>
        <p className="text-xs text-[#8A745A] mt-0.5">Here is your care overview for today.</p>
      </div>
      <div className="flex items-center gap-3 md:gap-5">
        {/* Quick App Switcher for seamless ecosystem navigation */}
        <div className="hidden lg:flex items-center gap-2 bg-[#FFFDF8]/80 p-1.5 rounded-full border border-[#D9C39C]">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-royal-gold hover:bg-[#F0DEC0]/50 rounded-full transition-colors"
            title="Open Kiosk Terminal"
          >
            <Monitor size={14} />
            <span>Kiosk</span>
          </a>
          <a
            href="http://localhost:8081"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#8CA383] hover:bg-[#DCE4D5]/60 rounded-full transition-colors"
            title="Open Mobile Companion App"
          >
            <Smartphone size={14} />
            <span>Companion</span>
          </a>
        </div>

        <div className="hidden sm:flex items-center gap-2 w-48 lg:w-56 px-3 py-2 rounded-full border border-[#D9C39C] bg-[#FFFDF8]/75 text-[#8A745A]">
          <Search size={16} />
          <span className="text-sm">Search patients...</span>
        </div>
        <div className="relative cursor-pointer text-royal-gold">
          <Bell size={20} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-royal-crimson text-white rounded-full text-[10px] flex items-center justify-center font-bold" style={{ boxShadow: '0 0 6px rgba(167,104,93,0.50)' }}>
            3
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-royal-ivory/80">
          <Shield size={16} className="text-royal-gold" />
          <span className="text-xs font-bold text-[#8A745A]">ABHA Linked</span>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-royal-gold bg-[#E8D9BC] text-royal-gold font-display text-lg font-bold flex items-center justify-center">PS</div>
      </div>
    </div>
  )
}
