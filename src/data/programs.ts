// Extracted outside to prevent memory reallocation on every function call
const DEGREE_ACRONYMS: Readonly<Record<string, string>> = {
  'BA Communication': 'BA Comm',
  'BA English Language Studies': 'BAELS',
  'BA Journalism': 'BA Journ',
  'BA Political Science': 'BAPS',
  'BS Accountancy': 'BSA',
  'BS Agricultural and Biosystems Engineering': 'BSABE',
  'BS Applied Mathematics': 'BSAM',
  'BS Business Administration': 'BSBA',
  'BS Computer Science': 'BSCS',
  'BS Information Technology': 'BSIT',
  'BS Civil Engineering': 'BSCE',
  'BS Electrical Engineering': 'BSEE',
  'BS Electronics Engineering': 'BSECE',
  'BS Computer Engineering': 'BSCpE',
  'BS Industrial Engineering': 'BSIE',
  'BS Development Communication': 'BSDC',
  'BS Development Management': 'BSDM',
  'BS Industrial Security Management': 'BSISM',
  'BS Industrial Technology - Major in Automotive Technology': 'BSINDT-AT',
  'BS Industrial Technology - Major in Electrical Technology': 'BSINDT-ET',
  'BS International Studies': 'BSIS',
  'BS Office Administration': 'BSOA',
  'BS Economics': 'BS Econ',
  'BS Criminology': 'BSCrim',
  'BS Hospitality Management': 'BSHM',
  'BS Hotel and Restaurant Management': 'BSHRM',
  'BS Tourism Management': 'BSTM',
  'BS Social Work': 'BSSW',
  'BS Architecture': 'BS Arch',
  'BS Biology': 'BS Bio',
  'BS Psychology': 'BS Psych',
  'BS Entrepreneurship': 'BS Entrep',
  'BS Physical Education': 'BPEd',
  'BS Exercise and Sports Science': 'BSESS',
};

export function abbreviateProgram(name: string): string {
  if (!name) return '';

  // 1. Shorten "Bachelor of..." prefixes on the full string (using /i for case-insensitivity)
  const normalized = name
    .replace(/^Bachelor of Science in /i, 'BS ')
    .replace(/^Bachelor of Arts in /i, 'BA ');

  // 2. Check for a direct acronym match (handles entries with majors baked in,
  //    e.g. "BS Industrial Technology - Major in Automotive Technology" → "BSINDT-AT")
  const directHit = DEGREE_ACRONYMS[normalized];
  if (directHit) return directHit;

  // 3. Separate the base degree from the major (if it exists)
  const [baseDegreeRaw, majorRaw] = normalized.split(/ - [Mm]ajor in /);

  const baseDegree = baseDegreeRaw.trim();
  const major = majorRaw?.trim();

  // 4. Map base degree to special acronym if it exists, otherwise fallback to the shortened form
  const abbr = DEGREE_ACRONYMS[baseDegree] ?? baseDegree;

  // 5. Re-attach the major if one was found
  return major ? `${abbr} - ${major}` : abbr;
}
