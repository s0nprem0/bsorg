import { abbreviateProgram } from '@/data/programs';
import OrgRow from '@/components/layout/OrgRow';
import type { Organization } from '@/lib/orgIndex';

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
            <OrgRow
              key={org.slug}
              org={org}
              meta={org.programId ? abbreviateProgram(org.programId) : org.type}
            />
          ))}
        </div>
      )}
    </section>
  );
}