// src/hooks/useOrgBrowser.ts
import {
  useReducer,
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { normalize } from '@/lib/utils';
import type { OrgType, FilterCategory } from '@/types/organization';
import { orgRegistry } from '@/lib/orgIndex';
import { ORG_BROWSER } from '@/data/constants';

// Added SortOption type
export type SortOption = 'A-Z' | 'Z-A' | 'Newest';

type Action =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_ORG_TYPE'; payload: 'All' | OrgType }
  | { type: 'SET_CATEGORY'; payload: FilterCategory | 'All' }
  | { type: 'SET_SORT'; payload: SortOption }
  | { type: 'RESET' };

type FilterState = {
  query: string;
  orgType: 'All' | OrgType;
  category: FilterCategory | 'All';
  sortBy: SortOption;
};

const INITIAL_STATE: FilterState = {
  query: '',
  orgType: 'All',
  category: 'All',
  sortBy: 'A-Z', // Default sort
};

function reducer(state: FilterState, action: Action): FilterState {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_ORG_TYPE':
      return { ...state, orgType: action.payload };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
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
  // 1.A: Hook into the URL search params
  const [searchParams, setSearchParams] = useSearchParams();

  // 1.A: Initialize state from the URL if params exist
  const [state, dispatch] = useReducer(reducer, {
    query: searchParams.get('q') || INITIAL_STATE.query,
    orgType:
      (searchParams.get('type') as 'All' | OrgType) || INITIAL_STATE.orgType,
    category:
      (searchParams.get('category') as FilterCategory | 'All') ||
      INITIAL_STATE.category,
    sortBy: (searchParams.get('sort') as SortOption) || INITIAL_STATE.sortBy,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const allOrgs = useMemo(() => orgRegistry.getAll(), []);

  const debouncedQuery = useDebounce(state.query, ORG_BROWSER.DEBOUNCE_DELAY);
  const isLoading = state.query !== debouncedQuery;

  // 1.A: Sync state changes back to the URL parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (state.query) params.set('q', state.query);
    if (state.orgType !== 'All') params.set('type', state.orgType);
    if (state.category !== 'All') params.set('category', state.category);
    if (state.sortBy !== 'A-Z') params.set('sort', state.sortBy);

    // Using replace: true so we don't clutter the browser history with every single keystroke
    setSearchParams(params, { replace: true });
  }, [state, setSearchParams]);

  const filteredOrgs = useMemo(() => {
    const q = normalize(debouncedQuery);

    // Filtering Logic
    let result = allOrgs.filter(org => {
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

    // 1.B: Sorting Logic
    result.sort((a, b) => {
      if (state.sortBy === 'A-Z') {
        return a.name.localeCompare(b.name);
      } else if (state.sortBy === 'Z-A') {
        return b.name.localeCompare(a.name);
      } else if (state.sortBy === 'Newest') {
        // Parse foundedYear string to a number for comparison
        const yearA = parseInt(a.metadata?.foundedYear as string) || 0;
        const yearB = parseInt(b.metadata?.foundedYear as string) || 0;
        return yearB - yearA;
      }
      return 0;
    });

    return result;
  }, [allOrgs, debouncedQuery, state.orgType, state.category, state.sortBy]);

  // Reset to page 1 when any filter/sort changes
  const isInitial = useRef(true);
  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    setCurrentPage(1);
  }, [debouncedQuery, state.orgType, state.category, state.sortBy]);

  const totalPages = Math.ceil(
    filteredOrgs.length / ORG_BROWSER.ITEMS_PER_PAGE
  );

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
