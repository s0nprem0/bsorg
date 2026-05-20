import type { Organization } from '@/types/organization';

/**
 * 🚀 Vite Magic: import.meta.glob
 * This automatically finds and imports ALL JSON files matching the patterns.
 * { eager: true } tells Vite to bundle them at build time rather than lazy-loading.
 */
const jsonModules = import.meta.glob<{ default: Organization[] }>(
  [
    '/contents/colleges/*.json',
    '/contents/nonacadorgs/*.json',
    '/contents/campuses/*.json'
  ],
  { eager: true }
);

// Flatten all organization arrays from the imported modules into a single massive array
const allOrgsRaw: Organization[] = Object.values(jsonModules).flatMap(
  // Vite usually puts JSON contents inside a 'default' export when eagerly loaded
  (module) => module.default || module
) as unknown as Organization[];

class OrgRegistry {
  private static instance: OrgRegistry;
  private slugMap: Map<string, Organization> = new Map();
  private allOrgs: Organization[] = [];

  private constructor() {
    // Base filter to ignore Inactive organizations site-wide
    this.allOrgs = allOrgsRaw.filter(org => org.status !== 'Inactive');

    // Build the O(1) Lookup Map
    this.allOrgs.forEach(org => {
      if (org?.slug) {
        this.slugMap.set(org.slug.toLowerCase().trim(), org);
      }
    });
  }

  public static getInstance(): OrgRegistry {
    if (!OrgRegistry.instance) {
      OrgRegistry.instance = new OrgRegistry();
    }
    return OrgRegistry.instance;
  }

  public getAll(): Organization[] {
    return this.allOrgs;
  }

  public getBySlug(slug: string): Organization | undefined {
    if (!slug) return undefined;
    return this.slugMap.get(slug.toLowerCase().trim());
  }
}

export const orgRegistry = OrgRegistry.getInstance();