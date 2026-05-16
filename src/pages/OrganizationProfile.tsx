import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6';

import { academicOrgsByCategory } from '@/data/academicOrgs';
import { nonAcademicOrgsByCategory } from '@/data/nonAcademicOrgs';
import { COLLEGES } from '@/data/constants';

import Breadcrumbs from '@/components/ui/Breadcrumbs'; // Import Breadcrumbs

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
  type?: 'Academic' | 'Non-Academic';
  category?: string;
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
        return { ...found, type: 'Academic', category: college.name };
      }
    }
  }

  // Search in non-academic organizations
  for (const [category, orgs] of Object.entries(nonAcademicOrgsByCategory)) {
    const found = orgs.find((org) => org.slug.toLowerCase() === normalizedSlug);
    if (found) {
      return { ...found, type: 'Non-Academic', category };
    }
  }

  return null;
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
                <a
                  href={`mailto:${org.contact.email}`}
                  className="flex items-center gap-3 border border-neutral-300 hover:border-black px-5 py-3 transition-colors group"
                >
                  <Mail className="text-neutral-500 group-hover:text-black" size={22} />
                  <span className="font-medium">{org.contact.email}</span>
                </a>
              )}

              {org.contact.facebook && (
                <a
                  href={org.contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border border-neutral-300 hover:border-[#1877F2] px-5 py-3 transition-colors text-neutral-700 hover:text-[#1877F2]"
                >
                  <FaFacebook size={22} />
                  <span>Facebook</span>
                </a>
              )}

              {org.contact.instagram && (
                <a
                  href={org.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border border-neutral-300 hover:border-[#E4405F] px-5 py-3 transition-colors text-neutral-700 hover:text-[#E4405F]"
                >
                  <FaInstagram size={22} />
                  <span>Instagram</span>
                </a>
              )}

              {org.contact.tiktok && (
                <a
                  href={org.contact.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border border-neutral-300 hover:border-black px-5 py-3 transition-colors"
                >
                  <FaTiktok size={22} />
                  <span>TikTok</span>
                </a>
              )}

              {org.contact.x && (
                <a
                  href={org.contact.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border border-neutral-300 hover:border-black px-5 py-3 transition-colors"
                >
                  <FaXTwitter size={22} />
                  <span>X (Twitter)</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}