import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

const RoyalButton: React.FC<Props> = ({
  variant = 'primary',
  size = 'lg',
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}) => {
  const baseStyle =
    'rounded-xl font-display tracking-wide uppercase font-bold transition-all flex justify-center items-center';
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm min-w-[100px]',
    md: 'px-6 py-3 text-base min-w-[140px]',
    lg: 'px-8 py-4 text-lg min-w-[180px] min-h-[56px]',
  };

  const variantStyles = {
    primary:
      'text-white shadow-gold-glow hover:opacity-90',
    secondary:
      'bg-transparent border-2 border-royal-gold text-royal-gold hover:bg-royal-gold/10',
    danger:
      'bg-royal-crimson text-white hover:opacity-90',
  };

  const primaryBg = {
    background: 'linear-gradient(135deg, #C9974B 0%, #B8863C 100%)',
  };

  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.96 }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={variant === 'primary' ? primaryBg : undefined}
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${
        disabled ? 'opacity-40 cursor-not-allowed' : ''
      } ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default RoyalButton;
