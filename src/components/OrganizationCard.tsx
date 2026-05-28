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

  const socialEntries = useMemo(
    () =>
      org.contact?.social
        ? Object.entries(org.contact.social).filter(([, val]) => val)
        : [],
    [org.contact?.social]
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
          large ? 'w-32 sm:w-40' : 'w-28 sm:w-32'
        )}
      >

        {org.assets?.logoUrl && !imageError ? (
          <img
            src={org.assets.logoUrl}
            alt={`${org.name} Official Logo`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : null}

        <div
          className={cn(
            'flex h-full w-full items-center justify-center bg-muted font-extrabold tracking-tighter text-muted-foreground transition-transform duration-500 group-hover:scale-110 z-20',
            org.assets?.logoUrl && !imageError ? 'hidden' : 'flex',
            large ? 'text-5xl' : 'text-4xl'
          )}
        >
          {org.acronym || org.name.substring(0, 2).toUpperCase()}
        </div>
      </figure>

      <div className="flex min-w-0 flex-1 flex-col">
        <CardHeader className="mb-auto p-4 pb-0 sm:p-5">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {campusName && (
              <Badge
                variant="secondary"
                className="w-fit text-[10px] uppercase tracking-wider"
              >
                {campusName}
              </Badge>
            )}
            {org.programId && (
              <span className="text-[10px] font-medium text-muted-foreground/70" title={org.programId}>
                {abbreviateProgram(org.programId)}
              </span>
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
          <CardDescription className="mt-1.5 line-clamp-2 text-xs leading-relaxed">
            {org.content?.shortDescription ||
              org.content?.about ||
              'No description available.'}
          </CardDescription>
        </CardHeader>

        {socialEntries.length > 0 && (
          <CardFooter className="relative z-10 flex flex-wrap items-center gap-3 p-4 pt-4 sm:p-5">
            {socialEntries.slice(0, 4).map(([network, url]) => (
              <Tooltip key={network} label={network.charAt(0).toUpperCase() + network.slice(1)}>
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
          </CardFooter>
        )}
      </div>
    </Card>
  );
}
