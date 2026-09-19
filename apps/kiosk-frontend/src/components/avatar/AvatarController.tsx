import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import NurseAvatar from './NurseAvatar';
import SpeechBubble from './SpeechBubble';
import { useTTS } from '../../voice/useTTS';
import { useSpeechRecognition } from '../../voice/useSpeechRecognition';

export interface AvatarControllerRef {
  speak: (text: string) => Promise<void>;
  listen: () => void;
  reset: () => void;
}

interface Props {
  onTranscript: (text: string) => void;
  initialMessage?: string;
  onListeningChange?: (isListening: boolean) => void;
}

const AvatarController = forwardRef<AvatarControllerRef, Props>(({ onTranscript, initialMessage, onListeningChange }, ref) => {
  const [state, setState] = useState<'idle' | 'speaking' | 'listening' | 'processing'>('idle');
  const [message, setMessage] = useState(initialMessage || '');
  
  const { speak: ttsSpeak, stop: ttsStop } = useTTS();
  const { startListening, stopListening, isListening, transcript } = useSpeechRecognition();

  useImperativeHandle(ref, () => ({
    speak: async (text: string) => {
      setState('speaking');
      setMessage(text);
      await ttsSpeak(text);
      setState('idle');
    },
    listen: () => {
      setState('listening');
      setMessage('I am listening...');
      startListening();
    },
    reset: () => {
      ttsStop();
      stopListening();
      setState('idle');
      setMessage('');
    }
  }));

  useEffect(() => {
    onListeningChange?.(isListening);
    if (state === 'listening' && !isListening && transcript) {
      setState('processing');
      onTranscript(transcript);
    }
  }, [isListening, transcript, state, onTranscript, onListeningChange]);

  return (
    <div className="flex flex-col items-center">
      <NurseAvatar state={state} />
      {message && <SpeechBubble text={message} isTyping={state === 'speaking'} />}
    </div>
  );
});

export default AvatarController;
