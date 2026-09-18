import React from 'react';
import { motion } from 'framer-motion';

const LoadingMandala: React.FC<{ size?: number; label?: string }> = ({ size = 64, label }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="text-royal-gold drop-shadow-gold-glow"
      >
        <path fill="currentColor" d="M50 0 C60 30 70 40 100 50 C70 60 60 70 50 100 C40 70 30 60 0 50 C30 40 40 30 50 0 Z" opacity="0.8" />
        <path fill="currentColor" d="M15 15 C35 35 45 45 85 15 C65 35 55 45 85 85 C65 65 55 55 15 85 C35 65 45 55 15 15 Z" opacity="0.5" />
        <circle cx="50" cy="50" r="10" fill="currentColor" />
      </motion.svg>
      {label && <span className="text-royal-gold font-display animate-pulse">{label}</span>}
    </div>
  );
};

export default LoadingMandala;
