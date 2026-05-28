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
    acronym.length > 6 ? 'text-lg sm:text-xl' : large ? 'text-6xl' : 'text-4xl';

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
        'group relative flex h-full w-full flex-row transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md hover:ring-1 hover:ring-primary/20 bg-card text-card-foreground cursor-pointer overflow-hidden',
        large ? 'min-h-48' : 'min-h-36'
      )}
    >
      <figure
        className={cn(
          'relative flex shrink-0 items-center justify-center overflow-hidden border-r border-border bg-muted transition-colors group-hover:bg-primary/5',
          large ? 'w-36 sm:w-48' : 'w-24 sm:w-32'
        )}
      >
        {org.assets?.logoUrl && !imageError ? (
          <img
            src={org.assets.logoUrl}
            alt={`${org.name} Official Logo`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain p-3 sm:p-4 transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : null}

        <div
          className={cn(
            'absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none',
            org.assets?.logoUrl && !imageError ? 'hidden' : 'block'
          )}
        />
        <div
          className={cn(
            'relative flex h-full w-full items-center justify-center font-extrabold tracking-tighter text-muted-foreground transition-transform duration-500 group-hover:scale-110 overflow-hidden truncate max-w-full px-1',
            org.assets?.logoUrl && !imageError ? 'hidden' : 'flex',
            acronymClass
          )}
        >
          {acronym}
        </div>
      </figure>

      <div className="flex min-w-0 flex-1 flex-col">
        <CardHeader className={cn('flex flex-col flex-1', large ? 'p-4 pb-0 sm:p-5 sm:pb-0' : 'p-3 pb-0 sm:p-4 sm:pb-0')}>
          <div className="relative z-10 flex flex-wrap items-center gap-1.5 mb-1.5">
            {typeStyle && (
              <Badge variant="outline" className={cn(typeStyle, 'text-[10px] uppercase tracking-wider')}>
                {org.type === 'Student Publication Units' ? 'Publication' : org.type === 'Performing Arts Group' ? 'Performing Arts' : org.type}
              </Badge>
            )}
            {campusName && (
              <Badge
                variant="outline"
                className="w-fit cursor-default text-[10px] uppercase tracking-wider border-muted-foreground/20 text-muted-foreground/80"
              >
                {campusName}
              </Badge>
            )}
            {org.programId && (
              <Tooltip label={org.programId}>
                <Badge
                  variant="secondary"
                  className="w-fit cursor-default text-[10px] uppercase tracking-wider text-secondary-foreground/80 transition-colors hover:bg-secondary/80"
                >
                  {abbreviateProgram(org.programId)}
                </Badge>
              </Tooltip>
            )}
          </div>

          <CardTitle className={cn('line-clamp-2 transition-colors group-hover:text-primary', large ? 'text-base sm:text-lg' : 'text-sm')}>
            <Link
              to={`/org/${org.slug}`}
              className="rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring before:absolute before:inset-0"
            >
              {org.name}
            </Link>
          </CardTitle>
          <CardDescription className="mt-1 line-clamp-2 text-xs leading-relaxed">
            {org.content?.shortDescription ||
              org.content?.about ||
              'No description available.'}
          </CardDescription>
        </CardHeader>

        {socialEntries.length > 0 && (
          <CardFooter className={cn('relative z-20 flex items-center', large ? 'p-4 pt-1.5 sm:p-5 sm:pt-2' : 'p-3 pt-1.5 sm:p-4 sm:pt-2')}>
            <div className="flex items-center gap-1">
              {/* First social: icon + label */}
              {(() => {
                const [network, url] = socialEntries[0];
                return (
                  <Button
                    key={network}
                    variant="ghost"
                    asChild
                    className="h-7 gap-1.5 px-2 text-muted-foreground hover:text-primary text-xs"
                  >
                    <a
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${org.name} on ${network}`}
                    >
                      <ContactIcon name={network} size={14} />
                      <span className="hidden sm:inline font-medium">Visit page</span>
                    </a>
                  </Button>
                );
              })()}

              {/* Remaining socials: icon only */}
              {socialEntries.slice(1, 4).map(([network, url]) => (
                <Button
                  key={network}
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-7 w-7 text-muted-foreground hover:text-primary"
                >
                  <a
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${org.name} on ${network}`}
                  >
                    <ContactIcon name={network} size={15} />
                  </a>
                </Button>
              ))}

              {/* Overflow popup */}
              {socialEntries.length > 4 && (
                <div className="group/overflow relative inline-flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 cursor-default rounded-full border border-dashed border-muted-foreground/30 text-[10px] font-bold text-muted-foreground hover:border-primary/50 hover:text-primary"
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
          </CardFooter>
        )}
      </div>
    </Card>
  );
}
