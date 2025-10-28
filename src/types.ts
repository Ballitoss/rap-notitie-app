export interface RhymeCandidate {
  text: string;
  rhymeType: 'perfect' | 'assonance' | 'alliteration' | 'multisyllabic';
  score: number;
  meterInfo: {
    syllables: number;
    stressPattern?: string;
  };
}

export interface FlowAnalysis {
  syllables: number;
  stressPattern: string[];
  bpmAlignment: number; // 0-1 score
  suggestion?: string;
}

export interface SlangTerm {
  term: string;
  meaning: string;
  region?: string;
  examples: string[];
  addedBy?: string;
  confidence: number;
}

export interface Feedback {
  suggestionId: string;
  label: 'fire' | 'accurate' | 'not-my-style' | 'wrong';
  timestamp: number;
}

export interface UserProject {
  id: string;
  name: string;
  lines: string[];
  createdAt: number;
  updatedAt: number;
}

export interface StyleProfile {
  userId: string;
  avgSyllables: number;
  multiRate: number;
  alliterationRate: number;
  sentiment: 'hard' | 'poetic' | 'storytelling' | 'punchy';
}

export type RhymeType = 'perfect' | 'assonance' | 'alliteration' | 'multisyllabic';

