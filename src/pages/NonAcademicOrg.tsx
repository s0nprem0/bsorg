import Section from '@/components/ui/Sectiton';
import OrganizationCard from '@/components/OrganizationCard';
import { nonAcademicOrgsByCategory } from '@/data/nonAcademicOrgs';
import type { NonAcademicOrg } from '@/data/nonAcademicOrgs';

export default function NonAcademicOrg() {
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
      <Section>
        <h1 className="text-3xl font-bold mb-4">Non-Academic Organizations</h1>
        <p className="text-lg text-neutral-600">
          Discover the vibrant world of non-academic organizations at Cavite State University. From cultural clubs to sports teams, find your community and make lasting connections!
        </p>
      </Section>
      <div>
        {Object.entries(nonAcademicOrgsByCategory).map(([category, orgs]) => {
          const orgList = orgs as NonAcademicOrg[];
          // Find and separate student council (by slug convention or org name)
          const council = orgList.find(org => org.slug.includes('asc') || org.org.toLowerCase().includes('council'));
          const rest = orgList.filter(org => org !== council).sort((a, b) => a.org.localeCompare(b.org));
          return (
            <section key={category} className="mb-14">
              <h3 className="text-2xl font-mono uppercase font-bold mb-4 text-primary-800 border-l-4 border-primary-400 pl-3 bg-primary-50/60 py-2">
                {category}
              </h3>
              {council && (
                <div className="mb-6">
                  <OrganizationCard
                    key={council.slug}
                    {...council}
                    large
                  />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rest.map(org => (
                  <OrganizationCard key={org.slug} {...org} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
