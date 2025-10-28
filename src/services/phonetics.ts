/**
 * Nederlandse Fonetische Parser
 * Vereenvoudigde implementatie voor MVP
 */

const VOWEL_PATTERNS: Record<string, string> = {
  // Klinkers
  'ui': 'œy',
  'ij': 'ɛi',
  'ei': 'ɛi',
  'oe': 'u',
  'ou': 'ʌu',
  'au': 'ʌu',
  'ie': 'i',
  'eu': 'ø',
  'aa': 'a',
  'ee': 'e',
  'oo': 'o',
  'uu': 'y',
  
  // Enkels
  'a': 'a',
  'e': 'ɛ',
  'i': 'ɪ',
  'o': 'ɔ',
  'u': 'ʏ',
};

const CONSONANT_CLUSTERS: Record<string, string> = {
  'sch': 'sx',
  'ch': 'x',
  'ng': 'ŋ',
  'nk': 'ŋk',
  'sj': 'ʃ',
  'tj': 'tʃ',
};

/**
 * Converteert Nederlandse spelling naar fonetische representatie
 */
export function phonemize(word: string): string {
  let result = word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Converteer clusters eerst
  for (const [cluster, sound] of Object.entries(CONSONANT_CLUSTERS)) {
    result = result.replace(new RegExp(cluster, 'g'), sound);
  }
  
  // Converteer klinkers
  for (const [pattern, sound] of Object.entries(VOWEL_PATTERNS)) {
    result = result.replace(new RegExp(pattern, 'g'), sound);
  }
  
  return result;
}

/**
 * Haalt laatste beklemtoonde syllabe op voor rijm
 */
export function extractRhymeKey(phonetic: string, word: string): string {
  // Voor MVP: neem laatste 3-4 karakters fonetisch
  // In productie: gebruik echte syllabificatie + klemtoon
  const syllables = syllableCount(word);
  
  if (syllables <= 2) {
    // Neem laatste deel
    const lastVowel = phonetic.match(/[ɛiʌuœɔaøɪʏy]|ɛi|œy/);
    if (lastVowel && lastVowel.index !== undefined) {
      return phonetic.substring(lastVowel.index);
    }
    return phonetic.slice(-3);
  }
  
  // Multisyllabisch: neem laatste 2 syllabes
  const parts = phonetic.match(/.{1,3}/g) || [];
  return parts.slice(-2).join('');
}

/**
 * Telt aantal syllabes in een woord (heuristisch)
 */
export function syllableCount(word: string): number {
  word = word.toLowerCase().trim();
  
  if (word.length <= 3) return 1;
  
  // Tel klinkers
  const vowels = word.match(/[aeiouijou]/g) || [];
  
  // Aantal klinkers is goede basis
  let count = vowels.length;
  
  // -e aan het einde telt vaak niet
  if (word.endsWith('e') && count > 1) count--;
  
  // ui, ij, ou, ei tellen als 1 klinker
  const diphthongs = word.match(/ui|ij|ei|ou|au/g);
  if (diphthongs) count -= diphthongs.length;
  
  return Math.max(1, count);
}

/**
 * Detecteert klemtoon (vereenvoudigd)
 */
export function stressPattern(syllables: number): string[] {
  // Heuristiek: eerste of tweede syllabe heeft vaak klemtoon in NL
  const pattern: string[] = [];
  for (let i = 0; i < syllables; i++) {
    if (i === 0 || i === 1) pattern.push('STRESSED');
    else pattern.push('unstressed');
  }
  return pattern;
}

/**
 * Berekent Levenshtein-afstand tussen twee fonetische strings
 */
export function phonemeDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  return matrix[a.length][b.length];
}

/**
 * Detecteert of twee woorden assonantie (klinkergelijkenis) vertonen
 */
export function isAssonance(word1: string, word2: string): boolean {
  const ph1 = phonemize(word1);
  const ph2 = phonemize(word2);
  
  // Vergelijk laatste klinkers
  const vowel1 = ph1.match(/[ɛiʌuœɔaøɪʏy]|ɛi|œy/);
  const vowel2 = ph2.match(/[ɛiʌuœɔaøɪʏy]|ɛi|œy/);
  
  if (!vowel1 || !vowel2) return false;
  
  // Vergelijk klankwaarden (vereenvoudigd)
  return Math.abs(vowel1[0].charCodeAt(0) - vowel2[0].charCodeAt(0)) <= 2;
}

