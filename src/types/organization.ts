export type OrgStatus = 'Active' | 'Inactive' | 'Probationary';
export type OrgType = 'Academic' | 'Non-Academic' | 'Student Council' | 'Student Publication Units' | 'Performing Arts Group';

export interface OrgSocialLinks {
  facebook?: string;
  instagram?: string;
  x?: string;
  tiktok?: string;
  linkedin?: string;
  youtube?: string;
}

export interface OrgContact {
  email?: string;
  website?: string;
  officeLocation?: string;
  social?: OrgSocialLinks;
}

export interface Organization {
  id: string; // Unique identifier
  slug: string; // URL-friendly identifier
  name: string; // Full name of the organization
  acronym?: string; // Optional acronym for display purposes
  status: OrgStatus; // Active, Inactive, Probationary
  type: OrgType; // Academic, Non-Academic, Student Council, etc.
  category: string; // E.g., "College of Science", "Cultural Organizations"
  campusId: number; // ID of the campus the org belongs to
  programId?: string; // Optional program affiliation (e.g., "BS Computer Science")

  metadata: {
    foundedYear?: number; // Optional because not all orgs may have this info
    accredited?: boolean; // May depend
    tags?: string[];
  };

  content: {
    shortDescription?: string; // Optional because not all orgs may have this info
    about?: string; // Optional because not all orgs may have this info
    mission?: string; // Optional because not all orgs may have this info
    vision?: string; // Optional because not all orgs may have this info
  };

  assets: {
    logoUrl?: string;
    bannerUrl?: string;
    galleryUrls?: string[];
  };

  contact: OrgContact;

  membership?: {
    isOpen: boolean;
    requirements?: string[];
  };
}

export type FilterCategory = string | 'All';