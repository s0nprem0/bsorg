import { Link } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';
import { CAMPUSES } from '@/data/campuses';
import type { Organization } from '@/lib/orgIndex';

export default function BrowseByCampus({ allOrgs }: { allOrgs: Organization[] }) {
  const campusOrgs = Object.entries(
    allOrgs.reduce<Record<number, number>>((acc, org) => {
      if (org.campusId !== undefined) {
        acc[org.campusId] = (acc[org.campusId] || 0) + 1;
      }
      return acc;
    }, {})
  )
    .map(([id, count]) => {
      const campus = CAMPUSES.find(c => c.id === Number(id));
      return campus ? { ...campus, count } : null;
    })
    .filter(Boolean)
    .sort((a, b) => (b?.count ?? 0) - (a?.count ?? 0))
    .slice(0, 4);

  if (campusOrgs.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-foreground mb-6">Browse by Campus</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {campusOrgs.map(campus => campus && (
          <Link
            key={campus.id}
            to={`/org?campusId=${campus.id}`}
            aria-label={`Browse ${campus.name} organizations`}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                {campus.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {campus.count} organization{campus.count !== 1 ? 's' : ''}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
