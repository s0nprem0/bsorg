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
    acronym.length > 6 ? 'text-lg sm:text-xl' : large ? 'text-5xl' : 'text-4xl';

  const socialEntries = useMemo(
    () =>
      org.contact?.social
        ? Object.entries(org.contact.social).filter(([, val]) => val)
        : [],
    [org.contact]
  );

  return (
    <Card
      className={cn(
        'group relative flex h-full w-full flex-row transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md bg-card text-card-foreground',
        large ? 'min-h-40' : 'min-h-32'
      )}
    >
      <figure
        className={cn(
          'relative flex shrink-0 items-center justify-center border-r border-border bg-muted overflow-hidden rounded-l-lg',
          large ? 'w-28 sm:w-36' : 'w-20 sm:w-28'
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
            'flex h-full w-full items-center justify-center font-extrabold tracking-tighter text-muted-foreground transition-transform duration-500 group-hover:scale-110 z-20 overflow-hidden truncate max-w-full px-1',
            org.assets?.logoUrl && !imageError ? 'hidden' : 'flex',
            acronymClass
          )}
        >
          {acronym}
        </div>
        <div
          className={cn(
            'absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none z-10',
            org.assets?.logoUrl && !imageError ? 'hidden' : 'block'
          )}
        />
      </figure>

      <div className="flex min-w-0 flex-1 flex-col">
        <CardHeader className="mb-auto px-3 pb-0 pt-3 sm:px-4 sm:pt-4">
          <div className="relative z-20 flex flex-wrap items-center gap-1.5 mb-2">
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

          <CardTitle className="line-clamp-2 text-base transition-colors group-hover:text-primary">
            <Link
              to={`/org/${org.slug}`}
              className="rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring before:absolute before:inset-0"
            >
              {org.name}
            </Link>
          </CardTitle>
          <CardDescription className="mt-1.5 line-clamp-2 text-xs leading-relaxed [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]">
            {org.content?.shortDescription ||
              org.content?.about ||
              'No description available.'}
          </CardDescription>
        </CardHeader>

        {socialEntries.length > 0 && (
          <CardFooter className="relative z-20 flex flex-col items-start gap-2 px-3 pb-3 sm:px-4 sm:pb-4">
            <div className="flex items-center gap-2">
              {(socialEntries.length > 4
                ? socialEntries.slice(0, 3)
                : socialEntries
              ).map(([network, url]) => (
                <Tooltip
                  key={network}
                  side="right"
                  label={network.charAt(0).toUpperCase() + network.slice(1)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-8 w-8 text-muted-foreground hover:text-primary z-20"
                  >
                    <a
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${org.name} on ${network}`}
                    >
                      <ContactIcon name={network} size={18} />
                    </a>
                  </Button>
                </Tooltip>
              ))}
              {socialEntries.length > 4 && (
                <div className="group/overflow relative inline-flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-default rounded-full border border-dashed border-muted-foreground/30 text-[11px] font-bold text-muted-foreground hover:border-primary/50 hover:text-primary z-20"
                    aria-label={`${socialEntries.length - 3} more links`}
                  >
                    +{socialEntries.length - 3}
                  </Button>
                  <div className="pointer-events-none absolute left-full ml-1.5 top-1/2 z-50 -translate-y-1/2 opacity-0 transition-opacity duration-150 group-hover/overflow:opacity-100">
                    <div className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-foreground p-2 shadow-sm">
                      {socialEntries.slice(3).map(([network, url]) => (
                        <a
                          key={network}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${org.name} on ${network}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-background hover:bg-background/10 transition-colors pointer-events-auto"
                        >
                          <ContactIcon name={network} size={16} />
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
