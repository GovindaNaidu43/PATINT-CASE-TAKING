import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RoyalButton from '../components/ui/RoyalButton';
import RoyalCard from '../components/ui/RoyalCard';
import LoadingMandala from '../components/ui/LoadingMandala';
import { ingestDocument } from '../api/apiClient';
import { mockOCRResult } from '../api/mockOCR';

interface Entity { text: string; label: string; }
interface OCRData { text: string; entities: Entity[]; filename?: string; }

const ScanScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ocrData, setOcrData] = useState<OCRData | null>(null);
  const [demoResult, setDemoResult] = useState(false);
  const consultationId = window.localStorage.getItem('medikiosk.consultationId');

  const loadDemoDocument = () => {
    setError('Showing a demo extraction for presentation.');
    setDemoResult(true);
    setOcrData({
      text: `${mockOCRResult.diagnosis}\n${mockOCRResult.medications.join('\n')}\n${mockOCRResult.labResults.join('\n')}`,
      entities: [
        { text: 'Metformin 500mg', label: 'MEDICATION' },
        { text: 'Amlodipine 5mg', label: 'MEDICATION' },
        { text: 'HbA1c 8.2%', label: 'LAB_RESULT' },
        { text: 'BP 148/92 mmHg', label: 'VITAL' },
      ],
      filename: 'demo-prescription.pdf',
    });
  };

  const handleFile = async (file: File) => {
    setLoading(true);
    setError('');
    try {
      const consultationId = window.localStorage.getItem('medikiosk.consultationId');
      if (!consultationId) {
        setError('Start a consultation before uploading a document.');
        return;
      }
      const result = await ingestDocument(file, consultationId);
      setOcrData({ ...(result as OCRData), filename: file.name });
    } catch {
      loadDemoDocument();
      setOcrData(previous => previous ? { ...previous, filename: file.name } : previous);
      setError('Live OCR is unavailable. Showing a demo extraction for presentation.');
    } finally {
      setLoading(false);
    }
  };

  if (!consultationId) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-xl rounded-3xl border p-8 text-center" style={{ borderColor: 'rgba(184,134,60,0.30)', background: 'rgba(255,253,248,0.82)' }}>
          <h2 className="text-3xl font-display text-royal-gold mb-4">Scan document</h2>
          <p className="text-royal-muted mb-6">No consultation is active yet. Start a demo consultation to continue with document upload.</p>
          <RoyalButton type="button" size="lg" onClick={() => navigate('/identify')} className="w-full max-w-xs mx-auto">
            Go to identify
          </RoyalButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center p-8 overflow-y-auto">
      <h2 className="text-3xl font-display text-royal-gold mb-8">{t('scan.title')}</h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-6">
          <LoadingMandala />
          <p className="text-royal-muted text-lg">Extracting text from document…</p>
        </div>
      ) : !ocrData ? (
        <div className="w-full max-w-3xl flex flex-col items-center">
          <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) void handleFile(f); }} />
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload clinical document or report"
            className="w-full h-80 rounded-2xl flex flex-col items-center justify-center mb-8 cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8863C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF5EB]"
            style={{ border: '4px dashed rgba(184,134,60,0.35)', background: 'rgba(255,253,248,0.60)' }}
            onClick={() => fileRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                fileRef.current?.click();
              }
            }}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) void handleFile(f); }}
            onDragOver={e => e.preventDefault()}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#B8863C'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,253,248,0.85)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,134,60,0.35)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,253,248,0.60)'; }}
          >
            <span className="text-6xl mb-4">📄</span>
            <p className="text-xl font-bold text-royal-ivory mb-2">Tap to Upload or Drag Document</p>
            <p className="text-royal-muted">Prescriptions · Lab reports · Case sheets</p>
          </div>
          <RoyalButton type="button" variant="secondary" onClick={loadDemoDocument}>
            Use demo document
          </RoyalButton>
          {error && (
            <div className="mb-6 px-5 py-3 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(167,104,93,0.15)', border: '1px solid #A7685D', color: '#A7685D' }}>
              {error}
            </div>
          )}
          <RoyalButton type="button" aria-label="Skip document upload and continue to Jihva screen" variant="secondary" onClick={() => navigate('/jihva')}>Skip for now</RoyalButton>
        </div>
      ) : (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="text-royal-muted text-sm">Document: <span className="font-semibold text-royal-ivory">{ocrData.filename}</span>{demoResult && <span className="ml-2 text-royal-gold">(demo extraction)</span>}</p>
            <button onClick={() => setOcrData(null)} className="text-xs text-royal-muted underline hover:text-royal-ivory">Upload different</button>
          </div>
          <RoyalCard className="p-6">
            <h3 className="text-sm font-display uppercase tracking-widest text-royal-muted mb-3 pb-2" style={{ borderBottom: '1px solid #E8D9BC' }}>Extracted Text (OCR)</h3>
            <p className="text-royal-ivory text-sm leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
              {ocrData.text || 'No text detected.'}
            </p>
          </RoyalCard>
          {ocrData.entities && ocrData.entities.length > 0 && (
            <RoyalCard className="p-6">
              <h3 className="text-sm font-display uppercase tracking-widest text-royal-muted mb-3 pb-2" style={{ borderBottom: '1px solid #E8D9BC' }}>Identified Medical Entities</h3>
              <div className="flex flex-wrap gap-2">
                {ocrData.entities.map((entity, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ background: 'rgba(184,134,60,0.10)', color: '#B8863C', border: '1px solid rgba(184,134,60,0.25)' }}>
                    <span className="opacity-60 text-xs mr-1">{entity.label}</span>{entity.text}
                  </span>
                ))}
              </div>
            </RoyalCard>
          )}
          <div className="flex gap-4 justify-center">
            <RoyalButton variant="secondary" onClick={() => setOcrData(null)}>Rescan</RoyalButton>
            <RoyalButton size="lg" onClick={() => navigate('/jihva')}>Confirm &amp; Continue →</RoyalButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanScreen;
