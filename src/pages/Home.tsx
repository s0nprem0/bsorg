import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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

import { orgRegistry } from '@/lib/orgIndex';
import { CAMPUSES } from '@/data/campuses';
import type { Organization } from '@/types/organization';

const getCampusName = (campusId?: number) => {
  if (campusId === undefined) return undefined;
  return CAMPUSES.find(campus => campus.id === campusId)?.name;
};

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

export default function Home() {
  const allOrgs = useMemo(() => orgRegistry.getAll(), []);

  const stats = useMemo(() => {
    return {
      total: allOrgs.length,
      academic: allOrgs.filter(org => org.type === 'Academic').length,
      nonAcademic: allOrgs.filter(org => org.type !== 'Academic').length,
    };
  }, [allOrgs]);

  const [featuredOrgs] = useState<Organization[]>(() =>
    shuffleOrganizationsBySeed(
      allOrgs,
      new Date().toISOString().slice(0, 10)
    ).slice(0, 6)
  );

  const [first, second, third, fourth, fifth, sixth] = featuredOrgs;

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

          <div className="grid auto-rows-fr gap-4 sm:gap-6 lg:grid-cols-4 lg:grid-rows-3">
            {first && (
              <div className="lg:col-span-2 lg:row-span-2">
                <OrganizationCard
                  org={first}
                  campusName={getCampusName(first.campusId)}
                  large
                />
              </div>
            )}

            {second && (
              <div className="lg:col-span-1">
                <OrganizationCard
                  org={second}
                  campusName={getCampusName(second.campusId)}
                />
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
                  <div className="mt-2 text-7xl font-extrabold tracking-tighter text-foreground drop-shadow-sm">
                    {stats.total}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed font-medium">
                    Active student organizations currently registered across the
                    university network.
                  </p>
                </div>

                <div className="mt-8 space-y-3 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">
                      Academic
                    </span>
                    <span className="font-mono font-bold text-foreground bg-surface-2 px-2 py-0.5 rounded-md">
                      {stats.academic}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">
                      Non-Academic
                    </span>
                    <span className="font-mono font-bold text-foreground bg-surface-2 px-2 py-0.5 rounded-md">
                      {stats.nonAcademic}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Remaining Grid Items */}
            {third && (
              <div className="lg:col-span-1">
                <OrganizationCard
                  org={third}
                  campusName={getCampusName(third.campusId)}
                />
              </div>
            )}
            {fourth && (
              <div className="lg:col-span-1">
                <OrganizationCard
                  org={fourth}
                  campusName={getCampusName(fourth.campusId)}
                />
              </div>
            )}
            {fifth && (
              <div className="lg:col-span-2">
                <OrganizationCard
                  org={fifth}
                  campusName={getCampusName(fifth.campusId)}
                />
              </div>
            )}
            {sixth && (
              <div className="lg:col-span-2">
                <OrganizationCard
                  org={sixth}
                  campusName={getCampusName(sixth.campusId)}
                />
              </div>
            )}
          </div>
        </Section>
      </main>
    </>
  );
}
