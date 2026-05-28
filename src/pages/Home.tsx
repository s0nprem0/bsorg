import { useMemo } from 'react';
import SEO from '@/components/SEO';
import Hero from '@/components/sections/Hero';
import FeaturedGrid from '@/components/sections/FeaturedGrid';
import BrowseCategories from '@/components/sections/BrowseCategories';
import BrowseByCampus from '@/components/sections/BrowseByCampus';
import CTASection from '@/components/sections/CTASection';
import { useOrgs } from '@/hooks/useOrgService';

export default function Home() {
  const { orgs: allOrgs, loading, error } = useOrgs();

  const stats = useMemo(() => {
    const uniqueCampuses = new Set(allOrgs.map(o => o.campusId).filter(id => id !== undefined));
    const uniqueCategories = new Set(allOrgs.map(o => o.category).filter(Boolean));
    return {
      total: allOrgs.length,
      academic: allOrgs.filter(org => org.type === 'Academic').length,
      nonAcademic: allOrgs.filter(org => org.type !== 'Academic').length,
      campuses: uniqueCampuses.size,
      categories: uniqueCategories.size,
    };
  }, [allOrgs]);

  return (
    <>
      <SEO title="Home" />
      <main className="grow bg-background">
        <Hero />
        <FeaturedGrid allOrgs={allOrgs} loading={loading} error={error} stats={stats} />
        <BrowseCategories academic={stats.academic} nonAcademic={stats.nonAcademic}>
          <BrowseByCampus allOrgs={allOrgs} />
        </BrowseCategories>
        <CTASection />
      </main>
    </>
  );
}
