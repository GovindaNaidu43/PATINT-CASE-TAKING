'use client'
import { useRouter } from 'next/navigation'
import RoyalCard from '@/components/RoyalCard'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = () => {
    document.cookie = "auth=true; path=/"
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-royal-bg flex flex-col items-center justify-center p-4">
      <RoyalCard className="w-full max-w-md p-8 text-center" glowing>
        <div className="mb-8">
          <svg className="w-16 h-16 mx-auto text-royal-gold mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <h1 className="font-display text-3xl text-royal-gold">MediKiosk</h1>
          <p className="text-royal-ivory mt-2 font-display text-xl">Physician Portal</p>
        </div>
        
        <button 
          onClick={handleLogin}
          className="w-full bg-royal-gold text-royal-bg font-bold py-3 px-4 rounded hover:bg-opacity-90 transition-all duration-200"
        >
          Sign in with Keycloak SSO
        </button>
        
        <div className="mt-8 text-sm text-royal-ivory/60">
          AIIA · Ministry of AYUSH · ABDM-compliant
        </div>
      </RoyalCard>
    </div>
  )
}
