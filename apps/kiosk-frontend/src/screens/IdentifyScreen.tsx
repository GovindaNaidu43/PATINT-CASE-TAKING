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
  const [newPatientAge, setNewPatientAge] = useState('');
  const [newPatientGender, setNewPatientGender] = useState('');
  const [newPatientContact, setNewPatientContact] = useState('');
  const [newPatientBloodGroup, setNewPatientBloodGroup] = useState('');
  const [newPatientOccupation, setNewPatientOccupation] = useState('');
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
                Find local record
              </RoyalButton>
              {lookupError && <p className="mt-4 text-warning text-sm">{lookupError}</p>}
              {lookupError && (
                <div className="mt-4 space-y-3">
                  <input value={newPatientName} onChange={event => setNewPatientName(event.target.value)} placeholder="Patient full name"
                    className="w-full rounded-xl p-4 outline-none transition-all"
                    style={{ background: 'rgba(255,253,248,0.90)', border: '1.5px solid #E8D9BC', color: '#3E2E1E' }}
                    onFocus={e => (e.target.style.borderColor = '#B8863C')}
                    onBlur={e => (e.target.style.borderColor = '#E8D9BC')}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" min="0" max="130" value={newPatientAge} onChange={event => setNewPatientAge(event.target.value)} placeholder="Age"
                      className="w-full rounded-xl p-4 outline-none transition-all"
                      style={{ background: 'rgba(255,253,248,0.90)', border: '1.5px solid #E8D9BC', color: '#3E2E1E' }}
                      onFocus={e => (e.target.style.borderColor = '#B8863C')}
                      onBlur={e => (e.target.style.borderColor = '#E8D9BC')}
                    />
                    <select value={newPatientGender} onChange={event => setNewPatientGender(event.target.value)}
                      className="w-full rounded-xl p-4 outline-none transition-all"
                      style={{ background: 'rgba(255,253,248,0.90)', border: '1.5px solid #E8D9BC', color: '#3E2E1E' }}>
                      <option value="">Gender</option>
                      <option>Female</option><option>Male</option><option>Other</option><option>Prefer not to say</option>
                    </select>
                  </div>
                  <input value={newPatientContact} onChange={event => setNewPatientContact(event.target.value)} placeholder="Contact number (optional)"
                    className="w-full rounded-xl p-4 outline-none transition-all"
                    style={{ background: 'rgba(255,253,248,0.90)', border: '1.5px solid #E8D9BC', color: '#3E2E1E' }}
                    onFocus={e => (e.target.style.borderColor = '#B8863C')}
                    onBlur={e => (e.target.style.borderColor = '#E8D9BC')}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input value={newPatientBloodGroup} onChange={event => setNewPatientBloodGroup(event.target.value)} placeholder="Blood group"
                      className="w-full rounded-xl p-4 outline-none transition-all"
                      style={{ background: 'rgba(255,253,248,0.90)', border: '1.5px solid #E8D9BC', color: '#3E2E1E' }}
                      onFocus={e => (e.target.style.borderColor = '#B8863C')}
                      onBlur={e => (e.target.style.borderColor = '#E8D9BC')}
                    />
                    <input value={newPatientOccupation} onChange={event => setNewPatientOccupation(event.target.value)} placeholder="Occupation"
                      className="w-full rounded-xl p-4 outline-none transition-all"
                      style={{ background: 'rgba(255,253,248,0.90)', border: '1.5px solid #E8D9BC', color: '#3E2E1E' }}
                      onFocus={e => (e.target.style.borderColor = '#B8863C')}
                      onBlur={e => (e.target.style.borderColor = '#E8D9BC')}
                    />
                  </div>
                  <RoyalButton disabled={!newPatientName.trim()} className="w-full" onClick={async () => {
                    const created = await createPatient({ name: newPatientName.trim(), age: newPatientAge ? Number(newPatientAge) : undefined, gender: newPatientGender || undefined, contact: newPatientContact || undefined, blood_group: newPatientBloodGroup || undefined, occupation: newPatientOccupation || undefined, abha_id: manualId, consent_granted: false });
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
                <div className="w-24 h-24 rounded-full border-2 border-royal-gold flex items-center justify-center mb-6"
                     style={{ background: 'rgba(232,217,188,0.40)' }}>
                  <span className="text-4xl">👤</span>
                </div>
                <h3 className="text-3xl font-display text-royal-ivory mb-2">{patient.name}</h3>
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
