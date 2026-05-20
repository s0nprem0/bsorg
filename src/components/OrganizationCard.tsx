import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CONTACT_ICONS } from '@/data/constants';
import type { Organization } from '@/types/organization';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/shadcn/card';
import { Badge } from '@/components/ui/shadcn/badge';
import { Button } from '@/components/ui/shadcn/button';

interface OrganizationCardProps {
  org: Organization;
  campusName?: string;
  large?: boolean;
}

export default function OrganizationCard({ org, campusName, large = false }: OrganizationCardProps) {
  // Use React state instead of direct DOM manipulation for image errors
  const [imageError, setImageError] = useState(false);

  const socialEntries = org.contact?.social
    ? Object.entries(org.contact.social).filter(([, val]) => val)
    : [];

  return (
    <Card className={cn(
      'group relative flex h-full w-full flex-row overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md bg-surface-1',
      large ? 'min-h-40' : 'min-h-32'
    )}>
      <figure className={cn(
        'relative flex shrink-0 items-center justify-center border-r border-border bg-surface-2 overflow-hidden',
        large ? 'w-32 sm:w-40' : 'w-28 sm:w-32'
      )}>
        {org.assets?.logoUrl && !imageError ? (
          <img
            src={org.assets.logoUrl}
            alt={`Logo of ${org.name}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : null}

        {/* Fallback Text */}
        <div className={cn(
          "flex h-full w-full items-center justify-center bg-surface-2 font-extrabold tracking-tighter text-border-strong transition-transform duration-500 group-hover:scale-110",
          (org.assets?.logoUrl && !imageError) ? "hidden" : "flex",
          large ? "text-5xl" : "text-4xl"
        )}>
          {org.acronym || org.name.substring(0, 2).toUpperCase()}
        </div>
      </figure>

      {/* ... Metadata Area remains unchanged ... */}
      <div className="flex min-w-0 flex-1 flex-col">
        <CardHeader className="mb-auto p-4 pb-0 sm:p-5">
          {campusName && (
            <Badge variant="secondary" className="mb-2 w-fit text-[10px] uppercase tracking-wider">
              {campusName}
            </Badge>
          )}
          <CardTitle className="line-clamp-2 text-base transition-colors group-hover:text-primary">
            <Link to={`/organization/${org.slug}`} className="rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <span className="absolute inset-0" aria-hidden="true" />
              {org.name}
            </Link>
          </CardTitle>
          <CardDescription className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-foreground-secondary">
            {org.content?.shortDescription}
          </CardDescription>
        </CardHeader>

        {socialEntries.length > 0 && (
          <CardFooter className="relative z-10 flex flex-wrap items-center gap-3 p-4 pt-4 sm:p-5">
            {socialEntries.slice(0, 4).map(([network, url]) => (
              <Button key={network} variant="ghost" size="icon" asChild className="h-8 w-8 text-foreground-muted hover:text-primary">
                <a
                  href={url as string}
                  title={network}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${network}`}
                >
                  {CONTACT_ICONS[network]?.(false)}
                </a>
              </Button>
            ))}
          </CardFooter>
        )}
      </div>
    </Card>
  );
}