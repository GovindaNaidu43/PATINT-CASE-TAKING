import React, { useEffect, useRef } from 'react';
import RoyalCard from '../ui/RoyalCard';

export interface Turn {
  speaker: 'nurse' | 'patient';
  text: string;
}

interface Props {
  turns: Turn[];
}

const Transcript: React.FC<Props> = ({ turns }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns]);

  return (
    <RoyalCard className="w-full h-[200px] flex flex-col p-4 bg-black/40">
      <h4 className="text-xs font-display text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-800 pb-2">Conversation Transcript</h4>
      <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {turns.length === 0 && (
          <p className="text-gray-600 italic text-center mt-8 text-sm">Conversation will appear here...</p>
        )}
        {turns.map((turn, idx) => (
          <div key={idx} className={`flex ${turn.speaker === 'nurse' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
              turn.speaker === 'nurse' 
                ? 'bg-royal-surface border border-royal-gold/30 text-royal-gold' 
                : 'bg-royal-gold text-royal-bg'
            }`}>
              {turn.text}
            </div>
          </div>
        ))}
      </div>
    </RoyalCard>
  );
};

export default Transcript;
