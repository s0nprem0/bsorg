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
    className="w-full border border-neutral-300 px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
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

  // Show loading when query differs from debounced query (deferred to avoid cascading renders)
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

      <div className="max-w-7xl mx-auto px-4 py-10">
        <Section>
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-black mb-2">
              {MESSAGES.TITLE}
            </h1>
            <p className="text-lg text-neutral-600">{MESSAGES.SUBTITLE}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                value={query}
                onChange={e =>
                  dispatch({ type: 'SET_QUERY', payload: e.target.value })
                }
                placeholder={PLACEHOLDER_TEXT.SEARCH}
                className="w-full border border-neutral-300 pl-12 pr-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
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

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 text-sm text-neutral-600 gap-3">
            <p>
              Showing{' '}
              <span className="font-medium text-black">
                {filteredOrgs.length}
              </span>{' '}
              of{' '}
              <span className="font-medium text-black">{allOrgs.length}</span>{' '}
              organizations
            </p>
            {(query || orgType !== 'All' || category !== 'All') && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black transition-colors"
              >
                <Filter className="h-3.5 w-3.5" />
                {MESSAGES.CLEAR_FILTERS}
              </button>
            )}
          </div>
        </Section>

        {!isLoading && filteredOrgs.length === 0 ? (
          <div className="border border-dashed border-neutral-300 bg-neutral-50 py-16 text-center">
            <p className="text-neutral-600">{MESSAGES.NO_RESULTS}</p>
            <p className="text-neutral-500 text-sm mt-1">
              {MESSAGES.NO_RESULTS_SUBTEXT}
            </p>
          </div>
        ) : isLoading ? (
          <div className="space-y-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative shrink-0 overflow-hidden aspect-3/2 w-44">
                    <div className="h-full w-full bg-neutral-200 animate-pulse" />
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-black/20" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between p-4 md:p-5">
                    <div className="min-w-0">
                      <div className="mb-2">
                        <div className="h-2 w-20 rounded bg-neutral-200 animate-pulse" />
                      </div>
                      <h3 className="truncate font-bold leading-tight text-black text-lg md:text-xl">
                        <div className="h-4 w-32 rounded bg-neutral-200 animate-pulse" />
                      </h3>
                      <p className="mt-3 line-clamp-3 text-neutral-600 text-sm">
                        <div className="h-2 w-full rounded bg-neutral-200 animate-pulse" />
                        <div className="mt-1 h-2 w-3/4 rounded bg-neutral-200 animate-pulse" />
                        <div className="mt-1 h-2 w-1/2 rounded bg-neutral-200 animate-pulse" />
                      </p>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-2.5">
                      {[...Array(3)].map((_, i) => (
                        <a
                          key={i}
                          href="#"
                          title="Contact"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-all duration-200 hover:scale-110 hover:bg-neutral-200 h-9 w-9"
                        >
                          <div className="h-5 w-5 bg-neutral-200 animate-pulse" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <OrgGrid
            organizations={paginatedOrgs}
            columns={2}
            className="w-full mt-6 gap-6"
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
