import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { Organization } from '@/lib/orgIndex';

/** One organization as a dense row: logo, name, and right-aligned meta.
 *
 *  Shared by the profile's sub-organization and similar lists and by the
 *  browser's list view, so the two cannot drift. `secondary` adds a clamped
 *  description line for the browser, where there is room to spend on it. */
export default function OrgRow({
  org,
  meta,
  secondary,
}: {
  org: Organization;
  meta?: string;
  secondary?: string;
}) {
  const [failed, setFailed] = useState(false);
  const hasLogo = !!org.assets?.logoUrl && !failed;
  const acronym = org.acronym || org.name.slice(0, 2).toUpperCase();

  return (
    <Link
      to={`/org/${org.slug}`}
      className={cn(
        'group flex min-h-11 items-center gap-3 rounded px-2 py-1.5 transition-colors',
        'hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
      )}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded bg-secondary text-[10px] font-bold text-secondary-foreground">
        {hasLogo ? (
          <img
            src={org.assets?.logoUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-0.5"
            onError={() => setFailed(true)}
          />
        ) : (
          acronym.slice(0, 3)
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-muted-foreground group-hover:text-foreground">
          {org.name}
        </span>
        {secondary && (
          <span className="block truncate text-xs text-muted-foreground/70">
            {secondary}
          </span>
        )}
      </span>

      {meta && (
        <span className="shrink-0 text-xs text-muted-foreground/70 tabular-nums">
          {meta}
        </span>
      )}
    </Link>
  );
}