import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcn/avatar';
import { Badge } from '@/components/ui/shadcn/badge';
import { Card, CardContent } from '@/components/ui/shadcn/card';
import type { Organization } from '@/lib/orgIndex';

export default function ProfileIdentityCard({ org }: { org: Organization }) {
  return (
    <Card
      style={{ viewTransitionName: 'org-identity' }}
      className="animate-fade-in-up animate-delay-100 md:col-span-2 lg:col-span-2 md:row-span-2 relative overflow-hidden group border-none bg-card/50 backdrop-blur-sm shadow-lg"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:24px_24px]" />
      <CardContent className="p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left h-full justify-center relative z-10 gap-6 lg:gap-8">
        <Avatar className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 shrink-0 border-4 border-background shadow-xl rounded-2xl bg-secondary transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-primary/30">
          <AvatarImage
            src={org.assets?.logoUrl}
            alt={`${org.name} logo`}
            className="object-contain p-3 sm:p-4"
          />
          <AvatarFallback className="text-3xl sm:text-4xl lg:text-5xl font-extrabold rounded-2xl bg-secondary text-muted-foreground">
            {org.acronym || org.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-3 sm:space-y-4 min-w-0">
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <Badge
              variant="secondary"
              className="bg-primary/15 text-primary hover:bg-primary/25 border-none text-[11px] px-3 py-1"
            >
              {org.type}
            </Badge>
            {org.status && org.status !== 'Active' && (
              <Badge className="bg-warning text-warning-foreground border-none text-[11px] px-3 py-1">
                {org.status}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
            {org.name}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl">
            {org.content.shortDescription}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
