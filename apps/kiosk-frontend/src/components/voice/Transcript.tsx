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
    <RoyalCard className="w-full h-[200px] flex flex-col p-4">
      <h4 className="text-xs font-display uppercase tracking-widest mb-2 pb-2"
          style={{ color: '#8A745A', borderBottom: '1px solid #E8D9BC' }}>
        Conversation Transcript
      </h4>
      <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {turns.length === 0 && (
          <p className="italic text-center mt-8 text-sm" style={{ color: '#B8A090' }}>
            Conversation will appear here...
          </p>
        )}
        {turns.map((turn, idx) => (
          <div key={idx} className={`flex ${turn.speaker === 'nurse' ? 'justify-start' : 'justify-end'}`}>
            <div
              className="max-w-[80%] rounded-2xl px-4 py-2 text-sm"
              style={
                turn.speaker === 'nurse'
                  ? { background: 'rgba(232,217,188,0.50)', border: '1px solid #E8D9BC', color: '#8A5C1A' }
                  : { background: 'linear-gradient(135deg,#C9974B,#B8863C)', color: '#fff' }
              }
            >
              {turn.text}
            </div>
          </div>
        ))}
      </div>
    </RoyalCard>
  );
};

export default Transcript;
