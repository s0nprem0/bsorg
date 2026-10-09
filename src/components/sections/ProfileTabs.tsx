import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { parseTab, type ProfileTab } from './profileTab';

export default function ProfileTabs({
  counts,
}: {
  counts: { suborgs: number; similar: number };
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = parseTab(searchParams.get('tab'));
  const listRef = useRef<HTMLDivElement>(null);

  // Tabs with a zero count are still rendered but disabled, so the bar does not
  // reflow as orgs gain sub-organizations. Hidden from tab order, not from AT.
  const tabs: { id: ProfileTab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'suborgs', label: 'Sub-Organizations', count: counts.suborgs },
    { id: 'similar', label: 'Similar', count: counts.similar },
  ];

  function select(id: ProfileTab) {
    if (searchParams.get('tab') === id) return;
    const next = new URLSearchParams(searchParams);
    next.set('tab', id);
    setSearchParams(next, { replace: true });
  }

  /** Arrow keys move between tabs, as expected of a tablist. Home/End jump to
   *  the ends. Only the active tab is in the tab order (roving tabindex). */
  function onKeyDown(e: React.KeyboardEvent) {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    const i = tabs.findIndex(t => t.id === active);
    let target: number | undefined;

    if (step) target = (i + step + tabs.length) % tabs.length;
    else if (e.key === 'Home') target = 0;
    else if (e.key === 'End') target = tabs.length - 1;
    else return;

    e.preventDefault();
    const next = tabs[target];
    select(next.id);
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[target]?.focus();
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Organization sections"
      onKeyDown={onKeyDown}
      className="sticky top-16 z-30 -mx-4 flex gap-1 overflow-x-auto border-b border-border/60 bg-background/90 px-4 backdrop-blur-lg sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      {tabs.map(tab => {
        const empty = tab.count === 0;
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            disabled={empty}
            onClick={() => select(tab.id)}
            className={cn(
              'relative shrink-0 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              selected
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground',
              empty && 'cursor-not-allowed opacity-40 hover:text-muted-foreground'
            )}
          >
            {tab.label}
            {tab.count !== undefined && !empty && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                {tab.count}
              </span>
            )}
            <span
              aria-hidden
              className={cn(
                'absolute inset-x-2 -bottom-px h-0.5 rounded-full transition-colors',
                selected ? 'bg-primary' : 'bg-transparent'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}