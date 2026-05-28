export function abbreviateProgram(name: string): string {
  if (!name) return '';

  let abbr = name;

  // Handle " - Major in " → " — " for BSBA, BS Ind'l Tech
  abbr = abbr.replace(/ - Major in /g, ' — ');

  // "Bachelor of Science in X" → "BS X"
  abbr = abbr.replace(/^Bachelor of Science in /, 'BS ');

  // "Bachelor of Arts in X" → "BA X"
  abbr = abbr.replace(/^Bachelor of Arts in /, 'BA ');

  // Special well-known single-acronym degrees
  const SPECIAL: Record<string, string> = {
    'BS Accountancy': 'BSA',
    'BS Business Administration': 'BSBA',
    'BS Computer Science': 'BSCS',
    'BS Information Technology': 'BSIT',
    'BS Civil Engineering': 'BSCE',
    'BS Electrical Engineering': 'BSEE',
    'BS Electronics Engineering': 'BSECE',
    'BS Computer Engineering': 'BSCpE',
    'BS Industrial Engineering': 'BSIE',
    'BS Criminology': 'BSCrim',
    'BS Hospitality Management': 'BSHM',
    'BS Hotel and Restaurant Management': 'BSHRM',
    'BS Tourism Management': 'BSTM',
    'BS Architecture': 'BS Arch',
    'BS Biology': 'BS Bio',
    'BS Psychology': 'BS Psych',
    'BS Entrepreneurship': 'BS Entrep',
    'BS Physical Education': 'BSPE',
    'BS Exercise and Sports Science': 'BSESS',
  };

  return SPECIAL[abbr] ?? abbr;
}
