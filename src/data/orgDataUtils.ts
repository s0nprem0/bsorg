// Utility to group organizations by category
import type { Organization } from '@/types/organization';

/**
 * Groups organizations by a category key.
 * @param orgData Record<string, Organization[]>
 * @param categories Array<{ slug: string, name: string }>
 * @param keyField The field to use as the category key (e.g., 'name')
 */
export function groupOrgsByCategory<T extends string>(
  orgData: Record<string, Organization[]>,
  categories: { slug: string; name: T }[],
  keyField: keyof (typeof categories)[number] = 'name'
): Record<T, Organization[]> {
  return categories.reduce((acc, category) => {
    const orgs = orgData[category.slug];
    if (orgs && orgs.length > 0) {
      acc[category[keyField] as T] = orgs;
    }
    return acc;
  }, {} as Record<T, Organization[]>);
}