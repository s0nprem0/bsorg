import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import OrganizationCard from '@/components/OrganizationCard';
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

/** A plain responsive grid of cards. This was a bento layout whose declared
 *  row spans summed to four rows against a three-row grid, so the sixth card
 *  spilled into an implicit row and sat alone at half width. */
export default function FeaturedGrid({ allOrgs }: { allOrgs: Organization[] }) {
  const featuredOrgs = useMemo<Organization[]>(
    () => dailyShuffle(allOrgs, new Date().toISOString().slice(0, 10)).slice(0, 6),
    [allOrgs]
  );

  return (
    <section>
      <div className="flex items-baseline justify-between gap-4 px-2 pb-2">
        <h2 className="text-sm font-semibold">Featured today</h2>
        <Link
          to="/org"
          className="group inline-flex items-center gap-1 rounded text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          All {allOrgs.length}
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {featuredOrgs.length === 0 ? (
        <p className="rounded-panel border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No organizations registered yet.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredOrgs.map(org => (
            <OrganizationCard
              key={org.slug}
              org={org}
              campusName={getCampusName(org.campusId)}
            />
          ))}
        </div>
      )}
    </section>
  );
}