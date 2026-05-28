import OrganizationCard from '@/components/OrganizationCard';
import { getCampusName } from '@/data/campuses';
import type { Organization } from '@/lib/orgIndex';
import { cn } from '@/lib/utils';

export interface OrgGridProps {
  organizations: Organization[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function GridSkeleton({ columns = 4, count = 8 }: { columns?: number; count?: number }) {
  const columnClasses =
    {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4',
    }[columns] ?? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4';

  return (
    <div className={cn('grid gap-6 auto-rows-fr', columnClasses)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col animate-pulse rounded-xl bg-card border border-border overflow-hidden"
        >
          <div className="h-16 shrink-0 bg-muted/50 border-b border-border" />
          <div className="flex flex-col p-4 gap-3">
            <div className="flex gap-2">
              <div className="h-4 w-16 rounded-md bg-muted" />
              <div className="h-4 w-12 rounded-md bg-muted" />
            </div>
            <div className="h-5 w-3/4 rounded-md bg-muted" />
            <div className="h-3 w-full rounded-md bg-muted" />
            <div className="flex gap-1.5 pt-2">
              <div className="h-6 w-6 rounded-full bg-muted" />
              <div className="h-6 w-6 rounded-full bg-muted" />
              <div className="h-6 w-6 rounded-full bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
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
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4',
    }[columns] ?? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4';

  return (
    <div className={cn('grid gap-6 auto-rows-fr', columnClasses, className)}>
      {organizations.map((org, i) => (
        <div
          key={org.id}
          className="animate-fade-in-up h-full"
          style={{ animationDelay: `${Math.min(i, 20) * 60}ms` }}
        >
          <OrganizationCard
            org={org}
            campusName={getCampusName(org.campusId)}
          />
        </div>
      ))}
    </div>
  );
}
