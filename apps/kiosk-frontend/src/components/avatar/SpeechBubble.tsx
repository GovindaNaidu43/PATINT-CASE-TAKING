import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  text: string;
  isTyping: boolean;
}

const SpeechBubble: React.FC<Props> = ({ text, isTyping }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(text);
      return;
    }
    
    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [text, isTyping]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10 }}
        className="relative bg-royal-surface border-2 border-royal-gold/60 p-6 rounded-2xl shadow-gold-glow max-w-md mx-auto mt-4"
      >
        {/* Triangle pointer to avatar */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-b-[16px] border-b-royal-gold/60 border-r-[12px] border-r-transparent" />
        <div className="absolute -top-[13px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-b-[14px] border-b-royal-surface border-r-[10px] border-r-transparent" />
        
        <p className="text-xl font-sans text-royal-ivory leading-relaxed text-center min-h-[60px] flex items-center justify-center">
          {displayedText}
          {isTyping && displayedText.length < text.length && (
            <span className="w-2 h-5 bg-royal-gold ml-1 animate-pulse inline-block" />
          )}
        </p>
      </motion.div>
    </AnimatePresence>
  );
};

export default SpeechBubble;
