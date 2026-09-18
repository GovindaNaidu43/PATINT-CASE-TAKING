import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import QRScanner from '../components/ui/QRScanner';
import RoyalCard from '../components/ui/RoyalCard';
import RoyalButton from '../components/ui/RoyalButton';
import { getPatient } from '../api/apiClient';

const IdentifyScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [patient, setPatient] = useState<any>(null);
  const [manualId, setManualId] = useState('');

  const handleScan = async (abhaId: string) => {
    const data = await getPatient(abhaId);
    setPatient(data);
  };

  const handleManualSubmit = async () => {
    if (manualId.length > 5) {
      const data = await getPatient(manualId);
      setPatient(data);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="w-full max-w-6xl grid grid-cols-2 gap-16">

        {/* Left Column: QR */}
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-display text-royal-gold mb-8">
            {t('identify.scanHeading')}
          </h2>
          <QRScanner onScan={handleScan} />
        </div>

        {/* Right Column: Manual / Result */}
        <div className="flex flex-col justify-center pl-16"
             style={{ borderLeft: '1px solid rgba(184,134,60,0.20)' }}>
          {!patient ? (
            <div className="w-full max-w-md">
              <h2 className="text-2xl font-display text-royal-muted mb-6">
                {t('identify.manualHeading')}
              </h2>
              <input
                type="text"
                value={manualId}
                onChange={e => setManualId(e.target.value)}
                placeholder="e.g. 91-XXXX-XXXX-XXXX"
                className="w-full rounded-xl p-6 text-xl outline-none transition-all mb-6"
                style={{
                  background: 'rgba(255,253,248,0.90)',
                  border: '2px solid #E8D9BC',
                  color: '#3E2E1E',
                }}
                onFocus={e => (e.target.style.borderColor = '#B8863C')}
                onBlur={e => (e.target.style.borderColor = '#E8D9BC')}
              />
              <RoyalButton variant="secondary" className="w-full" onClick={handleManualSubmit}>
                Fetch via ABHA / OTP
              </RoyalButton>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <RoyalCard className="p-8 flex flex-col items-center text-center" glowing>
                <div className="w-24 h-24 rounded-full border-2 border-royal-gold flex items-center justify-center mb-6"
                     style={{ background: 'rgba(232,217,188,0.40)' }}>
                  <span className="text-4xl">👤</span>
                </div>
                <h3 className="text-3xl font-display text-royal-ivory mb-2">{patient.name}</h3>
                <p className="text-royal-gold font-mono text-lg mb-4">ABHA: {patient.abhaId}</p>
                <p className="text-royal-muted mb-10">
                  {patient.age} years • {patient.gender === 'M' ? 'Male' : 'Female'}
                </p>
                <RoyalButton size="lg" className="w-full" onClick={() => navigate('/consent')}>
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
