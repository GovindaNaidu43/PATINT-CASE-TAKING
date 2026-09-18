import React from 'react';

interface Props {
  isListening: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const MicButton: React.FC<Props> = ({ isListening, onClick, disabled }) => {
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {isListening && (
        <>
          <div className="absolute inset-0 bg-royal-crimson rounded-full animate-ping opacity-75" />
          <div className="absolute -inset-4 bg-royal-crimson rounded-full animate-pulse opacity-30" />
        </>
      )}
      <button
        onClick={onClick}
        disabled={disabled}
        className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{
          background: isListening
            ? '#A7685D'
            : 'linear-gradient(135deg,#C9974B,#B8863C)',
          boxShadow: isListening
            ? '0 0 30px rgba(167,104,93,0.50)'
            : '0 12px 28px rgba(184,134,60,0.25)',
        }}
      >
        {/* Microphone icon — always white on coloured bg for contrast */}
        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
    </div>
  );
};

export default MicButton;
