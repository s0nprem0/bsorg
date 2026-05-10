// This file provides a utility to load non-academic orgs

import orgs from '@/../contents/nonacadorgs/orgs.json';

export type NonAcademicOrg = {
  slug: string;
  org: string;
  description?: string;
  contact: {
    email: string;
    facebook: string;
    instagram?: string;
    tiktok?: string;
    x?: string;
  };
  logo?: string;
};

export const nonAcademicOrgsByCategory: Record<string, NonAcademicOrg[]> = {
  "Student Organizations": orgs,
  // Add other categories here as you add more JSON files
};
