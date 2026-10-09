import { useState } from 'react';
import { BadgeCheck, Mail, Globe, MapPin, Users } from 'lucide-react';
import { ContactIcon } from '@/components/ui/ContactIcon';
import { abbreviateProgram } from '@/data/programs';
import type { Organization } from '@/lib/orgIndex';

type SocialEntry = [string, string];

/** Discord's server banner is wide and short, and the icon hangs below its
 *  bottom-left corner rather than sitting inside a panel of its own. */
/** Discord's server icon hangs below the banner's bottom-left corner. Only the
 *  icon overlaps — the name sits below the edge, because a photo banner can be
 *  bright enough to swallow white text. */
const AVATAR = 'h-20 w-20 -mt-10 shrink-0 sm:h-24 sm:w-24 sm:-mt-12';

/** Stable hue per category, so every org in a college shares a banner tint and
 *  the 14 categories stay distinguishable. Hashed from the category rather than
 *  the slug: hashing the slug would give sibling orgs clashing hues. Low
 *  saturation and lightness keep it a backdrop, never competing with the logo. */
function categoryHue(category: string): number {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) % 360;
  }
  return hash;
}

function BannerArt({ org }: { org: Organization }) {
  const [failed, setFailed] = useState(false);
  const hue = categoryHue(org.category);
  const showImage = !!org.assets?.bannerUrl && !failed;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: `linear-gradient(115deg, hsl(${hue} 46% 23%), hsl(${(hue + 50) % 360} 40% 11%))`,
      }}
    >
      {/* Blurred logo as texture. Only the org's own mark, so a college's orgs
          still read as one family once the shared hue is behind them. */}
      {org.assets?.logoUrl && (
        <img
          src={org.assets.logoUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-[1.8] object-cover opacity-40 blur-xl"
          loading="lazy"
        />
      )}
      {showImage && (
        <img
          src={org.assets?.bannerUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
      {/* Vignette, not a fade to the page background: the page background is
          white in light mode, which fogged the middle of the banner. The
          avatar keeps its own background-coloured ring, so legibility does not
          depend on this. */}
      <div className="absolute inset-0 bg-linear-to-t from-black/45 to-transparent" />
    </div>
  );
}

function Avatar({ org }: { org: Organization }) {
  const [failed, setFailed] = useState(false);
  const hasLogo = !!org.assets?.logoUrl && !failed;
  const acronym = org.acronym || org.name.slice(0, 2).toUpperCase();

  return (
    <div
      className={`${AVATAR} shrink-0 overflow-hidden rounded-panel border-4 border-background bg-secondary`}
    >
      {hasLogo ? (
        <img
          src={org.assets?.logoUrl}
          alt={`${org.name} logo`}
          className="h-full w-full object-contain p-1.5"
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          className={`flex h-full w-full items-center justify-center font-bold text-secondary-foreground ${
            acronym.length > 5 ? 'text-xs' : 'text-xl'
          }`}
        >
          {acronym}
        </span>
      )}
    </div>
  );
}

function LinkRow({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const external = !href.startsWith('mailto:');
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-2.5 rounded px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className="w-4 shrink-0 text-center" aria-hidden>
        {icon}
      </span>
      <span className="truncate">{children}</span>
    </a>
  );
}

export default function ProfileHeader({
  org,
  socialEntries,
  subOrgCount,
  campusName,
}: {
  org: Organization;
  socialEntries: SocialEntry[];
  subOrgCount: number;
  campusName?: string;
}) {
  // Discord puts the primary action in the header, not in a grid of tiles.
  const primary = org.contact?.website
    ? { href: org.contact.website, label: 'Website', icon: <Globe size={16} /> }
    : org.contact?.email
      ? {
          href: `mailto:${org.contact.email}`,
          label: 'Email',
          icon: <Mail size={16} />,
        }
      : null;

  return (
    <header className="animate-fade-in-up">
      <div className="relative h-32 overflow-hidden rounded-panel sm:h-40 lg:h-48">
        <BannerArt org={org} />
      </div>

      {/* relative + z-10: the banner above is a positioned element, so without
          this it paints over the avatar and name that overlap its edge. */}
      <div className="relative z-10 flex flex-col gap-4 px-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <Avatar org={org} />
          <div className="min-w-0 pt-3">
            {/* The badge stays in the text flow rather than being a flex
                sibling: as a sibling it wrapped onto its own line under a
                long name and read as an orphan. */}
            <h1 className="text-xl font-bold tracking-tight break-words sm:text-2xl lg:text-3xl">
              {org.name}
              {org.metadata?.accredited && (
                <BadgeCheck
                  size={20}
                  className="ml-1 inline-block align-baseline text-primary"
                  aria-label="Accredited organization"
                />
              )}
            </h1>
            {/* Discord's equivalent line: counts and status, not prose. */}
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
              {subOrgCount > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Users size={14} aria-hidden />
                  {subOrgCount} sub-org{subOrgCount === 1 ? '' : 's'}
                </span>
              )}
              {campusName && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} aria-hidden />
                  {campusName}
                </span>
              )}
              <span>{org.type}</span>
              {org.programId && (
                <span className="text-muted-foreground/80">
                  {abbreviateProgram(org.programId)}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:pb-1.5">
          {primary && (
            <a
              href={primary.href}
              target={primary.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={
                primary.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'
              }
              className="inline-flex h-9 items-center gap-2 rounded-panel bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
            >
              {primary.icon}
              {primary.label}
            </a>
          )}
          {org.contact?.website && org.contact?.email && (
            <LinkRow href={`mailto:${org.contact.email}`} icon={<Mail size={16} />}>
              <span className="sr-only">Email </span>
              Email
            </LinkRow>
          )}
          {socialEntries.map(([network, url]) => (
            <a
              key={network}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${org.name} on ${network}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-panel text-muted-foreground transition-colors hover:bg-card hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <ContactIcon name={network} size={18} />
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}