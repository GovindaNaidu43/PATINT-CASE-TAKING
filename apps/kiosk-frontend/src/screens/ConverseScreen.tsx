import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AvatarController, { AvatarControllerRef } from '../components/avatar/AvatarController';
import MicButton from '../components/voice/MicButton';
import Transcript, { Turn } from '../components/voice/Transcript';
import RoyalButton from '../components/ui/RoyalButton';
import RedFlagAlert from '../components/ui/RedFlagAlert';
import { QUESTION_TREE, RED_FLAG_RULES } from '../api/mockConversation';

const ConverseScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const avatarRef = useRef<AvatarControllerRef>(null);

  const [qIndex, setQIndex] = useState(0);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);

  const currentQ = QUESTION_TREE[qIndex];

  useEffect(() => {
    const startQ = async () => {
      if (isDone) return;
      if (currentQ) {
        setTurns(prev => [...prev, { speaker: 'nurse', text: currentQ.question }]);
        await avatarRef.current?.speak(currentQ.question);
      } else {
        setIsDone(true);
        await avatarRef.current?.speak(t('converse.done'));
        setTimeout(() => navigate('/scan'), 3000);
      }
    };
    startQ();
  }, [qIndex, isDone, navigate, t]);

  const handleAnswer = async (answer: string) => {
    setTurns(prev => [...prev, { speaker: 'patient', text: answer }]);
    
    // Check red flags
    const lowerAns = answer.toLowerCase();
    const newFlags: string[] = [];
    RED_FLAG_RULES.forEach(rule => {
      if (rule.triggers.some(t => lowerAns.includes(t))) {
        newFlags.push(rule.flag);
      }
    });
    if (newFlags.length > 0) {
      setRedFlags(prev => [...prev, ...newFlags]);
    }

    setQIndex(prev => prev + 1);
  };

  const handleTranscript = (text: string) => {
    handleAnswer(text);
  };

  return (
    <div className="flex-1 flex p-8 relative">
      <RedFlagAlert flags={redFlags} />
      
      {/* LEFT PANEL */}
      <div className="w-[40%] flex flex-col items-center justify-between border-r border-royal-gold/20 pr-8">
        <div className="w-full flex-1 flex items-center justify-center">
          <AvatarController 
            ref={avatarRef} 
            onTranscript={handleTranscript}
          />
        </div>
        
        <div className="pb-8">
          <MicButton 
            isListening={false} // Managed by AvatarController internally but we can trigger it
            onClick={() => avatarRef.current?.listen()} 
            disabled={isDone}
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[60%] flex flex-col pl-8">
        <div className="flex-1 flex flex-col justify-center">
          {!isDone && currentQ && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              {currentQ.options.map((opt, i) => (
                <RoyalButton key={i} variant="secondary" size="lg" onClick={() => handleAnswer(opt)} className="!h-20 text-left justify-start px-6 whitespace-normal leading-tight">
                  {opt}
                </RoyalButton>
              ))}
            </div>
          )}
          {!isDone && (
            <p className="text-center text-gray-400 text-sm italic mb-8">{t('converse.hint')}</p>
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
