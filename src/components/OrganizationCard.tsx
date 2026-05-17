import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CONTACT_ICONS, ORG_CARD } from '@/data/constants';

export type OrganizationCardProps = {
  slug: string;
  org: string;
  program?: string;
  contact?: Partial<Record<'email' | 'facebook' | 'instagram' | 'tiktok' | 'x' | 'website', string>>;
  logo?: string;
  large?: boolean;
  campus?: string;
};

const OrganizationCard: React.FC<OrganizationCardProps> = ({
  slug,
  org,
  program,
  contact = {},
  logo,
  large = false,
  campus,
}) => {
  const contactEntries = Object.entries(contact).filter(([, value]) => value);
  const { SIZES, ICONS } = ORG_CARD;
  const sizes = large ? SIZES.LARGE : SIZES.SMALL;

  const logoSize = `aspect-[3/2] w-${sizes.LOGO_WIDTH}`;

  return (
    <div
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        large ? 'md:min-h-60' : 'md:min-h-44'
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
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

        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col justify-between',
            sizes.PADDING
          )}
        >
          <div className="min-w-0">
            {campus && (
              <div className="mb-2 inline-block rounded-full bg-accent-100 px-3 py-1 text-sm font-medium text-accent-600">
                {campus}
              </div>
            )}

            <h3
              className={cn(
                'truncate font-bold leading-tight text-black',
                sizes.TITLE_SIZE
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
                  sizes.DESCRIPTION_SIZE
                )}
              >
                {program}
              </p>
            )}
          </div>

          {contactEntries.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              {contactEntries.map(([key, value]) => (
                <a
                  key={key}
                  href={key === 'email' ? `mailto:${value}` : value}
                  title={key.charAt(0).toUpperCase() + key.slice(1)}
                  target={key === 'email' ? undefined : '_blank'}
                  rel={key === 'email' ? undefined : 'noopener noreferrer'}
                  className={`flex h-${ICONS.CONTAINER_SIZE} w-${ICONS.CONTAINER_SIZE} items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-all duration-200 hover:scale-110 hover:bg-neutral-200`}
                >
                  {CONTACT_ICONS[key]?.(large)}
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