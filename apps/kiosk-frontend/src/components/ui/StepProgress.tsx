import React from 'react';

interface Props {
  currentStep: number;
}

const steps = ['Identify', 'Consent', 'Converse', 'Scan', 'Jihva', 'Summary'];

const StepProgress: React.FC<Props> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-4xl">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isPast = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;
        
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isPast ? 'bg-royal-gold border-royal-gold text-royal-bg' : isCurrent ? 'bg-transparent border-royal-gold text-royal-gold shadow-gold-glow' : 'bg-transparent border-gray-600 text-gray-600'}`}>
                <span className="font-bold text-sm font-display">{stepNum}</span>
              </div>
              <span className={`text-xs uppercase tracking-wider font-display ${isCurrent || isPast ? 'text-royal-gold' : 'text-gray-500'}`}>{step}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-[2px] mx-4 ${isPast ? 'bg-royal-gold' : 'bg-gray-700'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepProgress;
