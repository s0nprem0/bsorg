import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ExternalLink, Info, Target, Eye, ImageIcon, ArrowLeft, SearchX, AlertTriangle, Users } from 'lucide-react';

import SEO from '@/components/SEO';
import { useOrg, useOrgs } from '@/hooks/useOrgService';
import { ContactIcon } from '@/components/ui/ContactIcon';
import { CAMPUSES } from '@/data/campuses';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import OrgGrid from '@/components/layout/OrgGrid';
import RelatedOrganizations from '@/components/sections/RelatedOrganizations';

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
  DialogTitle,
} from '@/components/ui/shadcn/dialog';

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-xl bg-card/50 animate-pulse ${className ?? ''}`}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-56 sm:h-64 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Skeleton className="md:col-span-2 lg:col-span-2 md:row-span-2 h-[420px]" />
          <Skeleton className="md:col-span-1 lg:col-span-1 h-48" />
          <Skeleton className="md:col-span-1 lg:col-span-1 h-48" />
          <Skeleton className="md:col-span-3 lg:col-span-2 h-40" />
        </div>
      </main>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Error Loading Organization</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {message}
          </p>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link to="/org">
            <ArrowLeft size={16} />
            Back to Organizations
          </Link>
        </Button>
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <SearchX className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Organization Not Found</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The organization you're looking for doesn't exist or may have been
            moved.
          </p>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link to="/org">
            <ArrowLeft size={16} />
            Back to Organizations
          </Link>
        </Button>
      </div>
    </div>
  );
}

const socialBrandStyles: Record<string, string> = {
  facebook: 'hover:bg-[#1877F2] hover:text-white',
  instagram: 'hover:bg-linear-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white',
  x: 'hover:bg-black hover:text-white',
  tiktok: 'hover:bg-black hover:text-white',
  youtube: 'hover:bg-[#FF0000] hover:text-white',
  linkedin: 'hover:bg-[#0A66C2] hover:text-white',
  email: 'hover:bg-primary hover:text-primary-foreground',
  website: 'hover:bg-primary hover:text-primary-foreground',
};

export default function OrganizationProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { org, loading, error } = useOrg(slug);
  const { orgs: allOrgs } = useOrgs();
  const campus = CAMPUSES.find(c => c.id === org?.campusId);

  const subOrgs = useMemo(
    () => (slug ? allOrgs.filter(o => o.parentSlug?.includes(slug)) : []),
    [allOrgs, slug]
  );
  const parentOrgs = useMemo(
    () =>
      org?.parentSlug?.length
        ? allOrgs.filter(o => org.parentSlug!.some(p => o.slug.toLowerCase() === p.toLowerCase()))
        : [],
    [allOrgs, org]
  );

  if (loading) return <LoadingSkeleton />;

  if (error) return <ErrorState message={error.message} />;

  if (!org) return <NotFoundState />;

  const socialEntries = org.contact?.social
    ? Object.entries(org.contact.social).filter(([, val]) => val)
    : [];

  return (
    <>
      <SEO
        title={`${org.name} • BetterOSAS`}
        description={org.content?.shortDescription}
      />

      <div className="min-h-screen bg-background pb-20">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">

          <div className="animate-fade-in-up">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Organizations', href: '/org' },
                { label: org.acronym || org.name },
              ]}
            />
          </div>

          {org.assets?.bannerUrl && (
            <div className="animate-fade-in-up animate-delay-100 rounded-xl overflow-hidden">
              <div className="relative aspect-[820/312]">
                <img
                  src={org.assets.bannerUrl}
                  alt={`${org.name} banner`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6 auto-rows-min">

            <Card
              style={{ viewTransitionName: 'org-identity' }}
              className="animate-fade-in-up animate-delay-100 md:col-span-2 lg:col-span-2 md:row-span-2 relative overflow-hidden group border-none bg-card/50 backdrop-blur-sm shadow-lg"
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
              <CardContent className="p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left h-full justify-center relative z-10 gap-6 lg:gap-8">
                <Avatar className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 shrink-0 border-4 border-background shadow-xl rounded-3xl bg-secondary transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-primary/30">
                  <AvatarImage
                    src={org.assets?.logoUrl}
                    alt={`${org.name} logo`}
                    className="object-contain p-3 sm:p-4"
                  />
                  <AvatarFallback className="text-3xl sm:text-4xl lg:text-5xl font-extrabold rounded-3xl bg-secondary text-muted-foreground">
                    {org.acronym || org.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-3 sm:space-y-4 min-w-0">
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <Badge
                      variant="secondary"
                      className="bg-primary/15 text-primary hover:bg-primary/25 border-none text-[11px] px-3 py-1"
                    >
                      {org.type}
                    </Badge>
                    {org.status && org.status !== 'Active' && (
                      <Badge className="bg-warning text-warning-foreground border-none text-[11px] px-3 py-1">
                        {org.status}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
                    {org.name}
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl">
                    {org.content.shortDescription}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up animate-delay-200 md:col-span-1 lg:col-span-1 bg-card border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <MapPin size={14} /> Campus & Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 mt-1">
                <DetailRow label="Location" value={campus?.name || 'N/A'} />
                {org.programId && (
                  <DetailRow label="Program" value={org.programId} />
                )}
                {org.metadata?.foundedYear && (
                  <DetailRow label="Founded" value={String(org.metadata.foundedYear)} />
                )}
                {parentOrgs.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                      {parentOrgs.length === 1 ? 'Part of' : 'Part of'}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {parentOrgs.map(p => (
                        <Link
                          key={p.slug}
                          to={`/org/${p.slug}`}
                          className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary hover:bg-primary/10 hover:border-primary/30 transition-colors"
                        >
                          {p.acronym || p.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up animate-delay-200 md:col-span-1 lg:col-span-1 bg-card border-none shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <ExternalLink size={14} /> Connect
                </CardTitle>
              </CardHeader>
              <CardContent>
                {org.contact?.email ||
                org.contact?.website ||
                socialEntries.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    {org.contact?.email && (
                      <ContactButton
                        href={`mailto:${org.contact.email}`}
                        icon={<ContactIcon name="email" size={20} />}
                        label="Email"
                        brandStyle={socialBrandStyles.email}
                      />
                    )}
                    {org.contact?.website && (
                      <ContactButton
                        href={org.contact.website}
                        icon={<ContactIcon name="website" size={20} />}
                        label="Website"
                        brandStyle={socialBrandStyles.website}
                      />
                    )}
                    {socialEntries.map(([network, url]) => (
                      <ContactButton
                        key={network}
                        href={url as string}
                        icon={<ContactIcon name={network} size={20} />}
                        label={network.charAt(0).toUpperCase() + network.slice(1)}
                        brandStyle={socialBrandStyles[network] || 'hover:bg-primary hover:text-primary-foreground'}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-24 flex flex-col items-center justify-center text-sm text-muted-foreground text-center border-2 border-dashed border-border rounded-xl gap-1">
                    <ExternalLink size={16} className="opacity-40" />
                    <span className="italic">No links available</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up animate-delay-300 md:col-span-3 lg:col-span-2 bg-card border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <Info className="text-primary shrink-0" size={18} /> About
                </CardTitle>
              </CardHeader>
              <CardContent>
                {org.content.about ? (
                  <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
                    {org.content.about}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                    <Info size={24} className="text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground/60 italic">
                      No detailed description available
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {(org.content?.mission || org.content?.vision) && (
              <Card className="animate-fade-in-up animate-delay-300 md:col-span-3 lg:col-span-2 bg-card border-none shadow-md">
                <CardContent className="p-5 sm:p-6 grid sm:grid-cols-2 gap-6 sm:gap-8 h-full items-start">
                  {org.content.mission && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                        <Target className="text-primary shrink-0" size={15} /> Mission
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {org.content.mission}
                      </p>
                    </div>
                  )}
                  {org.content.vision && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                        <Eye className="text-primary shrink-0" size={15} /> Vision
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
              <Card className="animate-fade-in-up animate-delay-300 md:col-span-3 lg:col-span-4 bg-card border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                    <ImageIcon className="text-primary shrink-0" size={18} /> Gallery
                    <span className="text-xs font-normal text-muted-foreground ml-auto">
                      {org.assets.galleryUrls.length} {org.assets.galleryUrls.length === 1 ? 'photo' : 'photos'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {org.assets.galleryUrls.map((url, i) => (
                      <Dialog key={url}>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="group relative overflow-hidden rounded-lg aspect-square bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`View gallery image ${i + 1}`}
                          >
                            <img
                              src={url}
                              alt={`${org.name} gallery ${i + 1}`}
                              className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
                              loading="lazy"
                              onError={e => { e.currentTarget.style.display = 'none'; }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="rounded-full bg-background/60 backdrop-blur-sm p-2.5">
                                <ImageIcon size={18} className="text-foreground" />
                              </div>
                            </div>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-[90vw] bg-black/95 border-none p-1 sm:p-2">
                          <DialogTitle className="sr-only">{`${org.name} gallery image ${i + 1}`}</DialogTitle>
                          <img
                            src={url}
                            alt={`${org.name} gallery ${i + 1}`}
                            className="w-full max-h-[85vh] object-contain rounded-lg"
                            onError={e => { e.currentTarget.style.display = 'none'; }}
                          />
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {subOrgs.length > 0 && (
            <section className="animate-fade-in-up animate-delay-400">
              <Card className="bg-surface-1 border-none shadow-md overflow-hidden">
                <CardHeader className="border-b border-border/50 pb-6 bg-surface-2/30">
                  <CardTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                    <Users className="text-primary h-5 w-5" />
                    Sub-Organizations
                    <span className="text-xs font-normal text-muted-foreground ml-auto">
                      {subOrgs.length} {subOrgs.length === 1 ? 'org' : 'orgs'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <OrgGrid organizations={subOrgs} columns={4} />
                </CardContent>
              </Card>
            </section>
          )}

          <div className="animate-fade-in-up animate-delay-500">
            <RelatedOrganizations currentOrg={org} />
          </div>
        </main>
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
        {label}
      </p>
      <p className="font-semibold text-foreground text-sm">{value}</p>
    </div>
  );
}

function ContactButton({
  href,
  icon,
  label,
  brandStyle,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  brandStyle: string;
}) {
  return (
    <Button
      variant="secondary"
      asChild
      className={`h-auto py-3.5 flex-col gap-1.5 transition-all duration-300 ${brandStyle} border-none`}
    >
      <a
        href={href}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
      >
        {icon}
        <span className="text-[9px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </a>
    </Button>
  );
}
