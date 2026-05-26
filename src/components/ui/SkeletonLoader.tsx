import React from 'react';

const CardSkeleton: React.FC = () => (
  <div className="flex h-full w-full animate-pulse rounded-lg border border-border bg-card overflow-hidden">
    <div className="flex w-28 shrink-0 items-center justify-center bg-muted sm:w-32">
      <div className="h-12 w-12 rounded-full bg-muted-foreground/10" />
    </div>
    <div className="flex flex-1 flex-col p-4 sm:p-5">
      <div className="mb-2 h-3 w-20 rounded bg-muted-foreground/10" />
      <div className="mb-2 h-4 w-3/4 rounded bg-muted-foreground/10" />
      <div className="mb-1 h-3 w-full rounded bg-muted-foreground/10" />
      <div className="h-3 w-2/3 rounded bg-muted-foreground/10" />
      <div className="mt-auto flex gap-2 pt-3">
        <div className="h-6 w-6 rounded bg-muted-foreground/10" />
        <div className="h-6 w-6 rounded bg-muted-foreground/10" />
      </div>
    </div>
  </div>
);

const SkeletonLoader: React.FC<{
  count?: number;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}> = ({ count = 4, columns = 4, className = '' }) => {
  const columnClasses =
    {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    }[columns] ?? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className={`grid gap-4 sm:gap-6 ${columnClasses} ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
