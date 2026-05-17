import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';

import { academicOrgsByCategory } from '@/data/academicOrgs';
import { nonAcademicOrgsByCategory } from '@/data/nonAcademicOrgs';
import { CAMPUSES ,COLLEGES, CONTACT_ICONS } from '@/data/constants';

import Breadcrumbs from '@/components/ui/Breadcrumbs';

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

  // Search in academic organizations
  for (const college of COLLEGES) {
    const orgs = academicOrgsByCategory[college.name];
    if (orgs) {
      const found = orgs.find((org) => org.slug.toLowerCase() === normalizedSlug);
      if (found) {
        return { ...found, type: 'Academic', category: college.name, campusId: found.campusId };
      }
    }
  }

  // Search in non-academic organizations
  for (const [category, orgs] of Object.entries(nonAcademicOrgsByCategory)) {
    const found = orgs.find((org) => org.slug.toLowerCase() === normalizedSlug);
    if (found) {
      return { ...found, type: 'Non-Academic', category, campusId: found.campusId || 0 };
    }
  }

  return null;
}

// Reusable component for rendering contact links
function ContactLink({ type, href, label }: { type: string; href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 border border-neutral-300 hover:border-black px-5 py-3 transition-colors ${type !== 'email' ? 'text-neutral-700' : ''}`}
    >
      {CONTACT_ICONS[type]?.(true)}
      <span className="font-medium">{label}</span>
    </a>
  );
}

// Component to display campus name
function CampusDisplay({ campusId }: { campusId: number }) {
  const campus = CAMPUSES.find((c) => c.id === campusId);
  return campus ? <span>{campus.name}</span> : <span>Unknown Campus</span>;
}

export default function OrganizationProfile() {
  const { slug } = useParams<{ slug: string }>();

  const org = useMemo(() => findOrganization(slug), [slug]);

  if (!org) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Organization Not Found</h2>
        <p className="text-neutral-600 mb-8">
          The organization you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to="/organization"
          className="inline-flex items-center gap-2 border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors"
        >
          ← Back to Organizations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Organizations', href: '/organization' },
          { label: org.org }, // Current organization name
        ]}
        className="mb-6"
      />

      {/* Back Button */}
      <Link
        to="/organization"
        className="inline-flex items-center gap-2 text-neutral-600 hover:text-black transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        Back to Organization Browser
      </Link>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Column - Logo & Basic Info */}
        <div className="shrink-0">
          <div className="w-56 h-56 bg-white border border-neutral-200 overflow-hidden flex items-center justify-center">
            {org.logo ? (
              <>
                <img
                  src={org.logo}
                  alt={`${org.org} logo`}
                  className="h-full w-full object-contain p-6"
                />
                {/* Gradient Mask */}
                <div className="absolute inset-0 bg-linear-to-br from-black/5 via-transparent to-black/30 pointer-events-none" />
              </>
            ) : (
              <div className="text-8xl font-bold text-neutral-300">
                {org.org.charAt(0)}
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="inline-block px-4 py-1.5 border border-neutral-300 text-sm">
              {org.type}
            </div>
            {org.category && (
              <div className="mt-2 text-sm text-neutral-500">{org.category}</div>
            )}
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-bold tracking-tight mb-2">{org.org}</h1>

          {org.program && (
            <p className="text-lg text-neutral-600 mb-8">{org.program}</p>
          )}

          {/* About Section */}
          {org.description && (
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4">About</h3>
              <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                {org.description}
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>

            <div className="flex flex-wrap gap-4">
              {org.contact.email && (
                <ContactLink type="email" href={`mailto:${org.contact.email}`}
                  label={org.contact.email}
                />
              )}

              {org.contact.website && (
                <ContactLink type="website" href={org.contact.website}
                  label="Website"
                />
              )}

              {org.contact.facebook && (
                <ContactLink type="facebook" href={org.contact.facebook}
                  label="Facebook"
                />
              )}

              {org.contact.instagram && (
                <ContactLink type="instagram" href={org.contact.instagram}
                  label="Instagram"
                />
              )}

              {org.contact.tiktok && (
                <ContactLink type="tiktok" href={org.contact.tiktok}
                  label="TikTok"
                />
              )}

              {org.contact.x && (
                <ContactLink type="x" href={org.contact.x}
                  label="X (Twitter)"
                />
              )}
            </div>
          </div>

          {/* Display Campus */}
          <div className="mt-2 text-sm text-neutral-500">
            <strong>Campus:</strong> <CampusDisplay campusId={org.campusId} />
          </div>
        </div>
      </div>
    </div>
  );
}