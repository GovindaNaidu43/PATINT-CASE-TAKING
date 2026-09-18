'use client'

import { useState } from 'react'
import { Activity, ArrowUpRight, CalendarDays, CheckCircle2, ChevronRight, CircleDollarSign, Clock3, MoreHorizontal, UserRound, Video } from 'lucide-react'

const appointments = [
  { time: '09:00 AM', name: 'Ananya Mehta', type: 'Initial consultation', color: 'bg-[#E8D9BC]', initials: 'AM' },
  { time: '10:30 AM', name: 'Rohan Kapoor', type: 'Follow-up visit', color: 'bg-[#DCE4D5]', initials: 'RK' },
  { time: '12:00 PM', name: 'Meera Iyer', type: 'Ayurvedic consultation', color: 'bg-[#F0DEC0]', initials: 'MI' },
  { time: '02:30 PM', name: 'Vikram Shah', type: 'Wellness review', color: 'bg-[#E8D9BC]', initials: 'VS' },
]

const patients = [
  { name: 'Ananya Mehta', detail: 'Female · 32 years', visit: 'Today, 09:00 AM', status: 'Confirmed', initials: 'AM', tone: 'bg-[#E8D9BC]' },
  { name: 'Rohan Kapoor', detail: 'Male · 45 years', visit: 'Yesterday, 04:20 PM', status: 'In progress', initials: 'RK', tone: 'bg-[#DCE4D5]' },
  { name: 'Meera Iyer', detail: 'Female · 28 years', visit: 'May 21, 2024', status: 'Completed', initials: 'MI', tone: 'bg-[#F0DEC0]' },
  { name: 'Vikram Shah', detail: 'Male · 51 years', visit: 'May 20, 2024', status: 'Follow-up', initials: 'VS', tone: 'bg-[#E8D9BC]' },
]

const stats = [
  { label: "Today's Appointments", value: '12', note: '+2 from yesterday', icon: CalendarDays, color: 'text-[#B8863C]', bg: 'bg-[#F0DEC0]' },
  { label: 'Total Patients', value: '248', note: '+14 this month', icon: UserRound, color: 'text-[#8CA383]', bg: 'bg-[#DCE4D5]' },
  { label: 'Pending Reports', value: '08', note: '3 need attention', icon: Activity, color: 'text-[#C9974B]', bg: 'bg-[#F3E2C4]' },
  { label: 'Monthly Revenue', value: '₹1.24L', note: '+8.6% this month', icon: CircleDollarSign, color: 'text-[#B8863C]', bg: 'bg-[#F0DEC0]' },
]

function statusStyle(status: string) {
  if (status === 'Completed') return 'bg-[#DCE4D5] text-[#64775B]'
  if (status === 'In progress') return 'bg-[#F3E2C4] text-[#9A712F]'
  return 'bg-[#F0DEC0] text-[#9C6F29]'
}

export default function DashboardPage() {
  const [activeDay, setActiveDay] = useState(2)
  const days = [{ day: 'MON', date: '20' }, { day: 'TUE', date: '21' }, { day: 'WED', date: '22' }, { day: 'THU', date: '23' }, { day: 'FRI', date: '24' }]

  return (
    <div className="max-w-[1500px] mx-auto space-y-7 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="soft-label mb-1">Wednesday, May 22, 2024</p><h1 className="font-display text-4xl md:text-5xl font-semibold text-royal-ivory">Your care, beautifully organized.</h1></div><button className="gold-button flex items-center gap-2 px-4 py-2.5 text-sm"><CalendarDays size={16} /> New appointment</button></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">{stats.map(({ label, value, note, icon: Icon, color, bg }) => <div key={label} className="gold-card gold-top p-5 flex items-start justify-between"><div><p className="soft-label">{label}</p><p className="font-display text-4xl font-semibold text-royal-ivory mt-2">{value}</p><p className="text-xs text-[#8CA383] font-bold mt-2">{note}</p></div><div className={`w-11 h-11 rounded-full ${bg} ${color} flex items-center justify-center`}><Icon size={20} strokeWidth={1.7} /></div></div>)}</div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_.9fr] gap-5">
        <section className="gold-card p-5 md:p-6"><div className="flex items-start justify-between"><div><p className="soft-label">Your schedule</p><h2 className="font-display text-2xl font-semibold mt-1">Today&apos;s appointments</h2></div><button className="text-xs font-extrabold text-royal-gold flex items-center gap-1">View calendar <ChevronRight size={14} /></button></div><div className="flex gap-2 mt-5 border-b border-[#E8D9BC] pb-4">{days.map((item, index) => <button key={item.date} onClick={() => setActiveDay(index)} className={`flex-1 rounded-xl py-2.5 text-center transition ${activeDay === index ? 'bg-[#B8863C] text-white shadow-md' : 'text-[#8A745A] hover:bg-[#F0DEC0]/60'}`}><span className="block text-[10px] font-extrabold tracking-wider">{item.day}</span><span className="block font-display text-xl font-semibold">{item.date}</span></button>)}</div><div className="mt-4 space-y-2">{appointments.map((appointment, index) => <div key={appointment.name} className={`flex items-center gap-3 rounded-xl px-3 py-3 ${index === 0 ? 'bg-[#F0DEC0]/60 border border-[#D9C39C]' : 'bg-[#FAF3E8]/70'}`}><span className="w-16 text-xs font-extrabold text-[#8A745A]">{appointment.time}</span><div className={`w-9 h-9 rounded-full ${appointment.color} text-[#8A745A] flex items-center justify-center text-xs font-extrabold`}>{appointment.initials}</div><div className="flex-1 min-w-0"><p className="font-bold text-sm truncate">{appointment.name}</p><p className="text-xs text-[#8A745A]">{appointment.type}</p></div>{index === 0 && <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[#8CA383] font-bold"><Clock3 size={13} /> Now</span>}<MoreHorizontal size={18} className="text-[#B8863C]" /></div>)}</div></section>

        <section className="gold-card p-5 md:p-6"><div className="flex justify-between items-start"><div><p className="soft-label">Practice overview</p><h2 className="font-display text-2xl font-semibold mt-1">Patient visits</h2></div><button className="outline-button px-3 py-1.5 text-xs">This month</button></div><div className="h-48 mt-5 relative"><div className="absolute inset-0 flex flex-col justify-between text-[10px] text-[#B29A7A]"><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span></div><div className="ml-7 h-full border-l border-b border-[#E8D9BC] relative"><svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none" aria-label="Patient visits trend"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#C9974B" stopOpacity=".28" /><stop offset="1" stopColor="#C9974B" stopOpacity="0" /></linearGradient></defs><path d="M0 145 C40 136 53 112 92 119 S140 105 171 119 S216 84 252 96 S294 55 330 72 S370 84 402 52 S460 42 500 16 V180 H0Z" fill="url(#chartFill)" /><path d="M0 145 C40 136 53 112 92 119 S140 105 171 119 S216 84 252 96 S294 55 330 72 S370 84 402 52 S460 42 500 16" fill="none" stroke="#B8863C" strokeWidth="3" vectorEffect="non-scaling-stroke" /></svg></div><div className="ml-7 flex justify-between text-[10px] text-[#B29A7A] mt-2"><span>May 1</span><span>May 8</span><span>May 15</span><span>May 22</span><span>May 31</span></div></div><div className="flex items-center gap-2 mt-5 text-xs text-[#8A745A]"><span className="w-2 h-2 rounded-full bg-[#B8863C]" /> Patient visits <span className="ml-3 font-bold text-[#8CA383]">+18.4%</span><ArrowUpRight size={13} className="text-[#8CA383]" /></div></section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_.9fr] gap-5">
        <section className="gold-card overflow-hidden"><div className="p-5 md:p-6 flex justify-between items-start"><div><p className="soft-label">Patient directory</p><h2 className="font-display text-2xl font-semibold mt-1">Recent patients</h2></div><button className="text-xs font-extrabold text-royal-gold">View all patients <ChevronRight size={14} className="inline" /></button></div><div className="overflow-x-auto"><table className="w-full text-left min-w-[620px]"><thead className="bg-[#F0DEC0]/55 text-[#8A745A] text-[10px] uppercase tracking-[.12em]"><tr><th className="px-5 py-3 font-extrabold">Patient</th><th className="px-3 py-3 font-extrabold">Last visit</th><th className="px-3 py-3 font-extrabold">Status</th><th className="px-5 py-3" /></tr></thead><tbody>{patients.map((patient) => <tr key={patient.name} className="border-t border-[#E8D9BC]/70"><td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className={`w-9 h-9 rounded-full ${patient.tone} flex items-center justify-center text-xs text-[#8A745A] font-extrabold`}>{patient.initials}</div><div><p className="font-bold text-sm">{patient.name}</p><p className="text-xs text-[#8A745A]">{patient.detail}</p></div></div></td><td className="px-3 py-3 text-xs text-[#8A745A]">{patient.visit}</td><td className="px-3 py-3"><span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${statusStyle(patient.status)}`}>{patient.status}</span></td><td className="px-5 py-3 text-right"><ChevronRight size={16} className="text-[#B8863C] inline" /></td></tr>)}</tbody></table></div></section>

        <section className="gold-card p-5 md:p-6"><div className="flex justify-between items-start"><div><p className="soft-label">Coming up next</p><h2 className="font-display text-2xl font-semibold mt-1">Upcoming appointments</h2></div><button className="text-[#B8863C]" aria-label="More appointment options"><MoreHorizontal /></button></div><div className="space-y-3 mt-5">{appointments.slice(1, 4).map((appointment) => <div key={appointment.name} className="flex items-center gap-3"><div className={`w-10 h-10 rounded-full ${appointment.color} flex items-center justify-center text-xs font-extrabold text-[#8A745A]`}>{appointment.initials}</div><div className="flex-1"><p className="font-bold text-sm">{appointment.name}</p><p className="text-xs text-[#8A745A]">{appointment.time} · {appointment.type}</p></div><button className="outline-button p-2" aria-label={`View ${appointment.name}`}><Video size={15} /></button></div>)}</div><button className="gold-button w-full py-2.5 text-xs mt-5 flex items-center justify-center gap-2"><Video size={15} /> Open consultation room</button></section>
      </div>

      <div className="flex items-center gap-2 text-xs text-[#8A745A]"><CheckCircle2 size={15} className="text-[#8CA383]" /> All systems operational <span className="w-1 h-1 rounded-full bg-[#C9974B]" /> Last synced just now</div>
    </div>
  )
}
