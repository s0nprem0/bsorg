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

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <Section>
          <div className="mb-12 max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Non-Academic Organizations
            </h1>
            <p className="text-lg text-foreground-secondary">
              Discover the vibrant world of non-academic organizations at Cavite
              State University. From cultural clubs to sports teams, find your
              community and make lasting connections.
            </p>
          </div>
        </Section>

        <div className="space-y-16">
          {Object.entries(nonAcademicOrgsByCategory).map(([category, orgs]) => {
            const orgList = orgs as NonAcademicOrg[];
            const sortedOrgs = [...orgList].sort((a, b) =>
              a.org.localeCompare(b.org)
            );
            return (
              <section key={category}>
                <h3 className="text-xs font-mono tracking-widest text-foreground-muted uppercase border-b border-border pb-3 mb-6">
                  {category}
                </h3>
                <OrgGrid
                  organizations={sortedOrgs}
                  columns={3}
                />
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}