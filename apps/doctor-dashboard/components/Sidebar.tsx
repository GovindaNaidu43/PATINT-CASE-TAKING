'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Phone, BarChart3, LogOut } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  
  const navItems = [
    { name: 'Queue', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Follow-Up', href: '/follow-up', icon: Phone },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
  ]

  return (
    <div className="w-[240px] bg-royal-sidebar border-r border-royal-gold flex flex-col h-full flex-shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-royal-surface">
        <svg className="w-8 h-8 text-royal-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span className="font-display text-xl text-royal-gold">MediKiosk</span>
      </div>
      
      <div className="flex-1 py-6 space-y-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link key={item.name} href={item.href}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-royal-gold/10 text-royal-gold' : 'text-royal-ivory/70 hover:text-royal-ivory hover:bg-royal-surface'
              }`}>
                <Icon size={20} />
                <span className="font-semibold">{item.name}</span>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-royal-surface">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-royal-surface border border-royal-gold flex items-center justify-center text-royal-gold font-display font-bold">
            PS
          </div>
          <div>
            <div className="text-sm font-bold text-royal-ivory">Dr. Priya Sharma</div>
            <div className="text-xs text-royal-ivory/60">Senior Physician</div>
          </div>
        </div>
        <Link href="/login">
          <button className="w-full flex items-center justify-center gap-2 text-royal-ivory/60 hover:text-royal-crimson py-2 text-sm transition-colors">
            <LogOut size={16} />
            Logout
          </button>
        </Link>
      </div>
    </div>
  )
}
