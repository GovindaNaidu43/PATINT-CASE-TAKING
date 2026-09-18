import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SignalBadge from '../components/ui/SignalBadge';
import RoyalButton from '../components/ui/RoyalButton';
import RoyalCard from '../components/ui/RoyalCard';

const JihvaScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [captured, setCaptured] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center p-8 relative">
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <SignalBadge label="Jihva Pariksha" />
      </div>

      <h2 className="text-3xl font-display text-royal-gold mb-12 mt-16">
        {t('jihva.title')}
      </h2>

      {!captured ? (
        <div className="flex flex-col items-center">
          <div
            className="relative w-[600px] h-[400px] rounded-2xl overflow-hidden mb-8"
            style={{
              background: 'rgba(62,46,30,0.90)',
              border: '2px solid rgba(184,134,60,0.30)',
            }}
          >
            {/* Guide overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-[200px] h-[250px] border-4 border-dashed rounded-full opacity-60"
                style={{ borderColor: '#8CA383' }}
              />
            </div>
            <div className="absolute bottom-4 left-0 w-full text-center py-2"
                 style={{ color: 'rgba(255,253,248,0.80)', background: 'rgba(62,46,30,0.60)' }}>
              {t('jihva.hint')}
            </div>
          </div>

          <RoyalButton size="lg" onClick={() => setCaptured(true)} className="w-64">
            {t('jihva.capture')}
          </RoyalButton>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-4xl">
          <div className="grid grid-cols-2 gap-8 w-full mb-8">
            <div
              className="w-full aspect-video rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(62,46,30,0.85)',
                border: '1px solid rgba(184,134,60,0.30)',
              }}
            >
              <span className="text-4xl" style={{ color: 'rgba(255,253,248,0.80)' }}>
                👅 Image Captured
              </span>
            </div>

            <RoyalCard className="p-6 flex flex-col justify-center">
              <h3 className="text-xl font-display text-royal-gold mb-4">Signal Detected</h3>
              <p className="text-lg text-royal-ivory mb-2">Mild white coating noted.</p>
              <p className="font-bold mb-4" style={{ color: '#8CA383' }}>
                Suggestive of Kapha tendency.
              </p>
              <p className="text-xs italic text-royal-muted">
                This is an AI-generated signal for physician review, not a final diagnosis.
              </p>
            </RoyalCard>
          </div>

          <RoyalButton size="lg" onClick={() => navigate('/summary')} className="w-64">
            {t('jihva.continue')}
          </RoyalButton>
        </div>
      )}
    </div>
  );
};

export default JihvaScreen;
