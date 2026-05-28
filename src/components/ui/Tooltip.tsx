import { Children, cloneElement, isValidElement, useId } from 'react';
import { cn } from '@/lib/utils';

export default function Tooltip({
  children,
  label,
  side = 'top',
}: {
  children: React.ReactNode;
  label: string;
  side?: 'top' | 'bottom' | 'right';
}) {
  const id = useId();
  const child = Children.only(children);

  return (
    <div className="group/tooltip relative inline-flex">
      {isValidElement(child)
        ? cloneElement(child as React.ReactElement<{ 'aria-describedby'?: string }>, {
            'aria-describedby': id,
          })
        : child}
      <span
        id={id}
        role="tooltip"
        className={cn(
          'pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 shadow-sm transition-opacity duration-150 group-hover/tooltip:opacity-100',
          side === 'top' ? '-top-1 -translate-y-full' : side === 'bottom' ? 'top-full mt-1.5' : 'left-full ml-1.5 top-1/2 -translate-y-1/2'
        )}
      >
        {label}
      </span>
    </div>
  );
}
