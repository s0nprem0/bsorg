export interface Organization {
  slug: string; // URL-safe identifier
  org: string; // Organization name
  description?: string; // Brief description
  program?: string; // Associated academic program
  logo?: string; // Path to logo image
  contact: {
    email?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    x?: string; // Twitter/X
    website?: string;
    youtube?: string;
  };
  campusId: number; // Reference to campus
}

export type OrgType = 'Academic' | 'Non-Academic';

export type CollegeCategory =
  | 'College of Agriculture, Food, Environment and Natural Resources'
  | 'College of Arts and Sciences'
  | 'College of Criminal Justice'
  | 'College of Education'
  | 'College of Economics, Management and Development Studies'
  | 'College of Engineering and Information Technology'
  | 'College of Nursing'
  | 'College of Sports, Physical Education and Recreation'
  | 'College of Veterinary Medicine and Biomedical Sciences'
  | 'College of Tourism and Hospitality Management';

export type NonAcademicCategory = 'Non-Academic' | 'Student Publication Units' | 'Performing Arts Group';

export type FilterCategory = CollegeCategory | NonAcademicCategory | 'All';