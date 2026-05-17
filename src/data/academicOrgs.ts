// This file provides a utility to load academic orgs by college/category

import cas from '@/../contents/colleges/cas.json';
import ceit from '@/../contents/colleges/ceit.json';
import cemds from '@/../contents/colleges/cemds.json';
import { COLLEGES, CAMPUSES } from './constants';

export type AcademicOrg = {
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
  };
  program?: string;
  logo?: string;
};

const academicOrgData: Record<string, AcademicOrg[]> = {
  cas: cas as AcademicOrg[],
  ceit: ceit as AcademicOrg[],
  cemds: cemds as AcademicOrg[],
};

// Organize academic orgs by college/category
export const academicOrgsByCategory: Record<string, AcademicOrg[]> =
  COLLEGES.reduce(
    (acc, college) => {
      const orgs = academicOrgData[college.slug];
      if (orgs && orgs.length > 0) {
        acc[college.name] = orgs;
      }
      return acc;
    },
    {} as Record<string, AcademicOrg[]>
  );

// Organize academic orgs by campus for quick lookup
export const academicOrgsByCampus: Record<number, AcademicOrg[]> = CAMPUSES.reduce((acc, campus) => {
  acc[campus.id] = [];
  return acc;
}, {} as Record<number, AcademicOrg[]>);