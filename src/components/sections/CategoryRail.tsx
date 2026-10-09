import { useMemo } from 'react';
import { categoryHue } from '@/data/categoryHue';
import { ORG_CATEGORIES, type Organization } from '@/lib/orgIndex';
import DirectoryRow from '@/components/ui/DirectoryRow';

/** All 14 categories, as dense rows with real counts.
 *
 *  This replaces a two-card section that split the directory into "academic"
 *  and "non-academic" while the browser could filter by 14 categories. The
 *  counts come from the same data the filter reads, so a row can never promise
 *  a result set the browser won't return.
 */
export default function CategoryRail({ allOrgs }: { allOrgs: Organization[] }) {
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const org of allOrgs) {
      counts.set(org.category, (counts.get(org.category) ?? 0) + 1);
    }
    return ORG_CATEGORIES.filter(category => counts.has(category)).map(
      category => ({ category, count: counts.get(category)! })
    );
  }, [allOrgs]);

  if (categories.length === 0) return null;

  return (
    <section>
      <h2 className="px-2 pb-2 text-sm font-semibold">Colleges &amp; categories</h2>
      <div className="-mx-1 grid gap-x-2 sm:grid-cols-2">
        {categories.map(({ category, count }) => (
          <DirectoryRow
            key={category}
            to={`/org?category=${encodeURIComponent(category)}`}
            label={category}
            meta={`${count}`}
            leading={
              /* Same hue the category's orgs use for their banner, so the
                 college's colour is consistent between this rail and a profile. */
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: `hsl(${categoryHue(category)} 55% 55%)` }}
              />
            }
          />
        ))}
      </div>
    </section>
  );
}