// This file provides a utility to load non-academic orgs

import type { Organization, NonAcademicCategory } from '@/types/organization';
import orgs from '@/../contents/nonacadorgs/orgs.json';
import spuOrgs from '@/../contents/nonacadorgs/spu.json';
import pagOrgs from '@/../contents/nonacadorgs/pag.json';

import { ORGANIZATION_TYPES as ORG_TYPES } from './constants';

export type NonAcademicOrg = Organization;

export const nonAcademicOrgsByCategory: Record<NonAcademicCategory, NonAcademicOrg[]> = {
  [ORG_TYPES.NON_ACADEMIC]: orgs as NonAcademicOrg[],
  [ORG_TYPES.STUDENT_PUBLICATION_UNITS]: spuOrgs as NonAcademicOrg[],
  [ORG_TYPES.PERFORMING_ARTS]: pagOrgs as NonAcademicOrg[],
};