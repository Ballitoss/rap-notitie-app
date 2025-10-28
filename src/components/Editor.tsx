import { useRef, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { generateRhymes } from '../services/rhymeEngine';
import { detectSlang } from '../services/slangDB';
import { Trash2, Plus } from 'lucide-react';
import './Editor.css';

interface EditorProps {
  onSuggestionOpen?: (open: boolean) => void;
}

export function Editor({ onSuggestionOpen }: EditorProps) {
  const {
    lines,
    currentLine,
    updateLine,
    addLine,
    deleteLine,
    setSuggestions,
    setCurrentLine,
  } = useAppStore();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Suppress unused warning
  if (onSuggestionOpen) { /* used for future implementation */ }

  useEffect(() => {
    // Generate suggestions when line changes
    const currentText = lines[currentLine] || '';
    if (currentText.length > 0) {
      const candidates = generateRhymes(currentText, []);
      setSuggestions(candidates);
      
      // Detect slang
      const words = currentText.split(/\s+/);
      for (const word of words) {
        const cleanWord = word.toLowerCase().replace(/[.,!?;:]+$/, '');
        if (cleanWord.length > 2) {
          const result = detectSlang(cleanWord);
          if (result.isSlang && result.confidence < 0.5) {
            useAppStore.getState().setPendingSlang(cleanWord);
          }
        }
      }
    } else {
      setSuggestions([]);
    }
  }, [lines[currentLine], currentLine, setSuggestions]);

  const handleChange = (index: number, value: string) => {
    updateLine(index, value);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addLine();
      setCurrentLine(index + 1);
      
      // Focus next line
      setTimeout(() => {
        const nextTextarea = document.querySelectorAll('textarea')[index + 1];
        nextTextarea?.focus();
      }, 0);
    }
    
    if (e.key === 'Backspace' && lines[index] === '' && lines.length > 1) {
      e.preventDefault();
      deleteLine(index);
      setCurrentLine(Math.max(0, index - 1));
    }
  };

  const handleSelect = (index: number) => {
    setCurrentLine(index);
    const textarea = document.querySelectorAll('textarea')[index];
    textarea?.focus();
  };

  return (
    <div className="editor">
      <div className="editor-header">
        <h2>Tekst</h2>
        <div className="editor-stats">
          <span>{lines.length} regels</span>
        </div>
      </div>

      <div className="editor-lines">
        {lines.map((line, index) => (
          <div key={index} className={`line-item ${currentLine === index ? 'active' : ''}`}>
            <div className="line-number" onClick={() => handleSelect(index)}>
              {index + 1}
            </div>
            <textarea
              ref={index === currentLine ? textareaRef : null}
              className="line-input"
              value={line}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onClick={() => handleSelect(index)}
              placeholder="Type je regel hier..."
              rows={1}
            />
            {lines.length > 1 && (
              <button
                className="icon-button small"
                onClick={() => deleteLine(index)}
                title="Verwijder regel"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}

        <button className="add-line-button" onClick={addLine}>
          <Plus size={16} />
          Regel toevoegen
        </button>
      </div>
    </div>
  );
}


