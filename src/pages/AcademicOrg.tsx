import { useMemo } from 'react';
import CategoryPageTemplate from '@/components/layout/CategoryPageTemplate';
import { orgRegistry } from '@/lib/orgIndex';
import type { Organization } from '@/types/organization';

export default function AcademicOrg() {
  const groupedData = useMemo(() => {
    // 1. Leverage the pre-computed academic array from the registry instead of re-filtering the entire allOrgs array.
    const orgs = orgRegistry
      .getAcademicOrgs()
      .filter(org => org.category !== 'University-Wide');

    // 2. Dynamically group them by Category (College)
    const grouped: Record<string, Organization[]> = {};
    for (const org of orgs) {
      if (!grouped[org.category]) grouped[org.category] = [];
      grouped[org.category].push(org);
    }

    // 3. Sort the categories alphabetically for a predictable UI
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
      title="Academic Organizations"
      description="Explore the diverse range of academic organizations at Cavite State University. Connect with like-minded peers, enhance your skills, and make the most of your university experience."
      data={groupedData}
      highlightStudentCouncils={true}
    />
  );
}

