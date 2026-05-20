import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import Section from '@/components/ui/Section';
import SEO from '@/components/SEO';
import OrganizationCard from '@/components/OrganizationCard';
import OrgGrid from '@/components/layout/OrgGrid';
import { Input } from '@/components/ui/shadcn/input';
import { Button } from '@/components/ui/shadcn/button';
import { CAMPUSES } from '@/data/constants';
import type { Organization } from '@/types/organization';

export interface CategoryPageTemplateProps {
  title: string;
  description: string;
  data: Record<string, Organization[]>;
  highlightStudentCouncils?: boolean;
}

const getCampusName = (campusId?: number) => {
  return campusId !== undefined ? CAMPUSES.find((campus) => campus.id === campusId)?.name : undefined;
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
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">{title}</h1>
            <p className="text-lg leading-relaxed text-foreground-secondary">{description}</p>
          </div>
        </Section>

        <div className="relative mb-12 max-w-md group flex items-center">
          <Search className="absolute left-3 h-5 w-5 text-muted-foreground z-10 transition-colors group-focus-within:text-primary" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name, acronym, or tag..."
            className="pl-10 h-11 bg-surface-1 shadow-sm"
          />
        </div>

        <div className="space-y-16">
          {processedData.map(({ category, orgs: filteredOrgs }) => {
            if (searchQuery && filteredOrgs.length === 0) return null;
            let council: Organization | undefined;
            let rest = [...filteredOrgs].sort((a, b) => a.name.localeCompare(b.name));

            if (highlightStudentCouncils && !searchQuery) {
              council = rest.find((org) => org.type === 'Student Council');
              if (council) {
                rest = rest.filter((org) => org.id !== council?.id);
              }
            }

            return (
              <section key={category} className="scroll-mt-24">
                <div className="mb-6 flex items-center gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{category}</h3>
                  <div className="h-px flex-1 bg-border/60" />
                </div>

                {filteredOrgs.length === 0 ? (
                  <p className="text-sm italic text-muted-foreground py-8 text-center bg-surface-1/50 rounded-xl border border-dashed border-border">
                    No organizations found in this category.
                  </p>
                ) : (
                  <>
                    {council && (
                      <div className="mb-6">
                        <OrganizationCard org={council} campusName={getCampusName(council.campusId)} large />
                      </div>
                    )}
                    <OrgGrid organizations={rest} columns={4} />
                  </>
                )}
              </section>
            );
          })}

          {!hasGlobalResults && (
            <div className="rounded-2xl border-2 border-dashed border-border bg-surface-1 py-20 text-center flex flex-col items-center justify-center">
              <Search className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg font-semibold text-foreground">No results found for "{searchQuery}"</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your search terms or using an acronym.</p>
              <Button variant="secondary" onClick={() => setSearchQuery('')} className="mt-6">
                Clear search
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}