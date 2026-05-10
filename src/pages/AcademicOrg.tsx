import OrganizationCard from '@/components/OrganizationCard';
import { academicOrgsByCategory } from '@/data/academicOrgs';

export default function AcademicOrg() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Academic Organizations</h2>
      {Object.entries(academicOrgsByCategory).map(([category, orgs]) => {
        const sortedOrgs = [...orgs].sort((a, b) => a.org.localeCompare(b.org));
        return (
          <section key={category} className="mb-10">
            <h3 className="text-xl font-semibold mb-4">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedOrgs.map(org => (
                <OrganizationCard key={org.slug} {...org} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
