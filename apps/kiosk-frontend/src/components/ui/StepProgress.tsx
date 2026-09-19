import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  currentStep: number;
}

const steps = [
  { label: 'Identify', route: '/identify' },
  { label: 'Consent', route: '/consent' },
  { label: 'Converse', route: '/converse' },
  { label: 'Scan', route: '/scan' },
  { label: 'Jihva', route: '/jihva' },
  { label: 'Summary', route: '/summary' },
];

const StepProgress: React.FC<Props> = ({ currentStep }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between w-full max-w-4xl" aria-label="Kiosk progress">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isPast = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <React.Fragment key={step.label}>
            <button
              type="button"
              aria-label={`Go to ${step.label} step`}
              aria-current={isCurrent ? 'step' : undefined}
              onClick={() => navigate(step.route)}
              className="flex flex-col items-center gap-2 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8863C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF5EB]"
              style={{ opacity: 1 }}
            >
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
                {step.label}
              </span>
            </button>
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
