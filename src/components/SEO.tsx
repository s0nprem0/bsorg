import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  siteName = 'Better Student Org',
}: SEOProps) {
  const fullTitle = title ? `${title} - ${siteName}` : siteName;

  const getAbsoluteImageUrl = (img?: string): string | undefined => {
    if (!img) return undefined;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${img}`;
    }
    return img;
  };

  const absoluteImage = getAbsoluteImageUrl(image);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {absoluteImage && <meta property="og:image" content={absoluteImage} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      {title && <meta property="twitter:title" content={title} />}
      {description && (
        <meta property="twitter:description" content={description} />
      )}
      {absoluteImage && <meta property="twitter:image" content={absoluteImage} />}
      <meta property="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
