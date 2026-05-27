import { useMemo, useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import Section from '@/components/ui/Section';
import SEO from '@/components/SEO';
import OrganizationCard from '@/components/OrganizationCard';
import OrgGrid from '@/components/layout/OrgGrid';
import { Input } from '@/components/ui/shadcn/input';
import { Button } from '@/components/ui/shadcn/button';
import { useDebounce } from '@/hooks/useDebounce';
import { normalize } from '@/lib/utils';
import { getCampusName } from '@/data/campuses';
import type { Organization } from '@/lib/orgIndex';

export interface CategoryPageTemplateProps {
  title: string;
  description: string;
  data: Record<string, Organization[]>;
  highlightStudentCouncils?: boolean;
}

export default function CategoryPageTemplate({
  title,
  description,
  data,
  highlightStudentCouncils = false,
}: CategoryPageTemplateProps) {
  // URL Syncing for State Persistence
  const [searchParams, setSearchParams] = useSearchParams();

  // Local state for instant input UI update, debounced for heavy filtering
  const [inputValue, setInputValue] = useState(() => searchParams.get('q') || '');
  const debouncedQuery = useDebounce(inputValue, 300);

  // Sync URL changes back to local state (handles back/forward navigation)
  // Functional setState bails out when values match, preventing cascading renders
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    // eslint-disable-next-line react-hooks/set-state-in-effect -- safe: functional form prevents cascade
    setInputValue(prev => (prev !== urlQuery ? urlQuery : prev));
  }, [searchParams]);

  // Sync input to URL with short debounce (coalesces rapid typing)
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentUrlQuery = searchParams.get('q') || '';
      if (inputValue === currentUrlQuery) return;
      const params = new URLSearchParams(searchParams);
      if (inputValue) {
        params.set('q', inputValue);
      } else {
        params.delete('q');
      }
      setSearchParams(params, { replace: true });
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue, searchParams, setSearchParams]);

  const handleClearSearch = () => {
    setInputValue('');
    const params = new URLSearchParams(searchParams);
    params.delete('q');
    setSearchParams(params, { replace: true });
  };

  const processedData = useMemo(() => {
    const q = normalize(debouncedQuery);

    return Object.entries(data).map(([category, orgs]) => {
      const filtered = orgs.filter(org => {
        if (!q) return true;
        return (
          normalize(org.name).includes(q) ||
          normalize(org.acronym || '').includes(q) ||
          normalize(org.slug).includes(q) ||
          normalize(org.programId || '').includes(q) ||
          normalize(org.content?.shortDescription || '').includes(q) ||
          org.metadata?.tags?.some(tag => normalize(tag).includes(q))
        );
      });
      return { category, orgs: filtered };
    });
  }, [data, debouncedQuery]);

  const hasGlobalResults = processedData.some(item => item.orgs.length > 0);

  // 3. Quick Nav visible categories extraction
  const visibleCategories = processedData.filter(item => item.orgs.length > 0);

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100; // offset for sticky headers
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <SEO title={title} description={description} />
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 md:px-6 md:py-12">
        <Section>
          <div className="mb-10 max-w-2xl">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              {title}
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </Section>

        {/* 4. Sticky Header with Search and Quick Nav */}
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 py-4 -mx-4 px-4 md:-mx-6 md:px-6 border-b border-border mb-10 shadow-sm">
          <div className="relative max-w-md group flex items-center mb-4">
            <Search className="absolute left-3 h-5 w-5 text-muted-foreground z-10 transition-colors group-focus-within:text-primary" />
            <Input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Filter by name, acronym, or tag..."
              className="pl-10 pr-10 h-11 bg-surface-1 shadow-sm"
              aria-label="Search organizations"
            />
            {inputValue && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 p-1 text-muted-foreground hover:text-foreground rounded-full transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick Navigation Pills */}
          {visibleCategories.length > 0 && !debouncedQuery && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {visibleCategories.map(({ category }) => (
                <button
                  key={`nav-${category}`}
                  onClick={() => scrollToCategory(category)}
                  className="whitespace-nowrap px-4 py-1.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors border border-border"
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-16">
          {processedData.map(({ category, orgs: filteredOrgs }) => {
            if (debouncedQuery && filteredOrgs.length === 0) return null;
            let council: Organization | undefined;
            let rest = [...filteredOrgs].sort((a, b) =>
              a.name.localeCompare(b.name)
            );

            if (highlightStudentCouncils && !debouncedQuery) {
              council = rest.find(org => org.type === 'Student Council');
              if (council) {
                rest = rest.filter(org => org.id !== council?.id);
              }
            }

            return (
              <section
                key={category}
                id={`category-${category}`}
                className="scroll-mt-32"
              >
                <div className="mb-6 flex items-center gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    {category}
                    {/* 5. Organization count per category */}
                    <span className="bg-primary/10 text-primary py-0.5 px-2 rounded-full text-[10px]">
                      {filteredOrgs.length}
                    </span>
                  </h3>
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

          {!hasGlobalResults && (
            <div className="rounded-2xl border-2 border-dashed border-border bg-surface-1 py-20 text-center flex flex-col items-center justify-center">
              <Search className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg font-semibold text-foreground">
                No results found for "{debouncedQuery}"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search terms or using an acronym.
              </p>
              <Button
                variant="secondary"
                onClick={handleClearSearch}
                className="mt-6"
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
