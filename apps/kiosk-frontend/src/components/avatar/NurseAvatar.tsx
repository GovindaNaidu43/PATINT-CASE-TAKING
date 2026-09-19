import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  state: 'idle' | 'speaking' | 'listening' | 'processing';
}

const NurseAvatar: React.FC<Props> = ({ state }) => {
  return (
    <div className="relative w-64 h-80 flex items-center justify-center">
      {/* Glow Behind */}
      {state === 'speaking' && (
        <motion.div 
          className="absolute inset-0 bg-royal-gold/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {state === 'listening' && (
        <motion.div 
          className="absolute inset-0 bg-royal-teal/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* SVG Avatar Placeholder - Polished */}
      <motion.svg 
        viewBox="0 0 200 300" 
        className="w-full h-full relative z-10 drop-shadow-2xl"
        animate={
          state === 'idle' ? { y: [0, -10, 0] } :
          state === 'speaking' ? { y: [0, -5, 0] } :
          state === 'processing' ? { scale: [1, 0.98, 1] } : {}
        }
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Shoulders / Coat */}
        <path d="M40 300 C40 220 160 220 160 300 Z" fill="#8CA383" opacity="0.3" />
        <path d="M50 300 C50 240 150 240 150 300 Z" fill="#2C1F12" stroke="#B8863C" strokeWidth="2" />
        <path d="M90 300 L90 250 L110 250 L110 300 Z" fill="#FAF3E8" />

        
        {/* Neck */}
        <rect x="90" y="150" width="20" height="40" fill="#E6B87D" />
        
        {/* Head */}
        <circle cx="100" cy="120" r="45" fill="#E6B87D" />
        
        {/* Hair / Bun */}
        <path d="M50 120 C50 60 150 60 150 120 C150 130 50 130 50 120 Z" fill="#111" />
        <circle cx="100" cy="50" r="25" fill="#111" />
        <path d="M45 100 Q100 70 155 100 Q100 50 45 100 Z" fill="#222" />

        {/* Face Details */}
        {/* Eyes */}
        <motion.ellipse 
          cx="85" cy="115" rx="5" ry="3" fill="#111" 
          animate={state === 'listening' ? { ry: [3, 1, 3] } : { ry: [3, 3, 0.5, 3] }}
          transition={state === 'listening' ? { duration: 1, repeat: Infinity } : { duration: 4, times: [0, 0.95, 0.97, 1], repeat: Infinity }}
        />
        <motion.ellipse 
          cx="115" cy="115" rx="5" ry="3" fill="#111" 
          animate={state === 'listening' ? { ry: [3, 1, 3] } : { ry: [3, 3, 0.5, 3] }}
          transition={state === 'listening' ? { duration: 1, repeat: Infinity } : { duration: 4, times: [0, 0.95, 0.97, 1], repeat: Infinity }}
        />
        
        {/* Mouth */}
        <motion.path 
          d="M90 140 Q100 145 110 140" 
          stroke="#8B1A1A" strokeWidth="2" fill="none" strokeLinecap="round"
          animate={
            state === 'speaking' ? { d: ["M90 140 Q100 145 110 140", "M90 140 Q100 155 110 140"] } : {}
          }
          transition={{ duration: 0.2, repeat: Infinity, repeatType: 'reverse' }}
        />
        
        {/* Ear ring indicator for listening */}
        {state === 'listening' && (
           <motion.circle cx="145" cy="125" r="4" fill="#2DD4BF" 
             animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }} 
             transition={{ duration: 1, repeat: Infinity }}
           />
        )}
        
        {/* Stethoscope */}
        <path d="M70 240 C70 280 130 280 130 240" fill="none" stroke="#8A745A" strokeWidth="4" />
        <circle cx="130" cy="240" r="10" fill="#B8863C" />
      </motion.svg>
    </div>
  );
};

export default NurseAvatar;
