import OrganizationCard from '@/components/OrganizationCard';
import { getCampusName } from '@/data/campuses';
import type { Organization } from '@/lib/orgIndex';

export default function OrgGrid({ organizations }: { organizations: Organization[] }) {
  if (!organizations?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-6 auto-rows-fr sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {organizations.map((org, i) => (
        <div
          key={org.slug}
          className="animate-fade-in-up h-full"
          style={{ animationDelay: `${Math.min(i, 20) * 60}ms` }}
        >
          <OrganizationCard org={org} campusName={getCampusName(org.campusId)} />
        </div>
      ))}
    </div>
  );
}