import React, { type JSX } from 'react';
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6';
import { Mail, Globe } from 'lucide-react';

// ==================== Organization Types ====================

export const ORGANIZATION_TYPES = {
  STUDENT_COUNCIL: 'Student Council',
  ACADEMIC: 'Academic',
  NON_ACADEMIC: 'Non-Academic',
  PERFORMING_ARTS: 'Performing Arts',
  STUDENT_PUBLICATION_UNITS: 'Student Publication Units',
} as const;

// ==================== Paginated Browser ====================

export const ORG_BROWSER = {
  ITEMS_PER_PAGE: 12,
  DEBOUNCE_DELAY: 300,
  ORG_TYPE_OPTIONS: ['All', 'Academic', 'Non-Academic'],
  PLACEHOLDER_TEXT: {
    SEARCH: 'Search organizations...',
    ALL_TYPES: 'All Types',
    ALL_CATEGORIES: 'All Categories',
  },
  MESSAGES: {
    TITLE: 'Organization Browser',
    SUBTITLE: 'Discover and explore student organizations across campus.',
    NO_RESULTS: 'No organizations match your current filters.',
    NO_RESULTS_SUBTEXT: 'Try adjusting your search or filters.',
    CLEAR_FILTERS: 'Clear filters',
  },
};

// ==================== Contact Icons ====================

export const CONTACT_ICONS: Record<string, (large: boolean) => JSX.Element> = {
  email: (large: boolean) => React.createElement(Mail, { size: large ? 24 : 18 }),
  website: (large: boolean) => React.createElement(Globe, { size: large ? 24 : 18 }),
  facebook: (large: boolean) => React.createElement(FaFacebook, { size: large ? 24 : 18 }),
  instagram: (large: boolean) => React.createElement(FaInstagram, { size: large ? 24 : 18 }),
  tiktok: (large: boolean) => React.createElement(FaTiktok, { size: large ? 24 : 18 }),
  x: (large: boolean) => React.createElement(FaXTwitter, { size: large ? 24 : 18 }),
};

// ==================== Organization Card ====================

export const ORG_CARD = {
  SIZES: {
    SMALL: {
      LOGO_WIDTH: 44,
      MIN_HEIGHT: 44,
      PADDING: 'p-4 md:p-5',
      TITLE_SIZE: 'text-lg md:text-xl',
      DESCRIPTION_SIZE: 'text-sm',
    },
    LARGE: {
      LOGO_WIDTH: 60,
      MIN_HEIGHT: 60,
      PADDING: 'p-6 md:p-8',
      TITLE_SIZE: 'text-2xl md:text-3xl',
      DESCRIPTION_SIZE: 'text-base leading-relaxed',
    },
  },
  ICONS: {
    SIZE_SMALL: 18,
    SIZE_LARGE: 24,
    CONTAINER_SIZE: 36,
  },
} as const;

// ==================== Colleges ====================

export const COLLEGES = [
  {
    id: 0,
    name: "College of Agriculture, Food, Environment and Natural Resources",
    slug: "cafenr",
    campus_id: 0,
  },
  {
    id: 1,
    name: "College of Arts and Sciences",
    slug: "cas",
    campus_id: 0,
  },
  {
    id: 2,
    name: "College of Criminal Justice",
    slug: "ccj",
    campus_id: 0,
  },
  {
    id: 3,
    name: "College of Education",
    slug: "ced",
    campus_id: 0,
  },
  {
    id: 4,
    name: "College of Economics, Management and Development Studies",
    slug: "cemds",
    campus_id: 0,
  },
  {
    id: 5,
    name: "College of Engineering and Information Technology",
    slug: "ceit",
    campus_id: 0,
  },
  {
    id: 6,
    name: "College of Nursing",
    slug: "con",
    campus_id: 0,
  },
  {
    id: 7,
    name: "College of Sports, Physical Education and Recreation",
    slug: "cspear",
    campus_id: 0,
  },
  {
    id: 8,
    name: "College of Veterinary Medicine and Biomedical Sciences",
    slug: "cvmbs",
    campus_id: 0,
  },
  {
    id: 9,
    name: "College of Tourism and Hospitality Management",
    slug: "cthm",
    campus_id: 0,
  },
] as const;

// ==================== Programs ====================

export const PROGRAMS = [
  { name: "Bachelor of Science in Agriculture Major in Animal Science", slug: "bsa-as", college_id: 0 },
  { name: "Bachelor of Science in Agriculture Major in Crop Science", slug: "bsa-cs", college_id: 0 },
  { name: "Bachelor of Science in Environmental Science", slug: "bses", college_id: 0 },
  { name: "Bachelor of Science in Food Technology", slug: "bsft", college_id: 0 },
  { name: "Bachelor of Science in Land Use Design and Management", slug: "bsludm", college_id: 0 },
  { name: "Bachelor in Agricultural Entrepreneurship", slug: "bae", college_id: 0 },
  { name: "Bachelor of Science in Biology", slug: "bs-bio", college_id: 1 },
  { name: "Bachelor of Arts in English Language Studies", slug: "baels", college_id: 1 },
  { name: "Bachelor of Science in Psychology", slug: "bsp", college_id: 1 },
  { name: "Bachelor of Arts in Political Science", slug: "baps", college_id: 1 },
  { name: "Bachelor of Arts in Journalism", slug: "baj", college_id: 1 },
  { name: "Bachelor of Science in Social Work", slug: "bssw", college_id: 1 },
  { name: "Bachelor of Science in Applied Mathematics", slug: "bsam", college_id: 1 },
  { name: "Bachelor of Science in Criminology", slug: "bs-crim", college_id: 2 },
  { name: "Bachelor of Science in Industrial Security Management", slug: "bsism", college_id: 2 },
  { name: "Bachelor of Elementary Education", slug: "bee", college_id: 3 },
  { name: "Bachelor of Secondary Education - Major in English", slug: "bse-eng", college_id: 3 },
  { name: "Bachelor of Secondary Education - Major in Science", slug: "bse-sci", college_id: 3 },
  { name: "Bachelor of Secondary Education - Major in Filipino", slug: "bse-fil", college_id: 3 },
  { name: "Bachelor of Secondary Education - Major in Mathematics", slug: "bse-math", college_id: 3 },
  { name: "Bachelor of Secondary Education - Major in Social Science", slug: "bse-socsci", college_id: 3 },
  { name: "Bachelor of Science in Tourism Management", slug: "bstm", college_id: 3 },
  { name: "Bachelor of Early Childhood Education", slug: "bece", college_id: 3 },
  { name: "Bachelor of Special Needs Education", slug: "bsne", college_id: 3 },
  { name: "Bachelor of Technology and Livelihood Education", slug: "btle", college_id: 3 },
  { name: "Bachelor of Science in Hospitality Management", slug: "bshm", college_id: 3 },
  { name: "Bachelor of Science in Accountancy", slug: "bs-acc", college_id: 4 },
  { name: "Bachelor of Science in Business Management", slug: "bsbm", college_id: 4 },
  { name: "Bachelor of Science in Economics", slug: "bs-econ", college_id: 4 },
  { name: "Bachelor of Science in Development  Management", slug: "bsdm", college_id: 4 },
  { name: "Bachelor of Science in International Studies", slug: "bsis", college_id: 4 },
  { name: "Bachelor of Science in Office Administration", slug: "bsoa", college_id: 4 },
  { name: "Bachelor of Science in Agricultural and Biosystems Engineering", slug: "bsabe", college_id: 5 },
  { name: "Bachelor of Science in Architecture", slug: "bsarch", college_id: 5 },
  { name: "Bachelor of Science in Civil Engineering", slug: "bsce", college_id: 5 },
  { name: "Bachelor of Science in Computer Engineering", slug: "bscomp-eng", college_id: 5 },
  { name: "Bachelor of Science in Computer Science", slug: "bscs", college_id: 5 },
  { name: "Bachelor of Science in Electrical Engineering", slug: "bsee", college_id: 5 },
  { name: "Bachelor of Science in Electronics Engineering", slug: "bsece", college_id: 5 },
  { name: "Bachelor of Science in Industrial Engineering", slug: "bsie", college_id: 5 },
  { name: "Bachelor of Science in Industrial Technology Major in Automotive Technology", slug: "bsit-at", college_id: 5 },
  { name: "Bachelor of Science in Industrial Technology Major in Electrical Technology", slug: "bsit-et", college_id: 5 },
  { name: "Bachelor of Science in Industrial Technology Major in Electronics Technology", slug: "bsit-elex", college_id: 5 },
  { name: "Bachelor of Science in Information Technology", slug: "bsit", college_id: 5 },
  { name: "Bachelor of Science in Nursing", slug: "bsn", college_id: 6 },
  { name: "Bachelor of Science in Medical Technology", slug: "bsmt", college_id: 6 },
  { name: "Bachelor of Science in Midwifery", slug: "bsm", college_id: 6 },
  { name: "Bachelor of Physical Education", slug: "bped", college_id: 7 },
  { name: "Bachelor of Exercise and Sports Sciences", slug: "bsess", college_id: 7 },
  { name: "Doctor of Veterinary Medicine", slug: "dvm", college_id: 8 },
  { name: "Bachelor of Science in Veterinary Technology", slug: "bsvt", college_id: 8 },
  { name: "Bachelor of Science in  Animal Health and Management", slug: "bsahm", college_id: 8 },
  { name: "Bachelor of Science in Biomedical Science", slug: "bsbs", college_id: 8 },
] as const;

// ==================== Campuses ====================

export const CAMPUSES = [
  { id: 0, name: "Main Campus", slug: "main" },
  { id: 1, name: "Imus Campus", slug: "imus" },
  { id: 2, name: "Bacoor Campus", slug: "bacoor" },
  { id: 3, name: "General Trias Campus", slug: "general-trias" },
  { id: 4, name: "Silang Campus", slug: "silang" },
  { id: 5, name: "Tanza Campus", slug: "tanza" },
  { id: 6, name: "Rosario Campus", slug: "ccat" },
  { id: 7, name: "Naic Campus", slug: "naic" },
  { id: 8, name: "Cavite City Campus", slug: "cavite-city" },
] as const;