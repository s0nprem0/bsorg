import React from 'react';
import { Link } from 'react-router-dom';
import { CONTACT_ICONS, CONTACT_COLORS } from '../data/constants';

// Define the props type for the OrganizationCard
export type OrganizationCardProps = {
  slug: string;
  org: string;
  program?: string;
  contact: Partial<Record<'email' | 'facebook' | 'instagram' | 'tiktok' | 'x', string>>;
  logo?: string; // optional logo URL
  large?: boolean; // for student council highlight
};

const OrganizationCard: React.FC<OrganizationCardProps> = ({
  slug,
  org,
  program,
  contact,
  logo,
  large = false,
}) => {
  const cardClasses = [
    'flex items-center gap-4 border border-neutral-200 bg-secondary-50 shadow-sm transition hover:shadow-md w-full',
    large ? 'p-8 min-h-32 text-lg bg-accent-50 border-accent-300 shadow-lg' : 'p-4 min-h-24',
  ].join(' ');

  const logoClasses = large
    ? 'h-24 w-24 rounded-xl object-contain bg-neutral-100'
    : 'h-16 w-16 rounded-lg object-contain bg-neutral-100';

  const placeholderClasses = large
    ? 'h-24 w-24 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 text-3xl font-bold'
    : 'h-16 w-16 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 text-xl font-bold';

  return (
    <div className={cardClasses}>
      {logo ? (
        <img src={logo} alt={`${org} logo`} className={logoClasses} />
      ) : (
        <div className={placeholderClasses}>{org.charAt(0)}</div>
      )}
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className={large ? 'text-xl font-bold text-black truncate' : 'text-base font-semibold text-black truncate'}>
          <Link to={`/organization/${slug}`} className="hover:underline focus:underline">
            {org}
          </Link>
        </h3>
        {program && <p className="text-sm text-neutral-600 mt-1 line-clamp-3">{program}</p>}
        <div className="flex flex-wrap gap-3 mt-2 items-center">
          {Object.entries(contact).map(([key, value]) => {
            if (!value) return null;
            return (
              <a
                key={key}
                href={key === 'email' ? `mailto:${value}` : value}
                title={key.charAt(0).toUpperCase() + key.slice(1)}
                target={key === 'email' ? undefined : '_blank'}
                rel={key === 'email' ? undefined : 'noopener noreferrer'}
                className={CONTACT_COLORS[key]}
              >
                {CONTACT_ICONS[key](large)}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrganizationCard;
