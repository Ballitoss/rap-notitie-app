import { RhymeCandidate, RhymeType } from '../types';
import { phonemize, extractRhymeKey, syllableCount, phonemeDistance, isAssonance } from './phonetics';

/**
 * Rhyme Engine - Live rijmsuggesties generator
 */

// Basis woordenlijst met frequenties (in productie: grote lexicon)
const DUTCH_WORDS: Array<{ word: string; frequency: number }> = [
  // Veelgebruikte rijm-woorden
  { word: 'me', frequency: 1000 },
  { word: 'we', frequency: 950 },
  { word: 'je', frequency: 900 },
  { word: 'ze', frequency: 850 },
  { word: 'de', frequency: 800 },
  { word: 'het', frequency: 750 },
  
  // Eind-rijm woorden
  { word: 'lied', frequency: 700 },
  { word: 'tijd', frequency: 680 },
  { word: 'strijd', frequency: 650 },
  { word: 'wijd', frequency: 620 },
  { word: 'blij', frequency: 600 },
  { word: 'vrij', frequency: 580 },
  { word: 'zij', frequency: 560 },
  
  { word: 'deur', frequency: 550 },
  { word: 'keur', frequency: 540 },
  { word: 'zeur', frequency: 530 },
  { word: 'leuk', frequency: 520 },
  
  { word: 'straat', frequency: 500 },
  { word: 'graat', frequency: 480 },
  { word: 'laat', frequency: 450 },
  
  // Straattaal
  { word: 'zieke', frequency: 400 },
  { word: 'biekes', frequency: 380 },
  { word: 'sike', frequency: 360 },
  { word: 'bro', frequency: 350 },
  { word: 'famo', frequency: 340 },
  { word: 'main', frequency: 330 },
  { word: 'respect', frequency: 320 },
  
  // Multisyllabisch
  { word: 'waardeloos', frequency: 300 },
  { word: 'perfect', frequency: 310 },
  { word: 'momentje', frequency: 290 },
  { word: 'resolutie', frequency: 280 },
  { word: 'executie', frequency: 270 },
  
  // Combinaties
  { word: 'mijn leven', frequency: 250 },
  { word: 'mijn droom', frequency: 240 },
  { word: 'mijn hart', frequency: 230 },
  { word: 'de nacht', frequency: 220 },
  { word: 'de wereld', frequency: 210 },
  
  // === USER'S RIJMWOORDEN (uit aangeleverde teksten) ===
  
  // -ijken cluster
  { word: 'kijken', frequency: 900 },
  { word: 'lijken', frequency: 880 },
  { word: 'begrijpen', frequency: 860 },
  { word: 'krijgen', frequency: 840 },
  { word: 'blijven', frequency: 820 },
  { word: 'wijven', frequency: 800 },
  { word: 'rijden', frequency: 780 },
  { word: 'drive', frequency: 760 },
  
  // -iezen cluster
  { word: 'kiezen', frequency: 850 },
  { word: 'verliezen', frequency: 830 },
  { word: 'vriezen', frequency: 810 },
  { word: 'giezen', frequency: 790 },
  
  // -oek/-oep cluster  
  { word: 'hoek', frequency: 870 },
  { word: 'boek', frequency: 850 },
  { word: 'zoek', frequency: 830 },
  { word: 'beroep', frequency: 810 },
  { word: 'troep', frequency: 790 },
  { word: 'stoep', frequency: 770 },
  { word: 'groep', frequency: 750 },
  
  // -oos/-oos/-oost cluster
  { word: 'boos', frequency: 840 },
  { word: 'doos', frequency: 820 },
  { word: 'roos', frequency: 800 },
  { word: 'groot', frequency: 780 },
  { word: 'boot', frequency: 760 },
  { word: 'noot', frequency: 740 },
  
  // -oost/-ost cluster
  { word: 'ghost', frequency: 820 },
  { word: 'most', frequency: 800 },
  { word: 'post', frequency: 780 },
  { word: 'cost', frequency: 760 },
  { word: 'host', frequency: 740 },
  
  // -oopt/-oop cluster
  { word: 'hoopt', frequency: 810 },
  { word: 'loopt', frequency: 790 },
  { word: 'koop', frequency: 770 },
  { word: 'loop', frequency: 750 },
  { word: 'hoop', frequency: 730 },
  
  // -ag/-ack cluster
  { word: 'bag', frequency: 900 },
  { word: 'back', frequency: 880 },
  { word: 'flag', frequency: 860 },
  { word: 'track', frequency: 840 },
  { word: 'pack', frequency: 820 },
  { word: 'stack', frequency: 800 },
  { word: 'attack', frequency: 780 },
  
  // -weg/-eg cluster
  { word: 'weg', frequency: 880 },
  { word: 'peg', frequency: 860 },
  { word: 'leg', frequency: 840 },
  { word: 'zeg', frequency: 820 },
  
  // -ash/-esh cluster
  { word: 'cash', frequency: 900 },
  { word: 'dash', frequency: 880 },
  { word: 'flash', frequency: 860 },
  { word: 'smash', frequency: 840 },
  { word: 'trash', frequency: 820 },
  
  // -ellen cluster
  { word: 'vertellen', frequency: 850 },
  { word: 'tellen', frequency: 830 },
  { word: 'ellen', frequency: 810 },
  { word: 'snellen', frequency: 790 },
  { word: 'stellen', frequency: 770 },
  { word: 'bellen', frequency: 750 },
  
  // -ouwen cluster
  { word: 'vertrouwen', frequency: 840 },
  { word: 'bouwen', frequency: 820 },
  { word: 'verbouwen', frequency: 800 },
  { word: 'schouwen', frequency: 780 },
  { word: 'houwen', frequency: 760 },
  
  // -ara/-ama cluster
  { word: 'alcantara', frequency: 790 },
  { word: 'panorama', frequency: 770 },
  { word: 'drama', frequency: 750 },
  { word: 'mama', frequency: 730 },
  { word: 'karma', frequency: 710 },
  
  // -ijd/-ijt cluster
  { word: 'wedstrijd', frequency: 820 },
  { word: 'strijd', frequency: 800 },
  { word: 'tijd', frequency: 780 },
  { word: 'mijd', frequency: 760 },
  { word: 'snijd', frequency: 740 },
  { word: 'kwijt', frequency: 720 },
  
  // -eid/-eit cluster
  { word: 'nepheid', frequency: 810 },
  { word: 'waarheid', frequency: 790 },
  { word: 'heid', frequency: 770 },
  { word: 'wijd', frequency: 750 },
  
  // -at/-ad cluster  
  { word: 'zeiknat', frequency: 800 },
  { word: 'nat', frequency: 780 },
  { word: 'glad', frequency: 760 },
  { word: 'mad', frequency: 740 },
  { word: 'bad', frequency: 720 },
  { word: 'plat', frequency: 700 },
  
  // -and/-ant cluster
  { word: 'land', frequency: 820 },
  { word: 'zeikland', frequency: 800 },
  { word: 'hand', frequency: 780 },
  { word: 'brand', frequency: 760 },
  { word: 'stand', frequency: 740 },
  { word: 'kant', frequency: 720 },
  { word: 'zijkant', frequency: 700 },
  
  // -il/-ill cluster
  { word: 'bil', frequency: 790 },
  { word: 'stil', frequency: 770 },
  { word: 'mil', frequency: 750 },
  { word: 'will', frequency: 730 },
  { word: 'chill', frequency: 710 },
  { word: 'skill', frequency: 690 },
  
  // -ase/-ace cluster
  { word: 'chase', frequency: 880 },
  { word: 'race', frequency: 860 },
  { word: 'base', frequency: 840 },
  { word: 'case', frequency: 820 },
  { word: 'face', frequency: 800 },
  { word: 'place', frequency: 780 },
  { word: 'space', frequency: 760 },
  
  // -ar/-are cluster
  { word: 'car', frequency: 870 },
  { word: 'bar', frequency: 850 },
  { word: 'star', frequency: 830 },
  { word: 'far', frequency: 810 },
  { word: 'scar', frequency: 790 },
  
  // Straattaal & slang (user specific)
  { word: 'hossel', frequency: 850 },
  { word: 'gesetteld', frequency: 830 },
  { word: 'prayen', frequency: 810 },
  { word: 'securen', frequency: 790 },
  { word: 'brieven', frequency: 770 },
  { word: 'honey pak', frequency: 750 },
  { word: 'ghost rider', frequency: 730 },
  { word: 'on the road', frequency: 710 },
  { word: 'winning streak', frequency: 690 },
  { word: 'capture the flag', frequency: 670 },
  
  // Veelgebruikte user woorden
  { word: 'money', frequency: 880 },
  { word: 'cijfers', frequency: 860 },
  { word: 'figueres', frequency: 840 },
  { word: 'zorgen', frequency: 820 },
  { word: 'hoofd', frequency: 800 },
  { word: 'moeder', frequency: 780 },
  { word: 'dingen', frequency: 760 },
  { word: 'lessons', frequency: 740 },
  { word: 'pressure', frequency: 720 },
  { word: 'jongens', frequency: 700 },
  { word: 'vrouwen', frequency: 680 },
  { word: 'body', frequency: 660 },
  { word: 'regen', frequency: 640 },
  { word: 'schoenen', frequency: 620 },
  { word: 'spullen', frequency: 600 },
  { word: 'plannen', frequency: 580 },
  { word: 'dagen', frequency: 560 },
  { word: 'billen', frequency: 540 },
  { word: 'blaren', frequency: 520 },
  { word: 'getallen', frequency: 500 },
];

// Cache voor phonetische lookup
const rhymeCache = new Map<string, RhymeCandidate[]>();

/**
 * Genereert rijmsuggesties voor een woord/regel
 */
export function generateRhymes(
  line: string,
  contextLines: string[] = [],
  maxResults: number = 6
): RhymeCandidate[] {
  // Extract laatste woord
  const words = line.trim().split(/\s+/);
  if (words.length === 0) return [];
  
  const lastWord = words[words.length - 1].toLowerCase().replace(/[.,!?;:]+$/, '');
  
  // Check cache
  const cacheKey = `${lastWord}:${maxResults}`;
  if (rhymeCache.has(cacheKey)) {
    return rhymeCache.get(cacheKey) || [];
  }
  
  // Phonemize
  const phonetic = phonemize(lastWord);
  const key = extractRhymeKey(phonetic, lastWord);
  
  // Vind candidates
  const candidates = findRhymeCandidates(lastWord, key, phonetic);
  
  // Rank candidates
  const ranked = rankCandidates(candidates, lastWord, contextLines);
  
  // Take top N
  const topCandidates = ranked.slice(0, maxResults);
  
  // Cache result
  rhymeCache.set(cacheKey, topCandidates);
  
  return topCandidates;
}

/**
 * Vindt potentiële rijmpartners uit woordenlijst
 */
function findRhymeCandidates(
  word: string,
  key: string,
  _phonetic: string
): Array<{ word: string; rhymeType: RhymeType; score: number }> {
  const candidates: Array<{ word: string; rhymeType: RhymeType; score: number }> = [];
  
  for (const entry of DUTCH_WORDS) {
    const candidatePhonetic = phonemize(entry.word);
    const candidateKey = extractRhymeKey(candidatePhonetic, entry.word);
    
    // Skip identical
    if (entry.word === word) continue;
    
    // Perfect rhyme
    if (key === candidateKey) {
      candidates.push({
        word: entry.word,
        rhymeType: 'perfect',
        score: 1.0,
      });
      continue;
    }
    
    // Near rhyme (kleine afstand)
    const distance = phonemeDistance(key, candidateKey);
    if (distance <= 2) {
      candidates.push({
        word: entry.word,
        rhymeType: distance === 0 ? 'perfect' : 'multisyllabic',
        score: 1.0 - (distance * 0.2),
      });
      continue;
    }
    
    // Assonance
    if (isAssonance(word, entry.word)) {
      candidates.push({
        word: entry.word,
        rhymeType: 'assonance',
        score: 0.6,
      });
      continue;
    }
    
    // Alliteration (begin metzelfde letter)
    if (word[0] === entry.word[0]) {
      candidates.push({
        word: entry.word,
        rhymeType: 'alliteration',
        score: 0.4,
      });
    }
  }
  
  return candidates;
}

/**
 * Rank candidates op basis van context en gebruiker
 */
function rankCandidates(
  candidates: Array<{ word: string; rhymeType: RhymeType; score: number }>,
  _word: string,
  _contextLines: string[]
): RhymeCandidate[] {
  return candidates
    .map(candidate => ({
      text: candidate.word,
      rhymeType: candidate.rhymeType,
      score: candidate.score,
      meterInfo: {
        syllables: syllableCount(candidate.word),
        stressPattern: undefined,
      }
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Genereert flow-variaties voor een regel
 */
export function generateFlowVariations(line: string): string[] {
  const words = line.split(/\s+/);
  const variations: string[] = [];
  
  // Variatie 1: Harder (krachtiger woorden)
  const harder = words.map(w => {
    const hardMap: Record<string, string> = {
      'mooi': 'raw',
      'goed': 'zieke',
      'leuk': 'vet',
      'beter': 'blazend',
      'groot': 'massief',
    };
    return hardMap[w.toLowerCase()] || w;
  }).join(' ');
  if (harder !== line) variations.push(harder);
  
  // Variatie 2: Poëtischer
  const poetic = words.map(w => {
    const poeticMap: Record<string, string> = {
      'zieke': 'mysterieuze',
      'vet': 'elegante',
      'raw': 'sublieme',
      'snelle': 'zwierende',
    };
    return poeticMap[w.toLowerCase()] || w;
  }).join(' ');
  if (poetic !== line) variations.push(poetic);
  
  // Variatie 3: Wordplay
  const syllables = syllableCount(words[words.length - 1]);
  if (syllables <= 2) {
    variations.push(`${line}, blijf niet stilstaan`);
  }
  
  return variations;
}

/**
 * Analyseert flow van meerdere regels
 */
export function analyzeFlow(
  lines: string[],
  bpm: number = 90
): { syllables: number[]; suggestion: string; } {
  const syllables = lines.map(line => {
    return line.split(/\s+/).reduce((sum, word) => sum + syllableCount(word), 0);
  });
  
  // Bij 90 BPM: ~16 syllabes per 2 takten (4 beats)
  const target = (bpm / 90) * 16;
  const avg = syllables.reduce((a, b) => a + b, 0) / syllables.length;
  
  let suggestion = '';
  if (avg > target * 1.2) {
    suggestion = 'Regels zijn te lang. Knip hier en daar woorden weg voor betere flow.';
  } else if (avg < target * 0.8) {
    suggestion = 'Je kunt meer toevoegen. Voeg pauzes of adlibs toe (ey, uh, ja).';
  } else {
    suggestion = 'Flow staat goed!';
  }
  
  return { syllables, suggestion };
}

