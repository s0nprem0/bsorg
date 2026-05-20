import { z } from 'zod';
import type { Organization } from '@/types/organization';

// 1. Setup strict Zod validation matching the strict TypeScript Organization schema
const orgStatusSchema = z.enum(['Active', 'Inactive', 'Probationary']);
const orgTypeSchema = z.enum([
  'Academic',
  'Non-Academic',
  'Student Council',
  'Student Publication Units',
  'Performing Arts Group',
]);

const orgSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  acronym: z.string().optional(),
  status: orgStatusSchema,
  type: orgTypeSchema,
  category: z.string(),
  campusId: z.number(),
  programId: z.string().optional(),
  metadata: z.object({
    foundedYear: z.number().optional(),
    accredited: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  }),
  content: z.object({
    shortDescription: z.string(),
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
  membership: z.object({
    isOpen: z.boolean(),
    requirements: z.array(z.string()).optional(),
  }).optional(),
});

// 2. Single Global Glob Fetcher for performance (Vite executes this exactly once)
const rawModules = import.meta.glob<{ default: unknown }>(
  [
    '/contents/colleges/*.json',
    '/contents/nonacadorgs/*.json',
    '/contents/campuses/*.json',
  ],
  { eager: true }
);

// 3. Centralized Validation and Parsing Loop
const allOrgsRaw: Organization[] = Object.entries(rawModules).flatMap(([path, module]) => {
  const data = module.default || module;
  try {
    return z.array(orgSchema).parse(data) as Organization[];
  } catch (error) {
    console.error(`🚨 Production Schema Validation Failed in data file: ${path}`);
    console.error(error);
    return []; // Resilient fallback: strips malformed files from building while maintaining uptime
  }
});

// 4. Thread-Safe Registry Singleton Pattern
class OrgRegistry {
  private static instance: OrgRegistry;
  private slugMap: Map<string, Organization> = new Map();
  private allOrgs: Organization[] = [];
  private academicOrgs: Organization[] = [];
  private nonAcademicOrgs: Organization[] = [];

  private constructor() {
    // Standard filter out of active directory matching initial registry filters
    const activeOrgs = allOrgsRaw.filter((org) => org.status !== 'Inactive');

    // Categorize data sets neatly based on type constraints
    this.academicOrgs = activeOrgs.filter(
      (org) => org.type === 'Academic' || org.type === 'Student Council'
    );
    this.nonAcademicOrgs = activeOrgs.filter(
      (org) => org.type !== 'Academic' && org.type !== 'Student Council'
    );
    this.allOrgs = activeOrgs;

    // Fast O(1) String-Key Lookup Optimization
    this.allOrgs.forEach((org) => {
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

  public getAcademicOrgs(): Organization[] {
    return this.academicOrgs;
  }

  public getNonAcademicOrgs(): Organization[] {
    return this.nonAcademicOrgs;
  }

  public getBySlug(slug: string): Organization | undefined {
    if (!slug) return undefined;
    return this.slugMap.get(slug.toLowerCase().trim());
  }
}

export const orgRegistry = OrgRegistry.getInstance();