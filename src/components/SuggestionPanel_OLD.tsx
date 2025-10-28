import { useAppStore } from '../store/appStore';
import { analyzeFlow } from '../services/rhymeEngine';
import { Check, X, TrendingUp } from 'lucide-react';
import './SuggestionPanel.css';

export function SuggestionPanel() {
  const {
    currentSuggestions,
    selectedSuggestion,
    lines,
    currentLine,
    applySuggestion,
    bpm,
  } = useAppStore();

  const handleAccept = (text: string) => {
    const currentText = lines[currentLine];
    applySuggestion(currentText + ' ' + text);
  };

  const handleFeedback = (index: number, label: 'fire' | 'accurate' | 'not-my-style') => {
    useAppStore.getState().addFeedback({
      suggestionId: `${currentLine}-${index}`,
      label,
      timestamp: Date.now(),
    });
  };

  // Flow analysis
  const flowAnalysis = analyzeFlow(lines.filter(l => l.trim().length > 0), bpm);

  return (
    <div className="suggestion-panel">
      {/* Rhyme Suggestions */}
      <div className="panel-section">
        <h3 className="section-title">
          <span className="icon">🎯</span>
          Rijm Suggesties
        </h3>
        
        {currentSuggestions.length > 0 ? (
          <div className="suggestions-list">
            {currentSuggestions.map((candidate, index) => (
              <div
                key={index}
                className={`suggestion-item ${selectedSuggestion === index ? 'selected' : ''}`}
                onClick={() => handleAccept(candidate.text)}
              >
                <div className="suggestion-content">
                  <span className="suggestion-text">{candidate.text}</span>
                  <span className={`suggestion-type ${candidate.rhymeType}`}>
                    {candidate.rhymeType === 'perfect' && '🟢'}
                    {candidate.rhymeType === 'assonance' && '🟡'}
                    {candidate.rhymeType === 'alliteration' && '🔵'}
                    {candidate.rhymeType === 'multisyllabic' && '🟣'}
                  </span>
                </div>
                <div className="suggestion-actions">
                  <button
                    className="feedback-button positive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFeedback(index, 'fire');
                    }}
                    title="🔥 Fire"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    className="feedback-button negative"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFeedback(index, 'not-my-style');
                    }}
                    title="Not my style"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">Type een regel voor rijmsuggesties...</p>
        )}
      </div>

      {/* Flow Analysis */}
      {flowAnalysis.syllables.length > 0 && (
        <div className="panel-section">
          <h3 className="section-title">
            <span className="icon">📊</span>
            Flow Analyse
          </h3>
          <div className="flow-info">
            <div className="flow-stats">
              {flowAnalysis.syllables.map((syl, i) => (
                <div key={i} className="flow-bar">
                  <span className="bar-value">{syl}</span>
                  <div
                    className="bar-fill"
                    style={{ width: `${(syl / 20) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <p className="flow-suggestion">
              <TrendingUp size={14} />
              {flowAnalysis.suggestion}
            </p>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts */}
      <div className="panel-section shortcuts">
        <h3 className="section-title">⌨️ Shortcuts</h3>
        <div className="shortcuts-list">
          <div className="shortcut-item">
            <kbd>Enter</kbd> Nieuwe regel
          </div>
          <div className="shortcut-item">
            <kbd>↑</kbd><kbd>↓</kbd> Selecteer suggestie
          </div>
          <div className="shortcut-item">
            <kbd>↵</kbd> Accepteer
          </div>
        </div>
      </div>
    </div>
  );
}

