// Re-export all constants from domain-specific files for backward compatibility
export { CAMPUSES } from './campuses';
export { COLLEGES } from './colleges';
export { PROGRAMS } from './programs';
export { CONTACT_ICONS } from './contactIcons';
export { ORG_CARD } from './orgCard';
export {
  ORG_BROWSER,
  SORT_OPTIONS,
  type SortOption,
} from './orgBrowser';

// Organization types remain here as core app config
export const ORGANIZATION_TYPES = {
  STUDENT_COUNCIL: 'Student Council',
  ACADEMIC: 'Academic',
  NON_ACADEMIC: 'Non-Academic',
  PERFORMING_ARTS: 'Performing Arts Group',
  STUDENT_PUBLICATION_UNITS: 'Student Publication Units',
} as const;
