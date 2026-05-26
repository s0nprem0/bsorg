export const ORG_BROWSER = {
  ITEMS_PER_PAGE: 12,
  DEBOUNCE_DELAY: 300,
  ORG_TYPE_OPTIONS: ['All', 'Academic', 'Non-Academic'],
  PLACEHOLDER_TEXT: {
    SEARCH: 'Search organizations...',
    ALL_TYPES: 'All Types',
    ALL_CATEGORIES: 'All Categories',
  },
  MESSAGES: {
    TITLE: 'Organization Browser',
    SUBTITLE: 'Discover and explore student organizations across campus.',
    NO_RESULTS: 'No organizations match your current filters.',
    NO_RESULTS_SUBTEXT: 'Try adjusting your search or filters.',
    CLEAR_FILTERS: 'Clear filters',
  },
} as const;

export const SORT_OPTIONS = {
  ASC: 'A-Z',
  DESC: 'Z-A',
  NEWEST: 'Newest',
} as const;

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];
