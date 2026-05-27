import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { useOrgs } from '@/hooks/useOrgService';
import type { Organization } from '@/lib/orgIndex';
import OrgGrid from '@/components/layout/OrgGrid';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';

interface RelatedOrganizationsProps {
  currentOrg: Organization;
  limit?: number;
}

export default function RelatedOrganizations({
  currentOrg,
  limit = 4,
}: RelatedOrganizationsProps) {
  const { orgs: allOrgs } = useOrgs();
  const relatedOrgs = useMemo(() => {

    // Scoring system to find the best matches
    const scoredOrgs = allOrgs
      .filter(org => org.id !== currentOrg.id) // Exclude current org
      .map(org => {
        let score = 0;

        // Exact category match (High weight)
        if (org.category === currentOrg.category) score += 5;

        // Same type (e.g., both are Academic) (Medium weight)
        if (org.type === currentOrg.type) score += 3;

        // Tag intersections (Bonus weight)
        const currentTags = currentOrg.metadata?.tags || [];
        const compareTags = org.metadata?.tags || [];
        const sharedTags = currentTags.filter(tag => compareTags.includes(tag));
        score += sharedTags.length * 2;

        return { org, score };
      });

    // Sort by score descending and take the top results
    return scoredOrgs
      .filter(item => item.score > 0) // Must have at least some relation
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.org);
  }, [currentOrg, limit, allOrgs]);

  if (relatedOrgs.length === 0) return null;

  return (
    <Card className="mt-12 bg-surface-1 border-none shadow-md overflow-hidden">
      <CardHeader className="border-b border-border/50 pb-6 bg-surface-2/30">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
          <Sparkles className="text-primary h-5 w-5" />
          Similar Organizations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Reusing our OrgGrid, but limiting to 4 columns to fit the bento style */}
        <OrgGrid organizations={relatedOrgs} columns={4} />
      </CardContent>
    </Card>
  );
}
