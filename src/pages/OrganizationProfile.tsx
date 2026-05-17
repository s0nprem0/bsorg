import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';

import { academicOrgsByCategory } from '@/data/academicOrgs';
import { nonAcademicOrgsByCategory } from '@/data/nonAcademicOrgs';
import { CAMPUSES, COLLEGES, CONTACT_ICONS } from '@/data/constants';
import { Pills } from '@/components/ui/Pills';
import Breadcrumbs from '@/components/ui/BreadCrumbs';

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
    website?: string;
  };
  type?: 'Academic' | 'Non-Academic';
  category?: string;
  campusId: number;
};

function findOrganization(slug: string | undefined): BrowserOrg | null {
  if (!slug) return null;

  const normalizedSlug = slug.toLowerCase().trim();

  for (const college of COLLEGES) {
    const orgs = academicOrgsByCategory[college.name];
    if (orgs) {
      const found = orgs.find((org) => org.slug.toLowerCase() === normalizedSlug);
      if (found) {
        return { ...found, type: 'Academic', category: college.name, campusId: found.campusId };
      }
    }
  }

  for (const [category, orgs] of Object.entries(nonAcademicOrgsByCategory)) {
    const found = orgs.find((org) => org.slug.toLowerCase() === normalizedSlug);
    if (found) {
      return { ...found, type: 'Non-Academic', category, campusId: found.campusId || 0 };
    }
  }

  return null;
}

function ContactLink({ type, href, label }: { type: string; href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-black"
    >
      {CONTACT_ICONS[type]?.(true)}
      <span>{label}</span>
    </a>
  );
}

function CampusDisplay({ campusId }: { campusId: number }) {
  const campus = CAMPUSES.find((c) => c.id === campusId);
  return campus ? <Pills items={[campus.name]} variant="outline" size="sm" /> : <span>Unknown Campus</span>;
}

export default function OrganizationProfile() {
  const { slug } = useParams<{ slug: string }>();
  const org = useMemo(() => findOrganization(slug), [slug]);

  if (!org) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h2 className="mb-4 text-3xl font-bold">Organization Not Found</h2>
        <p className="mb-8 text-neutral-600">
          The organization you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to="/organization"
          className="inline-flex items-center gap-2 border border-black px-6 py-3 text-sm font-medium transition-colors hover:bg-black hover:text-white"
        >
          ← Back to Organizations
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Organizations', href: '/organization' },
          { label: org.org },
        ]}
        className="mb-6"
      />

      <Link
        to="/organization"
        className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-black"
      >
        <ArrowLeft size={18} />
        Back to Organization Browser
      </Link>

      <div className="flex flex-col gap-8 md:flex-row md:gap-10">
        <div className="shrink-0">
          <div className="relative aspect-square w-56 overflow-hidden border border-neutral-200 bg-white">
            {org.logo ? (
              <>
                <img
                  src={org.logo}
                  alt={`${org.org} logo`}
                  className="h-full w-full object-contain p-8"
                />
                <div className="absolute inset-0 bg-linear-to-br from-black/5 via-transparent to-black/20" />
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-7xl font-bold text-neutral-300">
                {org.org.charAt(0)}
              </div>
            )}
          </div>

          <div className="mt-5 space-y-3">
            <Pills items={[org.type || 'Organization']} variant="soft" size="sm" />
            {org.category && (
              <div className="text-sm text-neutral-500">{org.category}</div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <CampusDisplay campusId={org.campusId} />
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{org.org}</h1>

          {org.program && <p className="mt-2 text-lg text-neutral-600">{org.program}</p>}

          {org.description && (
            <div className="mt-8">
              <h3 className="mb-3 text-xl font-semibold">About</h3>
              <p className="whitespace-pre-line leading-relaxed text-neutral-700">{org.description}</p>
            </div>
          )}

          <div className="mt-8">
            <h3 className="mb-4 text-xl font-semibold">Contact Information</h3>
            <div className="flex flex-wrap gap-3">
              {org.contact.email && (
                <ContactLink type="email" href={`mailto:${org.contact.email}`} label={org.contact.email} />
              )}
              {org.contact.website && (
                <ContactLink type="website" href={org.contact.website} label="Website" />
              )}
              {org.contact.facebook && (
                <ContactLink type="facebook" href={org.contact.facebook} label="Facebook" />
              )}
              {org.contact.instagram && (
                <ContactLink type="instagram" href={org.contact.instagram} label="Instagram" />
              )}
              {org.contact.tiktok && (
                <ContactLink type="tiktok" href={org.contact.tiktok} label="TikTok" />
              )}
              {org.contact.x && (
                <ContactLink type="x" href={org.contact.x} label="X (Twitter)" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}