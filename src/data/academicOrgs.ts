// This file provides a utility to load academic orgs by college/category

import cas from '@/../contents/colleges/cas.json';
import ceit from '@/../contents/colleges/ceit.json';
import cemds from '@/../contents/colleges/cemds.json';
import { COLLEGES } from './constants';

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

const academicOrgData: Record<string, AcademicOrg[]> = {
  cas,
  ceit,
  cemds,
};

export const academicOrgsByCategory: Record<string, AcademicOrg[]> =
  COLLEGES.reduce(
    (acc, college) => {
      const orgs = academicOrgData[college.slug];
      if (orgs) {
        acc[college.name] = orgs;
      }
      return acc;
    },
    {} as Record<string, AcademicOrg[]>
  );
