import { Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/shadcn/card';
import type { Organization } from '@/lib/orgIndex';

export default function ProfileAboutCard({ org }: { org: Organization }) {
  return (
    <Card className="animate-fade-in-up animate-delay-300 md:col-span-3 lg:col-span-2 bg-card border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <Info className="text-primary shrink-0" size={18} /> About
        </CardTitle>
      </CardHeader>
      <CardContent>
        {org.content.about ? (
          <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {org.content.about}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
            <Info size={24} className="text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground/60 italic">No detailed description available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
