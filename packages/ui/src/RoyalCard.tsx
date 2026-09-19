import React from 'react';

export interface RoyalCardProps {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const UnifiedRoyalCard: React.FC<RoyalCardProps> = ({
  children,
  className = '',
  glowing = false,
  style,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl transition-all duration-200 ${className}`}
      style={{
        background: 'rgba(255, 253, 248, 0.90)',
        border: `1px solid ${glowing ? '#C9974B' : '#E8D9BC'}`,
        boxShadow: glowing
          ? '0 0 0 2px rgba(201, 151, 75, 0.22), 0 12px 28px rgba(184, 134, 60, 0.12)'
          : '0 8px 24px rgba(184, 134, 60, 0.08)',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default UnifiedRoyalCard;
