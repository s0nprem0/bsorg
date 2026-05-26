import type { Organization } from '@/types/organization';
import { COLLEGES } from './colleges';
import { CAMPUSES } from './campuses';
import { groupOrgsByCategory } from './orgDataUtils';
import { orgRegistry } from '@/lib/orgIndex';

export type AcademicOrg = Organization;

// Extract clean datasets instantly out of our centralized store
const allAcademicOrgs = orgRegistry.getAcademicOrgs();

// Dictionary Mapping for Main Campus College views
const academicOrgData: Record<string, AcademicOrg[]> = {};

allAcademicOrgs.forEach(org => {
  if (!org || !org.category) return;

  const college = COLLEGES.find(
    c => c.name === org.category || c.slug === org.category
  );
  if (college) {
    if (!academicOrgData[college.slug]) {
      academicOrgData[college.slug] = [];
    }
    academicOrgData[college.slug].push(org);
  }
});

export const academicOrgsByCategory: Record<string, AcademicOrg[]> =
  groupOrgsByCategory(academicOrgData, [...COLLEGES], 'name');

// Map Organizations systematically by Campus IDs ensuring Main (0) displays on load
export const academicOrgsByCampus: Record<number, AcademicOrg[]> =
  CAMPUSES.reduce(
    (acc, campus) => {
      acc[campus.id] = allAcademicOrgs.filter(
        org => org.campusId === campus.id
      );
      return acc;
    },
    {} as Record<number, AcademicOrg[]>
  );
