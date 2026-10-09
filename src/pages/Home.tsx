import { useMemo } from 'react';
import SEO from '@/components/SEO';
import DirectoryHeader from '@/components/sections/DirectoryHeader';
import CategoryRail from '@/components/sections/CategoryRail';
import BrowseByCampus from '@/components/sections/BrowseByCampus';
import FeaturedGrid from '@/components/sections/FeaturedGrid';
import { organizations } from '@/lib/orgIndex';
import { campusesWithOrgs } from '@/data/campuses';
import { countByType } from '@/data/orgBrowser';

export default function Home() {
  const allOrgs = organizations;

  const campuses = useMemo(() => campusesWithOrgs(allOrgs).length, [allOrgs]);

  const stats = useMemo(() => {
    const categories = new Set(allOrgs.map(o => o.category).filter(Boolean));
    return {
      academic: countByType(allOrgs, 'Academic'),
      councils: countByType(allOrgs, 'Student Council'),
      other:
        allOrgs.length -
        countByType(allOrgs, 'Academic') -
        countByType(allOrgs, 'Student Council'),
      categories: categories.size,
    };
  }, [allOrgs]);

  return (
    <>
      <SEO title="Home" />
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <DirectoryHeader total={allOrgs.length} campuses={campuses} />

        <div className="mt-6 space-y-8">
          <CategoryRail allOrgs={allOrgs} />
          <BrowseByCampus allOrgs={allOrgs} />
          <FeaturedGrid allOrgs={allOrgs} />
        </div>

        {/* Stats as a single quiet line rather than a card that spent four hues
            on four numbers. */}
        <p className="mt-10 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          {allOrgs.length} organizations · {stats.academic} academic ·{' '}
          {stats.councils} student councils · {stats.other} other ·{' '}
          {stats.categories} categories
        </p>
      </div>
    </>
  );
}