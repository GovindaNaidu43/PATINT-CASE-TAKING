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
    <div className="relative w-full aspect-square max-w-md bg-black rounded-2xl overflow-hidden border-2 border-royal-gold/40">
      {scanning ? (
        <>
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-[linear-gradient(rgba(45,212,191,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.2)_1px,transparent_1px)] bg-[size:20px_20px]" />
          </div>
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-royal-teal shadow-[0_0_15px_rgba(45,212,191,0.8)]"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="bg-black/50 px-4 py-2 rounded text-royal-teal font-sans animate-pulse">Scanning...</span>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-royal-surface">
           <div className="text-center">
             <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-success">
               <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
             </div>
             <span className="text-success font-bold font-display text-xl">Found!</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
