import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { Users, MapPin, ExternalLink } from 'lucide-react';

import SEO from '@/components/SEO';
import { orgRegistry } from '@/lib/orgIndex';
import { CAMPUSES, CONTACT_ICONS } from '@/data/constants';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

// Shadcn UI
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcn/avatar';
import { Badge } from '@/components/ui/shadcn/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';

export default function OrganizationProfile() {
  const { slug } = useParams<{ slug: string }>();
  const org = useMemo(() => (slug ? orgRegistry.getBySlug(slug) : null), [slug]);
  const campus = CAMPUSES.find((c) => c.id === org?.campusId);

  if (!org) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-3xl font-bold">Organization Not Found</h2>
          <p className="text-muted-foreground">The organization you're looking for doesn't exist or may have been moved.</p>
          <Button asChild variant="link">
            <Link to="/organization">← Back to Organizations</Link>
          </Button>
        </div>
      </div>
    );
  }

  const socialEntries = org.contact?.social ? Object.entries(org.contact.social).filter(([, val]) => val) : [];

  return (
    <>
      <SEO title={`${org.name} • BetterOSAS`} description={org.content.shortDescription} />
      <div className="min-h-screen bg-background">

        {/* Hero Section */}
        <div className="relative bg-surface-1 border-b border-border overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size[24px_24px]"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center md:items-end gap-8">

            {/* Shadcn Avatar for Visual Identity */}
            <Avatar className="w-32 h-32 md:w-48 md:h-48 border-4 border-background shadow-xl rounded-2xl bg-surface-2">
              <AvatarImage src={org.assets?.logoUrl} alt={`${org.name} logo`} className="object-contain p-4" />
              <AvatarFallback className="text-4xl md:text-6xl font-extrabold rounded-2xl bg-surface-2 text-muted-foreground">
                {org.acronym || org.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left flex-1 min-w-0 z-10">
              <Badge variant="secondary" className="mb-4">{org.type}</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-foreground">
                {org.name}
              </h1>
              <p className="mt-3 text-muted-foreground flex items-center justify-center md:justify-start gap-2 font-medium">
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
              { label: org.acronym || org.name }
            ]} />

            <section>
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                About the Organization
                <div className="h-px flex-1 bg-border/60" />
              </h2>
              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line text-lg">
                {org.content.about || org.content.shortDescription}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Users size={16} /> Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {org.programId && (
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Program</p>
                    <p className="font-semibold">{org.programId}</p>
                  </div>
                )}
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Campus</p>
                  <p className="font-semibold">{campus?.name || 'N/A'}</p>
                </div>
                {org.metadata?.foundedYear && (
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Founded</p>
                    <p className="font-semibold">{org.metadata.foundedYear}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ExternalLink size={16} /> Connect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {org.contact?.email && (
                    <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
                      <a href={`mailto:${org.contact.email}`}>
                        {CONTACT_ICONS['email']?.(true)}
                        <span className="text-[10px] font-bold uppercase tracking-wider">Email</span>
                      </a>
                    </Button>
                  )}
                  {org.contact?.website && (
                    <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
                      <a href={org.contact.website} target="_blank" rel="noopener noreferrer">
                        {CONTACT_ICONS['website']?.(true)}
                        <span className="text-[10px] font-bold uppercase tracking-wider">Website</span>
                      </a>
                    </Button>
                  )}
                  {socialEntries.map(([network, url]) => (
                    <Button key={network} variant="outline" asChild className="h-auto py-4 flex-col gap-2">
                      <a href={url as string} target="_blank" rel="noopener noreferrer">
                        {CONTACT_ICONS[network]?.(true)}
                        <span className="text-[10px] font-bold uppercase tracking-wider">{network}</span>
                      </a>
                    </Button>
                  ))}
                </div>
                {(!org.contact?.email && !org.contact?.website && socialEntries.length === 0) && (
                  <p className="text-sm italic text-muted-foreground text-center py-2">
                    No contact information available.
                  </p>
                )}
              </CardContent>
            </Card>
          </aside>
        </main>
      </div>
    </>
  );
}