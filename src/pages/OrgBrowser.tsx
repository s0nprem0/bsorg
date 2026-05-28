import { useRef, useCallback, useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Filter, Loader2, ArrowDownUp, X } from 'lucide-react';

import { useOrgBrowser } from '@/hooks/useOrgBrowser';
import OrgGrid from '@/components/layout/OrgGrid';
import Section from '@/components/ui/Section';
import SEO from '@/components/SEO';
import { SearchInput } from '@/components/ui/SearchInput';

import { ORG_BROWSER, SORT_OPTIONS, type SortOption } from '@/data/orgBrowser';
import { abbreviateProgram } from '@/data/programs';
import { CAMPUSES } from '@/data/campuses';

// Shadcn UI Imports
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
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

  // Create a local state so the UI updates instantly when the user types
  const [localQuery, setLocalQuery] = useState(state.query);

  // Sync URL changes back to local state (handles back/forward navigation)
  // Functional setState bails out when values match, preventing cascading renders
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- safe: functional form prevents cascade
    setLocalQuery(prev => (prev !== state.query ? state.query : prev));
  }, [state.query]);

  // Debounce: sync local input to URL state after user stops typing
  const debouncedQuery = useDebounce(localQuery, ORG_BROWSER.DEBOUNCE_DELAY);
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-2 mb-8">
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Search
                </label>
                <SearchInput
              value={localQuery}
              onChange={e => setLocalQuery(e.target.value)}
              onClear={() => setLocalQuery('')}
              placeholder="Search by name, acronym, or tags..."
              aria-label="Search organizations"
            />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Type
                </label>
                <Select
                  value={state.orgType}
                  onValueChange={value => dispatch('type', value)}
                >
                  <SelectTrigger className="h-11 bg-muted/50 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                      <SelectValue placeholder="All Types" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {ORG_BROWSER.ORG_TYPE_OPTIONS.map(type => (
                      <SelectItem key={`org-type-${type}`} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Program
                </label>
                <Select
                  value={state.program}
                  onValueChange={value => dispatch('program', value)}
                >
                  <SelectTrigger className="h-11 bg-muted/50 shadow-sm">
                    <div className="flex items-center gap-2 truncate">
                      <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                      <SelectValue placeholder="All Programs" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map(p => (
                      <SelectItem key={p} value={p} title={p === 'All' ? '' : p}>
                        {p === 'All' ? 'All Programs' : abbreviateProgram(p)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Sort
                </label>
                <Select
                  value={state.sortBy}
                  onValueChange={value => dispatch('sort', value as SortOption)}
                >
                  <SelectTrigger className="h-11 bg-muted/50 shadow-sm">
                    <div className="flex items-center gap-2">
                      <ArrowDownUp className="h-4 w-4 text-muted-foreground shrink-0" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SORT_OPTIONS.ASC}>
                      A-Z (Alphabetical)
                    </SelectItem>
                    <SelectItem value={SORT_OPTIONS.DESC}>Z-A (Reverse)</SelectItem>
                    <SelectItem value={SORT_OPTIONS.NEWEST}>
                      Newest Founded
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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

          {filterChips.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {filterChips.map(chip => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-xs font-medium text-foreground"
                >
                  {chip.label}
                  <button
                    type="button"
                    onClick={() => removeFilter(chip.key)}
                    className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label={`Remove ${chip.label} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
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
