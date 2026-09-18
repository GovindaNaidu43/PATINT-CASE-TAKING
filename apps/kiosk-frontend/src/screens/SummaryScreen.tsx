import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RoyalCard from '../components/ui/RoyalCard';
import RoyalButton from '../components/ui/RoyalButton';
import SignalBadge from '../components/ui/SignalBadge';
import { mockSummary } from '../api/mockSummary';

const SummaryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center p-8 overflow-y-auto custom-scrollbar">
      <h2 className="text-4xl font-display text-royal-gold mb-8">{t('summary.title')}</h2>
      
      <div className="w-full max-w-5xl grid grid-cols-2 gap-6 mb-8">
        
        <RoyalCard className="p-6 col-span-2">
          <h3 className="text-sm font-display text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-800 pb-2">Chief Complaint</h3>
          <p className="text-lg text-white mb-1">{mockSummary.chiefComplaint.text}</p>
          <span className="text-xs text-royal-gold bg-royal-gold/10 px-2 py-1 rounded">Source: {mockSummary.chiefComplaint.sourceId}</span>
        </RoyalCard>

        <RoyalCard className="p-6">
          <h3 className="text-sm font-display text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-800 pb-2">History of Present Illness</h3>
          <p className="text-white mb-2">{mockSummary.historyOfPresentIllness.text}</p>
        </RoyalCard>

        <RoyalCard className="p-6">
          <h3 className="text-sm font-display text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-800 pb-2">Medical Records (OCR)</h3>
          <p className="text-white mb-2">{mockSummary.medicalBackground.text}</p>
        </RoyalCard>

        <RoyalCard className="p-6 col-span-2 flex flex-col items-start gap-3">
          <h3 className="text-sm font-display text-gray-500 uppercase tracking-widest mb-1 border-b border-gray-800 w-full pb-2">Jihva Signal</h3>
          <SignalBadge />
          <p className="text-white">{mockSummary.jihvaSignal.text}</p>
        </RoyalCard>

      </div>

      <div className="bg-success/20 border border-success text-success px-6 py-4 rounded-xl flex items-center gap-4 mb-8">
        <span className="text-2xl">✓</span>
        <span className="font-bold">{t('summary.sent')}</span>
      </div>

      <RoyalButton size="lg" onClick={() => navigate('/')} className="w-64">
        {t('summary.done')}
      </RoyalButton>
    </div>
  );
};

export default SummaryScreen;
