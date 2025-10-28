import { useAppStore } from '../store/appStore';
import { X, FileText } from 'lucide-react';
import './ProjectList.css';

interface ProjectListProps {
  onClose: () => void;
}

export function ProjectList({ onClose }: ProjectListProps) {
  const { projects, selectProject, currentProject } = useAppStore();

  return (
    <div className="project-list-overlay">
      <div className="project-list">
        <div className="project-list-header">
          <h2>Projecten</h2>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="projects-container">
          {projects.length === 0 ? (
            <div className="empty-projects">
              <FileText size={48} />
              <p>Geen projecten nog</p>
              <p className="hint">Klik op "Nieuw" om te beginnen</p>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className={`project-card ${currentProject?.id === project.id ? 'active' : ''}`}
                onClick={() => {
                  selectProject(project.id);
                  onClose();
                }}
              >
                <div className="project-icon">
                  <FileText size={20} />
                </div>
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <p className="project-meta">
                    {project.lines.filter(l => l.trim()).length} regels
                    {' · '}
                    {new Date(project.updatedAt).toLocaleDateString('nl-NL')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

