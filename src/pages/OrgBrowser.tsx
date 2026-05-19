import React, {
  useMemo,
  useReducer,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { Search, Filter } from 'lucide-react';
import type { Organization } from '@/types/organization';
import SEO from '@/components/SEO';
import Section from '@/components/ui/Section';
import { academicOrgsByCategory } from '@/data/academicOrgs';
import { nonAcademicOrgsByCategory } from '@/data/nonAcademicOrgs';
import { normalize } from '@/lib/utils';
import OrgGrid from '@/components/layout/OrgGrid';
import Pagination from '@/components/ui/Pagination';
import { ORG_BROWSER } from '@/data/constants';

type OrgType = 'Academic' | 'Non-Academic';
type FilterValue = 'All' | string;

type BrowserOrg = Organization & {
  type: OrgType;
  category: string;
};

const INITIAL_STATE = {
  query: '',
  debouncedQuery: '',
  orgType: 'All' as FilterValue,
  category: 'All' as FilterValue,
};

const getUniqueOrgKey = (org: { slug: string }): string =>
  `slug:${normalize(org.slug)}`;

const getCompletenessScore = (org: BrowserOrg): number =>
  [
    org.description,
    org.program,
    org.logo,
    org.contact.email,
    org.contact.facebook,
    org.contact.instagram,
    org.contact.tiktok,
    org.contact.x,
  ].filter(Boolean).length;

const mergeOrganizations = (orgs: BrowserOrg[]): BrowserOrg[] => {
  const uniqueMap = new Map<string, BrowserOrg>();

  orgs.forEach(org => {
    const key = getUniqueOrgKey(org);
    const existing = uniqueMap.get(key);

    if (
      !existing ||
      getCompletenessScore(org) > getCompletenessScore(existing)
    ) {
      uniqueMap.set(key, {
        ...existing,
        ...org,
        contact: { ...existing?.contact, ...org.contact },
      });
    }
  });

  return Array.from(uniqueMap.values()).sort((a, b) =>
    a.org.localeCompare(b.org)
  );
};

const buildOrgIndex = (): BrowserOrg[] => {
  const academic = Object.entries(academicOrgsByCategory).flatMap(
    ([category, orgs]) =>
      orgs.map(org => ({ ...org, type: 'Academic' as const, category }))
  );

  const nonAcademic = Object.entries(nonAcademicOrgsByCategory).flatMap(
    ([category, orgs]) =>
      orgs.map(org => ({ ...org, type: 'Non-Academic' as const, category }))
  );

  return mergeOrganizations([...academic, ...nonAcademic]);
};

const filterOrganizations = (
  orgs: BrowserOrg[],
  query: string,
  orgType: FilterValue,
  category: FilterValue
): BrowserOrg[] => {
  const normalizedQuery = normalize(query);

  return orgs.filter(org => {
    const matchesType = orgType === 'All' || org.type === orgType;
    const matchesCategory = category === 'All' || org.category === category;

    if (!matchesType || !matchesCategory) return false;

    if (!normalizedQuery) return true;

    const haystack = normalize(
      [
        org.org,
        org.description,
        org.program,
        org.slug,
        org.category,
        org.type,
      ].join(' ')
    );
    return haystack.includes(normalizedQuery);
  });
};

type State = typeof INITIAL_STATE;
type Action =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_DEBOUNCED_QUERY'; payload: string }
  | { type: 'SET_ORG_TYPE'; payload: FilterValue }
  | { type: 'SET_CATEGORY'; payload: FilterValue }
  | { type: 'RESET_FILTERS' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_DEBOUNCED_QUERY':
      return { ...state, debouncedQuery: action.payload };
    case 'SET_ORG_TYPE':
      return { ...state, orgType: action.payload };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'RESET_FILTERS':
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};

const FilterSelect = ({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: FilterValue;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: FilterValue[];
  placeholder: string;
}) => (
  <select
    value={value}
    onChange={onChange}
    className="w-full appearance-none rounded-md border border-border bg-surface-1 px-3 py-2 text-sm text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors"
  >
    {options.map(opt => (
      <option key={opt} value={opt}>
        {opt === 'All' ? placeholder : opt}
      </option>
    ))}
  </select>
);

export default function OrgBrowser() {
  const allOrgs = useMemo(() => buildOrgIndex(), []);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { query, debouncedQuery, orgType, category } = state;
  const {
    ITEMS_PER_PAGE,
    DEBOUNCE_DELAY,
    ORG_TYPE_OPTIONS,
    PLACEHOLDER_TEXT,
    MESSAGES,
  } = ORG_BROWSER;

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_DEBOUNCED_QUERY', payload: query });
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [query, DEBOUNCE_DELAY]);

  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading(query !== debouncedQuery);
    }, 0);
    return () => clearTimeout(t);
  }, [query, debouncedQuery]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(allOrgs.map(org => org.category)));
    return ['All', ...unique.sort()] as FilterValue[];
  }, [allOrgs]);

  const filteredOrgs = useMemo(
    () => filterOrganizations(allOrgs, debouncedQuery, orgType, category),
    [allOrgs, debouncedQuery, orgType, category]
  );

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
  }, [debouncedQuery, orgType, category]);

  const paginatedOrgs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrgs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrgs, currentPage, ITEMS_PER_PAGE]);

  const totalPages = Math.ceil(filteredOrgs.length / ITEMS_PER_PAGE);

  const handleResetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  return (
    <>
      <SEO
        title={ORG_BROWSER.MESSAGES.TITLE}
        description={ORG_BROWSER.MESSAGES.SUBTITLE}
      />

      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 md:px-6 md:py-10">
        <Section>
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-2">
              {MESSAGES.TITLE}
            </h1>
            <p className="text-sm md:text-base text-foreground-secondary max-w-2xl">
              {MESSAGES.SUBTITLE}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
              <input
                type="text"
                value={query}
                onChange={e =>
                  dispatch({ type: 'SET_QUERY', payload: e.target.value })
                }
                placeholder={PLACEHOLDER_TEXT.SEARCH}
                className="w-full rounded-md border border-border bg-surface-1 pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors"
              />
            </div>

            <FilterSelect
              value={orgType}
              onChange={e =>
                dispatch({
                  type: 'SET_ORG_TYPE',
                  payload: e.target.value as FilterValue,
                })
              }
              options={ORG_TYPE_OPTIONS}
              placeholder={PLACEHOLDER_TEXT.ALL_TYPES}
            />

            <FilterSelect
              value={category}
              onChange={e =>
                dispatch({
                  type: 'SET_CATEGORY',
                  payload: e.target.value as FilterValue,
                })
              }
              options={categories}
              placeholder={PLACEHOLDER_TEXT.ALL_CATEGORIES}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 text-sm text-foreground-secondary gap-3 pb-3 border-b border-border">
            <p>
              Showing{' '}
              <span className="font-mono text-foreground">
                {filteredOrgs.length}
              </span>{' '}
              of{' '}
              <span className="font-mono text-foreground">{allOrgs.length}</span>{' '}
              organizations
            </p>
            {(query || orgType !== 'All' || category !== 'All') && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-xs font-medium text-foreground-muted hover:text-foreground transition-colors"
              >
                <Filter className="h-3.5 w-3.5" />
                {MESSAGES.CLEAR_FILTERS}
              </button>
            )}
          </div>
        </Section>

        {!isLoading && filteredOrgs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-surface-1 py-16 text-center">
            <p className="text-foreground text-sm font-medium">{MESSAGES.NO_RESULTS}</p>
            <p className="text-foreground-secondary text-xs mt-1">
              {MESSAGES.NO_RESULTS_SUBTEXT}
            </p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface-1"
                >
                  <div className="relative shrink-0 overflow-hidden h-28 md:h-auto md:w-full border-b border-border">
                    <div className="h-28 w-full bg-surface-2 animate-pulse" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div className="min-w-0 space-y-2">
                      <div className="h-2 w-16 rounded bg-surface-3 animate-pulse" />
                      <div className="h-4 w-3/4 rounded bg-surface-3 animate-pulse" />
                      <div className="space-y-1.5 mt-3">
                        <div className="h-2 w-full rounded bg-surface-2 animate-pulse" />
                        <div className="h-2 w-5/6 rounded bg-surface-2 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <OrgGrid
            organizations={paginatedOrgs}
            columns={4}
            className="w-full mt-4"
          />
        )}

        {totalPages > 1 && !isLoading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-8"
          />
        )}
      </div>
    </>
  );
}