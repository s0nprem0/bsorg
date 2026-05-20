// This file provides a utility to load academic orgs by college/category

import type { Organization } from '@/types/organization';

// Dynamically import all college org JSON files using Vite's import.meta.glob
const collegeOrgModules = import.meta.glob<{ default: Organization[] }>(
  '/contents/colleges/*.json',
  { eager: true }
);

// Flatten all orgs from the imported modules
const allAcademicOrgs: AcademicOrg[] = Object.values(collegeOrgModules).flatMap(
  (module) => module.default || module
) as AcademicOrg[];

import { COLLEGES, CAMPUSES } from './constants';
import { groupOrgsByCategory } from './orgDataUtils';

export type AcademicOrg = Organization;

// Group orgs by college slug
const academicOrgData: Record<string, AcademicOrg[]> = {};
for (const org of allAcademicOrgs) {
  if (!org || !org.category) continue;
  // Find the college slug for this org
  const college = COLLEGES.find(c => c.name === org.category || c.slug === org.category);
  if (!college) continue;
  if (!academicOrgData[college.slug]) academicOrgData[college.slug] = [];
  academicOrgData[college.slug].push(org);
}

export const academicOrgsByCategory: Record<string, AcademicOrg[]> = groupOrgsByCategory(
  academicOrgData,
  [...COLLEGES],
  'name'
);

// Organize academic orgs by campus for quick lookup
export const academicOrgsByCampus: Record<number, AcademicOrg[]> = CAMPUSES.reduce((acc, campus) => {
  acc[campus.id] = [];
  return acc;
}, {} as Record<number, AcademicOrg[]>);