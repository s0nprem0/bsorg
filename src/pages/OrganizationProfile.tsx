import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { MapPin, ExternalLink, Info, Target, Eye, ImageIcon, X } from 'lucide-react';

import SEO from '@/components/SEO';
import { orgRegistry } from '@/lib/orgIndex';
import { ContactIcon } from '@/components/ui/ContactIcon';
import { CAMPUSES } from '@/data/campuses';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import RelatedOrganizations from '@/components/sections/RelatedOrganizations';

// Shadcn UI
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/shadcn/avatar';
import { Badge } from '@/components/ui/shadcn/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from '@/components/ui/shadcn/dialog';

export default function OrganizationProfile() {
  const { slug } = useParams<{ slug: string }>();
  const org = useMemo(
    () => (slug ? orgRegistry.getBySlug(slug) : null),
    [slug]
  );
  const campus = CAMPUSES.find(c => c.id === org?.campusId);

  if (!org) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-3xl font-bold">Organization Not Found</h2>
          <p className="text-muted-foreground">
            The organization you're looking for doesn't exist or may have been
            moved.
          </p>
          <Button asChild variant="link">
            <Link to="/org">← Back to Organizations</Link>
          </Button>
        </div>
      </div>
    );
  }

  const socialEntries = org.contact?.social
    ? Object.entries(org.contact.social).filter(([, val]) => val)
    : [];

  return (
    <>
      <SEO
        title={`${org.name} • BetterOSAS`}
        description={org.content.shortDescription}
      />

      <div className="min-h-screen bg-background pb-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Organizations', href: '/org' },
              { label: org.acronym || org.name },
            ]}
          />

          {org.assets?.bannerUrl && (
            <div className="rounded-xl overflow-hidden max-h-80 mb-2">
              <img
                src={org.assets.bannerUrl}
                alt={`${org.name} banner`}
                className="w-full h-56 sm:h-64 object-cover"
              />
            </div>
          )}

          {/* Bento Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-min">
            {/* Main Identity Box (Spans 2 cols, 2 rows) */}
            <Card className="md:col-span-2 lg:col-span-2 md:row-span-2 relative overflow-hidden group border-none bg-card/50 backdrop-blur-sm shadow-lg">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              <CardContent className="p-8 sm:p-10 flex flex-col items-center sm:items-start text-center sm:text-left h-full justify-center relative z-10 gap-6">
                <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-xl rounded-3xl bg-secondary transition-transform duration-500 group-hover:scale-105">
                  <AvatarImage
                    src={org.assets?.logoUrl}
                    alt={`${org.name} logo`}
                    className="object-contain p-4"
                  />
                  <AvatarFallback className="text-4xl md:text-5xl font-extrabold rounded-3xl bg-secondary text-muted-foreground">
                    {org.acronym || org.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-3 w-full">
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <Badge
                      variant="secondary"
                      className="bg-primary/20 text-primary hover:bg-primary/30 border-none"
                    >
                      {org.type}
                    </Badge>
                    <Badge variant="outline">{org.status}</Badge>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
                    {org.name}
                  </h1>
                  <p className="text-muted-foreground font-medium text-lg max-w-lg">
                    {org.content.shortDescription}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Facts Box */}
            <Card className="md:col-span-1 lg:col-span-1 bg-card border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <MapPin size={16} /> Campus & Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 mt-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Location
                  </p>
                  <p className="font-semibold text-foreground">
                    {campus?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Category
                  </p>
                  <p className="font-semibold text-foreground">
                    {org.category}
                  </p>
                </div>
                {org.programId && (
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                      Program
                    </p>
                    <p className="font-semibold text-foreground">
                      {org.programId}
                    </p>
                  </div>
                )}
                {org.metadata?.foundedYear && (
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                      Founded
                    </p>
                    <p className="font-semibold text-foreground">
                      {org.metadata.foundedYear}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Connect / Socials Box */}
            <Card className="md:col-span-1 lg:col-span-1 bg-card border-none shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ExternalLink size={16} /> Connect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {org.contact?.email && (
                    <Button
                      variant="secondary"
                      asChild
                      className="h-auto py-4 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <a href={`mailto:${org.contact.email}`}>
                        <ContactIcon name="email" size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-wider mt-1">
                          Email
                        </span>
                      </a>
                    </Button>
                  )}
                  {org.contact?.website && (
                    <Button
                      variant="secondary"
                      asChild
                      className="h-auto py-4 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <a
                        href={org.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ContactIcon name="website" size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-wider mt-1">
                          Website
                        </span>
                      </a>
                    </Button>
                  )}
                  {socialEntries.map(([network, url]) => (
                    <Button
                      key={network}
                      variant="secondary"
                      asChild
                      className="h-auto py-4 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <a
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ContactIcon name={network} size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-wider mt-1">
                          {network}
                        </span>
                      </a>
                    </Button>
                  ))}
                </div>
                {!org.contact?.email &&
                  !org.contact?.website &&
                  socialEntries.length === 0 && (
                    <div className="h-full min-h-30 flex items-center justify-center text-sm italic text-muted-foreground text-center border-2 border-dashed border-border rounded-xl">
                      No links available
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* About Box (Spans wide below) */}
            <Card className="md:col-span-3 lg:col-span-2 bg-card border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Info className="text-primary" size={20} /> About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                  {org.content.about ||
                    'No detailed description available for this organization.'}
                </div>
              </CardContent>
            </Card>

            {/* Mission / Vision Box (Optional spanning) */}
            {(org.content?.mission || org.content?.vision) && (
              <Card className="md:col-span-3 lg:col-span-2 bg-card border-none shadow-md">
                <CardContent className="p-6 grid sm:grid-cols-2 gap-8 h-full items-start">
                  {org.content.mission && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                        <Target className="text-primary" size={16} /> Mission
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {org.content.mission}
                      </p>
                    </div>
                  )}
                  {org.content.vision && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                        <Eye className="text-primary" size={16} /> Vision
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {org.content.vision}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            {org.assets?.galleryUrls && org.assets.galleryUrls.length > 0 && (
              <Card className="md:col-span-3 lg:col-span-4 bg-card border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <ImageIcon className="text-primary" size={20} /> Gallery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {org.assets.galleryUrls.map((url, i) => (
                      <Dialog key={url}>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="group relative overflow-hidden rounded-lg aspect-square bg-muted"
                            aria-label={`View gallery image ${i + 1}`}
                          >
                            <img
                              src={url}
                              alt={`${org.name} gallery ${i + 1}`}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-[90vw] bg-black/95 border-none p-2">
                          <DialogClose className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors">
                            <X className="h-5 w-5" />
                          </DialogClose>
                          <img
                            src={url}
                            alt={`${org.name} gallery ${i + 1}`}
                            className="w-full max-h-[85vh] object-contain rounded-lg"
                          />
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <RelatedOrganizations currentOrg={org} />
        </main>
      </div>
    </>
  );
}
