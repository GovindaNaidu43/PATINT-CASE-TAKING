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

const OCRReviewPanel: React.FC<Props> = ({ ocrResult, onConfirm, onReject }) => {
  const [data, setData] = useState<OCRResult>(ocrResult);

  return (
    <RoyalCard className="w-full max-w-5xl overflow-hidden flex flex-col">
      <div className="bg-warning/20 text-warning px-4 py-3 flex items-center gap-2 font-bold text-sm">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        ⚠ OCR output requires human review — verify before accepting
      </div>
      
      <div className="p-6 grid grid-cols-2 gap-8">
        {/* Left: Thumbnail */}
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-royal-gold">Scanned Document</h3>
          <div className="flex-1 bg-black/40 rounded-lg border border-gray-700 flex items-center justify-center min-h-[300px]">
            <svg className="w-16 h-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        {/* Right: Editable Fields */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Diagnosis</label>
            <input type="text" value={data.diagnosis} onChange={e => setData({...data, diagnosis: e.target.value})} className="w-full bg-royal-bg border border-royal-gold/30 rounded p-2 text-white focus:border-royal-gold outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Medications (comma separated)</label>
            <input type="text" value={data.medications.join(', ')} onChange={e => setData({...data, medications: e.target.value.split(', ')})} className="w-full bg-royal-bg border border-royal-gold/30 rounded p-2 text-white focus:border-royal-gold outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Lab Results (comma separated)</label>
            <input type="text" value={data.labResults.join(', ')} onChange={e => setData({...data, labResults: e.target.value.split(', ')})} className="w-full bg-royal-bg border border-royal-gold/30 rounded p-2 text-white focus:border-royal-gold outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Date</label>
            <input type="date" value={data.date} onChange={e => setData({...data, date: e.target.value})} className="w-full bg-royal-bg border border-royal-gold/30 rounded p-2 text-white focus:border-royal-gold outline-none" />
          </div>
        </div>
      </div>

      <div className="p-4 bg-black/20 border-t border-royal-gold/10 flex justify-end gap-4">
        <RoyalButton variant="danger" size="md" onClick={onReject}>Reject</RoyalButton>
        <RoyalButton variant="primary" size="md" onClick={() => onConfirm(data)} className="!bg-success hover:!bg-success/80 !text-white !shadow-[0_0_15px_rgba(34,197,94,0.4)] border-none">Confirm & Accept</RoyalButton>
      </div>
    </RoyalCard>
  );
};

export default OCRReviewPanel;
