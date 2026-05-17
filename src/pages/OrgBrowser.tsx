import React, { useMemo, useReducer, useEffect, useState, useCallback } from 'react';
import { Search, Filter } from 'lucide-react';
import Section from '@/components/ui/Section';
import { academicOrgsByCategory } from '@/data/academicOrgs';
import { nonAcademicOrgsByCategory } from '@/data/nonAcademicOrgs';
import { normalize } from '@/lib/utils';
import OrgGrid from '@/components/layout/OrgGrid';
import Pagination from '@/components/ui/Pagination';

type OrgType = 'Academic' | 'Non-Academic';
type FilterValue = 'All' | string;

type BrowserOrg = {
  slug: string;
  org: string;
  description?: string;
  program?: string;
  logo?: string;
  contact: {
    email?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    x?: string;
  };
  type: OrgType;
  category: string;
};

// ==================== Utility Functions ====================

const getUniqueOrgKey = (org: { slug: string; org: string }): string =>
  org.slug ? `slug:${normalize(org.slug)}` : `org:${normalize(org.org)}`;

const getCompletenessScore = (org: BrowserOrg): number =>
  [org.description, org.program, org.logo, org.contact.email, org.contact.facebook, org.contact.instagram, org.contact.tiktok, org.contact.x].filter(Boolean).length;

const mergeOrganizations = (orgs: BrowserOrg[]): BrowserOrg[] => {
  const uniqueMap = new Map<string, BrowserOrg>();

  orgs.forEach((org) => {
    const key = getUniqueOrgKey(org);
    const existing = uniqueMap.get(key);

    if (!existing || getCompletenessScore(org) > getCompletenessScore(existing)) {
      uniqueMap.set(key, {
        ...existing,
        ...org,
        contact: { ...existing?.contact, ...org.contact },
      });
    }
  });

  return Array.from(uniqueMap.values()).sort((a, b) => a.org.localeCompare(b.org));
};

const buildOrgIndex = (): BrowserOrg[] => {
  const academic = Object.entries(academicOrgsByCategory).flatMap(([category, orgs]) =>
    orgs.map((org) => ({ ...org, type: 'Academic' as const, category }))
  );

  const nonAcademic = Object.entries(nonAcademicOrgsByCategory).flatMap(([category, orgs]) =>
    orgs.map((org) => ({ ...org, type: 'Non-Academic' as const, category }))
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

  return orgs.filter((org) => {
    const matchesType = orgType === 'All' || org.type === orgType;
    const matchesCategory = category === 'All' || org.category === category;

    if (!matchesType || !matchesCategory) return false;

    if (!normalizedQuery) return true;

    const haystack = normalize([org.org, org.description, org.program, org.slug, org.category, org.type].join(' '));
    return haystack.includes(normalizedQuery);
  });
};

// ==================== Reducer ====================

const initialState = {
  query: '',
  debouncedQuery: '',
  orgType: 'All' as FilterValue,
  category: 'All' as FilterValue,
};

type State = typeof initialState;
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
      return { ...initialState };
    default:
      return state;
  }
};

// ==================== Components ====================

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
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt === 'All' ? placeholder : opt}
      </option>
    ))}
  </select>
);

// ==================== Main Component ====================

export default function OrgBrowser() {
  const allOrgs = useMemo(() => buildOrgIndex(), []);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { query, debouncedQuery, orgType, category } = state;

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => dispatch({ type: 'SET_DEBOUNCED_QUERY', payload: query }), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(allOrgs.map((org) => org.category)));
    return ['All', ...unique.sort()] as FilterValue[];
  }, [allOrgs]);

  const filteredOrgs = useMemo(
    () => filterOrganizations(allOrgs, debouncedQuery, orgType, category),
    [allOrgs, debouncedQuery, orgType, category]
  );

  const totalPages = Math.ceil(filteredOrgs.length / itemsPerPage);

  // Reset to page 1 when filters change
  const isInitialMount = React.useRef(true);
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
  }, [debouncedQuery, orgType, category]);

  const paginatedOrgs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrgs.slice(start, start + itemsPerPage);
  }, [filteredOrgs, currentPage]);

  const handleResetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Section>
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-black mb-2">
            Organization Browser
          </h1>
          <p className="text-lg text-neutral-600">
            Discover and explore student organizations across campus.
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => dispatch({ type: 'SET_QUERY', payload: e.target.value })}
              placeholder="Search organizations..."
              className="w-full border border-neutral-300 pl-12 pr-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
            />
          </div>

          <FilterSelect
            value={orgType}
            onChange={(e) => dispatch({ type: 'SET_ORG_TYPE', payload: e.target.value as FilterValue })}
            options={['All', 'Academic', 'Non-Academic']}
            placeholder="All Types"
          />

          <FilterSelect
            value={category}
            onChange={(e) => dispatch({ type: 'SET_CATEGORY', payload: e.target.value as FilterValue })}
            options={categories}
            placeholder="All Categories"
          />
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 text-sm text-neutral-600 gap-3">
          <p>
            Showing{' '}
            <span className="font-medium text-black">{filteredOrgs.length}</span> of{' '}
            <span className="font-medium text-black">{allOrgs.length}</span> organizations
          </p>
          {(query || orgType !== 'All' || category !== 'All') && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black transition-colors"
            >
              <Filter className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>
      </Section>

      {/* Results */}
      {paginatedOrgs.length === 0 ? (
        <div className="border border-dashed border-neutral-300 bg-neutral-50 py-16 text-center">
          <p className="text-neutral-600">No organizations match your current filters.</p>
          <p className="text-neutral-500 text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <OrgGrid organizations={paginatedOrgs} columns={2} className="w-full mt-6 gap-6" />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-8"
        />
      )}
    </div>
  );
}