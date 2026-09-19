import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SignalBadge from '../components/ui/SignalBadge';
import RoyalButton from '../components/ui/RoyalButton';
import RoyalCard from '../components/ui/RoyalCard';
import { analyzeJihva, createConsultation, createPatient } from '../api/apiClient';
import { generateRandomDemoPatient } from '../lib/demoData';

const JihvaScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [captured, setCaptured] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [capturePreview, setCapturePreview] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [demoResult, setDemoResult] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const consultationId = window.localStorage.getItem('medikiosk.consultationId');

  const startDemoConsultation = async () => {
    try {
      const demoPatient = await createPatient(generateRandomDemoPatient());
      const consultation = await createConsultation(demoPatient.id);
      window.localStorage.setItem('medikiosk.consultationId', consultation.id);
      window.location.reload();
    } catch {
      setError('Demo consultation could not be created.');
    }
  };

  useEffect(() => () => streamRef.current?.getTracks().forEach(track => track.stop()), []);

  const startCamera = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (videoRef.current) { videoRef.current.srcObject = streamRef.current; await videoRef.current.play(); }
    } catch { setError('Camera access is required for tongue capture.'); }
  };

  const useDemoJihvaResult = () => {
    setDemoResult(true);
    setResult({ coating: 'Mild white coating noted', prakriti_signal: 'Suggestive of Kapha tendency' });
    setCaptured(true);
    setError('Showing a demo Jihva signal for presentation.');
  };

  const handleCapture = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas'); canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', .9));
    const consultationId = window.localStorage.getItem('medikiosk.consultationId');
    if (!blob || !consultationId) { setError('Start a consultation before capturing.'); return; }
    setAnalyzing(true);
    try {
      setCapturePreview(canvas.toDataURL('image/jpeg', .9));
      setResult(await analyzeJihva(consultationId, blob));
      window.localStorage.removeItem('medikiosk.jihvaSkipped');
      setCaptured(true);
      streamRef.current?.getTracks().forEach(track => track.stop());
    } catch {
      useDemoJihvaResult();
      streamRef.current?.getTracks().forEach(track => track.stop());
    }
    finally { setAnalyzing(false); }
  };

  if (!consultationId) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-xl rounded-3xl border p-8 text-center" style={{ borderColor: 'rgba(184,134,60,0.30)', background: 'rgba(255,253,248,0.82)' }}>
          <h2 className="text-3xl font-display text-royal-gold mb-4">Jihva assessment</h2>
          <p className="text-royal-muted mb-6">This feature needs an active consultation. Start a demo consultation to continue.</p>
          <RoyalButton type="button" size="lg" onClick={() => void startDemoConsultation()} className="w-full max-w-xs mx-auto">
            Start demo consultation
          </RoyalButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center p-8 relative">
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <SignalBadge label="Jihva Pariksha" />
      </div>

      <h2 className="text-3xl font-display text-royal-gold mb-12 mt-16">
        {t('jihva.title')}
      </h2>

      {!captured ? (
        <div className="flex flex-col items-center">
          <div className="relative w-[600px] h-[400px] bg-black rounded-2xl overflow-hidden border-2 border-royal-gold/30 mb-8">
            <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
            {/* Guide overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-[200px] h-[250px] border-4 border-dashed rounded-full opacity-60"
                style={{ borderColor: '#8CA383' }}
              />
            </div>
            <div className="absolute bottom-4 left-0 w-full text-center py-2"
                 style={{ color: 'rgba(255,253,248,0.80)', background: 'rgba(62,46,30,0.60)' }}>
              {t('jihva.hint')}
            </div>
          </div>
          
          <RoyalButton
            type="button"
            aria-label={analyzing ? 'Analyzing tongue image' : 'Capture and analyze tongue image'}
            disabled={analyzing}
            size="lg"
            onClick={() => void (streamRef.current ? handleCapture() : startCamera())}
            className="w-64"
          >
            {analyzing ? 'Analyzing…' : t('jihva.capture')}
          </RoyalButton>
          <RoyalButton type="button" variant="secondary" onClick={useDemoJihvaResult} disabled={analyzing} className="mt-3 w-64">
            Use demo Jihva result
          </RoyalButton>
          <button
            type="button"
            aria-label="Skip Jihva analysis and continue to summary"
            onClick={() => { window.localStorage.setItem('medikiosk.jihvaSkipped', 'true'); navigate('/summary'); }}
            disabled={analyzing}
            className="mt-4 text-sm text-royal-muted underline hover:text-royal-gold disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8863C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF5EB]"
          >
            Skip Jihva for demo
          </button>
          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-4xl">
          <div className="grid grid-cols-2 gap-8 w-full mb-8">
            <div className="w-full aspect-video bg-black rounded-xl border border-royal-gold/30 flex items-center justify-center">
              {capturePreview ? <img src={capturePreview} alt="Captured tongue" className="h-full w-full object-cover rounded-xl" /> : <span className="text-4xl text-gray-600">Image captured</span>}
            </div>

            <RoyalCard className="p-6 flex flex-col justify-center">
              <h3 className="text-xl font-display text-royal-gold mb-4">Signal Detected</h3>
              <p className="text-lg text-white mb-2">{result?.coating || 'Indeterminate coating'}</p>
              <p className="text-royal-teal font-bold mb-4">{result?.prakriti_signal || 'Supporting signal only'}</p>
              {demoResult && <p className="text-royal-gold text-xs mb-3">Demo signal for presentation</p>}
              <p className="text-xs text-gray-500 italic">This is an AI-generated signal for physician review, not a final diagnosis.</p>
            </RoyalCard>
          </div>

          <RoyalButton type="button" aria-label="Continue to summary after Jihva review" size="lg" onClick={() => navigate('/summary')} className="w-64">
            {t('jihva.continue')}
          </RoyalButton>
          <button
            type="button"
            aria-label="Continue without Jihva analysis"
            onClick={() => { window.localStorage.setItem('medikiosk.jihvaSkipped', 'true'); navigate('/summary'); }}
            className="mt-4 text-sm text-royal-muted underline hover:text-royal-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8863C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF5EB]"
          >
            Continue without Jihva analysis
          </button>
        </div>
      )}
    </div>
  );
};

export default JihvaScreen;
