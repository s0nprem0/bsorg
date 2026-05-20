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
  id: string;
  slug: string;
  name: string;
  acronym?: string;
  status: OrgStatus;
  type: OrgType;
  category: string;
  campusId: number;
  programId?: string;

  metadata: {
    foundedYear?: number;
    accredited: boolean;
    tags?: string[];
  };

  content: {
    shortDescription: string;
    about?: string;
    mission?: string;
    vision?: string;
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