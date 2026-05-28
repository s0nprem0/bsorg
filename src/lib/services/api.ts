import { orgValidationSchema } from '@/lib/orgIndex';
import type { Organization } from '@/lib/orgIndex';
import { errorReporter } from '@/lib/errorReporter';
import type { OrgService } from './types';

function getBaseUrl(): string {
  return import.meta.env.VITE_ORG_API_URL || 'http://localhost:3001/api';
}

let cache: Organization[] | null = null;
let cachePromise: Promise<Organization[]> | null = null;

async function loadAll(): Promise<Organization[]> {
  if (cache) return cache;
  if (cachePromise) return cachePromise;

  cachePromise = (async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/orgs`);
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`API error: ${res.status}${body ? ` — ${body.slice(0, 200)}` : ''}`);
      }
      const data = await res.json();
      const orgs = orgValidationSchema.array().parse(data);
      cache = orgs.map(o => ({ ...o, campusId: o.campusId ?? 0 }));
      return cache;
    } catch (error) {
      cachePromise = null;
      errorReporter.capture(error, { source: 'ApiOrgService' });
      throw error;
    }
  })();

  return cachePromise;
}

async function loadBySlug(slug: string): Promise<Organization | undefined> {
  const all = await loadAll();
  return all.find(o => o.slug.toLowerCase() === slug.toLowerCase());
}

function isAcademic(org: Organization): boolean {
  return org.type === 'Academic' || org.type === 'Student Council';
}

export const ApiOrgService: OrgService = {
  getAll: () => loadAll(),
  getBySlug: slug => loadBySlug(slug),
  getAcademicOrgs: async () => (await loadAll()).filter(isAcademic),
  getNonAcademicOrgs: async () => (await loadAll()).filter(o => !isAcademic(o)),
};
