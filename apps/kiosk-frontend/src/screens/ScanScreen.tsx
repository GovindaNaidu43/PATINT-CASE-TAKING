import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RoyalButton from '../components/ui/RoyalButton';
import RoyalCard from '../components/ui/RoyalCard';
import LoadingMandala from '../components/ui/LoadingMandala';
import { ingestDocument } from '../api/apiClient';

interface Entity { text: string; label: string; }
interface OCRData { text: string; entities: Entity[]; filename?: string; }

const ScanScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ocrData, setOcrData] = useState<OCRData | null>(null);

  const handleFile = async (file: File) => {
    setLoading(true);
    setError('');
    try {
      const result = await ingestDocument(file);
      setOcrData({ ...(result as OCRData), filename: file.name });
    } catch {
      setError('Could not process the document. Please try again or skip.');
    } finally {
      setLoading(false);
    }
  };

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
            className="w-full h-80 rounded-2xl flex flex-col items-center justify-center mb-8 cursor-pointer transition-all"
            style={{ border: '4px dashed rgba(184,134,60,0.35)', background: 'rgba(255,253,248,0.60)' }}
            onClick={() => fileRef.current?.click()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) void handleFile(f); }}
            onDragOver={e => e.preventDefault()}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#B8863C'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,253,248,0.85)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,134,60,0.35)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,253,248,0.60)'; }}
          >
            <span className="text-6xl mb-4">📄</span>
            <p className="text-xl font-bold text-royal-ivory mb-2">Tap to Upload or Drag Document</p>
            <p className="text-royal-muted">Prescriptions · Lab reports · Case sheets</p>
          </div>
          {error && (
            <div className="mb-6 px-5 py-3 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(167,104,93,0.15)', border: '1px solid #A7685D', color: '#A7685D' }}>
              {error}
            </div>
          )}
          <RoyalButton variant="secondary" onClick={() => navigate('/jihva')}>Skip for now</RoyalButton>
        </div>
      ) : (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="text-royal-muted text-sm">Document: <span className="font-semibold text-royal-ivory">{ocrData.filename}</span></p>
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
