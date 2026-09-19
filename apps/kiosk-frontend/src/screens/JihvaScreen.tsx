import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SignalBadge from '../components/ui/SignalBadge';
import RoyalButton from '../components/ui/RoyalButton';
import RoyalCard from '../components/ui/RoyalCard';
import { analyzeJihva } from '../api/apiClient';

const JihvaScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [captured, setCaptured] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => () => streamRef.current?.getTracks().forEach(track => track.stop()), []);

  const startCamera = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (videoRef.current) { videoRef.current.srcObject = streamRef.current; await videoRef.current.play(); }
    } catch { setError('Camera access is required for tongue capture.'); }
  };

  const handleCapture = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas'); canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', .9));
    const consultationId = window.localStorage.getItem('medikiosk.consultationId');
    if (!blob || !consultationId) { setError('Start a consultation before capturing.'); return; }
    try { setResult(await analyzeJihva(consultationId, blob)); setCaptured(true); streamRef.current?.getTracks().forEach(track => track.stop()); }
    catch { setError('The tongue image could not be analyzed. Please try again.'); }
  };

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
          
          <RoyalButton size="lg" onClick={() => void (streamRef.current ? handleCapture() : startCamera())} className="w-64">
            {t('jihva.capture')}
          </RoyalButton>
          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-4xl">
          <div className="grid grid-cols-2 gap-8 w-full mb-8">
            <div className="w-full aspect-video bg-black rounded-xl border border-royal-gold/30 flex items-center justify-center">
              <span className="text-4xl text-gray-600">Image captured</span>
            </div>

            <RoyalCard className="p-6 flex flex-col justify-center">
              <h3 className="text-xl font-display text-royal-gold mb-4">Signal Detected</h3>
              <p className="text-lg text-white mb-2">{result?.coating || 'Indeterminate coating'}</p>
              <p className="text-royal-teal font-bold mb-4">{result?.prakriti_signal || 'Supporting signal only'}</p>
              <p className="text-xs text-gray-500 italic">This is an AI-generated signal for physician review, not a final diagnosis.</p>
            </RoyalCard>
          </div>

          <RoyalButton size="lg" onClick={() => navigate('/summary')} className="w-64">
            {t('jihva.continue')}
          </RoyalButton>
        </div>
      )}
    </div>
  );
};

export default JihvaScreen;
