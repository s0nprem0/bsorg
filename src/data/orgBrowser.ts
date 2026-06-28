export const ORG_BROWSER = {
  ITEMS_PER_PAGE: 12,
  DEBOUNCE_DELAY: 300,
  ORG_TYPE_OPTIONS: [
    'All',
    'Academic',
    'Non-Academic',
    'Student Council',
    'Student Publication Units',
    'Performing Arts Group',
  ],
} as const;

export const SORT_OPTIONS = {
  ASC: 'A-Z',
  DESC: 'Z-A',
  NEWEST: 'Newest',
} as const;

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];
