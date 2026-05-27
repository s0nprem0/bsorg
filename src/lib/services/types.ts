import type { Organization } from '@/lib/orgIndex';

export interface OrgService {
  getAll(): Promise<Organization[]>;
  getBySlug(slug: string): Promise<Organization | undefined>;
  getAcademicOrgs(): Promise<Organization[]>;
  getNonAcademicOrgs(): Promise<Organization[]>;
}
