// This file provides a utility to load non-academic orgs

import type { Organization } from '@/types/organization';
import orgs from '@/../contents/nonacadorgs/orgs.json';
import spuOrgs from '@/../contents/nonacadorgs/spu.json';
import pagOrgs from '@/../contents/nonacadorgs/pag.json';

import { ORGANIZATION_TYPES as ORG_TYPES } from './constants';
import { groupOrgsByCategory } from './orgDataUtils';

export type NonAcademicOrg = Organization;


// Use ORGANIZATION_TYPES values for both slug and name to match NonAcademicCategory
const nonAcadOrgData: Record<string, NonAcademicOrg[]> = {
  [ORG_TYPES.NON_ACADEMIC]: orgs as NonAcademicOrg[],
  [ORG_TYPES.STUDENT_PUBLICATION_UNITS]: spuOrgs as NonAcademicOrg[],
  [ORG_TYPES.PERFORMING_ARTS]: pagOrgs as NonAcademicOrg[],
};

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