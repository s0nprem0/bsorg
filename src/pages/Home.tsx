import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import Hero from '@/components/sections/Hero';
import OrganizationCard from '@/components/OrganizationCard';
import Section from '@/components/ui/Section';
import { Button } from '@/components/ui/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';

import { orgRegistry } from '@/lib/orgIndex';
import { CAMPUSES } from '@/data/constants';
import type { Organization } from '@/types/organization';

const getCampusName = (campusId?: number) => {
  if (campusId === undefined) return undefined;
  return CAMPUSES.find((campus) => campus.id === campusId)?.name;
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
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
};

export default function Home() {
  const allOrgs = useMemo(() => orgRegistry.getAll(), []);

  const stats = useMemo(() => {
    return {
      total: allOrgs.length,
      academic: allOrgs.filter((org) => org.type === 'Academic').length,
      nonAcademic: allOrgs.filter((org) => org.type !== 'Academic').length,
    };
  }, [allOrgs]);

  const [featuredOrgs] = useState<Organization[]>(() =>
    shuffleOrganizationsBySeed(allOrgs, new Date().toISOString().slice(0, 10)).slice(0, 6)
  );

  const [first, second, third, fourth, fifth, sixth] = featuredOrgs;

  return (
    <>
      <title>BetterOSAS - Directory</title>
      <main className="grow">
        <Hero />

        <Section id="featured" className="py-16 md:py-24">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                Featured Organizations
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                At a glance, the essential student groups driving campus culture.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/organization">View Full Directory</Link>
            </Button>
          </div>

          <div className="grid auto-rows-fr gap-4 sm:gap-6 lg:grid-cols-4 lg:grid-rows-3">
            {first && (
              <div className="lg:col-span-2 lg:row-span-2">
                <OrganizationCard org={first} campusName={getCampusName(first.campusId)} large />
              </div>
            )}

            {second && (
              <div className="lg:col-span-1">
                <OrganizationCard org={second} campusName={getCampusName(second.campusId)} />
              </div>
            )}

            {/* Vercel-style Metric Card with Shadcn UI */}
            <Card className="relative flex flex-col justify-between overflow-hidden lg:col-span-1 lg:row-span-2 bg-surface-1 border-border">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent opacity-50" />
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold font-mono tracking-widest text-muted-foreground uppercase">
                  Platform Stats
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col h-full justify-between pb-6">
                <div>
                  <div className="mt-2 text-7xl font-light tracking-tighter text-foreground">
                    {stats.total}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed font-medium">
                    Active student organizations currently registered across the university network.
                  </p>
                </div>

                <div className="mt-8 space-y-3 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Academic</span>
                    <span className="font-mono font-bold text-foreground">{stats.academic}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Non-Academic</span>
                    <span className="font-mono font-bold text-foreground">{stats.nonAcademic}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Remaining Grid Items */}
            {third && (<div className="lg:col-span-1"><OrganizationCard org={third} campusName={getCampusName(third.campusId)} /></div>)}
            {fourth && (<div className="lg:col-span-1"><OrganizationCard org={fourth} campusName={getCampusName(fourth.campusId)} /></div>)}
            {fifth && (<div className="lg:col-span-2"><OrganizationCard org={fifth} campusName={getCampusName(fifth.campusId)} /></div>)}
            {sixth && (<div className="lg:col-span-2"><OrganizationCard org={sixth} campusName={getCampusName(sixth.campusId)} /></div>)}
          </div>
        </Section>
      </main>
    </>
  );
}