'use client'

import { useEffect, useRef, useState } from 'react'
import * as faceapi from '@vladmandic/face-api'
import { Camera, CheckCircle2, Loader2, ShieldCheck, X } from 'lucide-react'

type Mode = 'enroll' | 'verify'
type QualitySample = { pitch: number; yaw: number; lux: number; width: number; height: number }

type Props = {
  mode: Mode
  onClose: () => void
  onComplete: (message: string) => void
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
const MODEL_PATH = '/models'

function eyeAspectRatio(eye: faceapi.Point[]) {
  const distance = (first: faceapi.Point, second: faceapi.Point) => Math.hypot(first.x - second.x, first.y - second.y)
  return (distance(eye[1], eye[5]) + distance(eye[2], eye[4])) / (2 * distance(eye[0], eye[3]))
}

function centroid(descriptors: number[][]) {
  return descriptors[0].map((_, index) => descriptors.reduce((sum, descriptor) => sum + descriptor[index], 0) / descriptors.length)
}

function frameQuality(video: HTMLVideoElement, detection: faceapi.WithFaceDescriptor<{ detection: faceapi.FaceDetection; landmarks: faceapi.FaceLandmarks68 }>): QualitySample {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const context = canvas.getContext('2d')
  context?.drawImage(video, 0, 0, 32, 32)
  const pixels = context?.getImageData(0, 0, 32, 32).data || new Uint8ClampedArray()
  let luminance = 0
  for (let index = 0; index < pixels.length; index += 4) luminance += (pixels[index] * 0.2126) + (pixels[index + 1] * 0.7152) + (pixels[index + 2] * 0.0722)
  const box = detection.detection.box
  const nose = detection.landmarks.getNose()[3]
  const centerX = box.x + (box.width / 2)
  const centerY = box.y + (box.height / 2)
  return { pitch: ((nose.y - centerY) / box.height) * 30, yaw: ((nose.x - centerX) / box.width) * 30, lux: (luminance / 1024) * 1000, width: box.width, height: box.height }
}

export default function BiometricCaptureModal({ mode, onClose, onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const descriptorsRef = useRef<number[][]>([])
  const qualityRef = useRef<QualitySample[]>([])
  const noseHistoryRef = useRef<number[]>([])
  const blinkRef = useRef(0)
  const eyesClosedRef = useRef(false)
  const [loading, setLoading] = useState(true)
  const [modelsReady, setModelsReady] = useState(false)
  const [challenge, setChallenge] = useState('')
  const [liveness, setLiveness] = useState(false)
  const [consent, setConsent] = useState(false)
  const [sampleCount, setSampleCount] = useState(0)
  const [message, setMessage] = useState('Loading secure camera checks...')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    const start = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_PATH),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_PATH),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_PATH),
        ])
        const response = await fetch(`${API_BASE}/auth/biometric/challenge`, { headers: { Authorization: `Bearer ${sessionStorage.getItem('medikiosk.access_token') || ''}` } })
        if (!response.ok) throw new Error('Your secure staff session is required.')
        const data = await response.json()
        if (cancelled) return
        setChallenge(data.challenge)
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false })
        streamRef.current = stream
        if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
        setModelsReady(true)
        setMessage('Blink twice, then move your head slightly left and right.')
      } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to initialize the secure camera.') } finally { setLoading(false) }
    }
    void start()
    return () => { cancelled = true; streamRef.current?.getTracks().forEach(track => track.stop()) }
  }, [])

  useEffect(() => {
    if (!modelsReady || !videoRef.current) return
    const video = videoRef.current
    const interval = window.setInterval(async () => {
      const detection = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor()
      if (!detection) return
      const landmarks = detection.landmarks
      const leftEar = eyeAspectRatio(landmarks.getLeftEye())
      const rightEar = eyeAspectRatio(landmarks.getRightEye())
      const closed = leftEar < 0.2 && rightEar < 0.2
      if (closed && !eyesClosedRef.current) eyesClosedRef.current = true
      if (!closed && eyesClosedRef.current) { blinkRef.current += 1; eyesClosedRef.current = false }
      const noseX = landmarks.getNose()[3].x
      noseHistoryRef.current = [...noseHistoryRef.current.slice(-15), noseX]
      const range = Math.max(...noseHistoryRef.current) - Math.min(...noseHistoryRef.current)
      if (blinkRef.current >= 2 && range > 12) setLiveness(true)
    }, 180)
    return () => window.clearInterval(interval)
  }, [modelsReady])

  const captureSample = async () => {
    if (!videoRef.current || !liveness) return
    const detection = await faceapi.detectSingleFace(videoRef.current).withFaceLandmarks().withFaceDescriptor()
    if (!detection) { setError('No clear face detected. Center your face and try again.'); return }
    const quality = frameQuality(videoRef.current, detection)
    if (Math.abs(quality.pitch) > 15 || Math.abs(quality.yaw) > 15 || quality.lux < 300 || quality.width < 120 || quality.height < 120) { setError('Improve lighting and face alignment before capturing.'); return }
    descriptorsRef.current = [...descriptorsRef.current, Array.from(detection.descriptor)]
    qualityRef.current = [...qualityRef.current, quality]
    setSampleCount(descriptorsRef.current.length)
    setError('')
    const requiredSamples = mode === 'enroll' ? 5 : 1
    if (descriptorsRef.current.length === requiredSamples) await submit(descriptorsRef.current, qualityRef.current)
  }

  const submit = async (descriptors: number[][], quality: QualitySample[]) => {
    setSubmitting(true)
    try {
      const endpoint = mode === 'enroll' ? '/auth/biometric/enroll' : '/auth/biometric/verify'
      const body = mode === 'enroll' ? { challenge, descriptors, centroid: centroid(descriptors), quality, liveness_passed: true, biometric_consent: consent } : { challenge, descriptor: descriptors[0], liveness_passed: true }
      const response = await fetch(`${API_BASE}${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('medikiosk.access_token') || ''}` }, body: JSON.stringify(body) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Biometric operation failed.')
      onComplete(mode === 'enroll' ? `Enrollment complete. Recovery key: ${data.recovery_key}` : 'Biometric step-up verified.')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Biometric operation failed.') } finally { setSubmitting(false) }
  }

  const requiredSamples = mode === 'enroll' ? 5 : 1
  const finished = sampleCount === requiredSamples
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"><div className="w-full max-w-xl rounded-xl border border-royal-gold/30 bg-royal-sidebar p-5 shadow-2xl"><div className="flex items-center justify-between"><div><div className="flex items-center gap-2 text-royal-gold"><ShieldCheck size={18} /><span className="text-xs font-semibold uppercase tracking-[0.18em]">Secure biometric {mode}</span></div><p className="mt-2 text-sm text-royal-ivory/60">Frames stay in memory and are never uploaded.</p></div><button onClick={onClose} aria-label="Close biometric dialog" className="text-royal-ivory/60 hover:text-royal-ivory"><X size={20} /></button></div><div className="relative mt-5 overflow-hidden rounded-lg border border-royal-gold/20 bg-black"><video ref={videoRef} muted playsInline className="aspect-video w-full object-cover" /><div className="absolute inset-6 rounded-[45%] border border-royal-teal/70" />{loading && <div className="absolute inset-0 flex items-center justify-center bg-black/60"><Loader2 className="animate-spin text-royal-gold" /></div>}</div><div className="mt-4 flex items-center justify-between text-sm"><span className={liveness ? 'text-success' : 'text-royal-ivory/60'}>{liveness ? 'Liveness passed' : message}</span><span className="text-royal-gold">{sampleCount}/{requiredSamples} samples</span></div>{mode === 'enroll' && <label className="mt-4 flex items-start gap-3 text-sm text-royal-ivory/70"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} className="mt-1 accent-[#C9A84C]" />I consent to encrypted biometric step-up authentication for my staff account.</label>}{error && <p className="mt-3 text-sm text-red-300">{error}</p>}{!finished && <button onClick={() => void captureSample()} disabled={!liveness || loading || submitting || (mode === 'enroll' && !consent)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-royal-gold px-4 py-3 font-semibold text-royal-bg disabled:cursor-not-allowed disabled:opacity-40">{submitting ? <Loader2 size={18} className="animate-spin" /> : sampleCount === requiredSamples - 1 ? <CheckCircle2 size={18} /> : <Camera size={18} />} {sampleCount === requiredSamples - 1 ? 'Finish secure capture' : 'Capture valid sample'}</button>}</div></div>
}
