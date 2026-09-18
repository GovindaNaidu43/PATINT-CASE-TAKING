import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
}

const RoyalCard: React.FC<Props> = ({ children, className = '', glowing = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className={`rounded-2xl ${className}`}
    style={{
      background: 'rgba(255,253,248,0.88)',
      border: `1px solid ${glowing ? '#C9974B' : '#E8D9BC'}`,
      boxShadow: glowing
        ? '0 0 0 2px rgba(201,151,75,0.25), 0 12px 28px rgba(184,134,60,0.12)'
        : '0 8px 24px rgba(184,134,60,0.08)',
    }}
  >
    {children}
  </motion.div>
);

export default RoyalCard;
