import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import StepProgress from '../components/ui/StepProgress';
import MandalaBackground from '../components/ui/MandalaBackground';

const routesToSteps: Record<string, number> = {
  '/identify': 1,
  '/consent':  2,
  '/converse': 3,
  '/scan':     4,
  '/jihva':    5,
  '/summary':  6,
};

const KioskLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location  = useLocation();
  const isWelcome = location.pathname === '/';
  const currentStep = routesToSteps[location.pathname] || 0;

  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col relative font-sans"
         style={{ background: 'transparent' }}>

      {/* ── Animated mandala watercolor background ── */}
      <MandalaBackground />

      {/* ── Top Bar ── */}
      {!isWelcome && (
        <header className="h-16 flex items-center justify-between px-8 z-10 relative"
                style={{
                  background: 'rgba(255,253,248,0.80)',
                  backdropFilter: 'blur(14px)',
                  borderBottom: '1px solid rgba(184,134,60,0.20)',
                }}>
          <div className="flex items-center gap-3">
            {/* Lotus icon */}
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C10 7 6 9 6 14C6 18 8.5 21 12 22C15.5 21 18 18 18 14C18 9 14 7 12 3Z"
                    fill="#B8863C" opacity="0.85"/>
              <path d="M12 14C11 12 8 11 6 14" stroke="#B8863C" strokeWidth="1.2" fill="none"/>
              <path d="M12 14C13 12 16 11 18 14" stroke="#B8863C" strokeWidth="1.2" fill="none"/>
            </svg>
            <span className="font-display font-bold text-xl tracking-wider text-royal-gold">
              MediKiosk
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/diagnostics"
              className="text-xs font-semibold px-3 py-1 rounded-full border border-royal-border text-royal-muted hover:text-royal-gold transition-colors"
            >
              Diagnostics
            </Link>
            <a
              href="http://localhost:3000/dashboard"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex text-xs font-semibold px-3 py-1 rounded-full border border-royal-border text-royal-gold hover:bg-[#F0DEC0]/50 transition-colors"
            >
              Doctor Portal ↗
            </a>
            <span className="text-sm text-royal-muted">Ministry of AYUSH</span>
            <span className="text-royal-gold font-bold font-display">{time}</span>
          </div>
        </header>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-hidden z-10 relative flex flex-col">
        {children}
      </main>

      {/* ── Bottom Progress Bar ── */}
      {!isWelcome && (
        <footer className="h-20 z-10 relative flex items-center justify-center px-8"
                style={{
                  background: 'rgba(255,253,248,0.80)',
                  backdropFilter: 'blur(14px)',
                  borderTop: '1px solid rgba(184,134,60,0.20)',
                }}>
          <StepProgress currentStep={currentStep} />
        </footer>
      )}
    </div>
  );
};

export default KioskLayout;
