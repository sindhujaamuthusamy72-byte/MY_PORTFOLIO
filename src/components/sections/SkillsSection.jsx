import { useState, useRef } from 'react';
import SectionHeader from '../common/SectionHeader';
import { skillCategories } from '../../data/portfolioData';
import { useScrollVideoLifecycle } from '../../hooks/useViewportActivation';
import './SkillsSection.css';

const HAND_ORB_VIDEO_SRC = '/videos/Hand_holding_crimson_digital_orb_82f1da98_1080p.mp4';

/* Symmetrical 5-point orbital layout coordinates around the center hand & orb */
const ORBIT_SLOTS = [
  { key: 'apex', dotSide: 'bottom', lineEnd: [600, 128], lineStart: [600, 86] },
  { key: 'upper-left', dotSide: 'right', lineEnd: [418, 224], lineStart: [318, 178] },
  { key: 'upper-right', dotSide: 'left', lineEnd: [782, 224], lineStart: [882, 178] },
  { key: 'lower-left', dotSide: 'right', lineEnd: [432, 336], lineStart: [324, 378] },
  { key: 'lower-right', dotSide: 'left', lineEnd: [768, 336], lineStart: [876, 378] },
];

export default function SkillsSection() {
  const [activeDomainIndex, setActiveDomainIndex] = useState(0);
  const sectionRef = useRef(null);
  const orbVideoRef = useRef(null);

  const { hasEntered } = useScrollVideoLifecycle({
    sectionRef,
    videoRef: orbVideoRef,
    threshold: 0.14,
    offscreenMargin: '220px 0px 220px 0px',
    reducedMotionSeekOffsetFromEnd: 0.15,
  });

  const activeCategory = skillCategories[activeDomainIndex] || skillCategories[0];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={`scarlet-section skills-section ${hasEntered ? 'is-entered' : ''}`}
      aria-label="Skills & Technologies"
    >
      <div className="section-container">
        <SectionHeader
          number="06"
          label="TOOLKIT & CAPABILITIES"
          title="HONEST COMPETENCIES"
          subtitle="Organised strictly by domain knowledge without artificial percentage bars or exaggerated claims."
        />

        {/* CENTERPIECE INTERACTIVE CONSTELLATION */}
        <div className="skills-constellation-stage">
          <div className="constellation-hint-bar">
            <span className="constellation-hint-dot" aria-hidden="true" />
            <span>SELECT AN ORBITING DOMAIN TO EXPLORE ITS COMPETENCIES</span>
          </div>

          <div className="constellation-orbit-canvas">
            {/* Fine Orbital Rings & Constellation Connecting Lines (Desktop) */}
            <svg
              className="constellation-orbit-svg"
              viewBox="0 0 1200 540"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Concentric subtle orbital paths framing the hand & orb */}
              <ellipse
                cx="600"
                cy="274"
                rx="225"
                ry="168"
                className="orbit-ring orbit-ring--inner"
              />
              <ellipse
                cx="600"
                cy="274"
                rx="295"
                ry="210"
                className="orbit-ring orbit-ring--outer"
              />

              {/* Meridian line linking orb center down toward active domain showcase */}
              <line x1="600" y1="484" x2="600" y2="540" className="orbit-meridian-stem" />

              {/* Constellation radial connectors from orbital ring toward each of the 5 domains */}
              {ORBIT_SLOTS.map((slot, idx) => {
                const isSelected = activeDomainIndex === idx;
                return (
                  <g
                    key={slot.key}
                    className={`orbit-connector-group ${isSelected ? 'is-active' : ''}`}
                  >
                    <line
                      x1={slot.lineEnd[0]}
                      y1={slot.lineEnd[1]}
                      x2={slot.lineStart[0]}
                      y2={slot.lineStart[1]}
                      className="orbit-connector-line"
                    />
                    <circle
                      cx={slot.lineEnd[0]}
                      cy={slot.lineEnd[1]}
                      r={isSelected ? '4.5' : '3'}
                      className="orbit-ring-anchor-dot"
                    />
                  </g>
                );
              })}
            </svg>

            {/* CENTRAL VISUAL FOCAL POINT: Dominant Engraved Hand & Crimson Digital Orb */}
            <div className="constellation-centerpiece" aria-hidden="true">
              <div className="skills-orb-ambient-glow" />
              <div className="skills-orb-media-frame">
                <video
                  ref={orbVideoRef}
                  src={HAND_ORB_VIDEO_SRC}
                  muted
                  playsInline
                  preload="auto"
                  className="skills-orb-video"
                />
              </div>
            </div>

            {/* FIVE ORBITING SKILL DOMAIN NODES */}
            <div className="constellation-nodes-layer" role="tablist" aria-label="Skill Domains">
              {skillCategories.map((cat, idx) => {
                const slot = ORBIT_SLOTS[idx] || ORBIT_SLOTS[0];
                const isActive = activeDomainIndex === idx;
                return (
                  <button
                    key={cat.title}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="skills-domain-showcase-panel"
                    id={`domain-tab-${idx}`}
                    className={`constellation-domain-node slot-${slot.key} dot-${slot.dotSide} interactive-target ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveDomainIndex(idx)}
                  >
                    <span className="node-beacon-dot" aria-hidden="true" />
                    <span className="node-label-group">
                      <span className="node-index">{`0${idx + 1} // ${cat.skills.length} ${cat.skills.length === 1 ? 'SKILL' : 'SKILLS'}`}</span>
                      <span className="node-title">{cat.title}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PROMINENT SELECTED-DOMAIN SKILL SHOWCASE */}
          <div
            id="skills-domain-showcase-panel"
            role="tabpanel"
            aria-labelledby={`domain-tab-${activeDomainIndex}`}
            key={activeDomainIndex}
            className="domain-showcase-panel"
          >
            <div className="domain-showcase-header">
              <span className="domain-showcase-eyebrow">
                {`DOMAIN 0${activeDomainIndex + 1} // ACTIVE COMPETENCY CLUSTER`}
              </span>
              <h3 className="domain-showcase-title">{activeCategory.title}</h3>
            </div>

            <div
              className={`domain-skills-display ${activeCategory.skills.length % 2 === 1 && activeCategory.skills.length > 3 ? 'cols-balanced-odd' : 'cols-two'}`}
            >
              {activeCategory.skills.map((skill, sIdx) => {
                const isExploring = skill.includes('(Exploring)');
                const cleanName = isExploring
                  ? skill.replace(/\s*\(Exploring\)\s*/i, '').trim()
                  : skill;
                return (
                  <div
                    key={skill}
                    className={`domain-skill-item ${isExploring ? 'is-exploring' : ''}`}
                    style={{ '--skill-stagger': `${sIdx * 0.055}s` }}
                  >
                    <div className="domain-skill-meta-row">
                      <span className="domain-skill-num">{`0${sIdx + 1}`}</span>
                      <span className="domain-skill-pulse" aria-hidden="true" />
                      {isExploring && <span className="domain-skill-status">EXPLORING</span>}
                    </div>
                    <span className="domain-skill-name">{cleanName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Continuous Crimson Signature Ribbon */}
        <div
          className="skills-signature-marquee"
          role="marquee"
          aria-label="Sindhuja Muthusamy"
        >
          <div className="skills-signature-aura" aria-hidden="true" />
          <div className="skills-marquee-viewport">
            <div className="skills-marquee-track">
              {[0, 1].map((groupIdx) => (
                <div
                  key={groupIdx}
                  className="skills-marquee-group"
                  aria-hidden={groupIdx === 1}
                >
                  {[0, 1, 2, 3].map((itemIdx) => (
                    <span key={itemIdx} className="skills-marquee-item">
                      <span className="skills-marquee-name">SINDHUJA MUTHUSAMY</span>
                      <span className="skills-marquee-spark" aria-hidden="true">✦</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
