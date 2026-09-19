import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BrowserMultiFormatReader } from '@zxing/browser';

interface Props {
  onScan: (abhaId: string) => void;
}

const QRScanner: React.FC<Props> = ({ onScan }) => {
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const onScanRef = useRef(onScan);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    let mounted = true;
    const reader = new BrowserMultiFormatReader();

    if (!videoRef.current) return () => undefined;

    reader.decodeFromVideoDevice(undefined, videoRef.current, (result, decodeError) => {
      if (!mounted) return;
      if (result) {
        setScanning(false);
        controlsRef.current?.stop();
        onScanRef.current(result.getText().trim());
      } else if (decodeError && decodeError.name !== 'NotFoundException') {
        setError('The QR code could not be read. You can enter the ABHA ID manually.');
      }
    }).then(controls => {
      if (mounted) controlsRef.current = controls;
      else controls.stop();
    }).catch(() => {
      if (mounted) {
        setScanning(false);
        setError('Camera access is unavailable. Enter the ABHA ID manually.');
      }
    });

    return () => {
      mounted = false;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, []);

  return (
    <div
      className="relative w-full aspect-square max-w-md rounded-2xl overflow-hidden border-2"
      style={{
        /* Camera viewfinder: keep dark for realism — it simulates a camera feed */
        background: '#1A1208',
        borderColor: 'rgba(184,134,60,0.40)',
      }}
    >
      <video ref={videoRef} muted playsInline className="absolute inset-0 h-full w-full object-cover" />
      {scanning ? (
        <>
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-10"
               style={{ background: 'repeating-linear-gradient(rgba(184,134,60,0.3) 0 1px, transparent 1px 20px), repeating-linear-gradient(90deg, rgba(184,134,60,0.3) 0 1px, transparent 1px 20px)' }} />

          {/* Scanning beam */}
          <motion.div
            className="absolute left-0 w-full h-0.5"
            style={{ background: 'rgba(184,134,60,0.80)', boxShadow: '0 0 12px rgba(184,134,60,0.60)' }}
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          {/* Corner guides */}
          {[['top-6 left-6', 'border-t-2 border-l-2'],
            ['top-6 right-6', 'border-t-2 border-r-2'],
            ['bottom-6 left-6', 'border-b-2 border-l-2'],
            ['bottom-6 right-6', 'border-b-2 border-r-2']].map(([pos, border], i) => (
            <div key={i} className={`absolute ${pos} w-6 h-6 ${border} border-royal-gold`} />
          ))}

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-4 py-2 rounded font-sans animate-pulse text-sm"
                  style={{ background: 'rgba(26,18,8,0.75)', color: '#C9974B' }}>
              Point the camera at an ABHA QR code
            </span>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center"
             style={{ background: 'rgba(255,253,248,0.95)' }}>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                 style={{ background: 'rgba(140,163,131,0.20)', border: '1.5px solid #8CA383' }}>
              <svg className="w-8 h-8" style={{ color: '#5A7A55' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-bold font-display text-xl" style={{ color: '#5A7A55' }}>Found!</span>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-x-4 bottom-4 rounded-lg px-3 py-2 text-center text-xs"
             style={{ background: 'rgba(26,18,8,0.82)', color: '#F0DEC0' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default QRScanner;
