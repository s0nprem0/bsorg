import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CONTACT_ICONS } from '../data/constants';

export type OrganizationCardProps = {
  slug: string;
  org: string;
  program?: string;
  contact?: Partial<Record<'email' | 'facebook' | 'instagram' | 'tiktok' | 'x', string>>;
  logo?: string;
  large?: boolean;
};

const OrganizationCard: React.FC<OrganizationCardProps> = ({
  slug,
  org,
  program,
  contact = {},
  logo,
  large = false,
}) => {
  const contactEntries = Object.entries(contact).filter(([, value]) => value);

  // Dynamic sizing based on aspect ratio (3:2)
  const logoSize = large ? 'aspect-[3/2] w-60' : 'aspect-[3/2] w-44';

  return (
    <div
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        large ? 'md:min-h-60' : 'md:min-h-44'
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Logo Section */}
        <div
          className={cn(
            'relative shrink-0 overflow-hidden',
            logoSize
          )}
        >
          {logo ? (
            <>
              <img
                src={logo}
                alt={`${org} logo`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-black/20" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-5xl font-bold text-neutral-400">
              {org.charAt(0)}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col justify-between',
            large ? 'p-6 md:p-8' : 'p-4 md:p-5'
          )}
        >
          <div className="min-w-0">
            <h3
              className={cn(
                'truncate font-bold leading-tight text-black',
                large ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
              )}
            >
              <Link
                to={`/organization/${slug}`}
                className="transition-colors hover:text-accent-600"
              >
                {org}
              </Link>
            </h3>

            {program && (
              <p
                className={cn(
                  'mt-3 line-clamp-3 text-neutral-600',
                  large ? 'text-base leading-relaxed' : 'text-sm'
                )}
              >
                {program}
              </p>
            )}
          </div>

          {/* Contact Icons */}
          {contactEntries.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              {contactEntries.map(([key, value]) => (
                <a
                  key={key}
                  href={key === 'email' ? `mailto:${value}` : value}
                  title={key.charAt(0).toUpperCase() + key.slice(1)}
                  target={key === 'email' ? undefined : '_blank'}
                  rel={key === 'email' ? undefined : 'noopener noreferrer'}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-all duration-200 hover:scale-110 hover:bg-neutral-200"
                >
                  {CONTACT_ICONS[key](large)}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationCard;