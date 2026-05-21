import { Helmet } from 'react-helmet-async';

type SEOProps = {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: 'website' | 'article';
};

export default function SEO({
  title,
  description = 'Discover and explore student organizations across Cavite State University campuses.',
  image = '/hero.png', // Pointing to local asset instead of dummy domain
  canonical,
  type = 'website',
}: SEOProps) {
  const baseTitle = 'BetterOSAS';
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Social Media */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      {canonical && <meta property="og:url" content={canonical} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
}

