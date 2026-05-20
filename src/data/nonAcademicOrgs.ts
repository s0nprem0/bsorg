import type { Organization } from '@/types/organization';
import { orgRegistry } from '@/lib/orgIndex';

export type NonAcademicOrg = Organization;

// Collect clean pre-filtered global non-academic records
export const allNonAcademicOrgs: NonAcademicOrg[] = orgRegistry.getNonAcademicOrgs();

/**
 * Utility to fetch non-academic groups by targeted classification categories (e.g., 'SPU', 'PAG')
 */
export const getNonAcademicOrgsByCategory = (category: string): NonAcademicOrg[] => {
  if (!category) return [];
  return allNonAcademicOrgs.filter(
    (org) => org.category.toLowerCase().trim() === category.toLowerCase().trim()
  );
};