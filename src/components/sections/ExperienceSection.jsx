import { useState, useRef } from 'react';
import SectionHeader from '../common/SectionHeader';
import { experienceRoles } from '../../data/portfolioData';
import { useViewportPresence } from '../../hooks/useViewportActivation';
import './ExperienceSection.css';

const ROLE_LOGOS = {
  hintro: {
    src: encodeURI('/Screenshot 2026-11-11 012336.png'),
    alt: 'Hintro AI logo',
    cover: false,
  },
  'student-stack': {
    src: encodeURI('/Screenshot 2026-11-11 012554.png'),
    alt: 'Blogger The Student Stack logo',
    cover: true,
  },
  yrc: {
    src: encodeURI('/Screenshot 2026-11-11 012806.png'),
    alt: 'Youth Red Cross REC logo',
    cover: false,
  },
  'elite-coders': {
    src: encodeURI('/Screenshot 2026-11-11 012657.png'),
    alt: 'Elite Coders Summer of Code logo',
    cover: false,
  },
};

export default function ExperienceSection() {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const sectionRef = useRef(null);
  const { hasEntered } = useViewportPresence(sectionRef, { threshold: 0.08 });

  return (
    <section
      id="experience"
      ref={sectionRef}
      className={`scarlet-section experience-section ${hasEntered ? 'is-entered' : ''}`}
      aria-label="Experience and Leadership"
    >
      <div className="section-container">
        <SectionHeader
          number="05"
          label="ROLES & IMPACT"
          title="COMMUNITY & LEADERSHIP"
          subtitle="Direct contributions to peer learning, student engagement, and open developer ecosystems."
        />

        <div className="experience-interactive-spread">
          {/* Roles Selector Column: Uniform Left-Aligned Emblems */}
          <div className="experience-selector-col">
            {experienceRoles.map((exp, idx) => {
              const isSelected = selectedRoleIndex === idx;
              const logo = ROLE_LOGOS[exp.id];
              return (
                <button
                  key={exp.id}
                  type="button"
                  className={`role-select-item interactive-target ${isSelected ? 'selected' : ''}`}
                  style={{ '--exp-delay': `${0.12 + idx * 0.09}s` }}
                  onClick={() => setSelectedRoleIndex(idx)}
                >
                  {logo && (
                    <div className={`role-logo-frame ${logo.cover ? 'is-cover' : ''}`}>
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        loading="lazy"
                        decoding="async"
                        className="role-logo-img"
                      />
                    </div>
                  )}

                  <div className="role-select-content">
                    <div className="role-meta-top">
                      <span className="role-index-tag">{`0${idx + 1}`}</span>
                      <span className="role-badge-pill">{exp.badge}</span>
                    </div>
                    <h4 className="role-item-title">{exp.role}</h4>
                    <span className="role-item-org">{exp.organization}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Role Detailed Spotlight */}
          {(() => {
            const current = experienceRoles[selectedRoleIndex];
            const activeLogo = ROLE_LOGOS[current.id];
            return (
              <div className="experience-spotlight-pane interactive-target">
                <div className="spotlight-header">
                  <div>
                    <span className="spotlight-program">{current.program}</span>
                    <h3 className="spotlight-role-title">{current.role}</h3>
                    <span className="spotlight-org-name">{current.organization}</span>
                  </div>
                  <div className="spotlight-header-right">
                    {activeLogo && (
                      <div className={`spotlight-logo-frame ${activeLogo.cover ? 'is-cover' : ''}`}>
                        <img
                          src={activeLogo.src}
                          alt={activeLogo.alt}
                          decoding="async"
                          className="spotlight-logo-img"
                        />
                      </div>
                    )}
                    {current.link && (
                      <a
                        href={current.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="spotlight-ext-link interactive-target"
                      >
                        <span>VISIT PUBLICATION</span>
                        <span className="ext-arrow">↗</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="spotlight-body">
                  <span className="spotlight-deliverables-heading">VERIFIED RESPONSIBILITIES & OUTCOMES:</span>
                  <div className="spotlight-points-list">
                    {current.details.map((point, pIdx) => (
                      <div key={pIdx} className="spotlight-point-row">
                        <span className="spotlight-point-bullet">✦</span>
                        <p className="spotlight-point-text">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="spotlight-footer-note">
                  <span className="spotlight-verified-tag">FACTUALLY VERIFIED RESPONSIBILITIES</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
}

