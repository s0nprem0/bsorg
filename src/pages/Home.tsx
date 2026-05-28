import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  GraduationCap,
  Users,
  MapPin,
  LayoutGrid,
  Building2,
} from 'lucide-react';

import SEO from '@/components/SEO';
import Hero from '@/components/sections/Hero';
import OrganizationCard from '@/components/OrganizationCard';
import Section from '@/components/ui/Section';
import { Button } from '@/components/ui/shadcn/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';

import { useOrgs } from '@/hooks/useOrgService';
import { CAMPUSES, getCampusName } from '@/data/campuses';
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

const shuffleOrganizationsBySeed = <T,>(items: T[], seedText: string): T[] => {
  const random = seededRandom(hashSeed(seedText));
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }
  return shuffled;
};

function GridPlaceholder() {
  return (
    <div className="h-full min-h-20 rounded-xl border border-dashed border-border bg-muted/20" />
  );
}

const browseCategories: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  count: number | null;
  accent: string;
}[] = [
  {
    title: 'Academic Organizations',
    description: 'College-based academic councils and departmental organizations.',
    icon: GraduationCap,
    href: '/org?type=Academic',
    count: null,
    accent: 'from-primary/20 to-primary/5 border-primary/20',
  },
  {
    title: 'Non-Academic Organizations',
    description: 'Cultural, sports, and special interest groups.',
    icon: Users,
    href: '/org?type=Non-Academic',
    count: null,
    accent: 'from-accent/20 to-accent/5 border-accent/20',
  },
  {
    title: 'All Organizations',
    description: 'Browse every recognized student organization in one place.',
    icon: LayoutGrid,
    href: '/org',
    count: null,
    accent: 'from-blue-500/10 to-purple-500/10 border-blue-500/20',
  },
];

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

export default function Home() {
  const { orgs: allOrgs, loading, error } = useOrgs();

  const stats = useMemo(() => {
    const uniqueCampuses = new Set(allOrgs.map(o => o.campusId).filter(id => id !== undefined));
    const uniqueCategories = new Set(allOrgs.map(o => o.category).filter(Boolean));
    return {
      total: allOrgs.length,
      academic: allOrgs.filter(org => org.type === 'Academic').length,
      nonAcademic: allOrgs.filter(org => org.type !== 'Academic').length,
      campuses: uniqueCampuses.size,
      categories: uniqueCategories.size,
    };
  }, [allOrgs]);

  const campusOrgs = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const org of allOrgs) {
      if (org.campusId !== undefined) {
        counts[org.campusId] = (counts[org.campusId] || 0) + 1;
      }
    }
    return Object.entries(counts)
      .map(([id, count]) => {
        const campus = CAMPUSES.find(c => c.id === Number(id));
        return campus ? { ...campus, count } : null;
      })
      .filter(Boolean)
      .sort((a, b) => (b?.count ?? 0) - (a?.count ?? 0))
      .slice(0, 4);
  }, [allOrgs]);

  const featuredOrgs = useMemo<Organization[]>(
    () =>
      shuffleOrganizationsBySeed(
        allOrgs,
        new Date().toISOString().slice(0, 10)
      ).slice(0, 6),
    [allOrgs]
  );

  const [f0, f1, f2, f3, f4, f5] = featuredOrgs;

  const browseCats = useMemo(
    () =>
      browseCategories.map(cat => ({
        ...cat,
        count:
          cat.title === 'Academic Organizations'
            ? stats.academic
            : cat.title === 'Non-Academic Organizations'
              ? stats.nonAcademic
              : null,
      })),
    [stats]
  );

  return (
    <>
      <SEO title="Home" />
      <main className="grow bg-background">
        <Hero />

        <Section
          id="featured"
          className="py-16 md:py-24 max-w-7xl mx-auto px-6"
        >
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl flex items-center gap-3">
                Featured Organizations
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                At a glance, the essential student groups driving campus
                culture.
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
              <p className="text-destructive font-semibold">
                Failed to load organizations
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Please try refreshing the page.
              </p>
            </div>
          ) : allOrgs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
              <p className="text-muted-foreground font-semibold">
                No organizations registered yet
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Check back soon for upcoming student groups.
              </p>
            </div>
          ) : (
            <div className="grid auto-rows-fr gap-4 sm:gap-6 lg:grid-cols-4 lg:grid-rows-3">
              {f0 ? (
                <div className="lg:col-span-2 lg:row-span-2">
                  <OrganizationCard
                    org={f0}
                    campusName={getCampusName(f0.campusId)}
                    large
                  />
                </div>
              ) : (
                <div className="lg:col-span-2 lg:row-span-2">
                  <GridPlaceholder />
                </div>
              )}

              {f1 ? (
                <div>
                  <OrganizationCard
                    org={f1}
                    campusName={getCampusName(f1.campusId)}
                  />
                </div>
              ) : (
                <div className="hidden lg:block">
                  <GridPlaceholder />
                </div>
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
                      Active student organizations currently registered across the
                      university network.
                    </p>
                  </div>

                  <div className="mt-8 space-y-3 pt-6 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-info font-medium">
                        Academic
                      </span>
                      <span className="font-mono font-bold text-info bg-info/10 px-2 py-0.5 rounded-md">
                        {stats.academic}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-warning font-medium">
                        Non-Academic
                      </span>
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

              {f2 ? (
                <div>
                  <OrganizationCard
                    org={f2}
                    campusName={getCampusName(f2.campusId)}
                  />
                </div>
              ) : (
                <div className="hidden lg:block">
                  <GridPlaceholder />
                </div>
              )}

              {f3 ? (
                <div>
                  <OrganizationCard
                    org={f3}
                    campusName={getCampusName(f3.campusId)}
                  />
                </div>
              ) : (
                <div className="hidden lg:block">
                  <GridPlaceholder />
                </div>
              )}

              {f4 ? (
                <div className="lg:col-span-2">
                  <OrganizationCard
                    org={f4}
                    campusName={getCampusName(f4.campusId)}
                  />
                </div>
              ) : (
                <div className="hidden lg:block lg:col-span-2">
                  <GridPlaceholder />
                </div>
              )}

              {f5 ? (
                <div className="lg:col-span-2">
                  <OrganizationCard
                    org={f5}
                    campusName={getCampusName(f5.campusId)}
                  />
                </div>
              ) : (
                <div className="hidden lg:block lg:col-span-2">
                  <GridPlaceholder />
                </div>
              )}
            </div>
          )}
        </Section>

        <Section className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                Browse Organizations
              </h2>
              <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
                Find your community by type or explore the full directory.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {browseCats.map(cat => (
                <Link
                  key={cat.title}
                  to={cat.href}
                  aria-label={`Browse ${cat.title}`}
                  className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div
                    className={`absolute inset-0 rounded-xl bg-linear-to-br ${cat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <cat.icon className="h-6 w-6" />
                      </div>
                      {cat.count !== null && (
                        <span className="font-mono text-2xl font-bold text-muted-foreground/30">
                          {cat.count}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-4 font-bold text-foreground group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {cat.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {campusOrgs.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-bold text-foreground mb-6">
                  Browse by Campus
                </h3>
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
            )}
          </div>
        </Section>

        <Section className="py-24 max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              Ready to find your community?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Browse all organizations, discover student communities, and connect
              with fellow students who share your interests.
            </p>
            <div className="mt-8 flex items-center justify-center">
              <Button size="lg" asChild className="h-12 px-8 font-bold shadow-lg">
                <Link to="/org">
                  Browse All Organizations{' '}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
