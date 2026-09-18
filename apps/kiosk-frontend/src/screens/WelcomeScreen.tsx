import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import RoyalButton from '../components/ui/RoyalButton';
import LoadingMandala from '../components/ui/LoadingMandala';
import { useTranslation } from 'react-i18next';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center text-center z-10"
      >
        <div className="mb-12">
          <LoadingMandala size={160} />
        </div>
        
        <h1 className="text-7xl font-bold font-display bg-gradient-to-r from-royal-gold via-[#FFF2C8] to-royal-gold bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(201,168,76,0.3)] mb-6">
          {t('welcome.title')}
        </h1>
        
        <p className="text-2xl text-royal-ivory font-display tracking-widest uppercase mb-20 opacity-80">
          {t('welcome.subtitle')}
        </p>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <RoyalButton 
            size="lg" 
            onClick={() => navigate('/identify')}
            className="!px-16 !py-6 text-2xl"
          >
            {t('welcome.cta')}
          </RoyalButton>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-12 text-sm text-gray-500 font-display tracking-widest uppercase">
        {t('welcome.footer')}
      </div>
    </div>
  );
};

export default WelcomeScreen;
