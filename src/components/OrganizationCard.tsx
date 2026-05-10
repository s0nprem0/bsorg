import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6';
import { Mail } from 'lucide-react';

type OrganizationCardProps = {
  slug: string;
  org: string;
  program?: string;
  contact: {
    email?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    x?: string;
  };
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
  return (
    <div
      className={[
        'flex items-center gap-4 border border-neutral-200 bg-secondary-50 shadow-sm transition hover:shadow-md w-full',
        large ? 'p-8 min-h-32 text-lg bg-yellow-50 border-yellow-300 shadow-lg' : 'p-4 min-h-24',
      ].join(' ')}
    >
      {logo ? (
        <img
          src={logo}
          alt={org + ' logo'}
          className={large ? 'h-24 w-24 rounded-xl object-contain bg-neutral-100' : 'h-16 w-16 rounded-lg object-contain bg-neutral-100'}
        />
      ) : (
        <div className={large ? 'h-24 w-24 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 text-3xl font-bold' : 'h-16 w-16 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 text-xl font-bold'}>
          {org.charAt(0)}
        </div>
      )}
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className={large ? 'text-xl font-bold text-black truncate' : 'text-base font-semibold text-black truncate'}>
          <Link to={`/organization/${slug}`} className="hover:underline focus:underline">
            {org}
          </Link>
        </h3>
        {program && (
          <p className="text-sm text-neutral-600 mt-1 line-clamp-3">{program}</p>
        )}
        <div className="flex flex-wrap gap-3 mt-2 items-center">
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              title="Email"
              className="text-blue-600 hover:text-blue-800"
            >
              <Mail size={large ? 24 : 18} />
            </a>
          )}
          {contact.facebook && (
            <a
              href={contact.facebook}
              title="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <FaFacebook size={large ? 24 : 18} />
            </a>
          )}
          {contact.instagram && (
            <a
              href={contact.instagram}
              title="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-700"
            >
              <FaInstagram size={large ? 24 : 18} />
            </a>
          )}
          {contact.tiktok && (
            <a
              href={contact.tiktok}
              title="TikTok"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-neutral-700"
            >
              <FaTiktok size={large ? 24 : 18} />
            </a>
          )}
          {contact.x && (
            <a
              href={contact.x}
              title="X (Twitter)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-600"
            >
              <FaXTwitter size={large ? 24 : 18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationCard;
