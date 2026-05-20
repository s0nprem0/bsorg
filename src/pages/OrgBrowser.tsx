import { Search, Filter } from 'lucide-react';

import { useOrgBrowser } from '@/hooks/useOrgBrowser';
import OrgGrid from '@/components/layout/OrgGrid';
import Pagination from '@/components/ui/Pagination';
import Section from '@/components/ui/Section';
import SEO from '@/components/SEO';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

import { ORG_BROWSER } from '@/data/constants';
import type { FilterCategory } from '@/types/organization';

export default function OrgBrowser() {
  const {
    state,
    dispatch,
    paginatedOrgs,
    totalPages,
    currentPage,
    setCurrentPage,
    isLoading,
    allOrgsCount,
    filteredCount,
    categories
  } = useOrgBrowser();

  return (
    <>
      <SEO title={ORG_BROWSER.MESSAGES.TITLE} description={ORG_BROWSER.MESSAGES.SUBTITLE} />

      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 md:px-6">
        <Section>
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              {ORG_BROWSER.MESSAGES.TITLE}
            </h1>
            <p className="text-lg text-foreground-secondary mt-3">
              {ORG_BROWSER.MESSAGES.SUBTITLE}
            </p>
          </div>

          {/* Filter Bar - Fully Accessible */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="relative md:col-span-2 group">
              <label htmlFor="search-orgs" className="sr-only">Search organizations</label>
              <Search className="absolute left-3.5 top-3 h-5 w-5 text-foreground-tertiary transition-colors group-focus-within:text-primary" />
              <input
                id="search-orgs"
                value={state.query}
                onChange={(e) => dispatch({ type: 'SET_QUERY', payload: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface-1 pl-11 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                placeholder="Search by name, acronym, or tags..."
              />
            </div>

            <div className="relative group">
              <label htmlFor="filter-type" className="sr-only">Filter by Type</label>
              <Filter className="absolute left-3.5 top-3 h-5 w-5 text-foreground-tertiary pointer-events-none" />
              <select
                id="filter-type"
                value={state.orgType}
                onChange={(e) => dispatch({ type: 'SET_ORG_TYPE', payload: e.target.value as any })}
                className="w-full rounded-xl border border-border bg-surface-1 pl-11 pr-4 py-2.5 text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 hover:bg-surface-2 transition-all shadow-sm"
              >
                <option value="All">All Types</option>
                <option value="Academic">Academic</option>
                <option value="Non-Academic">Non-Academic</option>
                <option value="Student Council">Student Council</option>
                <option value="Performing Arts Group">Performing Arts</option>
              </select>
            </div>

            <div className="relative group">
              <label htmlFor="filter-category" className="sr-only">Filter by Category</label>
              <Filter className="absolute left-3.5 top-3 h-5 w-5 text-foreground-tertiary pointer-events-none" />
              <select
                id="filter-category"
                value={state.category}
                onChange={(e) => dispatch({ type: 'SET_CATEGORY', payload: e.target.value as FilterCategory | 'All' })}
                className="w-full rounded-xl border border-border bg-surface-1 pl-11 pr-4 py-2.5 text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 hover:bg-surface-2 transition-all shadow-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-foreground-secondary font-medium">
              Showing <span className="font-bold text-foreground">{paginatedOrgs.length}</span> of{' '}
              <span className="font-bold text-foreground">{filteredCount}</span> organizations
              {filteredCount < allOrgsCount && <span className="text-foreground-muted ml-1">(filtered from {allOrgsCount} total)</span>}
            </p>
          </div>
        </Section>

        {/* Grid or Loading State */}
        <Section className="min-h-[400px]">
          {isLoading ? (
            <SkeletonLoader count={8} />
          ) : filteredCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-2xl border-2 border-dashed border-border bg-surface-1 text-center">
              <Search className="h-12 w-12 text-foreground-muted mb-4 opacity-50" />
              <p className="text-lg font-semibold text-foreground">No organizations found</p>
              <p className="text-sm text-foreground-secondary mt-2">Try adjusting your filters or searching for an acronym.</p>
              <button
                onClick={() => dispatch({ type: 'RESET' })}
                className="mt-6 rounded-lg bg-surface-2 px-5 py-2.5 text-sm font-medium text-foreground hover:bg-surface-3 hover:text-primary transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <OrgGrid organizations={paginatedOrgs} columns={4} />
          )}
        </Section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>
    </>
  );
}