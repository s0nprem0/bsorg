import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, LayoutGrid } from 'lucide-react';
import OrganizationCard from '@/components/OrganizationCard';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { getCampusName } from '@/data/campuses';
import type { Organization } from '@/lib/orgIndex';

// Deterministic per-day shuffle, so the featured set is stable within a day
// but rotates daily. mulberry32 - one LCG, seeded from the date.
function dailyShuffle<T>(items: T[], seedText: string): T[] {
  let seed = 2166136261;
  for (const char of seedText) {
    seed = Math.imul(seed ^ char.charCodeAt(0), 16777619);
  }
  const random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Bento placement for the 6 featured slots. Index 0 is the hero card; the
// stats card sits between slots 1 and 2, so slot 1 is a single cell.
const FEATURED_SLOTS = [
  'lg:col-span-2 lg:row-span-2',
  '',
  '',
  '',
  'lg:col-span-2',
  'lg:col-span-2',
];

export default function FeaturedGrid({
  allOrgs,
  stats,
}: {
  allOrgs: Organization[];
  stats: Stats;
}) {
  const featuredOrgs = useMemo<Organization[]>(
    () => dailyShuffle(allOrgs, new Date().toISOString().slice(0, 10)).slice(0, 6),
    [allOrgs]
  );

  return (
    <section id="featured" className="py-16 md:py-24 max-w-7xl mx-auto px-6">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl flex items-center gap-3">
            Featured Organizations
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            At a glance, the essential student groups driving campus culture.
          </p>
        </div>
        <Button
          variant="secondary"
          asChild
          className="hover:bg-primary hover:text-primary-foreground transition-colors group"
        >
          <Link to="/org">
            View Full Directory{' '}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      {featuredOrgs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
          <p className="text-muted-foreground font-semibold">No organizations registered yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Check back soon for upcoming student groups.</p>
        </div>
      ) : (
        <div className="grid auto-rows-fr gap-4 sm:gap-6 lg:grid-cols-4 lg:grid-rows-3">
          {featuredOrgs.slice(0, 2).map((org, index) => (
            <div key={org.slug} className={FEATURED_SLOTS[index]}>
              <OrganizationCard
                org={org}
                campusName={getCampusName(org.campusId)}
                large={index === 0}
              />
            </div>
          ))}

          <StatsCard stats={stats} />

          {featuredOrgs.slice(2).map((org, index) => (
            <div key={org.slug} className={FEATURED_SLOTS[index + 2]}>
              <OrganizationCard org={org} campusName={getCampusName(org.campusId)} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

interface Stats {
  total: number;
  academic: number;
  nonAcademic: number;
  campuses: number;
  categories: number;
}

function StatsCard({ stats }: { stats: Stats }) {
  return (
    <>
            <Card className="relative flex flex-col justify-between overflow-hidden lg:col-span-1 lg:row-span-2 bg-card border-none shadow-md group">
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary to-primary/50" />
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-xs font-bold font-mono tracking-widest text-primary uppercase">
                  Platform Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-full justify-between pb-6 relative z-10">
                <div>
                  <div className="mt-2 text-7xl font-extrabold tracking-tighter text-primary drop-shadow-sm">
                    {stats.total}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed font-medium">
                    Active student organizations currently registered across the university network.
                  </p>
                </div>
                <div className="mt-8 space-y-3 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-info font-medium">Academic</span>
                    <span className="font-mono font-bold text-info bg-info/10 px-2 py-0.5 rounded-md">
                      {stats.academic}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-warning font-medium">Non-Academic</span>
                    <span className="font-mono font-bold text-warning bg-warning/10 px-2 py-0.5 rounded-md">
                      {stats.nonAcademic}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-success font-medium flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> Campuses
                    </span>
                    <span className="font-mono font-bold text-success bg-success/10 px-2 py-0.5 rounded-md">
                      {stats.campuses}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium flex items-center gap-1">
                      <LayoutGrid className="h-3.5 w-3.5" /> Categories
                    </span>
                    <span className="font-mono font-bold text-foreground bg-surface-2 px-2 py-0.5 rounded-md">
                      {stats.categories}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
    </>
  );
}
