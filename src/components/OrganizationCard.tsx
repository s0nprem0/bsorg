import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CONTACT_ICONS } from '@/data/constants';
import { useState } from 'react'; // Import useState

export type OrganizationCardProps = {
  slug: string;
  org: string;
  description?: string;
  program?: string;
  contact?: Partial<Record<'email' | 'facebook' | 'instagram' | 'tiktok' | 'x' | 'website', string>>;
  logo?: string;
  large?: boolean;
  campus?: string;
};

const OrganizationCard: React.FC<OrganizationCardProps> = ({
  slug,
  org,
  description,
  program,
  contact = {},
  logo,
  large = false,
  campus,
}) => {
  const contactEntries = Object.entries(contact).filter(([, value]) => value);
  const summary = program ?? description;
  const [imageError, setImageError] = useState(false); // Add state for image error

  return (
    <div
      className={cn(
        'group relative flex h-full w-full overflow-hidden rounded-lg border border-border bg-surface-1 transition-colors hover:border-foreground-muted',
        // Use Tailwind's predefined min-height classes
        large ? 'min-h-40' : 'min-h-32'
      )}
    >
      {/* Left Side: Logo Area
        Using stretch ensures the gray background perfectly matches
        the height of the text area, no matter how tall the text gets. */}
      <div
        className={cn(
          'relative flex shrink-0 items-center justify-center bg-surface-2 border-r border-border',
          large ? 'w-32 sm:w-40' : 'w-28 sm:w-32'
        )}
      >
        {logo && !imageError ? (
          <img
            src={logo}
            alt={`${org} logo`}
            onError={() => setImageError(true)} // Catch broken images
            className="absolute inset-0 h-full w-full object-contain p-4 opacity-90 transition-transform duration-300 group-hover:scale-110 group-hover:opacity-100"
            loading="lazy"
          />
        ) : (
          <span className="text-3xl font-bold tracking-tighter text-border-strong transition-transform duration-300 group-hover:scale-110">
            {org.substring(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Right Side: Details Area
        Using flex-col ensures natural stacking without overlap. */}
      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">

        {/* Top Data (Campus & Title) */}
        <div className="min-w-0">
          {campus && (
            <div className="mb-2">
              <span className="inline-flex items-center rounded-md border border-border bg-surface-2 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-widest text-foreground-secondary">
                {campus}
              </span>
            </div>
          )}

          {/* line-clamp-2 prevents titles from getting excessively long and breaking the layout */}
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight tracking-tight text-foreground sm:text-base">
            <Link to={`/organization/${slug}`} className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              {org}
            </Link>
          </h3>

          {summary && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-foreground-secondary">
              {summary}
            </p>
          )}
        </div>

        {/* Spacer: This pushes the social icons to the absolute bottom of the card
            if the title and description are short. */}
        <div className="flex-1" />

        {/* Contact Icons Footer */}
        {contactEntries.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {contactEntries.slice(0, 4).map(([key, value]) => (
              <a
                key={key}
                href={key === 'email' ? `mailto:${value}` : value}
                title={key}
                target={key === 'email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="relative z-10 text-foreground-muted transition-colors hover:text-foreground scale-90"
              >
                {CONTACT_ICONS[key]?.(false)}
              </a>
            ))}
            {/* Overflow indicator if there are too many icons to fit horizontally */}
            {contactEntries.length > 4 && (
              <span className="text-[10px] text-foreground-muted ml-1 font-mono">
                +{contactEntries.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationCard;