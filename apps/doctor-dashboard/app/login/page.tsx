'use client'
import RoyalCard from '@/components/RoyalCard'
function base64Url(bytes: Uint8Array) { return btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '') }
export default function LoginPage() {
  const signIn = async () => {
    const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER; const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'medikiosk-api'
    if (!issuer) return alert('Staff login is not configured. Ask the clinic administrator to configure Keycloak.')
    const verifier = base64Url(crypto.getRandomValues(new Uint8Array(48))); const challenge = base64Url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))))
    sessionStorage.setItem('medikiosk.pkce_verifier', verifier)
    const redirectUri = `${window.location.origin}/auth/callback`; const params = new URLSearchParams({ client_id: clientId, response_type: 'code', scope: 'openid profile', redirect_uri: redirectUri, code_challenge: challenge, code_challenge_method: 'S256' })
    window.location.assign(`${issuer.replace(/\/$/, '')}/protocol/openid-connect/auth?${params}`)
  }
  return <div className="min-h-screen bg-royal-bg flex flex-col items-center justify-center p-4"><RoyalCard className="w-full max-w-md p-8 text-center" glowing><h1 className="font-display text-3xl text-royal-gold">MediKiosk</h1><p className="text-royal-ivory mt-2 font-display text-xl">Physician Portal</p><button onClick={signIn} className="mt-8 w-full bg-royal-gold text-royal-bg font-bold py-3 px-4 rounded hover:bg-opacity-90 transition-all">Sign in securely</button><p className="mt-8 text-sm text-royal-ivory/60">Only authorised clinical staff may access patient records.</p></RoyalCard></div>
}
