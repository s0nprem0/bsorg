import type { Organization, OrgType } from '@/lib/orgIndex';

export const ORG_BROWSER = {
  ITEMS_PER_PAGE: 12,
  DEBOUNCE_DELAY: 300,
  ORG_TYPE_OPTIONS: [
    'All',
    'Academic',
    'Non-Academic',
    'Student Council',
    'Student Publication Units',
    'Performing Arts Group',
  ],
} as const;

export const SORT_OPTIONS = {
  ASC: 'A-Z',
  DESC: 'Z-A',
} as const;

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

/** Counts orgs the same way the browser filter compares them: exact match on
 *  `org.type`.
 *
 *  The home page used to count Academic + Student Council as "academic" and
 *  everything else as "non-academic", so its cards promised 68 and 21 while
 *  `/org?type=…` delivered 59 and 12. Anything that displays a type count has
 *  to come through here or the two drift apart again. */
export function countByType(orgs: Organization[], type: OrgType): number {
  return orgs.filter(org => org.type === type).length;
}
