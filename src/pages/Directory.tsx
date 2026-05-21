// src/pages/Directory.tsx
import { useMemo } from 'react';
import CategoryPageTemplate from '@/components/layout/CategoryPageTemplate';
import { orgRegistry } from '@/lib/orgIndex';
import type { Organization } from '@/types/organization';

export default function Directory() {
  const groupedData = useMemo(() => {
    // 1. Fetch ALL organizations
    // Optional: Filter out 'University-Wide' if you handle them separately,
    // or leave them in to let the template handle them.
    const allOrgs = orgRegistry.getAll().filter(org => org.status === 'Active');

    // 2. Dynamically group ALL orgs by their Category (Colleges + Non-Acad Categories)
    const grouped: Record<string, Organization[]> = {};

    for (const org of allOrgs) {
      // Fallback category if none exists
      const groupKey = org.category || 'Other Organizations';
      if (!grouped[groupKey]) grouped[groupKey] = [];
      grouped[groupKey].push(org);
    }

    // 3. Sort the categories alphabetically so the Quick Nav pills are organized
    return Object.keys(grouped)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = grouped[key];
          return acc;
        },
        {} as Record<string, Organization[]>
      );
  }, []);

  return (
    <CategoryPageTemplate
      title="Campus Directory"
      description="Explore the diverse range of organizations at Cavite State University. From academic councils to cultural clubs and sports teams, find your community and make lasting connections."
      data={groupedData}
      highlightStudentCouncils={true}
    />
  );
}
