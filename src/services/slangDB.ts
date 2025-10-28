import { SlangTerm } from '../types';

/**
 * Slang Database & Learning System
 * Detecteert onbekende slang en vraagt gebruiker om uitleg
 */

const DEFAULT_SLANG: SlangTerm[] = [
  { term: 'sike', meaning: 'grapje / niet waar / oops', region: 'NL', examples: ['Ha, sike! dat was niet de bedoeling'], confidence: 0.9 },
  { term: 'zieke', meaning: 'heel cool, awesome', region: 'NL', examples: ['Dat is een zieke beat'], confidence: 0.95 },
  { term: 'famo', meaning: 'dude / vriend', region: 'NL', examples: ['Yo famo, wat doe je?'], confidence: 0.85 },
  { term: 'main', meaning: 'vriend / broer', region: 'NL', examples: ['Kom op main, we gaan'], confidence: 0.8 },
  { term: 'biekes', meaning: 'meisjes, chicks', region: 'NL', examples: ['Die biekes zijn cool'], confidence: 0.75 },
];

let slangDB = new Map<string, SlangTerm>();

// Initialiseer met defaults
DEFAULT_SLANG.forEach(term => {
  slangDB.set(term.term.toLowerCase(), term);
});

/**
 * Detecteert of een woord slang is
 */
export function detectSlang(word: string): { isSlang: boolean; confidence: number; term?: SlangTerm } {
  const normalized = word.toLowerCase().trim();
  const term = slangDB.get(normalized);
  
  if (term) {
    return { isSlang: true, confidence: term.confidence, term };
  }
  
  // Heuristiek: onbekend woord dat niet in woordenlijst staat
  // is mogelijke slang (in productie: gebruik NL woordenlijst)
  const possibleSlang = !isKnownWord(normalized);
  
  if (possibleSlang) {
    return { isSlang: true, confidence: 0.3, term: undefined };
  }
  
  return { isSlang: false, confidence: 0 };
}

/**
 * Controleert of woord bekend is (vereenvoudigd)
 */
function isKnownWord(word: string): boolean {
  const knownPatterns = [
    /^(ik|jij|hij|zij|wij|het|de|aan|bij|van|met|voor|na)$/i,
    /[a-z]{3,}/, // Standaard NL woorden hebben >2 letters
  ];
  
  return knownPatterns.some(p => p.test(word)) && word.length > 2;
}

/**
 * Voegt nieuwe slang term toe aan database
 */
export function addSlangTerm(term: SlangTerm): void {
  slangDB.set(term.term.toLowerCase(), term);
  
  // Persist naar localStorage
  saveToLocalStorage();
}

/**
 * Haalt slang term op
 */
export function getSlangTerm(word: string): SlangTerm | undefined {
  return slangDB.get(word.toLowerCase());
}

/**
 * Haalt alle slang op
 */
export function getAllSlang(): SlangTerm[] {
  return Array.from(slangDB.values());
}

/**
 * Verwijder slang term
 */
export function removeSlangTerm(term: string): void {
  slangDB.delete(term.toLowerCase());
  saveToLocalStorage();
}

/**
 * Slaat slang op naar localStorage
 */
function saveToLocalStorage(): void {
  const slangArray = Array.from(slangDB.values());
  try {
    localStorage.setItem('rap_app_slang', JSON.stringify(slangArray));
  } catch (e) {
    console.error('Failed to save slang to localStorage:', e);
  }
}

/**
 * Laadt slang uit localStorage
 */
export function loadFromLocalStorage(): void {
  try {
    const saved = localStorage.getItem('rap_app_slang');
    if (saved) {
      const slangArray = JSON.parse(saved) as SlangTerm[];
      slangDB.clear();
      slangArray.forEach(term => {
        slangDB.set(term.term.toLowerCase(), term);
      });
    }
  } catch (e) {
    console.error('Failed to load slang from localStorage:', e);
  }
}

// Load op init
loadFromLocalStorage();

