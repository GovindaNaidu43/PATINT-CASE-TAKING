import { useState, useCallback } from 'react';

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(async (text: string): Promise<void> => {
    if (import.meta.env.VITE_TTS_ENABLED === 'false') {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      if (!window.speechSynthesis) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }, []);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, speak, stop };
};
