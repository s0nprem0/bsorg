import type { Organization } from '@/lib/orgIndex';

export const CAMPUSES = [
  { id: 0, name: 'Main Campus', slug: 'main' },
  { id: 1, name: 'Imus Campus', slug: 'imus' },
  { id: 2, name: 'Bacoor Campus', slug: 'bacoor' },
  { id: 3, name: 'General Trias Campus', slug: 'general-trias' },
  { id: 4, name: 'Silang Campus', slug: 'silang' },
  { id: 5, name: 'Tanza Campus', slug: 'tanza' },
  { id: 6, name: 'Rosario Campus', slug: 'ccat' },
  { id: 7, name: 'Naic Campus', slug: 'naic' },
  { id: 8, name: 'Cavite City Campus', slug: 'cavite-city' },
  { id: 9, name: 'Trece Martires Campus', slug: 'trece-martires' },
  { id: 10, name: 'Maragondon Campus', slug: 'maragondon' },
] as const;

export function getCampusName(campusId?: number): string | undefined {
  if (campusId === undefined) return undefined;
  return CAMPUSES.find(campus => campus.id === campusId)?.name;
}

/** Campuses that actually have orgs, most populated first.
 *
 *  CAMPUSES lists all 11 in the university network, but 4 of them currently
 *  hold no orgs. Filtering on those yields an empty page, so the browser and
 *  the home page both derive their lists from the data instead. */
export function campusesWithOrgs(orgs: Organization[]) {
  const counts = new Map<number, number>();
  for (const org of orgs) {
    counts.set(org.campusId, (counts.get(org.campusId) ?? 0) + 1);
  }

  return CAMPUSES.filter(campus => counts.has(campus.id))
    .map(campus => ({ ...campus, count: counts.get(campus.id)! }))
    .sort((a, b) => b.count - a.count);
}