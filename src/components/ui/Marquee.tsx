import React from 'react';

interface MarqueeProps {
  text: string;
  speed?: number;
  className?: string;
}

const Marquee: React.FC<MarqueeProps> = ({
  text,
  speed = 40,
  className = '',
}) => {
  return (
    <div
      className={[
        'group relative flex overflow-hidden',
        className,
      ].join(' ')}
    >
      {/* Left fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white to-transparent" />

      {/* Right fade */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white to-transparent" />

      {/* Infinite Track */}
      <div
        className="flex min-w-max shrink-0 items-center animate-marquee"
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={`first-${i}`}
            className="mx-8 whitespace-nowrap text-sm font-medium tracking-wide text-neutral-700"
          >
            {text}
          </span>
        ))}
      </div>

      {/* Duplicate */}
      <div
        className="flex min-w-max shrink-0 items-center animate-marquee"
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={`second-${i}`}
            className="mx-8 whitespace-nowrap text-sm font-medium tracking-wide text-neutral-700"
          >
            {text}
          </span>
        ))}
      </div>

      <style>{`
        .animate-marquee {
          animation: marquee linear infinite;
          will-change: transform;
        }

        .group:hover .animate-marquee {
          animation-play-state: paused;
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Marquee;