import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CONTACT_ICONS } from '@/data/constants';
import type { Organization } from '@/types/organization';

interface OrganizationCardProps {
  org: Organization;
  campusName?: string;
  large?: boolean;
}

export default function OrganizationCard({ org, campusName, large = false }: OrganizationCardProps) {
  // FIX 1: Added optional chaining (?. ) to org.contact to prevent crashes if contact is missing
  const socialEntries = org.contact?.social
    ? Object.entries(org.contact.social).filter(([, val]) => val)
    : [];

  return (
    <article className={cn(
      'group relative flex h-full w-full overflow-hidden rounded-xl border border-border bg-surface-1 transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5',
      large ? 'min-h-[160px]' : 'min-h-[128px]'
    )}>
      {/* Visual Identity Area */}
      <figure className={cn(
        'relative flex shrink-0 items-center justify-center bg-surface-2 border-r border-border overflow-hidden',
        large ? 'w-32 sm:w-40' : 'w-28 sm:w-32'
      )}>
        {org.assets?.logoUrl ? (
          <img
            src={org.assets.logoUrl}
            alt={`Logo of ${org.name}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}

        {/* Fallback Text - Hidden by default if image exists, revealed on error */}
        <div className={cn(
          "flex h-full w-full items-center justify-center bg-surface-2 text-border-strong font-extrabold tracking-tighter transition-transform duration-500 group-hover:scale-110",
          org.assets?.logoUrl ? "hidden" : "flex",
          large ? "text-5xl" : "text-4xl"
        )}>
          {org.acronym || org.name.substring(0, 2).toUpperCase()}
        </div>
      </figure>

      {/* Metadata Area */}
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <header className="min-w-0 mb-auto">
          {campusName && (
            <span className="inline-flex items-center rounded bg-surface-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground-tertiary mb-2">
              {campusName}
            </span>
          )}
          <h3 className="line-clamp-2 text-base font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
            <Link to={`/organization/${org.slug}`} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
              <span className="absolute inset-0" aria-hidden="true" />
              {org.name}
            </Link>
          </h3>
          {/* FIX 2: Added optional chaining to org.content to prevent crashes if content block is missing */}
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-foreground-secondary">
            {org.content?.shortDescription}
          </p>
        </header>

        {socialEntries.length > 0 && (
          <footer className="mt-4 flex flex-wrap items-center gap-3 relative z-10">
            {socialEntries.slice(0, 4).map(([network, url]) => (
              <a
                key={network}
                href={url as string}
                title={network}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground-muted transition-colors hover:text-primary"
                aria-label={`Visit our ${network}`}
              >
                {CONTACT_ICONS[network]?.(false)}
              </a>
            ))}
          </footer>
        )}
      </div>
    </article>
  );
}