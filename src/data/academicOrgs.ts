import type { Organization } from '@/types/organization';
import { COLLEGES, CAMPUSES } from './constants';
import { groupOrgsByCategory } from './orgDataUtils';
import { orgRegistry } from '@/lib/orgIndex';

export type AcademicOrg = Organization;

// Load pre-validated records safely from the registry source
const allAcademicOrgs = orgRegistry.getAcademicOrgs();

// Build College Mappings for Main Campus View
const academicOrgData: Record<string, AcademicOrg[]> = {};

allAcademicOrgs.forEach((org) => {
  if (!org || !org.category) return;

  const college = COLLEGES.find(
    (c) => c.name === org.category || c.slug === org.category
  );
  if (college) {
    if (!academicOrgData[college.slug]) {
      academicOrgData[college.slug] = [];
    }
    academicOrgData[college.slug].push(org);
  }
});

export const academicOrgsByCategory: Record<string, AcademicOrg[]> = groupOrgsByCategory(
  academicOrgData,
  [...COLLEGES],
  'name'
);

// Map All Academic Orgs by Campus ID including all Satellites seamlessly
export const academicOrgsByCampus: Record<number, AcademicOrg[]> = CAMPUSES.reduce(
  (acc, campus) => {
    acc[campus.id] = allAcademicOrgs.filter((org) => org.campusId === campus.id);
    return acc;
  },
  {} as Record<number, AcademicOrg[]>
);