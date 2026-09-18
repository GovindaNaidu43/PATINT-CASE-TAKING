import React from 'react';

interface Props {
  currentStep: number;
}

const steps = ['Identify', 'Consent', 'Converse', 'Scan', 'Jihva', 'Summary'];

const StepProgress: React.FC<Props> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-4xl">
      {steps.map((step, index) => {
        const stepNum  = index + 1;
        const isPast   = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                style={{
                  background: isPast
                    ? 'linear-gradient(135deg, #C9974B, #B8863C)'
                    : isCurrent
                    ? 'rgba(201,151,75,0.12)'
                    : 'rgba(232,217,188,0.40)',
                  borderColor: isPast || isCurrent ? '#B8863C' : '#D4C4A8',
                  boxShadow: isCurrent ? '0 0 0 3px rgba(184,134,60,0.20)' : 'none',
                }}
              >
                <span
                  className="font-bold text-sm font-display"
                  style={{ color: isPast ? '#fff' : isCurrent ? '#B8863C' : '#A89070' }}
                >
                  {stepNum}
                </span>
              </div>
              <span
                className="text-xs uppercase tracking-wider font-display"
                style={{ color: isPast || isCurrent ? '#B8863C' : '#A89070' }}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className="flex-1 h-[2px] mx-4 rounded-full"
                style={{ background: isPast ? 'linear-gradient(90deg,#C9974B,#B8863C)' : '#E8D9BC' }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepProgress;
