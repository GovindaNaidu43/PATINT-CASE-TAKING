import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AvatarController, { AvatarControllerRef } from '../components/avatar/AvatarController';
import MicButton from '../components/voice/MicButton';
import Transcript, { Turn } from '../components/voice/Transcript';
import RoyalButton from '../components/ui/RoyalButton';
import RedFlagAlert from '../components/ui/RedFlagAlert';
import { submitDialogueTurn } from '../api/apiClient';

const ConverseScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const avatarRef = useRef<AvatarControllerRef>(null);

  const [turns, setTurns] = useState<Turn[]>([]);
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState('Tell me what brings you here today.');
  const [questionKey, setQuestionKey] = useState<string | null>('presenting_complaint');
  const consultationId = window.localStorage.getItem('medikiosk.consultationId');

  useEffect(() => {
    if (!consultationId) navigate('/identify');
    if (question) {
      setTurns(prev => prev.length === 0 ? [{ speaker: 'nurse', text: question }] : prev);
      void avatarRef.current?.speak(question);
    }
  }, [consultationId, navigate, question]);

  const handleAnswer = async (answer: string, modality: 'voice' | 'touch' | 'text') => {
    if (!consultationId || !answer.trim() || isSubmitting || isDone) return;
    setIsSubmitting(true);
    setTurns(prev => [...prev, { speaker: 'patient', text: answer }]);
    try {
      const result = await submitDialogueTurn(consultationId, answer, modality);
      if (result.red_flags?.length) {
        setRedFlags(prev => [...prev, ...result.red_flags.map((flag: { phrase: string; action: string }) => `${flag.phrase}: ${flag.action}`)]);
      }
      if (!result.next_question) {
        setIsDone(true);
        await avatarRef.current?.speak(t('converse.done'));
        setTimeout(() => navigate('/scan'), 1500);
      } else {
        setQuestion(result.next_question);
        setQuestionKey(result.question_key);
        setTurns(prev => [...prev, { speaker: 'nurse', text: result.next_question }]);
        await avatarRef.current?.speak(result.next_question);
      }
      } catch {
      setTurns(prev => [...prev, { speaker: 'nurse', text: 'I could not save that response. Please try again.' }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTranscript = (text: string) => {
    void handleAnswer(text, 'voice');
  };

  return (
    <div className="flex-1 flex p-8 relative">
      <RedFlagAlert flags={redFlags} />

      {/* LEFT PANEL */}
      <div className="w-[40%] flex flex-col items-center justify-between pr-8"
           style={{ borderRight: '1px solid rgba(184,134,60,0.20)' }}>
        <div className="w-full flex-1 flex items-center justify-center">
          <AvatarController ref={avatarRef} onTranscript={handleTranscript} />
        </div>
        <div className="pb-8">
          <MicButton
            isListening={false}
            onClick={() => avatarRef.current?.listen()}
            disabled={isDone}
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[60%] flex flex-col pl-8">
        <div className="flex-1 flex flex-col justify-center">
          {!isDone && questionKey === 'severity' && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              {Array.from({ length: 11 }, (_, value) => String(value)).map(value => (
                <RoyalButton key={value} variant="secondary" size="lg" disabled={isSubmitting} onClick={() => void handleAnswer(value, 'touch')} className="!h-16">
                  {value}
                </RoyalButton>
              ))}
            </div>
          )}
          {!isDone && questionKey !== 'severity' && (
            <form className="flex gap-3 mb-4" onSubmit={event => { event.preventDefault(); void handleAnswer(input, 'touch'); setInput(''); }}>
              <input
                value={input}
                onChange={event => setInput(event.target.value)}
                placeholder="Type your answer…"
                disabled={isSubmitting}
                className="flex-1 rounded-xl px-5 py-4 outline-none transition-all"
                style={{
                  background: 'rgba(255,253,248,0.90)',
                  border: '1.5px solid #E8D9BC',
                  color: '#3E2E1E',
                }}
                onFocus={e => (e.target.style.borderColor = '#B8863C')}
                onBlur={e => (e.target.style.borderColor = '#E8D9BC')}
              />
              <RoyalButton type="submit" disabled={isSubmitting || !input.trim()} size="lg">Send</RoyalButton>
            </form>
          )}
          {!isDone && (
            <p className="text-center text-sm italic mb-8" style={{ color: '#A89070' }}>
              {t('converse.hint')}
            </p>
          )}
        </div>
        <div className="mt-auto">
          <Transcript turns={turns} />
        </div>
      </div>
    </div>
  );
};

export default ConverseScreen;
