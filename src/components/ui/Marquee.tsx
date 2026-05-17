import React from 'react';

interface MarqueeProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  speed?: number;
  className?: string;
}

const Marquee = <T,>({
  items,
  renderItem,
  speed = 40,
  className = '',
}: MarqueeProps<T>) => {
  return (
    <div
      className={[
        'group relative flex overflow-hidden',
        className,
      ].join(' ')}
    >
      {/* Left fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-linear-to-r from-white to-transparent" />

      {/* Right fade */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-linear-to-l from-white to-transparent" />

      {/* Infinite Track */}
      <div
        className="flex min-w-max shrink-0 items-center animate-marquee"
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {Array.from({ length: 10 }).flatMap((_, loopIndex) =>
          items.map((item, itemIndex) => (
            <div
              key={`first-${loopIndex}-${itemIndex}`}
              className="mx-4 flex shrink-0 items-center"
            >
              {renderItem(item, itemIndex)}
            </div>
          ))
        )}
      </div>

      {/* Duplicate */}
      <div
        className="flex min-w-max shrink-0 items-center animate-marquee"
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {Array.from({ length: 10 }).flatMap((_, loopIndex) =>
          items.map((item, itemIndex) => (
            <div
              key={`second-${loopIndex}-${itemIndex}`}
              className="mx-4 flex shrink-0 items-center"
            >
              {renderItem(item, itemIndex)}
            </div>
          ))
        )}
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