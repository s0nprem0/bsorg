import { z } from 'zod';
import type { Organization } from '@/types/organization';

// 1. Schema for validating the structure of organization data
const orgSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  status: z.enum(['Active', 'Inactive', 'Probationary']),
  type: z.enum(['Academic', 'Non-Academic', 'Student Council', 'Student Publication Units', 'Performing Arts Group']),
  category: z.string(),
  campusId: z.number(),
  programId: z.string().optional(),

  metadata: z.object({
    foundedYear: z.number().optional(),
    accredited: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  }),

  content: z.object({
    shortDescription: z.string().optional(),
    about: z.string().optional(),
    mission: z.string().optional(),
    vision: z.string().optional(),
  }),

  assets: z.object({
    logoUrl: z.string().optional(),
    bannerUrl: z.string().optional(),
    galleryUrls: z.array(z.string()).optional(),
  }),

  contact: z.object({
    email: z.string().optional(),
    website: z.string().optional(),
    officeLocation: z.string().optional(),
    social: z.object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      x: z.string().optional(),
      tiktok: z.string().optional(),
      linkedin: z.string().optional(),
      youtube: z.string().optional(),
    }).optional(),
  }),
});

// 2. Fetch all JSON files safely
const rawModules = import.meta.glob<{ default: unknown }>(
  [
    '/contents/colleges/*.json',
    '/contents/nonacadorgs/*.json',
    '/contents/campuses/*.json'
  ],
  { eager: true }
);

// 3. Parse, Validate, and Flatten
const allOrgsRaw: Organization[] = Object.entries(rawModules).flatMap(([path, module]) => {
  const data = module.default || module;

  // Zod will parse the array and throw a massive error if any object fails
  try {
    return z.array(orgSchema).parse(data) as Organization[];
  } catch (error) {
    console.error(`🚨 Schema Validation Failed in file: ${path}`);
    console.error(error);
    return []; // Return empty array so the app doesn't completely crash, just drops the bad data
  }
});

// 4. Organization Registry
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