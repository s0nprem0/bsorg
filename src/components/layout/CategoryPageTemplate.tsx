import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import Section from '@/components/ui/Section';
import SEO from '@/components/SEO';
import OrganizationCard from '@/components/OrganizationCard';
import OrgGrid from '@/components/layout/OrgGrid';
import { CAMPUSES } from '@/data/constants';
import type { Organization } from '@/types/organization';

export interface CategoryPageTemplateProps {
  title: string;
  description: string;
  data: Record<string, Organization[]>;
  highlightStudentCouncils?: boolean;
}

const getCampusName = (campusId?: number) => {
  if (campusId === undefined) return undefined;
  return CAMPUSES.find((campus) => campus.id === campusId)?.name;
};

export default function CategoryPageTemplate({
  title,
  description,
  data,
  highlightStudentCouncils = false,
}: CategoryPageTemplateProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const processedData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return Object.entries(data).map(([category, orgs]) => {
      const filtered = orgs.filter((org) => {
        if (!q) return true;

        // Schema-Aware Robust Searching
        return (
          org.name.toLowerCase().includes(q) ||
          org.acronym?.toLowerCase().includes(q) ||
          org.slug.toLowerCase().includes(q) ||
          org.programId?.toLowerCase().includes(q) ||
          org.content.shortDescription.toLowerCase().includes(q) ||
          org.metadata?.tags?.some(tag => tag.toLowerCase().includes(q))
        );
      });

      return { category, orgs: filtered };
    });
  }, [data, searchQuery]);

  const hasGlobalResults = processedData.some((item) => item.orgs.length > 0);

  return (
    <>
      <SEO title={title} description={description} />

      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 md:px-6 md:py-12">
        <Section>
          <div className="mb-10 max-w-2xl">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              {title}
            </h1>
            <p className="text-lg leading-relaxed text-foreground-secondary">
              {description}
            </p>
          </div>
        </Section>

        {/* Improved Search Bar (A11y + UI) */}
        <div className="relative mb-12 max-w-md group">
          <label htmlFor="category-search" className="sr-only">Filter organizations</label>
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted transition-colors group-focus-within:text-primary" />
          <input
            id="category-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name, acronym, or tag..."
            className="w-full rounded-xl border border-border bg-surface-1 py-3 pl-11 pr-4 text-sm text-foreground transition-all placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
          />
        </div>

        <div className="space-y-16">
          {processedData.map(({ category, orgs: filteredOrgs }) => {
            if (searchQuery && filteredOrgs.length === 0) return null;

            let council: Organization | undefined;

            // Sort alphabetically by name (updated from org.org)
            let rest = [...filteredOrgs].sort((a, b) => a.name.localeCompare(b.name));

            if (highlightStudentCouncils && !searchQuery) {
              // Deterministic Council Check (Using the strict Schema Enum)
              council = rest.find((org) => org.type === 'Student Council');

              if (council) {
                rest = rest.filter((org) => org.id !== council?.id); // Use stable ID
              }
            }

            return (
              <section key={category} className="scroll-mt-24">
                {/* Modernized Section Header */}
                <div className="mb-6 flex items-center gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground-secondary">
                    {category}
                  </h3>
                  <div className="h-px flex-1 bg-border/60" />
                </div>

                {filteredOrgs.length === 0 ? (
                  <p className="text-sm italic text-foreground-muted py-8 text-center bg-surface-1/50 rounded-xl border border-dashed border-border">
                    No organizations found in this category.
                  </p>
                ) : (
                  <>
                    {council && (
                      <div className="mb-6">
                        {/* Updated to match the new OrganizationCard props API */}
                        <OrganizationCard
                          org={council}
                          campusName={getCampusName(council.campusId)}
                          large
                        />
                      </div>
                    )}

                    <OrgGrid organizations={rest} columns={4} />
                  </>
                )}
              </section>
            );
          })}

          {/* Premium Empty State */}
          {!hasGlobalResults && (
            <div className="rounded-2xl border-2 border-dashed border-border bg-surface-1 py-20 text-center flex flex-col items-center justify-center">
              <Search className="h-10 w-10 text-foreground-muted mb-4 opacity-50" />
              <p className="text-lg font-semibold text-foreground">
                No results found for "{searchQuery}"
              </p>
              <p className="text-sm text-foreground-secondary mt-2">
                Try adjusting your search terms or using an acronym.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 rounded-lg bg-surface-2 px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-3 transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}