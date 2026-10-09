import { useState } from 'react';
import { Link } from 'react-router-dom';
import { abbreviateProgram } from '@/data/programs';
import type { Organization } from '@/lib/orgIndex';

function Row({ org }: { org: Organization }) {
  const [failed, setFailed] = useState(false);
  const hasLogo = !!org.assets?.logoUrl && !failed;
  const acronym = org.acronym || org.name.slice(0, 2).toUpperCase();

  return (
    <Link
      to={`/org/${org.slug}`}
      className="group flex h-11 items-center gap-3 rounded px-2 transition-colors hover:bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
      <span className="min-w-0 truncate text-sm font-medium text-muted-foreground group-hover:text-foreground">
        {org.name}
      </span>
      {/* Right-aligned meta, the way Discord pins a channel topic to the edge. */}
      <span className="ml-auto shrink-0 text-xs text-muted-foreground/70">
        {org.programId ? abbreviateProgram(org.programId) : org.type}
      </span>
    </Link>
  );
}

/** Discord's channel list: one dense row per destination, count in the header.
 *  A grid of cards cost ~150px per org, which made a 12-sub-org council scroll
 *  for four screens. Rows cost 44px. */
export default function ProfileOrgList({
  orgs,
  title,
  emptyMessage,
}: {
  orgs: Organization[];
  title: string;
  emptyMessage?: string;
}) {
  if (orgs.length === 0 && !emptyMessage) return null;

  return (
    <section>
      <h2 className="flex items-baseline gap-2 px-2 pb-2 text-sm font-semibold text-foreground">
        {title}
        <span className="text-xs font-normal text-muted-foreground">
          {orgs.length}
        </span>
      </h2>
      {orgs.length === 0 ? (
        <p className="px-2 py-4 text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="-mx-1 space-y-0.5">
          {orgs.map(org => (
            <Row key={org.slug} org={org} />
          ))}
        </div>
      )}
    </section>
  );
}