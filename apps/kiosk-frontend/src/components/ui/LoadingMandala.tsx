import React from 'react';
import { motion } from 'framer-motion';

const LoadingMandala: React.FC<{ size?: number; label?: string }> = ({ size = 64, label }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Outer ring — slow clockwise */}
      <div className="relative" style={{ width: size, height: size }}>
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 0 }}
          width={size}
          height={size}
          viewBox="0 0 100 100"
        >
          {/* Outer petals */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x = 50 + 44 * Math.cos(angle);
            const y = 50 + 44 * Math.sin(angle);
            const cx1 = 50 + 34 * Math.cos(angle - 0.35);
            const cy1 = 50 + 34 * Math.sin(angle - 0.35);
            const cx2 = 50 + 34 * Math.cos(angle + 0.35);
            const cy2 = 50 + 34 * Math.sin(angle + 0.35);
            return (
              <path
                key={i}
                d={`M50,50 C${cx1},${cy1} ${cx2},${cy2} ${x},${y} Z`}
                fill="#B8863C" opacity="0.75"
              />
            );
          })}
          <circle cx="50" cy="50" r="44" stroke="#B8863C" strokeWidth="1.5" fill="none" opacity="0.4" />
        </motion.svg>

        {/* Inner ring — slow counter-clockwise */}
        <motion.svg
          animate={{ rotate: -360 }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 0 }}
          width={size}
          height={size}
          viewBox="0 0 100 100"
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            return (
              <circle
                key={i}
                cx={50 + 28 * Math.cos(angle)}
                cy={50 + 28 * Math.sin(angle)}
                r="3"
                fill="#C9974B"
                opacity="0.7"
              />
            );
          })}
          <circle cx="50" cy="50" r="28" stroke="#C9974B" strokeWidth="1" fill="none" opacity="0.5" />
        </motion.svg>

        {/* Centre dot */}
        <svg style={{ position: 'absolute', inset: 0 }} width={size} height={size} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="8" fill="#B8863C" opacity="0.9" />
          <circle cx="50" cy="50" r="4" fill="#FAF3E8" />
        </svg>
      </div>

      {label && (
        <span className="font-display animate-pulse" style={{ color: '#B8863C' }}>
          {label}
        </span>
      )}
    </div>
  );
};

export default LoadingMandala;
