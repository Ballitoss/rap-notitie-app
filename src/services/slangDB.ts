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
  
  // === USER'S STRAATTAAL ===
  { term: 'hossel', meaning: 'hustle, druk bezig zijn, werken', region: 'NL', examples: ['Ik ben nog op me hossel'], confidence: 0.9 },
  { term: 'gesetteld', meaning: 'geregeld, goed zitten, stabiel', region: 'NL', examples: ['Dan zijn we gesetteld kunnen we brieven blijven tellen'], confidence: 0.85 },
  { term: 'prayen', meaning: 'bidden, hopen', region: 'NL', examples: ['We blijven prayen'], confidence: 0.9 },
  { term: 'securen', meaning: 'veiligstellen, pakken', region: 'NL', examples: ['Hier securen we de bag'], confidence: 0.88 },
  { term: 'brieven', meaning: 'geld, bankbiljetten', region: 'NL', examples: ['Brieven blijven tellen'], confidence: 0.92 },
  { term: 'bag', meaning: 'geld, winst, deal', region: 'NL/EN', examples: ['Money in me bag', 'We gonna get the bag'], confidence: 0.95 },
  { term: 'chase', meaning: 'achtervolgen, najagen', region: 'EN', examples: ['Ik ben al dagen aan het chase voor die money'], confidence: 0.9 },
  { term: 'ghost', meaning: 'verdwijnen, onzichtbaar zijn', region: 'EN', examples: ['Je weet toch dat ik ghost'], confidence: 0.88 },
  { term: 'ghost rider', meaning: 'iemand die stiekem/onzichtbaar beweegt', region: 'NL/EN', examples: ['Ghost rider in de wijk'], confidence: 0.85 },
  { term: 'nepheid', meaning: 'fake gedrag, onecht zijn', region: 'NL', examples: ['We waarderen geen nepheid'], confidence: 0.9 },
  { term: 'on the road', meaning: 'onderweg, bezig', region: 'EN', examples: ['Met me jongens on the road'], confidence: 0.92 },
  { term: 'capture the flag', meaning: 'doel bereiken, winnen', region: 'EN', examples: ['Need to capture the flag'], confidence: 0.8 },
  { term: 'winning streak', meaning: 'reeks overwinningen', region: 'EN', examples: ['Ben op een winning streak'], confidence: 0.85 },
  { term: 'honey pak', meaning: 'aantrekkelijke vrouw die blijft hangen', region: 'NL', examples: ['Als honing blijft ze aan me bil plakken geen honey pak'], confidence: 0.75 },
  { term: 'zeiknat', meaning: 'kletsnathellip;, zeer nat', region: 'NL', examples: ['Kwam thuis ik was zeiknat'], confidence: 0.95 },
  { term: 'zeikland', meaning: 'kut land, slecht land', region: 'NL', examples: ['Dit is een zeikland'], confidence: 0.9 },
  { term: 'figueres', meaning: '6 cijfers, 100k+', region: 'NL', examples: ['6 figueres denk niet alleen aan wijven'], confidence: 0.85 },
  { term: 'wijven', meaning: 'vrouwen (negatief/straat)', region: 'NL', examples: ['Denk niet alleen aan wijven'], confidence: 0.88 },
  { term: 'bro', meaning: 'broer, vriend', region: 'NL/EN', examples: ['Bro je bent de weg kwijt'], confidence: 0.95 },
  { term: 'lessons', meaning: 'lessen, ervaringen', region: 'EN', examples: ['We leerde je weer lessons'], confidence: 0.9 },
  { term: 'pressure', meaning: 'druk, stress', region: 'EN', examples: ['Je had pressure'], confidence: 0.92 },
  { term: 'alcantara', meaning: 'luxe stof voor auto interieurs', region: 'NL', examples: ['Wil die stuur fully alcantara'], confidence: 0.7 },
  { term: 'panorama', meaning: 'panoramadak auto', region: 'NL', examples: ['Dakje panorama'], confidence: 0.8 },
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

