import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onScan: (abhaId: string) => void;
}

const QRScanner: React.FC<Props> = ({ onScan }) => {
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScanning(false);
      onScan('91-1234-5678-9012'); // Mock ABHA ID
    }, 3000);
    return () => clearTimeout(timer);
  }, [onScan]);

  return (
    <div
      className="relative w-full aspect-square max-w-md rounded-2xl overflow-hidden border-2"
      style={{
        /* Camera viewfinder: keep dark for realism — it simulates a camera feed */
        background: '#1A1208',
        borderColor: 'rgba(184,134,60,0.40)',
      }}
    >
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
              Scanning...
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
    </div>
  );
};

export default QRScanner;
