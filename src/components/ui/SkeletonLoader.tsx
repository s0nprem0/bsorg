import React from 'react';

const SkeletonLoader: React.FC<{ count?: number; className?: string }> = ({
  count = 3,
  className = '',
}) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-4 w-full rounded mb-2 animate-pulse bg-muted"
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
