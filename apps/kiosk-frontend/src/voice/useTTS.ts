import { useState, useCallback } from 'react';
import { synthesizeSpeech } from '../api/apiClient';

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(async (text: string, language = import.meta.env.VITE_TTS_LANGUAGE || 'hi'): Promise<void> => {
    if (import.meta.env.VITE_TTS_ENABLED === 'false') {
      return Promise.resolve();
    }

    try {
      const result = await synthesizeSpeech(text, language);
      if (result.audio) {
        await new Promise<void>((resolve, reject) => {
          const audio = new Audio(result.audio);
          audio.onended = () => resolve();
          audio.onerror = () => reject(new Error('AI4Bharat audio playback failed'));
          setIsSpeaking(true);
          void audio.play().catch(reject);
        });
        setIsSpeaking(false);
        return;
      }
    } catch {
      // Browser speech remains the offline and provider-failure fallback.
      setIsSpeaking(false);
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
