import React from 'react';

interface Props {
  label?: string;
  className?: string;
}

const SignalBadge: React.FC<Props> = ({ label, className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${className}`}
      style={{
        background: 'rgba(140,163,131,0.15)',
        border: '1px solid #8CA383',
        color: '#5A7A55',
      }}
    >
      <span className="animate-pulse">⚡</span>
      <span>Supporting Signal — Not a Diagnosis{label ? ` · ${label}` : ''}</span>
    </div>
  );
};

export default SignalBadge;
