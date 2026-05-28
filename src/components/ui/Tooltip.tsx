import type { ReactNode } from 'react';

export default function Tooltip({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="group/tooltip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 shadow-sm transition-opacity duration-150 group-hover/tooltip:opacity-100"
      >
        {label}
      </span>
    </div>
  );
}
