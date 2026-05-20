import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { Users, MapPin, ExternalLink } from 'lucide-react';
import SEO from '@/components/SEO';

import { orgRegistry } from '@/lib/orgIndex';
import { CAMPUSES, CONTACT_ICONS } from '@/data/constants';
import { Pills } from '@/components/ui/Pills';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const PROFILE_STRINGS = {
  NOT_FOUND_TITLE: 'Organization Not Found',
  NOT_FOUND_DESCRIPTION: "The organization you're looking for doesn't exist or may have been moved.",
  BACK_LINK: '← Back to Organizations',
};

export default function OrganizationProfile() {
  const { slug } = useParams<{ slug: string }>();

  // O(1) Instant Lookup using our new Singleton Registry
  const org = useMemo(() => (slug ? orgRegistry.getBySlug(slug) : null), [slug]);
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

  // Safely extract contact links matching the new schema
  const socialEntries = org.contact?.social
    ? Object.entries(org.contact.social).filter(([, val]) => val)
    : [];

  return (
    <>
      <SEO title={`${org.name} • BetterOSAS`} description={org.content.shortDescription} />

      <div className="min-h-screen bg-bg">
        {/* Hero Section */}
        <div className="relative bg-primary-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 opacity-90" />
          <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center md:items-end gap-8">

            {/* Visual Identity / Logo Area */}
            <div className="w-32 h-32 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl bg-white flex items-center justify-center shrink-0 border-4 border-white/10 relative group">
              {org.assets?.logoUrl ? (
                <img
                  src={org.assets.logoUrl}
                  alt={`${org.name} logo`}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              {/* Fallback Display */}
              <div className={`flex items-center justify-center w-full h-full bg-surface-2 text-border-strong font-extrabold tracking-tighter ${org.assets?.logoUrl ? 'hidden' : ''} text-5xl md:text-8xl`}>
                {org.acronym || org.name.substring(0, 2).toUpperCase()}
              </div>
            </div>

            {/* Header Text Area */}
            <div className="text-center md:text-left flex-1 min-w-0">
              <Pills items={[org.type]} className="mb-4 justify-center md:justify-start bg-white/20 text-white border-0 backdrop-blur-sm font-medium" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                {org.name}
              </h1>
              <p className="mt-3 text-white/80 flex items-center justify-center md:justify-start gap-2 font-medium">
                <MapPin size={18} /> {org.category} {campus && `• ${campus.name}`}
              </p>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <Breadcrumbs items={[
              { label: 'Home', href: '/' },
              { label: 'Organizations', href: '/organization' },
              { label: org.acronym || org.name } // Prefer acronym for breadcrumbs to save space
            ]} />

            {/* Content Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                About the Organization
                <div className="h-px flex-1 bg-border/60" />
              </h2>
              <div className="prose prose-gray max-w-none text-foreground-secondary leading-relaxed whitespace-pre-line text-lg">
                {org.content.about || org.content.shortDescription}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            {/* Details Card */}
            <div className="bg-surface-1 border border-border p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold mb-5 flex items-center gap-2 text-xs uppercase tracking-widest text-foreground-tertiary">
                <Users size={16} /> Details
              </h3>
              <div className="space-y-4 text-sm">
                {org.programId && (
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-foreground-muted mb-1">Program</p>
                    <p className="font-semibold text-foreground">{org.programId}</p>
                  </div>
                )}
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-foreground-muted mb-1">Campus</p>
                  <p className="font-semibold text-foreground">{campus?.name || 'N/A'}</p>
                </div>
                {org.metadata?.foundedYear && (
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-foreground-muted mb-1">Founded</p>
                    <p className="font-semibold text-foreground">{org.metadata.foundedYear}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Connect Card */}
            <div className="bg-surface-1 border border-border p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold mb-5 flex items-center gap-2 text-xs uppercase tracking-widest text-foreground-tertiary">
                <ExternalLink size={16} /> Connect
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {/* Direct Contacts (Email/Website) */}
                {org.contact?.email && (
                  <a
                    href={`mailto:${org.contact.email}`}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-surface-2 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-all duration-300 group"
                  >
                    {CONTACT_ICONS['email']?.(true)}
                    <span className="text-[10px] font-bold uppercase tracking-wider">Email</span>
                  </a>
                )}

                {org.contact?.website && (
                  <a
                    href={org.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-surface-2 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-all duration-300 group"
                  >
                    {CONTACT_ICONS['website']?.(true)}
                    <span className="text-[10px] font-bold uppercase tracking-wider">Website</span>
                  </a>
                )}

                {/* Social Media Links */}
                {socialEntries.map(([network, url]) => (
                  <a
                    key={network}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-surface-2 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-all duration-300 group"
                  >
                    {CONTACT_ICONS[network]?.(true)}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{network}</span>
                  </a>
                ))}
              </div>

              {(!org.contact?.email && !org.contact?.website && socialEntries.length === 0) && (
                <p className="text-sm italic text-foreground-muted text-center py-4">
                  No contact information available.
                </p>
              )}
            </div>
          </aside>
        </main>
      </div>
    </>
  );
}