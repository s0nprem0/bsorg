import { z } from 'zod';
import { errorReporter } from './errorReporter';

// 1. Single Source of Truth: Zod Schema
export const orgTypeSchema = z.enum([
  'Academic',
  'Non-Academic',
  'Student Council',
  'Student Publication Units',
  'Performing Arts Group',
]);

export const ORG_CATEGORIES = [
  'College of Agriculture, Food, Environment and Natural Resources',
  'College of Arts and Sciences',
  'College of Criminal Justice',
  'College of Economics, Management and Development Studies',
  'College of Engineering and Information Technology',
  'College of Nursing',
  'College of Sports, Physical Education, Arts and Recreation',
  'College of Tourism and Hospitality Management',
  'Imus Campus',
  'Naic Campus',
  'Performing Arts Group',
  'Student Publication Units',
  'Trece Martires Campus',
  'University-Wide',
] as const;

export const orgCategorySchema = z.enum([
  'College of Agriculture, Food, Environment and Natural Resources',
  'College of Arts and Sciences',
  'College of Criminal Justice',
  'College of Economics, Management and Development Studies',
  'College of Engineering and Information Technology',
  'College of Nursing',
  'College of Sports, Physical Education, Arts and Recreation',
  'College of Tourism and Hospitality Management',
  'Imus Campus',
  'Naic Campus',
  'Performing Arts Group',
  'Student Publication Units',
  'Trece Martires Campus',
  'University-Wide',
]);

export const orgValidationSchema = z.object({
  slug: z.string(),
  name: z.string(),
  acronym: z.string().optional(),
  active: z.boolean().default(true),
  type: orgTypeSchema,
  campusId: z.number(),
  category: orgCategorySchema,
  programId: z.string().optional(),
  parentSlug: z.array(z.string()).optional(),
  metadata: z
    .object({
      foundedYear: z.number().optional(),
      accredited: z.boolean().optional(),
      tags: z.array(z.string()).optional(),
    })
    .default({}),
  content: z
    .object({
      shortDescription: z.string().optional(),
      about: z.string().optional(),
    })
    .optional()
    .default({}),
  assets: z
    .object({
      logoUrl: z.string().optional(),
      bannerUrl: z.string().optional(),
    })
    .default({}),
  contact: z
    .object({
      email: z.email().optional(),
      website: z.url().optional(),
      social: z
        .object({
          facebook: z.url().optional(),
          instagram: z.url().optional(),
          x: z.url().optional(),
          tiktok: z.url().optional(),
          linkedin: z.url().optional(),
          youtube: z.url().optional(),
        })
        .optional(),
    })
    .default({}),
});

// Automatically infer TypeScript types from the schema
export type Organization = z.infer<typeof orgValidationSchema>;
export type OrgType = z.infer<typeof orgTypeSchema>;

// 2. Singleton Registry
const rawModules = import.meta.glob<{ default: unknown }>(
  [
    '/contents/colleges/*.json',
    '/contents/nonacadorgs/*.json',
    '/contents/campuses/*.json',
  ],
  { eager: true }
);

// 3. Flatten and Validate
const validatedOrgs: Organization[] = Object.entries(rawModules).flatMap(
  ([path, module]) => {
    const data = module.default || module;
    try {
      const rawArray = z.array(orgValidationSchema).parse(data);

      // Type assertions are no longer needed; Zod handles the typing safely
      return rawArray;
    } catch (error) {
      errorReporter.capture(error, { source: 'orgIndex', filePath: path });
      return [];
    }
  }
);

class OrgRegistry {
  private static instance: OrgRegistry;
  private slugMap: Map<string, Organization> = new Map();
  private allOrgs: Organization[] = [];


  private constructor() {
    const activeData = validatedOrgs.filter(org => org.active);

    const sortPriority = (a: Organization, b: Organization) => {
      if (a.campusId === 0 && b.campusId !== 0) return -1;
      if (a.campusId !== 0 && b.campusId === 0) return 1;
      return a.name.localeCompare(b.name);
    };

    this.allOrgs = [...activeData].sort(sortPriority);

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
