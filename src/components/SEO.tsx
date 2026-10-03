import { Helmet } from 'react-helmet-async';

type SEOProps = {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
};

const DEFAULT_DESC = 'Discover and explore student organizations across Cavite State University campuses.';

export default function SEO({
  title,
  description = DEFAULT_DESC,
  image,
  type = 'website',
}: SEOProps) {
  const baseTitle = 'BetterOSAS';
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

  // Canonical + og:url use the path only, so a filtered /org?q=foo page
  // does not advertise itself as a separate URL to crawlers.
  const currentUrl = typeof window !== 'undefined' ? `${siteUrl}${window.location.pathname}` : siteUrl;

  const resolveImage = (src?: string) => {
    if (!src) return `${siteUrl}/hero.png`;
    if (src.startsWith('http')) return src;
    return `${siteUrl}${src.startsWith('/') ? '' : '/'}${src}`;
  };

  const ogImage = resolveImage(image);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
