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

const hashSeed = (value: string): number => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
};

const seededRandom = (seed: number) => {
  let current = seed || 1;
  return () => {
    current = (current * 1664525 + 1013904223) >>> 0;
    return current / 4294967296;
  };
};

const shuffleBySeed = <T,>(items: T[], seedText: string): T[] => {
  const random = seededRandom(hashSeed(seedText));
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
};

function GridPlaceholder() {
  return <div className="h-full min-h-20 rounded-xl border border-dashed border-border bg-muted/20" />;
}

function FeaturedSkeleton() {
  return (
    <div className="grid auto-rows-fr gap-4 sm:gap-6 lg:grid-cols-4 lg:grid-rows-3">
      <div className="lg:col-span-2 lg:row-span-2 rounded-xl bg-muted/50 animate-pulse min-h-40" />
      <div className="hidden lg:block rounded-xl bg-muted/50 animate-pulse min-h-32" />
      <div className="lg:col-span-1 lg:row-span-2 rounded-xl bg-muted/50 animate-pulse min-h-60" />
      <div className="hidden lg:block rounded-xl bg-muted/50 animate-pulse min-h-32" />
      <div className="hidden lg:block rounded-xl bg-muted/50 animate-pulse min-h-32" />
      <div className="lg:col-span-2 rounded-xl bg-muted/50 animate-pulse min-h-32" />
      <div className="lg:col-span-2 rounded-xl bg-muted/50 animate-pulse min-h-32" />
    </div>
  );
}

export default function FeaturedGrid({
  allOrgs,
  loading,
  error,
  stats,
}: {
  allOrgs: Organization[];
  loading: boolean;
  error: Error | null;
  stats: { total: number; academic: number; nonAcademic: number; campuses: number; categories: number };
}) {
  const featuredOrgs = useMemo<Organization[]>(
    () =>
      shuffleBySeed(allOrgs, new Date().toISOString().slice(0, 10)).slice(0, 6),
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

      {loading ? (
        <FeaturedSkeleton />
      ) : error ? (
        <div className="rounded-xl border border-dashed border-destructive/50 bg-destructive/5 p-12 text-center">
          <p className="text-destructive font-semibold">Failed to load organizations</p>
          <p className="mt-2 text-sm text-muted-foreground">Please try refreshing the page.</p>
        </div>
      ) : allOrgs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
          <p className="text-muted-foreground font-semibold">No organizations registered yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Check back soon for upcoming student groups.</p>
        </div>
      ) : (
        <div className="grid auto-rows-fr gap-4 sm:gap-6 lg:grid-cols-4 lg:grid-rows-3">
          {(() => {
            const [f0, f1, f2, f3, f4, f5] = featuredOrgs;
            return (
              <>
                {f0 ? (
                  <div className="lg:col-span-2 lg:row-span-2">
                    <OrganizationCard org={f0} campusName={getCampusName(f0.campusId)} large />
                  </div>
                ) : (
                  <div className="lg:col-span-2 lg:row-span-2"><GridPlaceholder /></div>
                )}
                {f1 ? (
                  <div><OrganizationCard org={f1} campusName={getCampusName(f1.campusId)} /></div>
                ) : (
                  <div className="hidden lg:block"><GridPlaceholder /></div>
                )}

                <Card className="relative flex flex-col justify-between overflow-hidden lg:col-span-1 lg:row-span-2 bg-card border-none shadow-md group">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary to-accent" />
                  <CardHeader className="pb-2 relative z-10">
                    <CardTitle className="text-xs font-bold font-mono tracking-widest text-primary uppercase">
                      Platform Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full justify-between pb-6 relative z-10">
                    <div>
                      <div className="mt-2 text-7xl font-extrabold tracking-tighter text-accent drop-shadow-sm">
                        {stats.total}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed font-medium">
                        Active student organizations currently registered across the university network.
                      </p>
                    </div>
                    <div className="mt-8 space-y-3 pt-6 border-t border-border/50">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-info font-medium">Academic</span>
                        <span className="font-mono font-bold text-info bg-info/20 px-2 py-0.5 rounded-md">
                          {stats.academic}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-warning font-medium">Non-Academic</span>
                        <span className="font-mono font-bold text-warning bg-warning/20 px-2 py-0.5 rounded-md">
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

                {f2 ? (
                  <div><OrganizationCard org={f2} campusName={getCampusName(f2.campusId)} /></div>
                ) : (
                  <div className="hidden lg:block"><GridPlaceholder /></div>
                )}
                {f3 ? (
                  <div><OrganizationCard org={f3} campusName={getCampusName(f3.campusId)} /></div>
                ) : (
                  <div className="hidden lg:block"><GridPlaceholder /></div>
                )}
                {f4 ? (
                  <div className="lg:col-span-2"><OrganizationCard org={f4} campusName={getCampusName(f4.campusId)} /></div>
                ) : (
                  <div className="hidden lg:block lg:col-span-2"><GridPlaceholder /></div>
                )}
                {f5 ? (
                  <div className="lg:col-span-2"><OrganizationCard org={f5} campusName={getCampusName(f5.campusId)} /></div>
                ) : (
                  <div className="hidden lg:block lg:col-span-2"><GridPlaceholder /></div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </section>
  );
}
