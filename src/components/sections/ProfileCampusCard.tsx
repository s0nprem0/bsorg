import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/shadcn/card';
import type { Organization } from '@/lib/orgIndex';

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">{label}</p>
      <p className="font-semibold text-foreground text-sm">{value}</p>
    </div>
  );
}

export default function ProfileCampusCard({
  org,
  campusName,
  parentOrgs,
}: {
  org: Organization;
  campusName: string;
  parentOrgs: Organization[];
}) {
  return (
    <Card className="animate-fade-in-up animate-delay-200 bg-card border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <MapPin size={14} /> Campus & Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 mt-1">
        <DetailRow label="Location" value={campusName || 'N/A'} />
        {org.programId && <DetailRow label="Program" value={org.programId} />}
        {org.metadata?.foundedYear && (
          <DetailRow label="Founded" value={String(org.metadata.foundedYear)} />
        )}
        {parentOrgs.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              Part of
            </p>
            <div className="flex flex-wrap gap-1.5">
              {parentOrgs.map(p => (
                <Link
                  key={p.slug}
                  to={`/org/${p.slug}`}
                  className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary hover:bg-primary/10 hover:border-primary/30 transition-colors"
                >
                  {p.acronym || p.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
