import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ContactIcon } from '@/components/ui/ContactIcon';
import Tooltip from '@/components/ui/Tooltip';
import type { Organization } from '@/lib/orgIndex';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/shadcn/card';
import { Badge } from '@/components/ui/shadcn/badge';
import { Button } from '@/components/ui/shadcn/button';
import { abbreviateProgram } from '@/data/programs';

const TYPE_STYLES: Record<string, string> = {
  'Academic': 'bg-primary/10 text-primary border-primary/25',
  'Non-Academic': 'bg-warning/10 text-warning border-warning/25',
  'Student Council': 'bg-info/10 text-info border-info/25',
  'Student Publication Units': 'bg-success/10 text-success border-success/25',
  'Performing Arts Group': 'bg-accent/10 text-accent border-accent/25',
};

const TYPE_LABELS: Record<string, string> = {
  'Student Publication Units': 'Publication',
  'Performing Arts Group': 'Performing Arts',
};

interface OrganizationCardProps {
  org: Organization;
  campusName?: string;
  large?: boolean;
}

export default function OrganizationCard({
  org,
  campusName,
  large = false,
}: OrganizationCardProps) {
  const [imageError, setImageError] = useState(false);

  const acronym = org.acronym || org.name.substring(0, 2).toUpperCase();
  const acronymClass =
    acronym.length > 6 ? 'text-sm sm:text-base' : large ? 'text-4xl' : 'text-xl';

  const hasLogo = !!org.assets?.logoUrl && !imageError;

  const socialEntries = useMemo(
    () =>
      org.contact?.social
        ? Object.entries(org.contact.social).filter(([, val]) => val)
        : [],
    [org.contact]
  );

  const typeStyle = TYPE_STYLES[org.type];

  return (
    <Card
      className={cn(
        'group relative flex h-full w-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg bg-card text-card-foreground cursor-pointer',
        large ? 'min-h-72' : 'min-h-52'
      )}
    >
      {/* Banner with overlapping logo */}
      <div
        className={cn(
          'relative w-full shrink-0 border-b border-border bg-muted/50',
          large ? 'h-24' : 'h-16'
        )}
      >
        <figure
          className={cn(
            'absolute left-4 sm:left-5 flex shrink-0 items-center justify-center bg-muted overflow-hidden shadow-sm transition-transform duration-500 group-hover:scale-105',
            large ? '-bottom-10 h-20 w-20' : '-bottom-8 h-20 w-20'
          )}
        >
          {org.assets?.logoUrl && !imageError ? (
            <img
              src={org.assets.logoUrl}
              alt={`${org.name} Official Logo`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain p-1.5"
              onError={() => setImageError(true)}
            />
          ) : null}

          <div
            className={cn(
              'flex h-full w-full items-center justify-center font-bold tracking-tighter overflow-hidden truncate px-1',
              hasLogo ? 'hidden' : 'flex bg-secondary text-secondary-foreground',
              acronymClass
            )}
          >
            {acronym}
          </div>
        </figure>
      </div>

      {/* Spacer for overlapping logo */}
      <div
        className={cn('w-full shrink-0', large ? 'h-12' : 'h-10')}
        aria-hidden="true"
      />

      <CardHeader className={cn('flex-none', large ? 'p-4 sm:p-5' : 'p-3 sm:p-4')}>
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {typeStyle && (
            <Badge variant="outline" className={cn(typeStyle, 'text-xs uppercase tracking-wider')}>
              {TYPE_LABELS[org.type] || org.type}
            </Badge>
          )}
          {campusName && (
            <Badge
              variant="secondary"
              className="text-xs uppercase tracking-wider bg-primary/10 text-primary hover:bg-primary/20 border-none"
            >
              {campusName}
            </Badge>
          )}
          {org.programId && (
            <Tooltip label={org.programId}>
              <Badge
                variant="outline"
                className="text-xs uppercase tracking-wider text-muted-foreground/80 border-muted-foreground/20"
              >
                {abbreviateProgram(org.programId)}
              </Badge>
            </Tooltip>
          )}
        </div>

        <CardTitle className={cn(
          'font-bold leading-tight transition-colors group-hover:text-primary',
          large ? 'text-xl sm:text-2xl' : 'text-lg'
        )}>
          <Link
            to={`/org/${org.slug}`}
            className="rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring before:absolute before:inset-0"
          >
            {org.name}
          </Link>
        </CardTitle>

        <CardDescription className="mt-1.5 line-clamp-3 text-sm leading-relaxed">
          {org.content?.shortDescription ||
            org.content?.about ||
            'No description available.'}
        </CardDescription>
      </CardHeader>

      <CardFooter className="relative z-20 mt-auto flex items-center justify-between border-t border-border/40 bg-card/50 p-3 sm:p-4">
        <div className="flex items-center gap-1">
          {socialEntries.slice(0, 4).map(([network, url]) => (
            <Button
              key={network}
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <a
                href={url as string}
                title={network}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${org.name} on ${network}`}
              >
                <ContactIcon name={network} size={16} />
              </a>
            </Button>
          ))}
          {socialEntries.length > 4 && (
            <div className="group/overflow relative inline-flex">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-default rounded-full border border-dashed border-muted-foreground/30 text-xs font-bold text-muted-foreground hover:border-primary/50 hover:text-primary"
                aria-label={`${socialEntries.length - 4} more links`}
              >
                +{socialEntries.length - 4}
              </Button>
              <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-150 group-hover/overflow:opacity-100 z-50">
                <div className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-foreground p-1.5 pl-2 shadow-sm">
                  {socialEntries.slice(4).map(([network, url]) => (
                    <a
                      key={network}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${org.name} on ${network}`}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-background hover:bg-background/10 transition-colors pointer-events-auto"
                    >
                      <ContactIcon name={network} size={14} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <span className="text-xs font-semibold text-primary flex items-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          View Profile <span aria-hidden="true">&rarr;</span>
        </span>
      </CardFooter>
    </Card>
  );
}
