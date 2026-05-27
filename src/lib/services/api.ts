import type { Organization } from '@/lib/orgIndex';
import type { OrgService } from './types';

export const ApiOrgService: OrgService = {
  getAll(): Organization[] {
    throw new Error('API service not yet implemented');
  },
  getBySlug(_slug: string): Organization | undefined {
    throw new Error('API service not yet implemented');
  },
  getAcademicOrgs(): Organization[] {
    throw new Error('API service not yet implemented');
  },
  getNonAcademicOrgs(): Organization[] {
    throw new Error('API service not yet implemented');
  },
};
