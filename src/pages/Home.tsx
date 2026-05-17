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
      <title>Home - Better Student Org</title>
      <main className="grow">
        <Hero />

        <Section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
                Featured Organizations
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-black md:text-4xl">
                At your glance, the student organizations you need to know about.
              </h2>
            </div>
            <Link
              to="/organization"
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Browse All Organizations
            </Link>
          </div>

          <Marquee
            className="mb-8 rounded-2xl border border-neutral-200 bg-white py-3"
            speed={360}
            items={featuredOrgs}
            renderItem={(org) => (
              <div className="flex items-center gap-3 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-2 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white">
                  {org.logo ? (
                    <img
                      src={org.logo}
                      alt={`${org.org} logo`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-sm font-bold text-neutral-500">
                      {org.org.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="whitespace-nowrap text-sm font-medium tracking-wide text-neutral-700">
                  {org.org}
                </span>
              </div>
            )}
          />

          <div className="grid auto-rows-[minmax(180px,auto)] gap-6 lg:grid-cols-4 lg:grid-rows-3">
            {first && (
              <div className="lg:col-span-2 lg:row-span-2">
                <OrganizationCard
                  {...first}
                  campus={getCampusName(first.campusId)}
                  large
                />
              </div>
            )}

            {second && (
              <div className="lg:col-span-1">
                <OrganizationCard
                  {...second}
                  campus={getCampusName(second.campusId)}
                />
              </div>
            )}

            <div className="rounded-2xl border border-neutral-200 bg-linear-to-br from-black to-neutral-800 p-6 text-white lg:col-span-1 lg:row-span-2">
              <p className="text-sm uppercase tracking-[0.25em] text-white/60">
                Directory Pulse
              </p>
              <div className="mt-6 text-5xl font-bold">{featuredOrgs.length}</div>
              <p className="mt-3 text-sm leading-6 text-white/75">
                Featured organizations are surfaced in a varied card layout so the
                most important entries stand out immediately.
              </p>
              <div className="mt-8 space-y-3 text-sm text-white/70">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span>Academic orgs</span>
                  <span>{featuredAcademic.length}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span>Non-academic orgs</span>
                  <span>{featuredNonAcademic.length}</span>
                </div>
              </div>
            </div>

            {third && (
              <div className="lg:col-span-1">
                <OrganizationCard
                  {...third}
                  campus={getCampusName(third.campusId)}
                />
              </div>
            )}

            {fourth && (
              <div className="lg:col-span-1">
                <OrganizationCard
                  {...fourth}
                  campus={getCampusName(fourth.campusId)}
                />
              </div>
            )}

            {fifth && (
              <div className="lg:col-span-2">
                <OrganizationCard
                  {...fifth}
                  campus={getCampusName(fifth.campusId)}
                />
              </div>
            )}

            {sixth && (
              <div className="lg:col-span-2">
                <OrganizationCard
                  {...sixth}
                  campus={getCampusName(sixth.campusId)}
                />
              </div>
            )}
          </div>
        </Section>
      </main>
    </>
  );
}
