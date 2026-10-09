import { useRef, useCallback, useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, Loader2, X, LayoutGrid, Rows3 } from 'lucide-react';

import { useOrgBrowser } from '@/hooks/useOrgBrowser';
import { useViewMode } from '@/hooks/useViewMode';
import OrgGrid from '@/components/layout/OrgGrid';
import OrgRow from '@/components/layout/OrgRow';
import Section from '@/components/ui/Section';
import SEO from '@/components/SEO';
import OrgFilterBar from '@/components/sections/OrgFilterBar';
import OrgFilterChips from '@/components/sections/OrgFilterChips';

import { ORG_BROWSER, SORT_OPTIONS } from '@/data/orgBrowser';
import { abbreviateProgram } from '@/data/programs';
import { getCampusName } from '@/data/campuses';
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
    campuses,
  } = useOrgBrowser();

  const [localQuery, setLocalQuery] = useState(state.query);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- safe: functional form prevents cascade
    setLocalQuery(prev => (prev !== state.query ? state.query : prev));
  }, [state.query]);

  const debouncedQuery = useDebounce(localQuery, ORG_BROWSER.DEBOUNCE_DELAY);
  useEffect(() => {
    if (debouncedQuery !== state.query) {
      dispatch('q', debouncedQuery);
    }
  }, [debouncedQuery, dispatch, state.query]);

  const hasActiveFilters = !!state.query || state.orgType !== 'All' || state.category !== 'All' || state.program !== 'All' || state.sortBy !== SORT_OPTIONS.ASC || !!state.campusId;

  const clearAllFilters = useCallback(() => {
    setLocalQuery('');
    dispatch('q', null);
    dispatch('type', null);
    dispatch('category', null);
    dispatch('program', null);
    dispatch('sort', null);
    dispatch('campusId', null);
  }, [dispatch]);

  const filterChips: { label: string; key: string }[] = [];
  if (state.query) filterChips.push({ label: `"${state.query}"`, key: 'q' });
  if (state.orgType !== 'All') filterChips.push({ label: state.orgType, key: 'type' });
  if (state.category !== 'All') filterChips.push({ label: state.category, key: 'category' });
  if (state.program !== 'All') filterChips.push({ label: abbreviateProgram(state.program), key: 'program' });
  if (state.sortBy !== SORT_OPTIONS.ASC) {
    const sortLabels: Record<string, string> = {
      [SORT_OPTIONS.ASC]: 'A-Z',
      [SORT_OPTIONS.DESC]: 'Z-A',
      [SORT_OPTIONS.CAMPUS]: 'By campus',
    };
    filterChips.push({ label: sortLabels[state.sortBy] || state.sortBy, key: 'sort' });
  }
  if (state.campusId) {
    filterChips.push({
      label: getCampusName(Number(state.campusId)) ?? `Campus ${state.campusId}`,
      key: 'campusId',
    });
  }

  const removeFilter = useCallback(
    (key: string) => {
      if (key === 'q') setLocalQuery('');
      dispatch(key, null);
    },
    [dispatch]
  );

  const { view, setView } = useViewMode();

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

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <Section className="py-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Browse organizations
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Search and filter across the Cavite State University network.
            </p>
          </div>

          <OrgFilterBar
            query={localQuery}
            onQueryChange={setLocalQuery}
            state={state}
            dispatch={dispatch}
            programs={programs}
            campuses={campuses}
          />

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground font-medium">
              {filteredCount}{' '}
              <span className="text-foreground font-bold">
                {filteredCount === 1 ? 'organization' : 'organizations'}
              </span>{' '}
              found
            </p>

            <div className="flex items-center gap-2">
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

              {/* Toggle group: arrow keys move between the two buttons, which
                  is what a radiogroup of view options should do. */}
              <div
                role="group"
                aria-label="Result layout"
                className="flex items-center gap-0.5 rounded-panel border border-border/60 p-0.5"
              >
                <ViewButton
                  active={view === 'grid'}
                  label="Grid view"
                  onClick={() => setView('grid')}
                >
                  <LayoutGrid size={14} />
                </ViewButton>
                <ViewButton
                  active={view === 'list'}
                  label="List view"
                  onClick={() => setView('list')}
                >
                  <Rows3 size={14} />
                </ViewButton>
              </div>
            </div>
          </div>

          <OrgFilterChips chips={filterChips} onRemove={removeFilter} />
        </Section>

        <Section className="min-h-96">
          {filteredCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border bg-muted/20 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted/60">
                <Search className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-xl font-bold text-foreground">
                No organizations found
              </p>
              <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
                {hasActiveFilters
                  ? 'Try adjusting your search or filters to find what you are looking for.'
                  : 'There are no organizations to display right now.'}
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
              {view === 'grid' ? (
                <OrgGrid organizations={visibleOrgs} />
              ) : (
                <div className="-mx-1 space-y-0.5">
                  {visibleOrgs.map(org => (
                    <OrgRow
                      key={org.slug}
                      org={org}
                      secondary={org.content?.shortDescription || org.content?.about}
                      meta={
                        org.programId
                          ? abbreviateProgram(org.programId)
                          : getCampusName(org.campusId)
                      }
                    />
                  ))}
                </div>
              )}
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

function ViewButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={label}
      className={`flex h-7 w-7 items-center justify-center rounded-[6px] transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
        active
          ? 'bg-primary/15 text-primary'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}
