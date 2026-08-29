import { Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/shadcn/card';
import type { Organization } from '@/lib/orgIndex';

export default function ProfileAboutCard({ org }: { org: Organization }) {
  if (!org.content.about) return null;

  return (
    <Card className="animate-fade-in-up animate-delay-300 md:col-span-full bg-card border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <Info className="text-primary shrink-0" size={18} /> About
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
          {org.content.about}
        </div>
      </CardContent>
    </Card>
  );
}
