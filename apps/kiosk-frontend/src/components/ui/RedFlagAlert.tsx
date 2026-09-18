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
            <div key={i} className="bg-royal-crimson/90 backdrop-blur-sm border border-red-400 text-white p-4 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.5)]">
              <div className="flex items-start gap-3">
                <span className="text-2xl animate-pulse">⚠</span>
                <div>
                  <h4 className="font-bold font-display uppercase tracking-wider text-sm mb-1">Priority Alert</h4>
                  <p className="text-sm">{flag}</p>
                  <p className="text-xs text-red-200 mt-2 italic">Notifying staff...</p>
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
