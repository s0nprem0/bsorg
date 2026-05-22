import { useEffect, useRef, useCallback } from 'react';
import { Search, Filter, Loader2, ArrowDownUp } from 'lucide-react';

import { useOrgBrowser, SortOption } from '@/hooks/useOrgBrowser';
import OrgGrid from '@/components/layout/OrgGrid';
import Section from '@/components/ui/Section';
import SEO from '@/components/SEO';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { SearchInput } from '@/components/ui/SearchInput';

import { ORG_BROWSER } from '@/data/constants';
import type { FilterCategory, OrgType } from '@/types/organization';

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
    isLoading,
    allOrgsCount,
    filteredCount,
    categories,
  } = useOrgBrowser();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasMore, loadMore]
  );

  return (
    <>
      <SEO
        title={ORG_BROWSER.MESSAGES.TITLE}
        description={ORG_BROWSER.MESSAGES.SUBTITLE}
      />

      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 md:px-6">
        <Section>
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              {ORG_BROWSER.MESSAGES.TITLE}
            </h1>
            <p className="text-lg text-muted-foreground mt-3">
              {ORG_BROWSER.MESSAGES.SUBTITLE}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <SearchInput
              containerClassName="lg:col-span-2"
              value={state.query}
              onChange={e =>
                dispatch({ type: 'SET_QUERY', payload: e.target.value })
              }
              onClear={() => dispatch({ type: 'SET_QUERY', payload: '' })}
              placeholder="Search by name, acronym, or tags..."
              aria-label="Search organizations"
            />

            <Select
              value={state.orgType}
              onValueChange={value =>
                dispatch({
                  type: 'SET_ORG_TYPE',
                  payload: value as 'All' | OrgType,
                })
              }
            >
              <SelectTrigger className="h-11 bg-muted/50 shadow-sm">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
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

            <Select
              value={state.category}
              onValueChange={value =>
                dispatch({
                  type: 'SET_CATEGORY',
                  payload: value as FilterCategory | 'All',
                })
              }
            >
              <SelectTrigger className="h-11 bg-muted/50 shadow-sm">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={state.sortBy}
              onValueChange={value =>
                dispatch({ type: 'SET_SORT', payload: value as SortOption })
              }
            >
              <SelectTrigger className="h-11 bg-muted/50 shadow-sm">
                <div className="flex items-center gap-2">
                  <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A-Z">A-Z (Alphabetical)</SelectItem>
                <SelectItem value="Z-A">Z-A (Reverse)</SelectItem>
                <SelectItem value="Newest">Newest Founded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium">
              Showing{' '}
              <span className="font-bold text-foreground">
                {visibleOrgs.length}
              </span>{' '}
              of{' '}
              <span className="font-bold text-foreground">{filteredCount}</span>{' '}
              organizations
            </p>
          </div>
        </Section>

        <Section className="min-h-100">
          {isLoading && visibleOrgs.length === 0 ? (
            <SkeletonLoader count={8} />
          ) : filteredCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-2xl border-2 border-dashed border-border bg-muted/30 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg font-semibold text-foreground">
                No organizations found
              </p>
              <Button
                variant="secondary"
                onClick={() => dispatch({ type: 'RESET' })}
                className="mt-6"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <OrgGrid organizations={visibleOrgs} columns={4} />
              <div
                ref={loadMoreRef}
                className="w-full h-24 flex items-center justify-center mt-8 text-muted-foreground"
              >
                {hasMore && !isLoading && (
                  <Loader2 className="w-8 h-8 animate-spin opacity-50" />
                )}
              </div>
            </>
          )}
        </Section>
      </div>
    </>
  );
}
