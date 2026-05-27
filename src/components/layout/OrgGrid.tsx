import OrganizationCard from '@/components/OrganizationCard';
import { getCampusName } from '@/data/campuses';
import type { Organization } from '@/lib/orgIndex';
import { cn } from '@/lib/utils';

export interface OrgGridProps {
  organizations: Organization[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export default function OrgGrid({
  organizations,
  columns = 4,
  className,
}: OrgGridProps) {
  if (!organizations?.length) return null;

  const columnClasses =
    {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    }[columns] ?? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className={cn('grid gap-4 sm:gap-6', columnClasses, className)}>
      {organizations.map(org => (
        <OrganizationCard
          key={org.id}
          org={org}
          campusName={getCampusName(org.campusId)}
        />
      ))}
    </div>
  );
}
