import { useEffect } from 'react';
import './CaseStudyModal.css';

export default function CaseStudyModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="case-study-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="case-study-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="case-study-top">
          <div className="case-study-meta">
            <span className="case-study-status">{project.status}</span>
            <span className="case-study-dot">•</span>
            <span className="case-study-context">{project.context}</span>
          </div>
          <button type="button" className="case-study-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Title */}
        <h2 className="case-study-title">{project.title}</h2>
        <p className="case-study-subtitle">{project.subtitle}</p>

        {/* Overview */}
        <div className="case-study-section">
          <span className="case-study-heading">SYSTEM OVERVIEW</span>
          <p className="case-study-text">{project.overview}</p>
        </div>

        {/* Workflow */}
        <div className="case-study-section">
          <span className="case-study-heading">CORE WORKFLOW & PARADIGM</span>
          <div className="case-study-workflow">
            {project.workflow.map((step, i) => (
              <div key={i} className="workflow-step">
                <span className="workflow-step-num">{`0${i + 1}`}</span>
                <p className="workflow-step-text">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tags & Actions */}
        <div className="case-study-footer">
          <div className="case-study-tags">
            {project.tags.map((tag, i) => (
              <span key={i} className="case-study-tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="case-study-actions">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="case-study-github-btn"
              >
                <span>GITHUB REPO</span>
                <span>↗</span>
              </a>
            )}
            <button type="button" className="case-study-done-btn" onClick={onClose}>
              RETURN TO SHOWCASE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

