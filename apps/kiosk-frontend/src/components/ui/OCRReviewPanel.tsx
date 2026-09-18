import React, { useState } from 'react';
import RoyalCard from './RoyalCard';
import RoyalButton from './RoyalButton';

export interface OCRResult {
  diagnosis: string;
  medications: string[];
  labResults: string[];
  date: string;
  confidence: number;
}

interface Props {
  ocrResult: OCRResult;
  onConfirm: (data: OCRResult) => void;
  onReject: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,253,248,0.95)',
  border: '1.5px solid #E8D9BC',
  borderRadius: '8px',
  padding: '8px 12px',
  color: '#3E2E1E',
  outline: 'none',
  fontSize: '0.95rem',
  transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#8A745A',
  marginBottom: '4px',
};

const OCRReviewPanel: React.FC<Props> = ({ ocrResult, onConfirm, onReject }) => {
  const [data, setData] = useState<OCRResult>(ocrResult);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#B8863C';
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#E8D9BC';
  };

  return (
    <RoyalCard className="w-full max-w-5xl overflow-hidden flex flex-col">
      {/* Warning Banner */}
      <div className="px-4 py-3 flex items-center gap-2 font-bold text-sm"
           style={{ background: 'rgba(201,151,75,0.12)', color: '#8A5C1A',
                    borderBottom: '1px solid rgba(184,134,60,0.20)' }}>
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        ⚠ OCR output requires human review — verify before accepting
      </div>

      <div className="p-6 grid grid-cols-2 gap-8">
        {/* Left: Thumbnail */}
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-royal-gold">Scanned Document</h3>
          <div className="flex-1 rounded-lg flex items-center justify-center min-h-[300px]"
               style={{ background: 'rgba(232,217,188,0.35)', border: '1.5px solid #E8D9BC' }}>
            <svg className="w-16 h-16" style={{ color: '#C4A97A' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        {/* Right: Editable Fields */}
        <div className="flex flex-col gap-4">
          <div>
            <label style={labelStyle}>Diagnosis</label>
            <input type="text" value={data.diagnosis}
              onChange={e => setData({ ...data, diagnosis: e.target.value })}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div>
            <label style={labelStyle}>Medications (comma separated)</label>
            <input type="text" value={data.medications.join(', ')}
              onChange={e => setData({ ...data, medications: e.target.value.split(', ') })}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div>
            <label style={labelStyle}>Lab Results (comma separated)</label>
            <input type="text" value={data.labResults.join(', ')}
              onChange={e => setData({ ...data, labResults: e.target.value.split(', ') })}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div>
            <label style={labelStyle}>Date</label>
            <input type="date" value={data.date}
              onChange={e => setData({ ...data, date: e.target.value })}
              style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 flex justify-end gap-4"
           style={{ background: 'rgba(232,217,188,0.25)', borderTop: '1px solid rgba(184,134,60,0.15)' }}>
        <RoyalButton variant="danger" size="md" onClick={onReject}>Reject</RoyalButton>
        <RoyalButton variant="primary" size="md" onClick={() => onConfirm(data)}>
          Confirm &amp; Accept
        </RoyalButton>
      </div>
    </RoyalCard>
  );
};

export default OCRReviewPanel;
