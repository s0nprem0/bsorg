// This file provides a utility to load academic orgs by college/category

import type { Organization } from '@/types/organization';
import cas from '@/../contents/colleges/cas.json';
import ceit from '@/../contents/colleges/ceit.json';
import cemds from '@/../contents/colleges/cemds.json';
import ccj from '@/../contents/colleges/ccj.json';
import cspear from '@/../contents/colleges/cspear.json';
import cafenr from '@/../contents/colleges/cafenr.json';
import cthm from '@/../contents/colleges/cthm.json';

import { COLLEGES, CAMPUSES } from './constants';
import { groupOrgsByCategory } from './orgDataUtils';

export type AcademicOrg = Organization;

const academicOrgData: Record<string, AcademicOrg[]> = {
  cas: cas as AcademicOrg[],
  ceit: ceit as AcademicOrg[],
  cemds: cemds as AcademicOrg[],
  ccj: ccj as AcademicOrg[],
  cspear: cspear as AcademicOrg[],
  cafenr: cafenr as AcademicOrg[],
  cthm: cthm as AcademicOrg[],
};

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