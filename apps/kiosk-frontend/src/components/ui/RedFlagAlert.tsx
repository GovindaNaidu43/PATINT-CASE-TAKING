import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  flags: string[];
}

const RedFlagAlert: React.FC<Props> = ({ flags }) => {
  return (
    <AnimatePresence>
      {flags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="absolute top-20 right-8 z-50 flex flex-col gap-2 max-w-sm"
        >
          {flags.map((flag, i) => (
            <div
              key={i}
              className="backdrop-blur-sm p-4 rounded-lg"
              style={{
                background: 'rgba(167,104,93,0.92)',
                border: '1px solid rgba(220,100,80,0.60)',
                boxShadow: '0 0 20px rgba(167,104,93,0.40)',
                color: '#fff',
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl animate-pulse">⚠</span>
                <div>
                  <h4 className="font-bold font-display uppercase tracking-wider text-sm mb-1">
                    Priority Alert
                  </h4>
                  <p className="text-sm">{flag}</p>
                  <p className="text-xs mt-2 italic" style={{ color: 'rgba(255,220,210,0.85)' }}>
                    Notifying staff...
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RedFlagAlert;
