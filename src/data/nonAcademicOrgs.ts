// This file provides a utility to load non-academic orgs

import type { Organization } from '@/types/organization';
import orgs from '@/../contents/nonacadorgs/orgs.json';
import spuOrgs from '@/../contents/nonacadorgs/spu.json';

export type NonAcademicOrg = Organization;

export const nonAcademicOrgsByCategory: Record<string, NonAcademicOrg[]> = {
  "Student Organizations": orgs as NonAcademicOrg[],
  "Student Publication Units": spuOrgs as NonAcademicOrg[],
};