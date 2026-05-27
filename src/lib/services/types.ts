import type { Organization } from '@/lib/orgIndex';

export interface OrgService {
  getAll(): Organization[];
  getBySlug(slug: string): Organization | undefined;
  getAcademicOrgs(): Organization[];
  getNonAcademicOrgs(): Organization[];
}
