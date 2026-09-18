import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OCRReviewPanel, { OCRResult } from '../components/ui/OCRReviewPanel';
import RoyalButton from '../components/ui/RoyalButton';
import { mockOCRResult } from '../api/mockOCR';

const ScanScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [scanned, setScanned] = useState(false);
  const [ocrData, setOcrData] = useState<OCRResult | null>(null);

  const handleSimulateUpload = () => {
    // Simulate upload delay
    setTimeout(() => {
      setOcrData(mockOCRResult);
      setScanned(true);
    }, 1500);
  };

  const handleConfirm = (data: OCRResult) => {
    console.log('Confirmed OCR:', data);
    navigate('/jihva');
  };

  const handleReject = () => {
    setScanned(false);
    setOcrData(null);
  };

  return (
    <div className="flex-1 flex flex-col items-center p-8 overflow-y-auto">
      <h2 className="text-3xl font-display text-royal-gold mb-8">{t('scan.title')}</h2>
      
      {!scanned ? (
        <div className="w-full max-w-3xl flex flex-col items-center">
          <div 
            className="w-full h-80 border-4 border-dashed border-royal-gold/30 rounded-2xl flex flex-col items-center justify-center bg-royal-surface/50 mb-8 cursor-pointer hover:border-royal-gold hover:bg-royal-surface transition-all"
            onClick={handleSimulateUpload}
          >
            <span className="text-6xl mb-4">📄</span>
            <p className="text-xl font-bold mb-2">Tap to Capture Document</p>
            <p className="text-gray-400">or place on scanner</p>
          </div>
          
          <RoyalButton variant="secondary" onClick={() => navigate('/jihva')}>
            Skip for now
          </RoyalButton>
        </div>
      ) : (
        ocrData && (
          <OCRReviewPanel 
            ocrResult={ocrData} 
            onConfirm={handleConfirm} 
            onReject={handleReject} 
          />
        )
      )}
    </div>
  );
};

export default ScanScreen;
