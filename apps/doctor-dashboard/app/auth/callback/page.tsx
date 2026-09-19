'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
export default function AuthCallback() {
  const params = useSearchParams(); const router = useRouter(); const [message, setMessage] = useState('Completing secure sign-in…')
  useEffect(() => { const complete = async () => { const code = params.get('code'); const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER; const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'medikiosk-api'; const verifier = sessionStorage.getItem('medikiosk.pkce_verifier'); if (!code || !issuer || !verifier) { setMessage('Sign-in could not be completed. Please return to login and try again.'); return } const body = new URLSearchParams({ grant_type: 'authorization_code', code, client_id: clientId, redirect_uri: `${window.location.origin}/auth/callback`, code_verifier: verifier }); const response = await fetch(`${issuer.replace(/\/$/, '')}/protocol/openid-connect/token`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body }); if (!response.ok) { setMessage('Sign-in was rejected. Confirm that your account has the physician role.'); return } const tokens = await response.json(); sessionStorage.setItem('medikiosk.access_token', tokens.access_token); sessionStorage.removeItem('medikiosk.pkce_verifier'); router.replace('/dashboard') }; void complete() }, [params, router])
  return <main className="min-h-screen grid place-items-center bg-royal-bg text-royal-ivory">{message}</main>
}
