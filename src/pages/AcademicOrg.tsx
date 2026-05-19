import CategoryPageTemplate from '@/components/layout/CategoryPageTemplate';
import { academicOrgsByCategory } from '@/data/academicOrgs';

export default function AcademicOrg() {
  return (
    <CategoryPageTemplate
      title="Academic Organizations"
      description="Explore the diverse range of academic organizations at Cavite State University. Connect with like-minded peers, enhance your skills, and make the most of your university experience."
      data={academicOrgsByCategory}
      highlightStudentCouncils={true}
    />
  );
}