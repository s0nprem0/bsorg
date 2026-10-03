// programId values are full degree names, e.g. "Bachelor of Science in Computer
// Science". Almost all of them shorten cleanly by stripping the prefix and
// initialising each word:
//
//   "Bachelor of Science in Computer Science" -> "BS Computer Science" -> "BSCS"
//
// This map holds only the degrees the rule gets wrong or can't express: real
// acronyms that aren't spelled as initials (BSA, BSABE, BSCpE), abbreviations
// with a space (BS Econ), and degrees carrying a major (BSBA-MM).
const OVERRIDES: Readonly<Record<string, string>> = {
  'BS Accountancy': 'BSA',
  'BS Agricultural and Biosystems Engineering': 'BSABE',
  'BS Business Administration': 'BSBA',
  'BS Computer Engineering': 'BSCpE',
  'BS Criminology': 'BSCrim',
  'BS Development Management': 'BSDevComm',
  'BS Economics': 'BS Econ',
  'BS Entrepreneurship': 'BS Entrep',
  // Both collapse to "BEE" without overrides, and the two are genuinely
  // distinct acronyms on campus.
  'BS Electrical Engineering': 'BSEE',
  'BS Electronics Engineering': 'BSECE',
  'BS Physical Education': 'BPEd',
  'BS Psychology': 'BS Psych',
  'BS Architecture': 'BS Arch',
  'BS Biology': 'BS Bio',
  'BS Hospitality Management': 'BSHM',
  'BS Hotel and Restaurant Management': 'BSHRM',
  'BS Medical Technology': 'BSMT',
  'BS Industrial Technology': 'BSINDT',
  'BS Agriculture': 'BSAgri',
  'BA Communication': 'BA Comm',

  // Already abbreviations in the data, not degree names. Must be matched
  // before the initializer runs, or they collapse to a single letter.
  BPED: 'BPEd',
  BSESS: 'BSESS',
  'BSESS-SM': 'BSESS-SM',

  'Bachelor of Science in Business Administration - Major in Marketing Management': 'BSBA-MM',
  'Bachelor of Science in Business Administration - Major in Human Resource Management': 'BSBA-HRM',
  'Bachelor of Science in Business Administration - Major in Financial Management': 'BSBA-FM',
  'Bachelor of Science in Business Administration - Major in Operations Management': 'BSBA-OM',
  'Bachelor of Science in Industrial Technology - Major in Automotive Technology': 'BSINDT-AT',
  'Bachelor of Science in Industrial Technology - Major in Electrical Technology': 'BSINDT-ET',
  'Bachelor of Science in Agriculture Major in Agribusiness': 'BSAgri-Agri',
  'Bachelor of Science in Agriculture Major in Animal Science': 'BSAgri-ASci',
  'Bachelor of Science in Agriculture Major in Crop Science': 'BSAgri-CSci',
};

export function abbreviateProgram(name: string): string {
  if (!name) return '';

  const shortened = name
    .replace(/^Bachelor of Science in /i, 'BS ')
    .replace(/^Bachelor of Arts in /i, 'BA ')
    .trim();

  return (
    OVERRIDES[name] ??
    OVERRIDES[shortened] ??
    shortened
      .split(/\s+/)
      .map(word => word[0])
      .join('')
      .toUpperCase()
  );
}