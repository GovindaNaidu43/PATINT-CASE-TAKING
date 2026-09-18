import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const RoyalButton: React.FC<Props> = ({ variant = 'primary', size = 'lg', children, onClick, disabled = false, className = '' }) => {
  const baseStyle = "rounded-lg font-display tracking-wide uppercase font-bold transition-colors flex justify-center items-center";
  
  const sizeStyles = {
    sm: "px-4 py-2 text-sm min-w-[100px]",
    md: "px-6 py-3 text-base min-w-[140px]",
    lg: "px-8 py-4 text-lg min-w-[180px] min-h-[56px]"
  };

  const variantStyles = {
    primary: "bg-royal-gold text-royal-bg hover:bg-[#b3923a] shadow-gold-glow",
    secondary: "bg-transparent border-2 border-royal-gold text-royal-gold hover:bg-royal-gold/10",
    danger: "bg-royal-crimson text-white hover:bg-[#6b1414]"
  };

  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.96 }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default RoyalButton;
