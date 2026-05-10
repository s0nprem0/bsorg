import Section from '@/components/ui/Sectiton';
import OrganizationCard from '@/components/OrganizationCard';
import { academicOrgsByCategory } from '@/data/academicOrgs';

export default function AcademicOrg() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Section>
        <h1 className="text-3xl font-bold mb-4">Academic Organizations</h1>
        <p className="text-lg text-neutral-600">
          Explore the diverse range of academic organizations at Cavite State University. Connect with like-minded peers, enhance your skills, and make the most of your university experience!
        </p>
      </Section>
      {Object.entries(academicOrgsByCategory).map(([category, orgs]) => {
        // Find and separate student council (by slug convention or org name)
        const council = orgs.find(org => org.slug.includes('sc') || org.org.toLowerCase().includes('student council'));
        const rest = orgs.filter(org => org !== council).sort((a, b) => a.org.localeCompare(b.org));
        return (
          <section key={category} className="mb-10">
            <h3 className="text-xl font-semibold mb-4">{category}</h3>
            {council && (
              <div className="mb-6">
                <OrganizationCard
                  key={council.slug}
                  {...council}
                  large // pass a prop to enlarge
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
  );
}
