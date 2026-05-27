// src/hooks/useOrgBrowser.ts
import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useOrgs } from '@/hooks/useOrgService';
import { normalize } from '@/lib/utils';
import type { OrgType, FilterCategory } from '@/lib/orgIndex';
import { ORG_BROWSER, SORT_OPTIONS, type SortOption } from '@/data/orgBrowser';

export function useOrgBrowser() {
  const { orgs: allOrgs, loading: dataLoading, error: dataError } = useOrgs();
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Derive state purely from URL
  const query = searchParams.get('q') || '';
  const orgType = (searchParams.get('type') as 'All' | OrgType) || 'All';
  const category =
    (searchParams.get('category') as FilterCategory | 'All') || 'All';
  const program = searchParams.get('program') || 'All';

  // Use the constant for the default fallback
  const sortBy = (searchParams.get('sort') as SortOption) || SORT_OPTIONS.ASC;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // 2. Safe Update Function
  const setFilter = useCallback(
    (key: string, value: string | null) => {
      setSearchParams(
        prev => {
          const next = new URLSearchParams(prev);
          if (value === null || value === 'All' || value === '') {
            next.delete(key);
          } else {
            next.set(key, value);
          }
          if (key !== 'page') next.delete('page');
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // 3. Filter & Sort Logic
  const filteredOrgs = useMemo(() => {
    const q = normalize(query);

    const result = allOrgs.filter(org => {
      const matchesType = orgType === 'All' || org.type === orgType;
      const matchesCat = category === 'All' || org.category === category;
      const matchesProgram = program === 'All' || org.programId === program;
      if (!matchesType || !matchesCat || !matchesProgram) return false;
      if (!q) return true;

      return (
        normalize(org.name).includes(q) ||
        normalize(org.acronym || '').includes(q) ||
        (org.metadata?.tags?.some(tag => normalize(tag).includes(q)) ??
          false) ||
        normalize(org.content?.shortDescription || '').includes(q)
      );
    });

    result.sort((a, b) => {
      // Use the constants for your conditional logic
      if (sortBy === SORT_OPTIONS.ASC) return a.name.localeCompare(b.name);
      if (sortBy === SORT_OPTIONS.DESC) return b.name.localeCompare(a.name);
      if (sortBy === SORT_OPTIONS.NEWEST) {
        const yearA = a.metadata?.foundedYear || 0;
        const yearB = b.metadata?.foundedYear || 0;
        return yearB - yearA;
      }
      return 0;
    });

    return result;
  }, [allOrgs, query, orgType, category, sortBy, program]);

  const totalPages = Math.ceil(
    filteredOrgs.length / ORG_BROWSER.ITEMS_PER_PAGE
  );
  const visibleOrgs = filteredOrgs.slice(
    0,
    currentPage * ORG_BROWSER.ITEMS_PER_PAGE
  );

  const loadMore = useCallback(() => {
    if (currentPage < totalPages) {
      setFilter('page', (currentPage + 1).toString());
    }
  }, [currentPage, totalPages, setFilter]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      allOrgs.map(o => o.category?.trim()).filter(Boolean)
    );
    return ['All', ...Array.from(uniqueCategories).sort()];
  }, [allOrgs]);

  const programs = useMemo(() => {
    const uniquePrograms = new Set(
      allOrgs.map(o => o.programId).filter((id): id is string => !!id)
    );
    return ['All', ...Array.from(uniquePrograms).sort()];
  }, [allOrgs]);

  return {
    state: { query, orgType, category, sortBy, program },
    dispatch: setFilter,
    visibleOrgs,
    hasMore: currentPage < totalPages,
    loadMore,
    filteredCount: filteredOrgs.length,
    categories,
    programs,
    loading: dataLoading,
    error: dataError,
  };
}
