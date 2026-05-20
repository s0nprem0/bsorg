// src/components/OrganizationCard.tsx
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
  const socialEntries = org.contact?.social
    ? Object.entries(org.contact.social).filter(([, val]) => val)
    : [];

  return (
    <Card className={cn(
      'group relative flex flex-row h-full w-full overflow-hidden transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 bg-surface-1',
      large ? 'min-h-40' : 'min-h-32'
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

        {/* Fallback Text */}
        <div className={cn(
          "flex h-full w-full items-center justify-center bg-surface-2 text-border-strong font-extrabold tracking-tighter transition-transform duration-500 group-hover:scale-110",
          org.assets?.logoUrl ? "hidden" : "flex",
          large ? "text-5xl" : "text-4xl"
        )}>
          {org.acronym || org.name.substring(0, 2).toUpperCase()}
        </div>
      </figure>

      {/* Metadata Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <CardHeader className="p-4 sm:p-5 pb-0 mb-auto">
          {campusName && (
            <Badge variant="secondary" className="w-fit mb-2 text-[10px] uppercase tracking-wider">
              {campusName}
            </Badge>
          )}
          <CardTitle className="line-clamp-2 text-base group-hover:text-primary transition-colors">
            <Link to={`/organization/${org.slug}`} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">
              <span className="absolute inset-0" aria-hidden="true" />
              {org.name}
            </Link>
          </CardTitle>
          <CardDescription className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-foreground-secondary">
            {org.content?.shortDescription}
          </CardDescription>
        </CardHeader>

        {socialEntries.length > 0 && (
          <CardFooter className="p-4 sm:p-5 pt-4 flex flex-wrap items-center gap-3 relative z-10">
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