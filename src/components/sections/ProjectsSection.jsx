import { useState, useRef } from 'react';
import SectionHeader from '../common/SectionHeader';
import CaseStudyModal from '../common/CaseStudyModal';
import { projects } from '../../data/portfolioData';
import { useViewportPresence } from '../../hooks/useViewportActivation';
import './ProjectsSection.css';

export default function ProjectsSection() {
  const [activeProjectModal, setActiveProjectModal] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const { hasEntered } = useViewportPresence(sectionRef, { threshold: 0.08 });

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`scarlet-section projects-section ${hasEntered ? 'is-entered' : ''}`}
      aria-label="Selected Projects"
    >
      <div className="section-container">
        <SectionHeader
          number="04"
          label="WORKS & INITIATIVES"
          title="PURPOSEFUL PLATFORMS"
          subtitle="Architected concepts and software projects built to solve tangible problems."
        />

        {/* Project Selector Bar */}
        <div className="project-index-tabs">
          {projects.map((proj, idx) => (
            <button
              key={proj.id}
              type="button"
              className={`project-tab-btn interactive-target ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
            >
              <span className="tab-num">{`0${idx + 1}`}</span>
              <span className="tab-title">{proj.title}</span>
            </button>
          ))}
        </div>

        {/* Active Project Hero Card (Horizontal Showcase) */}
        {(() => {
          const current = projects[activeIndex];
          return (
            <article className="project-horizontal-showcase interactive-target">
              <div className="showcase-content-pane">
                <div className="showcase-meta-row">
                  <span className={`showcase-status ${current.status === 'IN PROGRESS' ? 'in-progress' : ''}`}>
                    {current.status}
                  </span>
                  <span className="showcase-context">{current.context}</span>
                  {current.problemId && <span className="showcase-prob-id">{current.problemId}</span>}
                </div>

                <h3 className="showcase-title">{current.title}</h3>
                <p className="showcase-subtitle">{current.subtitle}</p>
                <p className="showcase-overview">{current.overview}</p>

                {/* Tags */}
                <div className="showcase-tag-pills">
                  {current.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="showcase-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Case Study & Source Action Row */}
                <div className="showcase-action-row">
                  <button
                    type="button"
                    className="case-study-trigger-btn interactive-target"
                    onClick={() => setActiveProjectModal(current)}
                  >
                    <span>VIEW CASE STUDY & WORKFLOW</span>
                    <span className="btn-icon-arrow">↗</span>
                  </button>
                  {current.githubUrl && (
                    <a
                      href={current.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-github-btn interactive-target"
                      aria-label={`View ${current.title} repository on GitHub`}
                    >
                      <span>GITHUB REPOSITORY</span>
                      <span className="btn-icon-arrow">↗</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Visual Showcase Frame */}
              <div
                className="showcase-visual-pane interactive-target"
                onClick={() => setActiveProjectModal(current)}
              >
                <div className="visual-halo-glow" />
                {current.image ? (
                  <img
                    src={encodeURI(current.image)}
                    alt={`${current.title} project preview`}
                    className="showcase-project-photo"
                  />
                ) : (
                  <span className="visual-watermark-text">{current.title}</span>
                )}
                <div className="visual-overlay-info">
                  <span className="visual-expand-tag">CLICK FOR CASE STUDY ↗</span>
                </div>
              </div>
            </article>
          );
        })()}

        {/* All Projects Editorial Grid Preview */}
        <div className="projects-grid-directory">
          {projects.map((proj, idx) => (
            <div
              key={proj.id}
              className={`project-grid-thumb interactive-target ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
            >
              <span className="thumb-idx">{`0${idx + 1}`}</span>
              <h4 className="thumb-name">{proj.title}</h4>
              <span className="thumb-status">{proj.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Detail Modal */}
      {activeProjectModal && (
        <CaseStudyModal
          project={activeProjectModal}
          onClose={() => setActiveProjectModal(null)}
        />
      )}
    </section>
  );
}

