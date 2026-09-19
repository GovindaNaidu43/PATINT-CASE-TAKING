import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RoyalCard from '../components/ui/RoyalCard';
import RoyalButton from '../components/ui/RoyalButton';
import { useTTS } from '../voice/useTTS';
import { grantConsent } from '../api/apiClient';

const ConsentScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { speak, isSpeaking } = useTTS();

  const [consents, setConsents] = useState([false, false, false, false]);
  const [submitting, setSubmitting] = useState(false);

  const toggleConsent = (index: number) => {
    const newConsents = [...consents];
    newConsents[index] = !newConsents[index];
    setConsents(newConsents);
  };

  const items = [
    { id: 'item1', icon: '🎙️', title: t('consent.item1.title'), desc: t('consent.item1.desc') },
    { id: 'item2', icon: '📊', title: t('consent.item2.title'), desc: t('consent.item2.desc') },
    { id: 'item3', icon: '👅', title: t('consent.item3.title'), desc: t('consent.item3.desc') },
    { id: 'item4', icon: '☁️', title: t('consent.item4.title'), desc: t('consent.item4.desc') },
  ];

  const allAccepted = consents.every(Boolean);

  return (
    <div className="flex-1 flex flex-col items-center p-8 overflow-y-auto custom-scrollbar">
      <h2 className="text-4xl font-display text-royal-gold mb-8 mt-4">
        {t('consent.title')}
      </h2>

      <div className="w-full max-w-4xl grid grid-cols-2 gap-6 mb-10">
        {items.map((item, idx) => (
          <RoyalCard key={idx} className="p-6 flex flex-col justify-between" glowing={consents[idx]}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{item.icon}</span>
                <button
                  onClick={() => speak(item.desc)}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    background: isSpeaking ? 'rgba(201,151,75,0.15)' : 'rgba(232,217,188,0.5)',
                    color: isSpeaking ? '#B8863C' : '#A89070',
                  }}
                >
                  🔊
                </button>
              </div>
              <h3 className="text-xl font-bold font-display text-royal-ivory mb-2">
                {item.title}
              </h3>
              <p className="text-royal-muted text-sm mb-6">{item.desc}</p>
            </div>

            <button
              onClick={() => toggleConsent(idx)}
              className="w-full py-3 rounded-lg border-2 font-bold uppercase tracking-wider transition-all"
              style={{
                background: consents[idx] ? 'rgba(140,163,131,0.15)' : 'transparent',
                borderColor: consents[idx] ? '#8CA383' : '#D4C4A8',
                color: consents[idx] ? '#8CA383' : '#A89070',
              }}
            >
              {consents[idx] ? 'Accepted ✓' : 'Accept'}
            </button>
          </RoyalCard>
        ))}
      </div>

      <div className="text-center w-full max-w-4xl">
        <p className="text-royal-muted text-sm mb-6">{t('consent.note')}</p>
        <RoyalButton
          size="lg"
          onClick={async () => {
            const consultationId = window.localStorage.getItem('medikiosk.consultationId');
            if (!consultationId) return navigate('/identify');
            setSubmitting(true);
            try {
              await grantConsent(consultationId, 'en', ['care', 'voice_biomarker', 'jihva_image', 'followup']);
              navigate('/converse');
            } finally { setSubmitting(false); }
          }}
          disabled={!allAccepted || submitting}
          className="w-full max-w-md mx-auto"
        >
          {t('consent.proceed')}
        </RoyalButton>
      </div>
    </div>
  );
};

export default ConsentScreen;
