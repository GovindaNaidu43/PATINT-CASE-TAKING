import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
}

const RoyalCard: React.FC<Props> = ({ children, className = '', glowing = false }) => {
  return (
    <div className={`bg-royal-surface border border-royal-gold/40 rounded-xl shadow-gold-glow backdrop-blur-sm transition-all duration-300 ${glowing ? 'hover:border-royal-gold/80 hover:shadow-[0_0_30px_rgba(201,168,76,0.6)]' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default RoyalCard;
