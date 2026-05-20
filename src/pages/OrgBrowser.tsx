import { useOrgBrowser } from '@/hooks/useOrgBrowser';
import { Search, Filter } from 'lucide-react';
import OrgGrid from '@/components/layout/OrgGrid';
import Pagination from '@/components/ui/Pagination';
import Section from '@/components/ui/Section';
import SEO from '@/components/SEO';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { ORG_BROWSER } from '@/data/constants';
import type { FilterCategory } from '@/types/organization';

export default function OrgBrowser() {
  const { state, dispatch, paginatedOrgs, totalPages, currentPage, setCurrentPage, isLoading, allOrgsCount, filteredCount, categories } = useOrgBrowser();

  return (
    <>
      <SEO title={ORG_BROWSER.MESSAGES.TITLE} description={ORG_BROWSER.MESSAGES.SUBTITLE} />
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 md:px-6">
        <Section>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">{ORG_BROWSER.MESSAGES.TITLE}</h1>
            <p className="text-foreground-secondary mt-2">{ORG_BROWSER.MESSAGES.SUBTITLE}</p>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground-tertiary" />
              <input
                value={state.query}
                onChange={(e) => dispatch({ type: 'SET_QUERY', payload: e.target.value })}
                className="w-full rounded-md border border-border bg-surface-1 pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-foreground-tertiary"
                placeholder="Filter organizations..."
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-2.5 h-4 w-4 text-foreground-tertiary pointer-events-none" />
              <select
                value={state.orgType}
                onChange={(e) => dispatch({ type: 'SET_ORG_TYPE', payload: e.target.value as 'All' | 'Academic' | 'Non-Academic' })}
                className="w-full rounded-md border border-border bg-surface-1 pl-9 pr-4 py-2 text-sm text-foreground appearance-none cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Academic">Academic</option>
                <option value="Non-Academic">Non-Academic</option>
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-2.5 h-4 w-4 text-foreground-tertiary pointer-events-none" />
              <select
                value={state.category}
                onChange={(e) => dispatch({ type: 'SET_CATEGORY', payload: e.target.value as FilterCategory | 'All' })}
                className="w-full rounded-md border border-border bg-surface-1 pl-9 pr-4 py-2 text-sm text-foreground appearance-none cursor-pointer"
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
          <div className="mb-4">
            <p className="text-sm text-foreground-secondary">
              Showing <span className="font-semibold text-foreground">{paginatedOrgs.length}</span> of{' '}
              <span className="font-semibold text-foreground">{filteredCount}</span> organizations
              {filteredCount < allOrgsCount && ` (filtered from ${allOrgsCount} total)`}
            </p>
          </div>
        </Section>

        {/* Grid or Loading State */}
        <Section>
          {isLoading ? (
            <SkeletonLoader count={4} />
          ) : filteredCount === 0 ? (
            <div className="text-center py-20">
              <p className="text-foreground-secondary">No organizations found. Try adjusting your filters.</p>
            </div>
          ) : (
            <OrgGrid organizations={paginatedOrgs} columns={4} />
          )}
        </Section>

        {/* Pagination */}
        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
      </div>
    </>
  );
}