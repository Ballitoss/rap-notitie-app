import { create } from 'zustand';
import { UserProject, Feedback, RhymeCandidate } from '../types';

interface AppState {
  // Project management
  projects: UserProject[];
  currentProject: UserProject | null;
  
  // Editor state
  lines: string[];
  currentLine: number;
  bpm: number;
  
  // AI suggestions
  currentSuggestions: RhymeCandidate[];
  selectedSuggestion: number;
  
  // Slang & feedback
  pendingSlang: string | null;
  feedbackHistory: Feedback[];
  
  // Actions
  createProject: (name: string) => void;
  selectProject: (id: string) => void;
  updateLines: (lines: string[]) => void;
  addLine: () => void;
  updateLine: (index: number, text: string) => void;
  deleteLine: (index: number) => void;
  
  setSuggestions: (candidates: RhymeCandidate[]) => void;
  selectSuggestion: (index: number) => void;
  applySuggestion: (text: string) => void;
  
  setPendingSlang: (word: string | null) => void;
  addFeedback: (feedback: Feedback) => void;
  
  exportProject: (format: 'txt' | 'pdf') => void;
  
  // Helper methods
  saveProject: () => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  setCurrentLine: (index: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  projects: [],
  currentProject: null,
  lines: [''],
  currentLine: 0,
  bpm: 90,
  currentSuggestions: [],
  selectedSuggestion: 0,
  pendingSlang: null,
  feedbackHistory: [],
  
  // Actions
  createProject: (name: string) => {
    const newProject: UserProject = {
      id: Date.now().toString(),
      name,
      lines: [''],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    set(state => ({
      projects: [...state.projects, newProject],
      currentProject: newProject,
      lines: [''],
      currentLine: 0,
    }));
    
    get().saveToLocalStorage();
  },
  
  selectProject: (id: string) => {
    const project = get().projects.find(p => p.id === id);
    if (project) {
      set({
        currentProject: project,
        lines: project.lines,
        currentLine: 0,
      });
    }
  },
  
  updateLines: (lines: string[]) => {
    set({ lines });
    get().saveProject();
  },
  
  addLine: () => {
    const lines = [...get().lines, ''];
    set({ lines });
    get().saveProject();
  },
  
  updateLine: (index: number, text: string) => {
    const lines = [...get().lines];
    lines[index] = text;
    set({ lines });
    get().saveProject();
  },
  
  deleteLine: (index: number) => {
    const lines = get().lines.filter((_, i) => i !== index);
    set({ lines });
    get().saveProject();
  },
  
  setSuggestions: (candidates: RhymeCandidate[]) => {
    set({ currentSuggestions: candidates, selectedSuggestion: 0 });
  },
  
  selectSuggestion: (index: number) => {
    set({ selectedSuggestion: index });
  },
  
  applySuggestion: (text: string) => {
    const { lines, currentLine } = get();
    const updated = [...lines];
    updated[currentLine] = text;
    set({ lines: updated });
    get().saveProject();
  },
  
  setPendingSlang: (word: string | null) => {
    set({ pendingSlang: word });
  },
  
  addFeedback: (feedback: Feedback) => {
    set(state => ({
      feedbackHistory: [...state.feedbackHistory, feedback],
    }));
  },
  
  exportProject: (format: 'txt' | 'pdf') => {
    const { lines, currentProject } = get();
    const content = lines.join('\n');
    
    if (format === 'txt') {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProject?.name || 'rap'}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // PDF export (vereenvoudigd - in productie: gebruik jsPDF)
      alert('PDF export komt in v1.0');
    }
  },
  
  setCurrentLine: (index: number) => {
    set({ currentLine: index });
  },
  
  // Helper: save current project
  saveProject: () => {
    const { currentProject, lines } = get();
    if (!currentProject) return;
    
    currentProject.lines = lines;
    currentProject.updatedAt = Date.now();
    
    set(state => ({
      projects: state.projects.map(p =>
        p.id === currentProject.id ? currentProject : p
      ),
    }));
    
    get().saveToLocalStorage();
  },
  
  // Helper: save to localStorage
  saveToLocalStorage: () => {
    try {
      const { projects } = get();
      localStorage.setItem('rap_app_projects', JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  },
  
  // Load from localStorage
  loadFromLocalStorage: () => {
    try {
      const saved = localStorage.getItem('rap_app_projects');
      if (saved) {
        const projects = JSON.parse(saved) as UserProject[];
        set({ projects });
        if (projects.length > 0) {
          set({ currentProject: projects[0], lines: projects[0].lines });
        }
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
  },
}));

// Load on init
if (typeof window !== 'undefined') {
  useAppStore.getState().loadFromLocalStorage();
}

