import { useRef, useCallback, useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Loader2, X } from 'lucide-react';

import { useOrgBrowser } from '@/hooks/useOrgBrowser';
import OrgGrid from '@/components/layout/OrgGrid';
import Section from '@/components/ui/Section';
import SEO from '@/components/SEO';
import OrgFilterBar from '@/components/sections/OrgFilterBar';
import OrgFilterChips from '@/components/sections/OrgFilterChips';

import { SORT_OPTIONS, type SortOption } from '@/data/orgBrowser';
import { abbreviateProgram } from '@/data/programs';
import { CAMPUSES } from '@/data/campuses';
import { Button } from '@/components/ui/shadcn/button';

export default function OrgBrowser() {
  const {
    state,
    dispatch,
    visibleOrgs,
    hasMore,
    loadMore,
    filteredCount,
    programs,
    loading,
    error,
  } = useOrgBrowser();

  const [localQuery, setLocalQuery] = useState(state.query);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- safe: functional form prevents cascade
    setLocalQuery(prev => (prev !== state.query ? state.query : prev));
  }, [state.query]);

  const debouncedQuery = useDebounce(localQuery, 300);
  useEffect(() => {
    if (debouncedQuery !== state.query) {
      dispatch('q', debouncedQuery);
    }
  }, [debouncedQuery, dispatch, state.query]);

  const hasActiveFilters = !!state.query || state.orgType !== 'All' || state.program !== 'All' || state.sortBy !== SORT_OPTIONS.ASC || !!state.campusId;

  const clearAllFilters = useCallback(() => {
    setLocalQuery('');
    dispatch('q', null);
    dispatch('type', null);
    dispatch('program', null);
    dispatch('sort', null);
    dispatch('campusId', null);
  }, [dispatch]);

  const filterChips: { label: string; key: string }[] = [];
  if (state.query) filterChips.push({ label: `"${state.query}"`, key: 'q' });
  if (state.orgType !== 'All') filterChips.push({ label: state.orgType, key: 'type' });
  if (state.program !== 'All') filterChips.push({ label: abbreviateProgram(state.program), key: 'program' });
  if (state.sortBy !== SORT_OPTIONS.ASC) {
    const sortLabels: Record<string, string> = {
      [SORT_OPTIONS.ASC]: 'A-Z',
      [SORT_OPTIONS.DESC]: 'Z-A',
      [SORT_OPTIONS.NEWEST]: 'Newest',
    };
    filterChips.push({ label: sortLabels[state.sortBy] || state.sortBy, key: 'sort' });
  }
  if (state.campusId) {
    const name = CAMPUSES.find(c => c.id === Number(state.campusId))?.name || `Campus ${state.campusId}`;
    filterChips.push({ label: name, key: 'campusId' });
  }

  const removeFilter = useCallback(
    (key: string) => {
      if (key === 'q') setLocalQuery('');
      dispatch(key, null);
    },
    [dispatch]
  );

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [hasMore, loadMore]
  );

  return (
    <>
      <SEO
        title="Organization Browser"
        description="Discover and explore student organizations across campus."
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <Section className="py-0">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Organization Browser
            </h1>
            <p className="text-lg text-muted-foreground mt-3">
              Discover and explore student organizations across campus.
            </p>
          </div>

          <OrgFilterBar
            localQuery={localQuery}
            setLocalQuery={setLocalQuery}
            orgType={state.orgType}
            onTypeChange={value => dispatch('type', value)}
            program={state.program}
            onProgramChange={value => dispatch('program', value)}
            sortBy={state.sortBy}
            onSortChange={value => dispatch('sort', value as SortOption)}
            programs={programs}
          />

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground font-medium">
              Showing{' '}
              <span className="font-bold text-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                {visibleOrgs.length}
              </span>{' '}
              of{' '}
              <span className="font-bold text-foreground bg-muted/60 px-1.5 py-0.5 rounded">{filteredCount}</span>{' '}
              organizations
            </p>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Clear all filters
              </Button>
            )}
          </div>

          <OrgFilterChips chips={filterChips} onRemove={removeFilter} />
        </Section>

        <Section className="min-h-96">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">Loading organizations...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-2xl border-2 border-dashed border-destructive/50 bg-destructive/10 text-center">
              <p className="text-lg font-semibold text-destructive">Failed to load organizations</p>
              <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
            </div>
          ) : filteredCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-2xl border-2 border-dashed border-border bg-muted/30 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg font-semibold text-foreground">
                No organizations found
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filters.
              </p>
              {hasActiveFilters && (
                <Button
                  variant="secondary"
                  onClick={clearAllFilters}
                  className="mt-6"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <OrgGrid organizations={visibleOrgs} columns={4} />
              {hasMore ? (
                <div
                  ref={loadMoreRef}
                  className="w-full h-24 flex items-center justify-center mt-8 text-muted-foreground"
                >
                  <Loader2 className="w-8 h-8 animate-spin opacity-50" />
                </div>
              ) : visibleOrgs.length > 0 && (
                <div className="w-full flex items-center justify-center mt-8 text-xs text-muted-foreground/60">
                  All {filteredCount} organization{filteredCount !== 1 ? 's' : ''} loaded
                </div>
              )}
            </>
          )}
        </Section>
      </div>
    </>
  );
}
