'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, UsersRound, CalendarDays, MessageCircle, FileBarChart, ClipboardList, Settings, LogOut, Sparkles } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', href: '/appointments', icon: CalendarDays },
    { name: 'Patients', href: '/patients', icon: UsersRound },
    { name: 'Messages', href: '/messages', icon: MessageCircle },
    { name: 'Reports', href: '/reports', icon: FileBarChart },
    { name: 'Prescriptions', href: '/prescriptions', icon: ClipboardList },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="w-[236px] bg-royal-sidebar/90 border-r border-[#E8D9BC] flex flex-col h-full flex-shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-[#E8D9BC]">
        <div className="w-10 h-10 rounded-full bg-[#F0DEC0] text-royal-gold flex items-center justify-center"><Sparkles size={19} /></div>
        <div><span className="font-display text-2xl text-royal-gold font-semibold">MediKiosk</span><p className="text-[10px] tracking-[.2em] text-[#8A745A] uppercase">Wellness care</p></div>
      </div>
      
      <div className="flex-1 py-6 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link key={item.name} href={item.href}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors border-l-2 ${
                isActive ? 'bg-[#F0DEC0]/70 text-royal-gold border-royal-gold' : 'text-[#8A745A] hover:text-royal-ivory hover:bg-royal-surface/70 border-transparent'
              }`}>
                <Icon size={20} />
                <span className="font-semibold">{item.name}</span>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-[#E8D9BC]">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#F0DEC0] border border-royal-gold flex items-center justify-center text-royal-gold font-display font-bold">
            PS
          </div>
          <div>
            <div className="text-sm font-bold text-royal-ivory">Dr. Priya Sharma</div>
            <div className="text-xs text-[#8A745A]">Senior Physician</div>
          </div>
        </div>
        <Link href="/login">
          <button className="w-full flex items-center justify-center gap-2 text-[#8A745A] hover:text-royal-crimson py-2 text-sm transition-colors">
            <LogOut size={16} />
            Logout
          </button>
        </Link>
      </div>
    </div>
  )
}
