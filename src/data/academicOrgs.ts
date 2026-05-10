// This file provides a utility to load academic orgs by college/category
import cas from '@/../contents/acadorgs/cas.json';

export type AcademicOrg = typeof cas[number] & { slug: string; logo?: string };

export const academicOrgsByCategory: Record<string, AcademicOrg[]> = {
  CAS: cas,
  // Add other colleges/categories here as you add more JSON files
};
