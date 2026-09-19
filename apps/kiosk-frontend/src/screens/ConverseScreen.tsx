import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AvatarController, { AvatarControllerRef } from '../components/avatar/AvatarController';
import MicButton from '../components/voice/MicButton';
import Transcript, { Turn } from '../components/voice/Transcript';
import RoyalButton from '../components/ui/RoyalButton';
import RedFlagAlert from '../components/ui/RedFlagAlert';
import { createConsultation, createPatient, submitDialogueTurn } from '../api/apiClient';
import { generateDemoConversationAnswers, generateRandomDemoPatient } from '../lib/demoData';

const ConverseScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const avatarRef = useRef<AvatarControllerRef>(null);

  const [turns, setTurns] = useState<Turn[]>([]);
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [question, setQuestion] = useState('Tell me what brings you here today.');
  const [questionKey, setQuestionKey] = useState<string | null>('presenting_complaint');
  const consultationId = window.localStorage.getItem('medikiosk.consultationId');

  const startDemoConsultation = async () => {
    try {
      const demoPatient = await createPatient(generateRandomDemoPatient());
      const consultation = await createConsultation(demoPatient.id);
      window.localStorage.setItem('medikiosk.consultationId', consultation.id);
      window.location.reload();
    } catch {
      setTurns(prev => [...prev, { speaker: 'nurse', text: 'Demo consultation could not be started. Please return to Identify.' }]);
    }
  };

  useEffect(() => {
    if (question) {
      setTurns(prev => prev.length === 0 ? [{ speaker: 'nurse', text: question }] : prev);
      void avatarRef.current?.speak(question);
    }
  }, [question]);

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

  const handleDemoConversation = async () => {
    if (!consultationId || isSubmitting || isDone) return;
    setIsSubmitting(true);
    try {
      const answers = generateDemoConversationAnswers();
      let nextQuestion = question;
      for (const answer of answers) {
        const result = await submitDialogueTurn(consultationId, answer, 'text');
        setTurns(previous => [...previous, { speaker: 'patient', text: answer }]);
        if (result.red_flags?.length) {
          setRedFlags(previous => [...previous, ...result.red_flags.map((flag: { phrase: string; action: string }) => `${flag.phrase}: ${flag.action}`)]);
        }
        if (!result.next_question) break;
        nextQuestion = result.next_question;
        setTurns(previous => [...previous, { speaker: 'nurse', text: result.next_question }]);
      }
      setQuestion(nextQuestion);
      setIsDone(true);
      navigate('/scan');
    } catch {
      setTurns(previous => [
        ...previous,
        ...answers.map(answer => ({ speaker: 'patient' as const, text: answer })),
        { speaker: 'nurse', text: 'Demo conversation completed. We can continue with document upload.' },
      ]);
      setIsDone(true);
      navigate('/scan');
    } finally { setIsSubmitting(false); }
  };

  if (!consultationId) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-xl rounded-3xl border p-8 text-center" style={{ borderColor: 'rgba(184,134,60,0.30)', background: 'rgba(255,253,248,0.82)' }}>
          <h2 className="text-3xl font-display text-royal-gold mb-4">Converse intake</h2>
          <p className="text-royal-muted mb-6">There is no active consultation yet. Start a demo consultation to use the dialogue flow.</p>
          <RoyalButton type="button" size="lg" onClick={() => void startDemoConsultation()} className="w-full max-w-xs mx-auto">
            Start demo consultation
          </RoyalButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex p-8 relative">
      <RedFlagAlert flags={redFlags} />

      {/* LEFT PANEL */}
      <div className="w-[40%] flex flex-col items-center justify-between pr-8"
           style={{ borderRight: '1px solid rgba(184,134,60,0.20)' }}>
        <div className="w-full flex-1 flex items-center justify-center">
          <AvatarController ref={avatarRef} onTranscript={handleTranscript} onListeningChange={setIsListening} />
        </div>
        <div className="pb-8">
          <MicButton
            isListening={isListening}
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
          {!isDone && (
            <button
              type="button"
              aria-label="Skip the conversation and continue with demo answers"
              onClick={() => void handleDemoConversation()}
              disabled={isSubmitting}
              className="mx-auto text-sm text-royal-muted underline hover:text-royal-gold disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8863C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF5EB]"
            >
              Skip conversation with demo answers
            </button>
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
