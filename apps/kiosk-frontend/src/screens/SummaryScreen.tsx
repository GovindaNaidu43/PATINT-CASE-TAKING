import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RoyalCard from '../components/ui/RoyalCard';
import RoyalButton from '../components/ui/RoyalButton';
import SignalBadge from '../components/ui/SignalBadge';
import LoadingMandala from '../components/ui/LoadingMandala';
import { getConsultation } from '../api/apiClient';

interface Turn {
  text: string;
  modality: string;
  language: string;
  answer_key?: string;
  phase?: string;
  red_flags?: { phrase: string; action: string }[];
}

interface ConsultationData {
  id: string;
  status: string;
  turns: Turn[];
  red_flags: { phrase: string; action: string }[];
  patient: { name: string; age?: number; gender?: string; abha_id?: string };
  consent: { purposes: string[]; language: string; granted_at: string } | null;
}

const SummaryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [consultation, setConsultation] = useState<ConsultationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const consultationId = window.localStorage.getItem('medikiosk.consultationId');
    if (!consultationId) { setLoading(false); setError('No active consultation found.'); return; }
    getConsultation(consultationId)
      .then(data => setConsultation(data as ConsultationData))
      .catch(() => setError('Could not load consultation summary.'))
      .finally(() => setLoading(false));
  }, []);

  // Build a readable chief complaint from the first patient turn
  const patientTurns = consultation?.turns.filter(t => t.answer_key) ?? [];
  const chiefComplaintTurn = patientTurns[0];
  const redFlagCount = consultation?.red_flags?.length ?? 0;

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6">
      <LoadingMandala />
      <p className="text-royal-muted text-lg">Loading consultation summary…</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col items-center p-8 overflow-y-auto custom-scrollbar">
      <h2 className="text-4xl font-display text-royal-gold mb-8">{t('summary.title')}</h2>

      {error && !consultation && (
        <div className="mb-8 px-5 py-3 rounded-xl text-sm"
          style={{ background: 'rgba(167,104,93,0.15)', border: '1px solid #A7685D', color: '#A7685D' }}>
          {error} Showing placeholder summary.
        </div>
      )}

      <div className="w-full max-w-5xl grid grid-cols-2 gap-6 mb-8">

        {/* Chief Complaint */}
        <RoyalCard className="p-6 col-span-2">
          <h3 className="text-sm font-display uppercase tracking-widest mb-2 pb-2 text-royal-muted"
            style={{ borderBottom: '1px solid #E8D9BC' }}>
            Chief Complaint
          </h3>
          <p className="text-lg text-royal-ivory mb-1">
            {chiefComplaintTurn?.text ?? 'Presenting complaint recorded during consultation.'}
          </p>
          <span className="text-xs text-royal-gold px-2 py-1 rounded"
            style={{ background: 'rgba(184,134,60,0.10)' }}>
            Source: dialogue
          </span>
        </RoyalCard>

        {/* Dialogue History */}
        <RoyalCard className="p-6">
          <h3 className="text-sm font-display uppercase tracking-widest mb-2 pb-2 text-royal-muted"
            style={{ borderBottom: '1px solid #E8D9BC' }}>
            History of Present Illness
          </h3>
          {patientTurns.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              {patientTurns.map((turn, i) => (
                <p key={i} className="text-royal-ivory text-sm">
                  <span className="text-royal-muted text-xs mr-2">{turn.answer_key ?? `Q${i + 1}`}:</span>
                  {turn.text}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-royal-ivory">Dialogue history captured during consultation.</p>
          )}
        </RoyalCard>

        {/* Patient Info */}
        <RoyalCard className="p-6">
          <h3 className="text-sm font-display uppercase tracking-widest mb-2 pb-2 text-royal-muted"
            style={{ borderBottom: '1px solid #E8D9BC' }}>
            Patient Information
          </h3>
          {consultation?.patient ? (
            <div className="space-y-1 text-royal-ivory text-sm">
              <p><span className="text-royal-muted">Name:</span> {consultation.patient.name}</p>
              {consultation.patient.age && <p><span className="text-royal-muted">Age:</span> {consultation.patient.age}</p>}
              {consultation.patient.gender && <p><span className="text-royal-muted">Gender:</span> {consultation.patient.gender}</p>}
              {consultation.patient.abha_id && <p><span className="text-royal-muted">ABHA:</span> {consultation.patient.abha_id}</p>}
            </div>
          ) : (
            <p className="text-royal-ivory text-sm">Patient details captured at registration.</p>
          )}
        </RoyalCard>

        {/* Red Flags */}
        {redFlagCount > 0 && (
          <RoyalCard className="p-6 col-span-2" style={{ borderColor: '#A7685D' }}>
            <h3 className="text-sm font-display uppercase tracking-widest mb-2 pb-2"
              style={{ color: '#A7685D', borderBottom: '1px solid rgba(167,104,93,0.30)' }}>
              ⚠ Red Flags Detected ({redFlagCount})
            </h3>
            <div className="flex flex-wrap gap-2">
              {consultation!.red_flags.map((flag, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-sm"
                  style={{ background: 'rgba(167,104,93,0.12)', color: '#A7685D', border: '1px solid rgba(167,104,93,0.25)' }}>
                  {flag.phrase} — {flag.action}
                </span>
              ))}
            </div>
          </RoyalCard>
        )}

        {/* Jihva Signal placeholder */}
        <RoyalCard className="p-6 col-span-2 flex flex-col items-start gap-3">
          <h3 className="text-sm font-display uppercase tracking-widest mb-1 w-full pb-2 text-royal-muted"
            style={{ borderBottom: '1px solid #E8D9BC' }}>
            Jihva Signal
          </h3>
          <SignalBadge />
          <p className="text-royal-ivory text-sm">
            {consultation?.status === 'priority_review'
              ? 'Priority review requested due to red flags.'
              : 'Tongue analysis captured. Physician review pending.'}
          </p>
        </RoyalCard>

        {/* Consent status */}
        {consultation?.consent && (
          <RoyalCard className="p-6 col-span-2">
            <h3 className="text-sm font-display uppercase tracking-widest mb-2 pb-2 text-royal-muted"
              style={{ borderBottom: '1px solid #E8D9BC' }}>
              Consent Record
            </h3>
            <p className="text-royal-ivory text-sm">
              Granted for: <span className="font-semibold">{consultation.consent.purposes.join(', ')}</span>
              <span className="text-royal-muted ml-2 text-xs">({consultation.consent.language.toUpperCase()}) · {new Date(consultation.consent.granted_at).toLocaleString()}</span>
            </p>
          </RoyalCard>
        )}
      </div>

      <div className="px-6 py-4 rounded-xl flex items-center gap-4 mb-8"
        style={{ background: 'rgba(140,163,131,0.15)', border: '1px solid #8CA383', color: '#5A7A55' }}>
        <span className="text-2xl">✓</span>
        <span className="font-bold">{t('summary.sent')}</span>
      </div>

      <RoyalButton size="lg" onClick={() => {
        window.localStorage.removeItem('medikiosk.consultationId');
        navigate('/');
      }} className="w-64">
        {t('summary.done')}
      </RoyalButton>
    </div>
  );
};

export default SummaryScreen;
