import { Bell, Search, Shield } from 'lucide-react'

export default function TopBar() {
  return (
    <div className="min-h-20 bg-[#FAF3E8]/75 border-b border-[#E8D9BC] flex items-center justify-between gap-5 px-5 md:px-8 flex-shrink-0">
      <div>
        <p className="font-display text-2xl md:text-3xl font-semibold text-royal-ivory">Good morning, Dr. Priya</p>
        <p className="text-xs text-[#8A745A] mt-0.5">Here is your care overview for today.</p>
      </div>
      <div className="flex items-center gap-3 md:gap-6">
        <div className="hidden sm:flex items-center gap-2 w-52 lg:w-64 px-3 py-2 rounded-full border border-[#D9C39C] bg-[#FFFDF8]/75 text-[#8A745A]"><Search size={16} /><span className="text-sm">Search patients...</span></div>
        <div className="relative cursor-pointer text-royal-gold"><Bell size={20} /><div className="absolute -top-1 -right-1 w-4 h-4 bg-royal-crimson text-white rounded-full text-[10px] flex items-center justify-center font-bold" style={{ boxShadow: '0 0 6px rgba(167,104,93,0.50)' }}>3</div></div>
        <div className="hidden md:flex items-center gap-2 text-royal-ivory/80">
          <Shield size={16} className="text-royal-gold" />
          <span className="text-xs font-bold text-[#8A745A]">ABHA Linked</span>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-royal-gold bg-[#E8D9BC] text-royal-gold font-display text-lg font-bold flex items-center justify-center">PS</div>
      </div>
    </div>
  )
}
