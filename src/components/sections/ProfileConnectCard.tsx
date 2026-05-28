import { ExternalLink } from 'lucide-react';
import { ContactIcon } from '@/components/ui/ContactIcon';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import type { Organization } from '@/lib/orgIndex';

const brandStyles: Record<string, string> = {
  facebook: 'hover:bg-[#1877F2] hover:text-white',
  instagram: 'hover:bg-linear-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white',
  x: 'hover:bg-black hover:text-white',
  tiktok: 'hover:bg-black hover:text-white',
  youtube: 'hover:bg-[#FF0000] hover:text-white',
  linkedin: 'hover:bg-[#0A66C2] hover:text-white',
  email: 'hover:bg-primary hover:text-primary-foreground',
  website: 'hover:bg-primary hover:text-primary-foreground',
};

function ContactButton({
  href,
  icon,
  label,
  brandStyle,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  brandStyle: string;
}) {
  return (
    <Button
      variant="secondary"
      asChild
      className={`h-auto py-3.5 flex-col gap-1.5 transition-all duration-300 ${brandStyle} border-none`}
    >
      <a
        href={href}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
      >
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </a>
    </Button>
  );
}

export default function ProfileConnectCard({
  org,
  socialEntries,
}: {
  org: Organization;
  socialEntries: [string, string | boolean][];
}) {
  return (
    <Card className="animate-fade-in-up animate-delay-200 bg-card border-none shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <ExternalLink size={14} /> Connect
        </CardTitle>
      </CardHeader>
      <CardContent>
        {org.contact?.email || org.contact?.website || socialEntries.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5">
            {org.contact?.email && (
              <ContactButton
                href={`mailto:${org.contact.email}`}
                icon={<ContactIcon name="email" size={20} />}
                label="Email"
                brandStyle={brandStyles.email}
              />
            )}
            {org.contact?.website && (
              <ContactButton
                href={org.contact.website}
                icon={<ContactIcon name="website" size={20} />}
                label="Website"
                brandStyle={brandStyles.website}
              />
            )}
            {socialEntries.map(([network, url]) => (
              <ContactButton
                key={network}
                href={url as string}
                icon={<ContactIcon name={network} size={20} />}
                label={network.charAt(0).toUpperCase() + network.slice(1)}
                brandStyle={brandStyles[network] || 'hover:bg-primary hover:text-primary-foreground'}
              />
            ))}
          </div>
        ) : (
          <div className="h-24 flex flex-col items-center justify-center text-sm text-muted-foreground text-center border-2 border-dashed border-border rounded-xl gap-1">
            <ExternalLink size={16} className="opacity-40" />
            <span className="italic">No links available</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
