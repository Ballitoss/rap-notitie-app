import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { addSlangTerm } from '../services/slangDB';
import { SlangTerm } from '../types';
import { X, Save } from 'lucide-react';
import './SlangDialog.css';

export function SlangDialog() {
  const { pendingSlang, setPendingSlang } = useAppStore();
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [region, setRegion] = useState('NL');

  const handleSave = () => {
    if (!pendingSlang || !meaning) return;

    const term: SlangTerm = {
      term: pendingSlang,
      meaning,
      region,
      examples: example ? [example] : [],
      confidence: 0.8,
    };

    addSlangTerm(term);
    setPendingSlang(null);
    setMeaning('');
    setExample('');
    setRegion('NL');
  };

  const handleCancel = () => {
    setPendingSlang(null);
    setMeaning('');
    setExample('');
  };

  if (!pendingSlang) return null;

  return (
    <div className="slang-dialog-overlay">
      <div className="slang-dialog">
        <div className="slang-header">
          <div className="slang-title">
            <span className="icon">⚠️</span>
            <div>
              <h3>Nieuw woord gedetecteerd</h3>
              <p className="word-display">"{pendingSlang}"</p>
            </div>
          </div>
          <button className="icon-button" onClick={handleCancel}>
            <X size={18} />
          </button>
        </div>

        <div className="slang-form">
          <div className="form-group">
            <label>Betekenis</label>
            <input
              type="text"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="Wat betekent dit woord?"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Voorbeeldzin (optioneel)</label>
            <input
              type="text"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              placeholder="Bv: 'Dat is echt zieke muziek'"
            />
          </div>

          <div className="form-group">
            <label>Regio</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="NL">Nederland</option>
              <option value="NL-U">Utrecht</option>
              <option value="NL-A">Amsterdam</option>
              <option value="NL-R">Rotterdam</option>
              <option value="BE">België</option>
              <option value="SUR">Surinaams</option>
            </select>
          </div>

          <div className="form-actions">
            <button className="secondary-button" onClick={handleCancel}>
              Skip
            </button>
            <button className="primary-button" onClick={handleSave} disabled={!meaning}>
              <Save size={16} />
              Opslaan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

