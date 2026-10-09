import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/** One dense destination row: leading mark, label, trailing count, and a
 *  chevron that only appears on hover. Shared by the home category and campus
 *  rails, and by the browser's list view, so the site has a single row
 *  language instead of one shape per surface. */
export default function DirectoryRow({
  to,
  leading,
  label,
  meta,
  className,
}: {
  to: string;
  leading: React.ReactNode;
  label: string;
  meta?: string;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        'group flex h-11 items-center gap-3 rounded px-2 transition-colors',
        'hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        className
      )}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center" aria-hidden>
        {leading}
      </span>
      <span className="min-w-0 truncate text-sm font-medium text-muted-foreground group-hover:text-foreground">
        {label}
      </span>
      {meta && (
        <span className="ml-auto shrink-0 text-xs text-muted-foreground/70 tabular-nums">
          {meta}
        </span>
      )}
      <ChevronRight
        size={14}
        aria-hidden
        className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
      />
    </Link>
  );
}