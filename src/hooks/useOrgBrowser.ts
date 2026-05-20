import { useReducer, useEffect, useMemo, useState, useRef } from 'react';
import { normalize } from '@/lib/utils';
import type { OrgType, FilterCategory } from '@/types/organization';
import { orgRegistry } from '@/lib/orgIndex';
import { ORG_BROWSER } from '@/data/constants';

type Action =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_DEBOUNCED_QUERY'; payload: string }
  | { type: 'SET_ORG_TYPE'; payload: 'All' | OrgType }
  | { type: 'SET_CATEGORY'; payload: FilterCategory | 'All' }
  | { type: 'RESET' };

type FilterState = {
  query: string;
  debouncedQuery: string;
  orgType: 'All' | OrgType;
  category: FilterCategory | 'All';
};

const INITIAL_STATE: FilterState = {
  query: '',
  debouncedQuery: '',
  orgType: 'All',
  category: 'All',
};

// Reducer function
function reducer(state: typeof INITIAL_STATE, action: Action) {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_DEBOUNCED_QUERY':
      return { ...state, debouncedQuery: action.payload };
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

// Custom hook
export function useOrgBrowser() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [currentPage, setCurrentPage] = useState(1);
  const allOrgs = useMemo(() => orgRegistry.getAll(), []);

  // Derived loading state
  const isLoading = useMemo(() => state.query !== state.debouncedQuery, [state.query, state.debouncedQuery]);

  // Sync Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch({ type: 'SET_DEBOUNCED_QUERY', payload: state.query });
    }, ORG_BROWSER.DEBOUNCE_DELAY);
    return () => clearTimeout(handler);
  }, [state.query]);

  // Filtering (schema-aware, weighted search)
  const filteredOrgs = useMemo(() => {
    const q = normalize(state.debouncedQuery);
    return allOrgs.filter((org) => {
      const matchesType = state.orgType === 'All' || org.type === state.orgType;
      const matchesCat = state.category === 'All' || org.category === state.category;
      if (!matchesType || !matchesCat) return false;
      if (!q) return true;

      // Weighted search strategy
      const exactMatch = normalize(org.name).includes(q) || normalize(org.acronym || '').includes(q);
      const deepMatch = org.metadata?.tags?.some(tag => normalize(tag).includes(q)) ||
                        normalize(org.content?.shortDescription || '').includes(q);

      return exactMatch || deepMatch;
    });
  }, [allOrgs, state.debouncedQuery, state.orgType, state.category]);

  // Reset page when filters change
  const isInitial = useRef(true);
  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    setCurrentPage(1);
  }, [state.debouncedQuery, state.orgType, state.category]);

  // Pagination
  const paginatedOrgs = useMemo(() => {
    const start = (currentPage - 1) * ORG_BROWSER.ITEMS_PER_PAGE;
    return filteredOrgs.slice(start, start + ORG_BROWSER.ITEMS_PER_PAGE);
  }, [filteredOrgs, currentPage]);

  return {
    state,
    dispatch,
    paginatedOrgs,
    totalPages: Math.ceil(filteredOrgs.length / ORG_BROWSER.ITEMS_PER_PAGE),
    currentPage,
    setCurrentPage,
    isLoading,
    allOrgsCount: allOrgs.length,
    filteredCount: filteredOrgs.length,
    categories: ['All', ...Array.from(new Set(allOrgs.map((o) => o.category))).sort()],
  };
}