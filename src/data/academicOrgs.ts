// This file provides a utility to load academic orgs by college/category

import cas from '@/../contents/acadorgs/cas.json';
import ceit from '@/../contents/acadorgs/ceit.json';


export type AcademicOrg = {
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
  program?: string;
  logo?: string;
};


export const academicOrgsByCategory: Record<string, AcademicOrg[]> = {
  "College of Arts and Sciences": cas,
  "College of Engineering and Information Technology": ceit,
  // Add other colleges/categories here as you add more JSON files
};
