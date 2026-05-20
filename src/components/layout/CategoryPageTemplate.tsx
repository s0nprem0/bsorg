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
    const q = searchQuery.toLowerCase();

    return Object.entries(data).map(([category, orgs]) => {
      const filtered = orgs.filter((org) => {
        if (!searchQuery) return true;

        return (
          org.org.toLowerCase().includes(q) ||
          org.slug.toLowerCase().includes(q) ||
          org.program?.toLowerCase().includes(q) ||
          org.description?.toLowerCase().includes(q)
        );
      });

      return {
        category,
        orgs: filtered,
      };
    });
  }, [data, searchQuery]);

  const hasGlobalResults = processedData.some(
    (item) => item.orgs.length > 0
  );

  return (
    <>
      <SEO title={title} description={description} />

      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 md:px-6 md:py-12">
        <Section>
          <div className="mb-8 max-w-2xl">
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>

            <p className="text-sm leading-relaxed text-foreground-secondary sm:text-base">
              {description}
            </p>
          </div>
        </Section>

        <div className="relative mb-10 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter organizations..."
            className="w-full rounded-md border border-border bg-surface-1 py-2 pl-9 pr-4 text-sm text-foreground transition-colors placeholder:text-foreground-muted focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>

        <div className="space-y-16">
          {processedData.map(({ category, orgs: filteredOrgs }) => {
            if (searchQuery && filteredOrgs.length === 0) {
              return null;
            }

            let council: Organization | undefined;

            let rest = [...filteredOrgs].sort((a, b) =>
              a.org.localeCompare(b.org)
            );

            if (highlightStudentCouncils && !searchQuery) {
              council = rest.find(
                (org) =>
                  org.slug.includes('sc') ||
                  org.org.toLowerCase().includes('student council')
              );

              if (council) {
                rest = rest.filter((org) => org !== council);
              }
            }

            return (
              <section key={category}>
                <h3 className="mb-5 border-b border-border pb-2.5 text-xs font-mono uppercase tracking-widest text-foreground-muted">
                  {category}
                </h3>

                {filteredOrgs.length === 0 ? (
                  <p className="text-sm italic text-foreground-muted">
                    No organizations found in this category.
                  </p>
                ) : (
                  <>
                    {council && (
                      <div className="mb-4">
                        <OrganizationCard
                          {...council}
                          campus={getCampusName(council.campusId)}
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

          {!hasGlobalResults && (
            <div className="rounded-lg border border-dashed border-border bg-surface-1 py-16 text-center">
              <p className="text-sm font-medium text-foreground">
                No results found for "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}