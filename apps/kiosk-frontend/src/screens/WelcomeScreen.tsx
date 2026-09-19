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

        <h1 className="text-7xl font-bold font-display mb-6"
            style={{
              background: 'linear-gradient(135deg, #8A5C1A 0%, #C9974B 50%, #8A5C1A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 12px rgba(184,134,60,0.20))',
            }}>
          {t('welcome.title')}
        </h1>

        <p className="text-2xl font-display tracking-widest uppercase mb-20"
           style={{ color: '#8A745A' }}>
          {t('welcome.subtitle')}
        </p>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
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

      <div className="absolute bottom-12 text-sm font-display tracking-widest uppercase"
           style={{ color: '#B8A090' }}>
        {t('welcome.footer')}
        <button className="ml-4 text-royal-gold/70 hover:text-royal-gold normal-case tracking-normal" onClick={() => navigate('/diagnostics')}>
          Diagnostics
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
