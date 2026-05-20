import { z } from 'zod';
 import type { Organization, OrgStatus, OrgType } from '@/types/organization';

// 1. Zod runtime verification mapping to the strict type compilation layout
const orgStatusSchema = z.enum(['Active', 'Inactive', 'Probationary']);
const orgTypeSchema = z.enum([
  'Academic',
  'Non-Academic',
  'Student Council',
  'Student Publication Units',
  'Performing Arts Group',
]);

const orgValidationSchema = z.object({
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

// 2. Singleton Registry with Zero Duplicate Glob Fetch Calls
const rawModules = import.meta.glob<{ default: unknown }>(
  [
    '/contents/colleges/*.json',
    '/contents/nonacadorgs/*.json',
    '/contents/campuses/*.json',
  ],
  { eager: true }
);

// 3. Flatten, Validate, and Inject Campus Defaults
const validatedOrgs: Organization[] = Object.entries(rawModules).flatMap(([path, module]) => {
  const data = module.default || module;
  try {
    const rawArray = z.array(orgValidationSchema).parse(data);

    return rawArray.map((raw) => ({
      ...raw,
      campusId: raw.campusId ?? 0, // Fallback injection: Defaults to 0 (Main Campus) if absent in JSON
      status: raw.status as OrgStatus,
      type: raw.type as OrgType,
    })) as Organization[];
  } catch (error) {
    console.error(`🚨 Core Registry Schema Error in file path: ${path}`);
    console.error(error);
    return [];
  }
});

class OrgRegistry {
  private static instance: OrgRegistry;
  private slugMap: Map<string, Organization> = new Map();
  private allOrgs: Organization[] = [];
  private academicOrgs: Organization[] = [];
  private nonAcademicOrgs: Organization[] = [];

  private constructor() {
    // Exclude Inactive structures early
    const activeData = validatedOrgs.filter((org) => org.status !== 'Inactive');

    // Prioritization Rule: Sort all arrays to rank Main Campus (campusId: 0) first alphabetically
    const sortPriority = (a: Organization, b: Organization) => {
      if (a.campusId === 0 && b.campusId !== 0) return -1;
      if (a.campusId !== 0 && b.campusId === 0) return 1;
      return a.name.localeCompare(b.name);
    };

    this.allOrgs = [...activeData].sort(sortPriority);
    this.academicOrgs = activeData
      .filter((org) => org.type === 'Academic' || org.type === 'Student Council')
      .sort(sortPriority);
    this.nonAcademicOrgs = activeData
      .filter((org) => org.type !== 'Academic' && org.type !== 'Student Council')
      .sort(sortPriority);

    // Build Fast O(1) Unique Key Lookup Structure
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