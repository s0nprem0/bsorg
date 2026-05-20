import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { Users, MapPin, ExternalLink,} from 'lucide-react';
import type { Organization } from '@/types/organization';
import SEO from '@/components/SEO';

import { academicOrgsByCategory } from '@/data/academicOrgs';
import { nonAcademicOrgsByCategory } from '@/data/nonAcademicOrgs';
import { CAMPUSES, CONTACT_ICONS } from '@/data/constants';
import { Pills } from '@/components/ui/Pills';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

type BrowserOrg = Organization & {
  type: 'Academic' | 'Non-Academic';
  category: string;
};

const PROFILE_STRINGS = {
  NOT_FOUND_TITLE: 'Organization Not Found',
  NOT_FOUND_DESCRIPTION: "The organization you're looking for doesn't exist or may have been moved.",
  BACK_LINK: '← Back to Organizations',
};

function findOrganization(slug: string | undefined): BrowserOrg | null {
  if (!slug) return null;
  const normalizedSlug = slug.toLowerCase().trim();

  for (const college of Object.keys(academicOrgsByCategory)) {
    const orgs = academicOrgsByCategory[college as keyof typeof academicOrgsByCategory];
    const found = orgs?.find((org) => org.slug.toLowerCase() === normalizedSlug);
    if (found) return { ...found, type: 'Academic', category: college };
  }

  for (const [category, orgs] of Object.entries(nonAcademicOrgsByCategory)) {
    const found = orgs.find((org) => org.slug.toLowerCase() === normalizedSlug);
    if (found) return { ...found, type: 'Non-Academic', category };
  }
  return null;
}

export default function OrganizationProfile() {
  const { slug } = useParams<{ slug: string }>();
  const org = useMemo(() => findOrganization(slug), [slug]);
  const campus = CAMPUSES.find((c) => c.id === org?.campusId);

  if (!org) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-3xl font-bold">{PROFILE_STRINGS.NOT_FOUND_TITLE}</h2>
          <p className="text-text-secondary">{PROFILE_STRINGS.NOT_FOUND_DESCRIPTION}</p>
          <Link to="/organization" className="text-primary font-medium hover:underline">
            {PROFILE_STRINGS.BACK_LINK}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title={`${org.org} • BetterOSAS`} description={org.description} />

      <div className="min-h-screen bg-bg">
        {/* Hero Section */}
        <div className="relative bg-primary-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary-600 to-secondary-600 opacity-90" />
          <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center md:items-end gap-8">
            <div className="w-32 h-32 md:w-64 md:h-64 rounded-xl overflow-hidden shadow-2xl bg-white flex items-center justify-center shrink-0 border-4 border-white/10">
              {org.logo ? (
                <img src={org.logo} alt={org.org} className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-6xl font-bold text-gray-400">{org.org.charAt(0)}</span>
              )}
            </div>
            <div className="text-center md:text-left">
              <Pills items={[org.type]} className="mb-3 justify-center md:justify-start bg-white/20 text-white border-0" />
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{org.org}</h1>
              <p className="mt-2 text-white/80 flex items-center justify-center md:justify-start gap-2">
                <MapPin size={16} /> {org.category} {campus && `• ${campus.name}`}
              </p>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

          <div className="lg:col-span-2 space-y-8">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Organizations', href: '/organization' }, { label: org.org }]} />

            {org.description && (
              <section>
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <div className="prose prose-gray max-w-none text-text-secondary leading-relaxed whitespace-pre-line">
                  {org.description}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            {/* Info Card */}
            <div className="bg-surface-1 border border-border p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-text-secondary">
                <Users size={18} /> Details
              </h3>
              <div className="space-y-4 text-sm">
                {org.program && (
                  <div>
                    <p className="text-xs text-text-muted">Program</p>
                    <p className="font-semibold">{org.program}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-text-muted">Campus</p>
                  <p className="font-semibold">{campus?.name || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Connect Card */}
            <div className="bg-surface-1 border border-border p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider text-text-secondary">
                <ExternalLink size={18} /> Connect
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(org.contact).map(([key, value]) => value && (
                  <a
                    key={key}
                    href={key === 'email' ? `mailto:${value}` : value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-bg hover:border-primary-500 hover:text-primary-600 transition-all duration-300 group"
                  >
                    {CONTACT_ICONS[key as keyof typeof CONTACT_ICONS]?.(true)}
                    <span className="text-[10px] font-bold uppercase">{key}</span>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </>
  );
}