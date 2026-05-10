import { useMemo, useState } from 'react';
import Section from '@/components/ui/Sectiton';
import OrganizationCard from '@/components/OrganizationCard';
import { academicOrgsByCategory } from '@/data/academicOrgs';
import { nonAcademicOrgsByCategory } from '@/data/nonAcademicOrgs';

type OrgType = 'Academic' | 'Non-Academic';

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

function normalize(text?: string) {
  return (text ?? '').toLowerCase();
}

function getUniqueOrgKey(org: Pick<BrowserOrg, 'slug' | 'org'>) {
  const slug = normalize(org.slug).trim();
  if (slug) {
    return `slug:${slug}`;
  }

  return `org:${normalize(org.org).trim()}`;
}

function getCompletenessScore(org: BrowserOrg) {
  return [
    org.description,
    org.program,
    org.logo,
    org.contact.email,
    org.contact.facebook,
    org.contact.instagram,
    org.contact.tiktok,
    org.contact.x,
  ].filter(Boolean).length;
}

export default function OrgBrowser() {
  const allOrgs = useMemo<BrowserOrg[]>(() => {
    const academic = Object.entries(academicOrgsByCategory).flatMap(([category, orgs]) =>
      orgs.map(org => ({
        ...org,
        type: 'Academic' as const,
        category,
      })),
    );

    const nonAcademic = Object.entries(nonAcademicOrgsByCategory).flatMap(([category, orgs]) =>
      orgs.map(org => ({
        ...org,
        type: 'Non-Academic' as const,
        category,
      })),
    );

    const uniqueMap = new Map<string, BrowserOrg>();

    for (const org of [...academic, ...nonAcademic]) {
      const key = getUniqueOrgKey(org);
      const existing = uniqueMap.get(key);

      if (!existing) {
        uniqueMap.set(key, org);
        continue;
      }

      const existingScore = getCompletenessScore(existing);
      const incomingScore = getCompletenessScore(org);

      if (incomingScore > existingScore) {
        uniqueMap.set(key, {
          ...existing,
          ...org,
          contact: {
            ...existing.contact,
            ...org.contact,
          },
        });
      }
    }

    return Array.from(uniqueMap.values()).sort((a, b) => a.org.localeCompare(b.org));
  }, []);

  const [query, setQuery] = useState('');
  const [orgType, setOrgType] = useState<'All' | OrgType>('All');
  const [category, setCategory] = useState<'All' | string>('All');

  const categories = useMemo(() => {
    return ['All', ...new Set(allOrgs.map(org => org.category))];
  }, [allOrgs]);

  const filteredOrgs = useMemo(() => {
    const q = normalize(query).trim();

    return allOrgs.filter(org => {
      const byType = orgType === 'All' || org.type === orgType;
      const byCategory = category === 'All' || org.category === category;

      if (!q) {
        return byType && byCategory;
      }

      const haystack = [
        org.org,
        org.description,
        org.program,
        org.slug,
        org.category,
        org.type,
      ]
        .map(value => normalize(value))
        .join(' ');

      return byType && byCategory && haystack.includes(q);
    });
  }, [allOrgs, category, orgType, query]);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
      <Section>
        <h1 className="text-3xl font-bold mb-4">Organization Browser</h1>
        <p className="text-lg text-neutral-600 mb-6">
          Search and filter student organizations by type and category.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Search organizations..."
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
          />

          <select
            value={orgType}
            onChange={event => setOrgType(event.target.value as 'All' | OrgType)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
          >
            <option value="All">All Types</option>
            <option value="Academic">Academic</option>
            <option value="Non-Academic">Non-Academic</option>
          </select>

          <select
            value={category}
            onChange={event => setCategory(event.target.value as 'All' | string)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
          >
            {categories.map(item => (
              <option key={item} value={item}>
                {item === 'All' ? 'All Categories' : item}
              </option>
            ))}
          </select>
        </div>
      </Section>

      <div className="mb-4 text-sm text-neutral-600">
        Showing {filteredOrgs.length} of {allOrgs.length} organizations
      </div>

      {filteredOrgs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-neutral-600">
          No organizations found. Try changing your search or filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrgs.map(org => (
            <OrganizationCard
              key={`${org.type}-${org.slug}`}
              slug={org.slug}
              org={org.org}
              program={org.program}
              contact={org.contact}
              logo={org.logo}
            />
          ))}
        </div>
      )}
    </div>
  );
}
