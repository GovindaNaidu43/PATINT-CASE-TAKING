import React from 'react';

interface Props {
  label?: string;
  className?: string;
}

const SignalBadge: React.FC<Props> = ({ label, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-royal-teal/10 border border-royal-teal text-royal-teal text-sm font-bold ${className}`}>
      <span className="animate-pulse">⚡</span>
      <span>Supporting Signal — Not a Diagnosis{label ? ` · ${label}` : ''}</span>
    </div>
  );
};

export default SignalBadge;
