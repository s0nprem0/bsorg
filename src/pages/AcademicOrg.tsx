import Section from '@/components/ui/Section';
import OrganizationCard from '@/components/OrganizationCard';
import { academicOrgsByCategory } from '@/data/academicOrgs';
import type { AcademicOrg } from '@/data/academicOrgs';

export default function AcademicOrg() {
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
      {/* Section Header */}
      <Section>
        <h1 className="text-3xl font-bold mb-4">Academic Organizations</h1>
        <p className="text-lg text-neutral-600">
          Explore the diverse range of academic organizations at Cavite State University. Connect with like-minded peers, enhance your skills, and make the most of your university experience!
        </p>
      </Section>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search organizations..."
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>

      {/* Organization Categories */}
      <div>
        {Object.entries(academicOrgsByCategory).map(([category, orgs]) => {
          const orgList = orgs as AcademicOrg[];

          // Find and separate student council (by slug convention or org name)
          const council = orgList.find(
            (org) =>
              org.slug.includes('sc') || org.org.toLowerCase().includes('student council')
          );
          const rest = orgList
            .filter((org) => org !== council)
            .sort((a, b) => a.org.localeCompare(b.org));

          return (
            <section key={category} className="mb-14">
              {/* Category Heading */}
              <h3
                className="text-2xl font-mono uppercase font-bold mb-4 text-primary-800 border-l-4 border-primary-400 pl-3 bg-linear-to-r from-primary-50 to-primary-100 py-2"
                aria-label={`Category: ${category}`}
              >
                {category}
              </h3>

              {/* Empty State */}
              {orgList.length === 0 ? (
                <p className="text-neutral-500">No organizations found in this category.</p>
              ) : (
                <>
                  {/* Highlighted Student Council */}
                  {council && (
                    <div className="mb-6">
                      <OrganizationCard
                        key={council.slug}
                        {...council}
                        large
                      />
                    </div>
                  )}

                  {/* Organization Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((org) => (
                      <OrganizationCard key={org.slug} {...org} />
                    ))}
                  </div>
                </>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
