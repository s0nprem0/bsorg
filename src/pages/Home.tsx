import Hero from '@/components/sections/Hero';
import OrganizationCard from '@/components/OrganizationCard';
import Marquee from '@/components/ui/Marquee';
import Section from '@/components/ui/Section';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { academicOrgsByCategory } from '@/data/academicOrgs';
import { nonAcademicOrgsByCategory } from '@/data/nonAcademicOrgs';
import { CAMPUSES } from '@/data/constants';

const getCampusName = (campusId: number) =>
  CAMPUSES.find((campus) => campus.id === campusId)?.name;

const featuredAcademic = Object.values(academicOrgsByCategory)
  .flatMap((orgs) => orgs.slice(0, 1));

const featuredNonAcademic = Object.values(nonAcademicOrgsByCategory)
  .flatMap((orgs) => orgs.slice(0, 1));

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
  const [featuredOrgs] = useState(() =>
    shuffleOrganizationsBySeed(
      Array.from(
        new Map([...featuredAcademic, ...featuredNonAcademic].map((org) => [org.slug, org])).values()
      ).slice(0, 6),
      new Date().toISOString().slice(0, 10)
    )
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
              <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Featured Organizations
              </h2>
              <p className="mt-2 text-foreground-secondary">
                At a glance, the essential student groups driving campus culture.
              </p>
            </div>
            <Link
              to="/organization"
              className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-surface-1 px-4 text-sm font-medium text-foreground hover:bg-surface-2 transition-colors"
            >
              View Directory
            </Link>
          </div>

          <div className="grid auto-rows-fr gap-6 lg:grid-cols-4 lg:grid-rows-3">
            {first && (
              <div className="lg:col-span-2 lg:row-span-2">
                <OrganizationCard {...first} campus={getCampusName(first.campusId)} large />
              </div>
            )}

            {second && (
              <div className="lg:col-span-1">
                <OrganizationCard {...second} campus={getCampusName(second.campusId)} />
              </div>
            )}

            {/* Vercel-style Metric Card */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface-1 p-6 lg:col-span-1 lg:row-span-2">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-border to-foreground-muted opacity-20" />
              <div>
                <p className="text-xs font-mono tracking-wider text-foreground-secondary uppercase">
                  System Stats
                </p>
                <div className="mt-4 text-6xl font-light tracking-tighter text-foreground">
                  {featuredOrgs.length}
                </div>
                <p className="mt-2 text-sm text-foreground-secondary leading-relaxed">
                  Featured organizations surfaced actively to highlight campus involvement.
                </p>
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-secondary">Academic</span>
                  <span className="font-mono text-foreground">{featuredAcademic.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground-secondary">Non-Academic</span>
                  <span className="font-mono text-foreground">{featuredNonAcademic.length}</span>
                </div>
              </div>
            </div>

            {third && (<div className="lg:col-span-1"><OrganizationCard {...third} campus={getCampusName(third.campusId)} /></div>)}
            {fourth && (<div className="lg:col-span-1"><OrganizationCard {...fourth} campus={getCampusName(fourth.campusId)} /></div>)}
            {fifth && (<div className="lg:col-span-2"><OrganizationCard {...fifth} campus={getCampusName(fifth.campusId)} /></div>)}
            {sixth && (<div className="lg:col-span-2"><OrganizationCard {...sixth} campus={getCampusName(sixth.campusId)} /></div>)}
          </div>
        </Section>
      </main>
    </>
  );
}