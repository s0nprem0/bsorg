import { orgRegistry } from '@/lib/orgIndex';
import type { OrgService } from './types';

export const StaticOrgService: OrgService = {
  getAll: () => orgRegistry.getAll(),
  getBySlug: slug => orgRegistry.getBySlug(slug),
  getAcademicOrgs: () => orgRegistry.getAcademicOrgs(),
  getNonAcademicOrgs: () => orgRegistry.getNonAcademicOrgs(),
};
