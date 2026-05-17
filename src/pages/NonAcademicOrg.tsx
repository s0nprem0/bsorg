import Section from '@/components/ui/Section';
import SEO from '@/components/SEO';
import { nonAcademicOrgsByCategory } from '@/data/nonAcademicOrgs';
import type { NonAcademicOrg } from '@/data/nonAcademicOrgs';
import OrgGrid from '@/components/layout/OrgGrid';

export default function NonAcademicOrg() {
  return (
    <>
      <SEO
        title="Non-Academic Organizations"
        description="Discover the vibrant world of non-academic organizations at Cavite State University. From cultural clubs to sports teams, find your community and make lasting connections!"
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
        <Section>
          <h1 className="text-3xl font-bold mb-4">
            Non-Academic Organizations
          </h1>
          <p className="text-lg text-neutral-600">
            Discover the vibrant world of non-academic organizations at Cavite
            State University. From cultural clubs to sports teams, find your
            community and make lasting connections!
          </p>
        </Section>
        <div>
          {Object.entries(nonAcademicOrgsByCategory).map(([category, orgs]) => {
            const orgList = orgs as NonAcademicOrg[];
            const sortedOrgs = [...orgList].sort((a, b) =>
              a.org.localeCompare(b.org)
            );
            return (
              <section key={category} className="mb-14">
                <h3 className="text-2xl font-mono uppercase font-bold mb-4 text-primary-800 border-l-4 border-primary-400 pl-3 bg-primary-50/60 py-2">
                  {category}
                </h3>
                <OrgGrid
                  organizations={sortedOrgs}
                  columns={3}
                  className="mt-6"
                />
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
