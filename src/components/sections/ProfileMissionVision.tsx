import { Target, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/shadcn/card';
import type { Organization } from '@/lib/orgIndex';

export default function ProfileMissionVision({ org }: { org: Organization }) {
  if (!org.content?.mission && !org.content?.vision) return null;

  return (
    <Card className="animate-fade-in-up animate-delay-300 md:col-span-3 lg:col-span-2 bg-card border-none shadow-md">
      <CardContent className="p-5 sm:p-6 grid sm:grid-cols-2 gap-6 sm:gap-8 h-full items-start">
        {org.content.mission && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
              <Target className="text-primary shrink-0" size={15} /> Mission
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{org.content.mission}</p>
          </div>
        )}
        {org.content.vision && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
              <Eye className="text-primary shrink-0" size={15} /> Vision
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{org.content.vision}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
