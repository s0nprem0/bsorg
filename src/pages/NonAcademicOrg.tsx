import CategoryPageTemplate from '@/components/layout/CategoryPageTemplate';
import { nonAcademicOrgsByCategory } from '@/data/nonAcademicOrgs';

export default function NonAcademicOrg() {
  return (
    <CategoryPageTemplate
      title="Non-Academic Organizations"
      description="Discover the vibrant world of non-academic organizations at Cavite State University. From cultural clubs to sports teams, find your community and make lasting connections."
      data={nonAcademicOrgsByCategory}
      highlightStudentCouncils={false}
    />
  );
}