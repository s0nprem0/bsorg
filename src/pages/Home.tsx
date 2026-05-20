import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import Hero from '@/components/sections/Hero';
import OrganizationCard from '@/components/OrganizationCard';
import Section from '@/components/ui/Section';

import { orgRegistry } from '@/lib/orgIndex';
import { CAMPUSES } from '@/data/constants';
import type { Organization } from '@/types/organization';

const getCampusName = (campusId?: number) => {
  if (campusId === undefined) return undefined;
  return CAMPUSES.find((campus) => campus.id === campusId)?.name;
};

// Seeded randomizer utilities to ensure the "Featured" list stays consistent
// for the duration of a single day, rather than flashing on every navigation.
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
  // Use the new Singleton Registry to get all active organizations instantly
  const allOrgs = useMemo(() => orgRegistry.getAll(), []);

  // Calculate real system stats dynamically
  const stats = useMemo(() => {
    return {
      total: allOrgs.length,
      academic: allOrgs.filter((org) => org.type === 'Academic').length,
      nonAcademic: allOrgs.filter((org) => org.type !== 'Academic').length,
    };
  }, [allOrgs]);

  // Shuffle all organizations based on today's date, then pick top 6
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
              <p className="mt-3 text-lg text-foreground-secondary">
                At a glance, the essential student groups driving campus culture.
              </p>
            </div>
            <Link
              to="/organization"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface-1 px-5 text-sm font-semibold text-foreground hover:bg-surface-2 hover:border-foreground-muted transition-all"
            >
              View Full Directory
            </Link>
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

            {/* Vercel-style Metric Card Updated with Real Data */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface-1 p-6 lg:col-span-1 lg:row-span-2 shadow-sm">
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary-500 to-secondary-500 opacity-50" />
              <div>
                <p className="text-xs font-bold font-mono tracking-widest text-foreground-tertiary uppercase">
                  Platform Stats
                </p>
                <div className="mt-4 text-7xl font-light tracking-tighter text-foreground">
                  {stats.total}
                </div>
                <p className="mt-2 text-sm text-foreground-secondary leading-relaxed font-medium">
                  Active student organizations currently registered across the university network.
                </p>
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-secondary font-medium">Academic</span>
                  <span className="font-mono font-bold text-foreground">{stats.academic}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-secondary font-medium">Non-Academic</span>
                  <span className="font-mono font-bold text-foreground">{stats.nonAcademic}</span>
                </div>
              </div>
            </div>

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