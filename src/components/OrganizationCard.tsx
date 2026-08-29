import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn, getSocialEntries } from '@/lib/utils';
import { ContactIcon } from '@/components/ui/ContactIcon';
import Tooltip from '@/components/ui/Tooltip';
import type { Organization } from '@/lib/orgIndex';
import {
  Card,
  CardHeader,
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
  const hasLogo = !!org.assets?.logoUrl && !imageError;

  const socialEntries = getSocialEntries(org.contact);
  const typeStyle = TYPE_STYLES[org.type];

  return (
    <Card
      className={cn(
        'group relative flex h-full w-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg bg-card text-card-foreground',
        large ? 'min-h-56' : 'min-h-48'
      )}
    >
      <CardHeader className={cn('relative flex-none pb-2', large ? 'p-4 sm:p-5' : 'p-3 sm:p-4')}>
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden bg-secondary text-secondary-foreground">
            {hasLogo ? (
              <img
                src={org.assets?.logoUrl}
                alt={`${org.name} Official Logo`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain p-1"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className={cn('font-bold tracking-tighter truncate px-1', acronym.length > 6 ? 'text-xs' : 'text-lg')}>
                {acronym}
              </span>
            )}
          </div>

          <Link
            to={`/org/${org.slug}`}
            className="min-w-0 flex-1 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring before:absolute before:inset-0"
            aria-label={`View ${org.name}`}
          >
            <h3 className={cn('font-bold leading-tight text-foreground transition-colors group-hover:text-primary', large ? 'text-xl sm:text-2xl' : 'text-lg')}>
              {org.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
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
      </CardHeader>

      <CardDescription className={cn('flex-none px-3 sm:px-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground', large ? 'px-4 sm:px-5' : 'px-3 sm:px-4')}>
        {org.content?.shortDescription ||
          org.content?.about ||
          'No description available.'}
      </CardDescription>

      <CardFooter className="relative z-10 mt-auto flex items-center justify-between border-t border-border/40 bg-card/50 p-3 sm:p-4">
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
              <div className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-2 opacity-0 transition-opacity duration-150 group-hover/overflow:opacity-100 z-50">
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
    </Card>
  );
}
