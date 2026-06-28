import { orgValidationSchema } from '@/lib/orgIndex';
import type { Organization } from '@/lib/orgIndex';
import { errorReporter } from '@/lib/errorReporter';
import type { OrgService } from './types';

function getBaseUrl(): string {
  const url = import.meta.env.VITE_ORG_API_URL;
  if (!url) throw new Error('VITE_ORG_API_URL is not set');
  return url;
}

let cache: Organization[] | null = null;
let cachePromise: Promise<Organization[]> | null = null;

async function loadAll(): Promise<Organization[]> {
  if (cache) return cache;
  if (cachePromise) return cachePromise;

  cachePromise = (async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(`${getBaseUrl()}/orgs`, { signal: controller.signal });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`API error: ${res.status}${body ? ` — ${body.slice(0, 200)}` : ''}`);
      }
      const data = await res.json();
      const orgs = orgValidationSchema.array().parse(data);
      cache = orgs;
      return cache;
    } catch (error) {
      cachePromise = null;
      errorReporter.capture(error, { source: 'ApiOrgService' });
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  })();

  return cachePromise;
}

async function loadBySlug(slug: string): Promise<Organization | undefined> {
  const all = await loadAll();
  return all.find(o => o.slug.toLowerCase() === slug.toLowerCase());
}

export const ApiOrgService: OrgService = {
  getAll: () => loadAll(),
  getBySlug: slug => loadBySlug(slug),
};
