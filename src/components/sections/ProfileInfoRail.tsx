import { Link } from 'react-router-dom';
import {
  MapPin,
  GraduationCap,
  CalendarDays,
  Shapes,
  Mail,
  Globe,
  CornerDownRight,
} from 'lucide-react';
import { ContactIcon } from '@/components/ui/ContactIcon';
import { abbreviateProgram } from '@/data/programs';
import type { Organization } from '@/lib/orgIndex';

/** Discord's muted all-caps section label, above each group of rows. */
function RailLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="px-2 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
      {children}
    </h3>
  );
}

/** One info row: small grey icon above, tiny caps label, then the value. */
function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-2 py-1">
      <span
        aria-hidden
        className="mb-0.5 flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        {icon}
        <span className="tracking-wide uppercase">{label}</span>
      </span>
      <div className="text-sm font-medium break-words text-foreground">{children}</div>
    </div>
  );
}

function RailLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const external = !href.startsWith('mailto:');
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className="w-4 shrink-0 text-center" aria-hidden>
        {icon}
      </span>
      <span className="truncate">{children}</span>
    </a>
  );
}

export default function ProfileInfoRail({
  org,
  campusName,
  parentOrgs,
  socialEntries,
}: {
  org: Organization;
  campusName?: string;
  parentOrgs: Organization[];
  socialEntries: [string, string][];
}) {
  const hasLinks =
    !!org.contact?.email || !!org.contact?.website || socialEntries.length > 0;

  return (
    <aside className="space-y-5">
      <section>
        <RailLabel>Information</RailLabel>
        <dl className="rounded-panel bg-surface-2/60 py-2">
          <InfoRow icon={<MapPin size={13} />} label="Campus">
            {campusName ?? 'N/A'}
          </InfoRow>
          {org.programId && (
            <InfoRow icon={<GraduationCap size={13} />} label="Program">
              {abbreviateProgram(org.programId)}
            </InfoRow>
          )}
          {org.metadata?.foundedYear && (
            <InfoRow icon={<CalendarDays size={13} />} label="Founded">
              {org.metadata.foundedYear}
            </InfoRow>
          )}
          <InfoRow icon={<Shapes size={13} />} label="Type">
            {org.type}
          </InfoRow>
        </dl>
      </section>

      {hasLinks && (
        <section>
          <RailLabel>Links</RailLabel>
          <div className="rounded-panel bg-surface-2/60 py-1.5">
            {org.contact?.email && (
              <RailLink
                href={`mailto:${org.contact.email}`}
                icon={<Mail size={14} />}
              >
                {org.contact.email}
              </RailLink>
            )}
            {org.contact?.website && (
              <RailLink href={org.contact.website} icon={<Globe size={14} />}>
                {org.contact.website.replace(/^https?:\/\//, '')}
              </RailLink>
            )}
            {socialEntries.map(([network, url]) => (
              <RailLink key={network} href={url} icon={<ContactIcon name={network} size={14} />}>
                {network.charAt(0).toUpperCase() + network.slice(1)}
              </RailLink>
            ))}
          </div>
        </section>
      )}

      {parentOrgs.length > 0 && (
        <section>
          <RailLabel>Part of</RailLabel>
          <div className="rounded-panel bg-surface-2/60 py-1.5">
            {parentOrgs.map(parent => (
              <Link
                key={parent.slug}
                to={`/org/${parent.slug}`}
                className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <CornerDownRight size={14} className="w-4 shrink-0" aria-hidden />
                <span className="truncate">
                  {parent.acronym || parent.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </aside>
  );
}