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
  };
  campusId: number; // Reference to campus
}