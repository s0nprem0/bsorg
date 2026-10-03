import { useMemo } from 'react';
import SEO from '@/components/SEO';
import Hero from '@/components/sections/Hero';
import FeaturedGrid from '@/components/sections/FeaturedGrid';
import BrowseCategories from '@/components/sections/BrowseCategories';
import BrowseByCampus from '@/components/sections/BrowseByCampus';
import CTASection from '@/components/sections/CTASection';
import Section from '@/components/ui/Section';
import { organizations } from '@/lib/orgIndex';

export default function Home() {
  const allOrgs = organizations;

  const stats = useMemo(() => {
    const uniqueCampuses = new Set(allOrgs.map(o => o.campusId).filter(id => id !== undefined));
    const uniqueCategories = new Set(allOrgs.map(o => o.category).filter(Boolean));
    return {
      total: allOrgs.length,
      academic: allOrgs.filter(org => org.type === 'Academic' || org.type === 'Student Council').length,
      nonAcademic: allOrgs.filter(org => org.type !== 'Academic' && org.type !== 'Student Council').length,
      campuses: uniqueCampuses.size,
      categories: uniqueCategories.size,
    };
  }, [allOrgs]);

  return (
    <>
      <SEO title="Home" />
      <section className="grow bg-background">
        <Hero />
        <FeaturedGrid allOrgs={allOrgs} stats={stats} />
        <BrowseCategories
          counts={{
            '/org?type=Academic': stats.academic,
            '/org?type=Non-Academic': stats.nonAcademic,
          }}
        />
        <Section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
          <BrowseByCampus allOrgs={allOrgs} />
        </Section>
        <CTASection />
      </section>
    </>
  );
}
