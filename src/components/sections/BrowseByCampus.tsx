import { Building2 } from 'lucide-react';
import { campusesWithOrgs } from '@/data/campuses';
import DirectoryRow from '@/components/ui/DirectoryRow';
import type { Organization } from '@/lib/orgIndex';

/** Only campuses that actually hold orgs are listed. Four of the eleven in the
 *  university network have none, and linking to them would land on an empty
 *  result page. */
export default function BrowseByCampus({ allOrgs }: { allOrgs: Organization[] }) {
  const campuses = campusesWithOrgs(allOrgs);

  if (campuses.length === 0) return null;

  return (
    <section>
      <h2 className="px-2 pb-2 text-sm font-semibold">Campuses</h2>
      <div className="-mx-1 grid gap-x-2 sm:grid-cols-2">
        {campuses.map(campus => (
          <DirectoryRow
            key={campus.id}
            to={`/org?campusId=${campus.id}`}
            label={campus.name}
            meta={`${campus.count}`}
            leading={<Building2 size={15} className="text-muted-foreground" />}
          />
        ))}
      </div>
    </section>
  );
}