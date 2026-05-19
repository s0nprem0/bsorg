import Section from '@/components/ui/Section';
import SEO from '@/components/SEO';
import OrganizationCard from '@/components/OrganizationCard';
import { academicOrgsByCategory } from '@/data/academicOrgs';
import type { AcademicOrg } from '@/data/academicOrgs';
import { CAMPUSES } from '@/data/constants';

const getCampusName = (campusId: number) =>
  CAMPUSES.find(campus => campus.id === campusId)?.name;

export default function AcademicOrg() {
  return (
    <>
      <SEO
        title="Academic Organizations"
        description="Explore the diverse range of academic organizations at Cavite State University. Connect with like-minded peers, enhance your skills, and make the most of your university experience!"
      />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <Section>
          <div className="mb-10 max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Academic Organizations
            </h1>
            <p className="text-lg text-foreground-secondary">
              Explore the diverse range of academic organizations at Cavite State
              University. Connect with like-minded peers, enhance your skills, and
              make the most of your university experience.
            </p>
          </div>
        </Section>

        {/* Search Bar */}
        <div className="mb-12">
          <input
            type="text"
            placeholder="Filter organizations..."
            className="w-full md:max-w-md rounded-md border border-border bg-surface-1 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors"
          />
        </div>

        {/* Organization Categories */}
        <div className="space-y-16">
          {Object.entries(academicOrgsByCategory).map(([category, orgs]) => {
            const orgList = orgs as AcademicOrg[];

            // Find and separate student council (by slug convention or org name)
            const council = orgList.find(
              org =>
                org.slug.includes('sc') ||
                org.org.toLowerCase().includes('student council')
            );
            const rest = orgList
              .filter(org => org !== council)
              .sort((a, b) => a.org.localeCompare(b.org));

            return (
              <section key={category}>
                {/* Category Heading (Vercel Style) */}
                <h3
                  className="text-xs font-mono tracking-widest text-foreground-muted uppercase border-b border-border pb-3 mb-6"
                  aria-label={`Category: ${category}`}
                >
                  {category}
                </h3>

                {/* Empty State */}
                {orgList.length === 0 ? (
                  <p className="text-sm text-foreground-muted">
                    No organizations found in this category.
                  </p>
                ) : (
                  <>
                    {/* Highlighted Student Council */}
                    {council && (
                      <div className="mb-6">
                        <OrganizationCard
                          key={council.slug}
                          {...council}
                          campus={getCampusName(council.campusId)}
                          large
                        />
                      </div>
                    )}

                    {/* Organization Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {rest.map(org => (
                        <OrganizationCard
                          key={org.slug}
                          {...org}
                          campus={getCampusName(org.campusId)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}