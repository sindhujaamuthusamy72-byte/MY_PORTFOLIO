import { useState, useRef } from 'react';
import SectionHeader from '../common/SectionHeader';
import { personalInfo } from '../../data/portfolioData';
import { useScrollVideoLifecycle } from '../../hooks/useViewportActivation';
import './AboutSection.css';

const ROSE_VIDEO_SRC = '/videos/Crimson_rose_in_breeze_0cad1e0b_1080p.mp4';

export default function AboutSection() {
  const sectionRef = useRef(null);
  const roseVideoRef = useRef(null);
  const [isRoseExpanded, setIsRoseExpanded] = useState(false);

  const {
    hasEntered,
    prefersReducedMotion,
    isVideoReady,
    hasEnded,
    hasError,
  } = useScrollVideoLifecycle({
    sectionRef,
    videoRef: roseVideoRef,
    threshold: 0.12,
    offscreenMargin: '220px 0px 220px 0px',
    reducedMotionSeekOffsetFromEnd: 0.12,
    onEndedComplete: () => {
      setIsRoseExpanded(true);
    },
  });

  const isGiantDiagonal = prefersReducedMotion || hasEnded || hasError || isRoseExpanded;

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`scarlet-section about-section ${hasEntered ? 'is-entered' : ''} ${
        isGiantDiagonal ? 'is-rose-diagonal-bg' : ''
      }`}
      aria-label="About Me"
    >
      {/* FULL-SECTION BACKGROUND ROSE CANVAS: Plays complete upright video -> expands into enormous permanent diagonal stroke behind everything */}
      <div className="about-rose-bg-canvas" aria-hidden="true">
        <div className="about-rose-sticky-viewport">
          <div className="about-rose-ambient-glow" />
          <div
            className={`about-rose-transform-carrier ${
              isVideoReady || hasEntered || hasError ? 'is-visible' : ''
            } ${isGiantDiagonal ? 'is-giant-diagonal' : ''}`}
          >
            <div className="about-rose-video-shell">
              <video
                ref={roseVideoRef}
                className="about-rose-video"
                src={ROSE_VIDEO_SRC}
                muted
                playsInline
                preload="auto"
              />
            </div>
          </div>
          <div className="about-rose-section-vignette" />
        </div>
      </div>

      {/* FOREGROUND CONTENT (Preserves existing Portrait left + Bio/Cards right cleanly in front) */}
      <div className="section-container about-content-shell">
        <SectionHeader
          number="01"
          label="IDENTITY & ARCHITECTURE"
          title={
            <>
              I FUSE LOGIC WITH{' '}
              <span className="about-elegance-cursive">Elegance.</span>
            </>
          }
          subtitle="Grounded in fundamentals, motivated by engineering rigor, and focused on building intentional digital experiences."
        />

        <div className="about-editorial-spread">
          {/* Left: Existing Profile Photograph */}
          <div className="about-portrait-column">
            <div className="portrait-frame-wrap interactive-target">
              <div className="portrait-glow-halo" aria-hidden="true" />
              <div className="portrait-image-container">
                <img
                  src={personalInfo.portrait}
                  alt="Sindhuja Muthusamy profile in dramatic crimson rim light"
                  className="portrait-image"
                  loading="lazy"
                />
              </div>
              <div className="portrait-corner-bracket top-left" />
              <div className="portrait-corner-bracket bottom-right" />
              <div className="portrait-caption">
                <span className="caption-tag">SINDHUJA MUTHUSAMY</span>
                <span className="caption-sub">RAJALAKSHMI ENGINEERING COLLEGE • CSE</span>
              </div>
            </div>
          </div>

          {/* Right: Personal Narrative & Three Highlight Cards */}
          <div className="about-content-column">
            <div className="about-narrative-block">
              {personalInfo.bio.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="about-lead-paragraph about-stagger-item"
                  style={{ '--about-delay': `${0.12 + idx * 0.12}s` }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Meta Distinction Triad */}
            <div className="about-meta-triad">
              <div
                className="meta-card about-stagger-item"
                style={{ '--about-delay': '0.45s' }}
              >
                <span className="meta-number">01</span>
                <span className="meta-heading">ACADEMIC STANDING</span>
                <span className="meta-detail">9.6 CGPA in 1st year CSE at REC; School topper (594/600).</span>
              </div>
              <div
                className="meta-card about-stagger-item"
                style={{ '--about-delay': '0.57s' }}
              >
                <span className="meta-number">02</span>
                <span className="meta-heading">LEADERSHIP & OUTREACH</span>
                <span className="meta-detail">2nd Place Hintro Campus Leader 2.0; Workshop for 60+ first-year peers.</span>
              </div>
              <div
                className="meta-card about-stagger-item"
                style={{ '--about-delay': '0.69s' }}
              >
                <span className="meta-number">03</span>
                <span className="meta-heading">PROBLEM SOLVING</span>
                <span className="meta-detail">Top 10 SRM Designathon; SIH internal qualifier; 200+ LeetCode problems.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
