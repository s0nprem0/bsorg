// This file provides a utility to load non-academic orgs

import type { Organization } from '@/types/organization';

// Dynamically import all non-academic org JSON files using Vite's import.meta.glob
const nonAcadOrgModules = import.meta.glob<{ default: Organization[] }>(
  '/contents/nonacadorgs/*.json',
  { eager: true }
);

// Flatten all orgs from the imported modules
const allNonAcademicOrgs: NonAcademicOrg[] = Object.values(nonAcadOrgModules).flatMap(
  (module) => module.default || module
) as NonAcademicOrg[];

import { ORGANIZATION_TYPES as ORG_TYPES } from './constants';
import { groupOrgsByCategory } from './orgDataUtils';

export type NonAcademicOrg = Organization;


// Group orgs by type (category)
const nonAcadOrgData: Record<string, NonAcademicOrg[]> = {};
for (const org of allNonAcademicOrgs) {
  if (!org || !org.type) continue;
  if (!nonAcadOrgData[org.type]) nonAcadOrgData[org.type] = [];
  nonAcadOrgData[org.type].push(org);
}

const NON_ACAD_CATEGORIES: { slug: string; name: string }[] = [
  { slug: ORG_TYPES.NON_ACADEMIC, name: ORG_TYPES.NON_ACADEMIC },
  { slug: ORG_TYPES.STUDENT_PUBLICATION_UNITS, name: ORG_TYPES.STUDENT_PUBLICATION_UNITS },
  { slug: ORG_TYPES.PERFORMING_ARTS, name: ORG_TYPES.PERFORMING_ARTS },
];

export const nonAcademicOrgsByCategory: Record<string, NonAcademicOrg[]> = groupOrgsByCategory(
  nonAcadOrgData,
  NON_ACAD_CATEGORIES,
  'name'
);