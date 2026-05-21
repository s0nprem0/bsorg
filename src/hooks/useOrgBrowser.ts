import {
  useReducer,
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from 'react';
import { normalize } from '@/lib/utils';
import type { OrgType, FilterCategory } from '@/types/organization';
import { orgRegistry } from '@/lib/orgIndex';
import { ORG_BROWSER } from '@/data/constants';

type Action =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_ORG_TYPE'; payload: 'All' | OrgType }
  | { type: 'SET_CATEGORY'; payload: FilterCategory | 'All' }
  | { type: 'RESET' };

type FilterState = {
  query: string;
  orgType: 'All' | OrgType;
  category: FilterCategory | 'All';
};

const INITIAL_STATE: FilterState = {
  query: '',
  orgType: 'All',
  category: 'All',
};

function reducer(state: typeof INITIAL_STATE, action: Action): FilterState {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_ORG_TYPE':
      return { ...state, orgType: action.payload };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'RESET':
      return INITIAL_STATE;
    default:
      return state;
  }
}

// Integrated debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function useOrgBrowser() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [currentPage, setCurrentPage] = useState(1);
  const allOrgs = useMemo(() => orgRegistry.getAll(), []);

  const debouncedQuery = useDebounce(state.query, ORG_BROWSER.DEBOUNCE_DELAY);
  const isLoading = state.query !== debouncedQuery;

  const filteredOrgs = useMemo(() => {
    const q = normalize(debouncedQuery);
    return allOrgs.filter(org => {
      const matchesType = state.orgType === 'All' || org.type === state.orgType;
      const matchesCat =
        state.category === 'All' || org.category === state.category;
      if (!matchesType || !matchesCat) return false;
      if (!q) return true;

      const exactMatch =
        normalize(org.name).includes(q) ||
        normalize(org.acronym || '').includes(q);
      const deepMatch =
        org.metadata?.tags?.some(tag => normalize(tag).includes(q)) ||
        normalize(org.content?.shortDescription || '').includes(q);

      return exactMatch || deepMatch;
    });
  }, [allOrgs, debouncedQuery, state.orgType, state.category]);

  // Reset to page 1 when any filter changes
  const isInitial = useRef(true);
  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    setCurrentPage(1);
  }, [debouncedQuery, state.orgType, state.category]);

  const totalPages = Math.ceil(
    filteredOrgs.length / ORG_BROWSER.ITEMS_PER_PAGE
  );

  // [REFACTOR]: Accumulate visible organizations instead of slicing just one page
  const visibleOrgs = useMemo(() => {
    const limit = currentPage * ORG_BROWSER.ITEMS_PER_PAGE;
    return filteredOrgs.slice(0, limit);
  }, [filteredOrgs, currentPage]);

  const loadMore = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const categories = useMemo(() => {
    return (['All'] as string[]).concat(
      Array.from(
        new Set(
          allOrgs.map(o => (o.category || '').toString().trim()).filter(Boolean)
        )
      ).sort()
    );
  }, [allOrgs]);

  return {
    state,
    dispatch,
    visibleOrgs,
    hasMore: currentPage < totalPages,
    loadMore,
    isLoading,
    allOrgsCount: allOrgs.length,
    filteredCount: filteredOrgs.length,
    categories,
  };
}

