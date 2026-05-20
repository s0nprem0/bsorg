import { useMemo } from 'react';
import CategoryPageTemplate from '@/components/layout/CategoryPageTemplate';
import { orgRegistry } from '@/lib/orgIndex';
import type { Organization } from '@/types/organization';

export default function NonAcademicOrg() {
  const groupedData = useMemo(() => {
    // 1. Fetch all orgs and filter out standard Academic ones
    const orgs = orgRegistry.getAll().filter(
      (org) => org.type !== 'Academic' && !(org.type === 'Student Council' && org.category !== 'University-Wide')
    );

    // 2. Group by Category
    const grouped: Record<string, Organization[]> = {};
    for (const org of orgs) {
      const groupKey = org.category || 'Other Organizations';
      if (!grouped[groupKey]) grouped[groupKey] = [];
      grouped[groupKey].push(org);
    }

    return Object.keys(grouped).sort().reduce((acc, key) => {
      acc[key] = grouped[key];
      return acc;
    }, {} as Record<string, Organization[]>);
  }, []);

  return (
    <CategoryPageTemplate
      title="Non-Academic Organizations"
      description="Discover the vibrant world of non-academic organizations at Cavite State University. From cultural clubs to sports teams, find your community and make lasting connections."
      data={groupedData}
      highlightStudentCouncils={true}
    />
  );
}