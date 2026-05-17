// This file provides a utility to load non-academic orgs

import orgs from '@/../contents/nonacadorgs/orgs.json';
import spuOrgs from '@/../contents/nonacadorgs/spu.json';

export type NonAcademicOrg = {
  campusId: number;
  slug: string;
  org: string;
  description?: string;
  contact: {
    email?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    x?: string;
    website?: string;
  };
  logo?: string;
};

export const nonAcademicOrgsByCategory: Record<string, NonAcademicOrg[]> = {
  "Student Organizations": orgs as NonAcademicOrg[],
  "Student Publication Units": spuOrgs as NonAcademicOrg[],
};