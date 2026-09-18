import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import QRScanner from '../components/ui/QRScanner';
import RoyalCard from '../components/ui/RoyalCard';
import RoyalButton from '../components/ui/RoyalButton';
import { createConsultation, createPatient, getPatient } from '../api/apiClient';

const IdentifyScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [patient, setPatient] = useState<any>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [manualId, setManualId] = useState('');
  const [newPatientName, setNewPatientName] = useState('');
  const [lookupError, setLookupError] = useState('');

  const handleScan = async (abhaId: string) => {
    try { setPatient(await getPatient(abhaId)); setLookupError(''); }
    catch { setManualId(abhaId); setLookupError('No local record was found. Register the patient below.'); }
  };

  const handleManualSubmit = async () => {
    if (manualId.length > 5) {
      await handleScan(manualId);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="w-full max-w-6xl grid grid-cols-2 gap-16">
        
        {/* Left Column: QR */}
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-display text-royal-gold mb-8">{t('identify.scanHeading')}</h2>
          <QRScanner onScan={handleScan} />
        </div>

        {/* Right Column: Manual / Result */}
        <div className="flex flex-col justify-center border-l border-royal-gold/20 pl-16">
          {!patient ? (
            <div className="w-full max-w-md">
              <h2 className="text-2xl font-display text-gray-300 mb-6">{t('identify.manualHeading')}</h2>
              <input 
                type="text" 
                value={manualId}
                onChange={e => setManualId(e.target.value)}
                placeholder="e.g. 91-XXXX-XXXX-XXXX"
                className="w-full bg-royal-surface border-2 border-royal-gold/40 rounded-xl p-6 text-xl text-white focus:border-royal-gold focus:shadow-gold-glow outline-none transition-all mb-6"
              />
              <RoyalButton variant="secondary" className="w-full" onClick={handleManualSubmit}>
                Find local record
              </RoyalButton>
              {lookupError && <p className="mt-4 text-warning text-sm">{lookupError}</p>}
              {lookupError && (
                <div className="mt-4 space-y-3">
                  <input value={newPatientName} onChange={event => setNewPatientName(event.target.value)} placeholder="Patient full name" className="w-full bg-royal-surface border border-royal-gold/40 rounded-xl p-4 text-white" />
                  <RoyalButton disabled={!newPatientName.trim()} className="w-full" onClick={async () => {
                    const created = await createPatient({ name: newPatientName.trim(), abha_id: manualId, consent_granted: false });
                    setPatient({ ...created, abha_id: manualId }); setLookupError('');
                  }}>Register patient locally</RoyalButton>
                </div>
              )}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <RoyalCard className="p-8 flex flex-col items-center text-center" glowing>
                <div className="w-24 h-24 bg-royal-bg rounded-full border-2 border-royal-gold flex items-center justify-center mb-6">
                  <span className="text-4xl">👤</span>
                </div>
                <h3 className="text-3xl font-display text-white mb-2">{patient.name}</h3>
                <p className="text-royal-gold font-mono text-lg mb-10">ABHA: {patient.abha_id || 'Not linked'}</p>
                
                <RoyalButton size="lg" className="w-full" disabled={isStarting} onClick={async () => {
                  setIsStarting(true);
                  try {
                    const consultation = await createConsultation(patient.id);
                    window.localStorage.setItem('medikiosk.consultationId', consultation.id);
                    navigate('/consent');
                  } finally {
                    setIsStarting(false);
                  }
                }}>
                  {t('identify.continue')}
                </RoyalButton>
              </RoyalCard>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
};

export default IdentifyScreen;
