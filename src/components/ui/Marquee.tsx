import React from 'react';

interface MarqueeProps {
  text: string;
  speed?: number; // pixels per second
  className?: string;
}

const Marquee: React.FC<MarqueeProps> = ({ text, speed = 60, className = '' }) => {
  return (
    <div className={`overflow-hidden whitespace-nowrap w-full ${className}`} style={{ position: 'relative', height: '2.5rem' }}>
      <div
        className="inline-block animate-marquee"
        style={{
          animation: `marquee ${text.length / speed}s linear infinite`,
        }}
      >
        {text}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Marquee;
