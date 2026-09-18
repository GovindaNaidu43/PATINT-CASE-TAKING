'use client'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import RoyalCard from './RoyalCard'
import SignalBadge from './SignalBadge'

export default function PrakritiRadar({ data }: { data: any }) {
  const chartData = [
    { subject: 'Vata', A: data?.vata || 40, fullMark: 100 },
    { subject: 'Pitta', A: data?.pitta || 30, fullMark: 100 },
    { subject: 'Kapha', A: data?.kapha || 80, fullMark: 100 },
  ]

  return (
    <RoyalCard className="p-5 flex flex-col items-center">
      <SignalBadge />
      <h3 className="font-display text-xl text-royal-gold mt-4 mb-2">Prakriti Signal</h3>
      <div className="text-sm text-royal-ivory/60 mb-4">(Voice + Jihva)</div>
      
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#1A1535" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#C9A84C', fontSize: 14, fontFamily: 'Cinzel' }} />
            <Radar
              name="Prakriti"
              dataKey="A"
              stroke="#C9A84C"
              strokeWidth={2}
              fill="#C9A84C"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-royal-teal font-bold text-lg mt-2">
        {data?.kapha > data?.vata && data?.kapha > data?.pitta ? 'Kapha Dominant' : 
         data?.vata > data?.pitta ? 'Vata Dominant' : 'Pitta Dominant'}
      </div>
    </RoyalCard>
  )
}
