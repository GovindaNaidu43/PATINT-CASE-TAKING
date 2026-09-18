import React from 'react';
import { useLocation } from 'react-router-dom';
import StepProgress from '../components/ui/StepProgress';

const routesToSteps: Record<string, number> = {
  '/identify': 1,
  '/consent': 2,
  '/converse': 3,
  '/scan': 4,
  '/jihva': 5,
  '/summary': 6,
};

const KioskLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isWelcome = location.pathname === '/';
  const currentStep = routesToSteps[location.pathname] || 0;
  
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="h-screen w-screen bg-royal-bg text-royal-ivory overflow-hidden flex flex-col relative font-sans">
      {/* Decorative Mandalas */}
      <div className="absolute top-0 left-0 w-64 h-64 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-royal-gold">
           <circle cx="50" cy="50" r="40" strokeWidth="2" stroke="currentColor" fill="none"/>
           <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10 pointer-events-none transform rotate-45">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-royal-gold">
           <circle cx="50" cy="50" r="40" strokeWidth="2" stroke="currentColor" fill="none"/>
           <path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>

      {/* Top Bar */}
      {!isWelcome && (
        <header className="h-16 flex items-center justify-between px-8 border-b border-royal-gold/20 bg-royal-surface/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-royal-gold" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C9 5 5 8 5 13C5 17 8 21 12 22C16 21 19 17 19 13C19 8 15 5 12 2Z" opacity="0.8"/>
            </svg>
            <span className="font-display font-bold text-xl tracking-wider text-royal-gold">MediKiosk</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm opacity-80">Ministry of AYUSH</span>
            <span className="text-royal-gold font-bold font-display">{time}</span>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden z-10 relative flex flex-col">
        {children}
      </main>

      {/* Bottom Bar (Progress) */}
      {!isWelcome && (
        <footer className="h-20 border-t border-royal-gold/20 bg-royal-surface/80 backdrop-blur-md z-10 flex items-center justify-center px-8">
          <StepProgress currentStep={currentStep} />
        </footer>
      )}
    </div>
  );
};

export default KioskLayout;
