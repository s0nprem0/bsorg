// This file provides a utility to load academic orgs by college/category

import type { Organization } from '@/types/organization';

const academicOrgModules = import.meta.glob<{ default: Organization[] }>(
  [
    '/contents/colleges/*.json', // Main campus academic orgs are categorized by college
    '/contents/campuses/*.json' // Sattelite campus orgs
  ],
  { eager: true }
);
// Flatten all orgs from the imported modules
const allAcademicOrgs: AcademicOrg[] = Object.values(academicOrgModules).flatMap(
  (module) => module.default || module
) as AcademicOrg[];

import { COLLEGES, CAMPUSES } from './constants';
import { groupOrgsByCategory } from './orgDataUtils';

export type AcademicOrg = Organization;

// 2. Group by College for Main Campus
const academicOrgData: Record<string, AcademicOrg[]> = {};
for (const org of allAcademicOrgs) {
  if (!org || !org.category) continue;

  const college = COLLEGES.find(c => c.name === org.category || c.slug === org.category);
  if (college) {
    if (!academicOrgData[college.slug]) academicOrgData[college.slug] = [];
    academicOrgData[college.slug].push(org);
  }
}

export const academicOrgsByCategory: Record<string, AcademicOrg[]> = groupOrgsByCategory(
  academicOrgData,
  [...COLLEGES],
  'name'
);

// Organize ALL academic orgs by campus ID
export const academicOrgsByCampus: Record<number, AcademicOrg[]> = CAMPUSES.reduce((acc, campus) => {
  // Filter the flattened array by campusId to populate the record
  acc[campus.id] = allAcademicOrgs.filter(org => org.campusId === campus.id);
  return acc;
}, {} as Record<number, AcademicOrg[]>);