import { useState } from 'react';
import { useAppStore } from './store/appStore';
import { Editor } from './components/Editor';
import { SuggestionPanel } from './components/SuggestionPanel';
import { SlangDialog } from './components/SlangDialog';
import { ProjectList } from './components/ProjectList';
import { Menu, Plus, Download } from 'lucide-react';
import './App.css';

function App() {
  const [showProjects, setShowProjects] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentProject, createProject, exportProject } = useAppStore();

  const handleCreateProject = () => {
    const name = prompt('Project naam:');
    if (name) {
      createProject(name);
      setShowProjects(false);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button className="icon-button" onClick={() => setShowProjects(!showProjects)}>
            <Menu size={20} />
          </button>
          <h1 className="app-title">Rap Notitie</h1>
          {currentProject && (
            <span className="project-name">{currentProject.name}</span>
          )}
        </div>
        <div className="header-right">
          <button
            className="icon-button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle suggestions"
          >
            →
          </button>
          {currentProject && (
            <button
              className="icon-button"
              onClick={() => exportProject('txt')}
              title="Export as TXT"
            >
              <Download size={18} />
            </button>
          )}
          <button className="primary-button" onClick={handleCreateProject}>
            <Plus size={16} />
            Nieuw
          </button>
        </div>
      </header>

      {/* Project List Sidebar */}
      {showProjects && (
        <ProjectList onClose={() => setShowProjects(false)} />
      )}

      {/* Main Content */}
      <div className="main-content">
        <div className={`editor-container ${sidebarOpen ? 'with-sidebar' : ''}`}>
          <Editor onSuggestionOpen={setSidebarOpen} />
          
          {/* Right Sidebar - Suggestions */}
          {sidebarOpen && <SuggestionPanel />}
        </div>
      </div>

      {/* Slang Dialog */}
      <SlangDialog />
    </div>
  );
}

export default App;

