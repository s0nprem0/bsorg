import { orgRegistry } from '@/lib/orgIndex';
import type { OrgService } from './types';

function wrap<T>(fn: () => T): Promise<T> {
  return Promise.resolve(fn());
}

export const StaticOrgService: OrgService = {
  getAll: () => wrap(() => orgRegistry.getAll()),
  getBySlug: slug => wrap(() => orgRegistry.getBySlug(slug)),
};
