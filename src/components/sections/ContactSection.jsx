import { useState, useRef } from 'react';
import SectionHeader from '../common/SectionHeader';
import { personalInfo } from '../../data/portfolioData';
import { useViewportPresence } from '../../hooks/useViewportActivation';
import './ContactSection.css';

/* Existing butterfly asset from public/ */
const BUTTERFLY_ASSET_SRC = '/Gemini_Generated_Image_kgmm3fkgmm3fkgmm.png';

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef(null);
  const { hasEntered } = useViewportPresence(sectionRef, { threshold: 0.14 });

  const handleCopy = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`scarlet-section contact-section ${hasEntered ? 'is-entered' : ''}`}
      aria-label="Contact and Connect"
    >
      {/* Cinematic Ambient Atmosphere (Echoing the floating cloth aura) */}
      <div className="contact-ambient-cloth-glow" aria-hidden="true" />

      <div className="section-container relative-z">
        <SectionHeader
          number="08"
          label="DIALOGUE & REPOSITORY"
          title="THE CLOSING SCENE"
          subtitle="Open for engineering collaborations, hackathon teams, and software development discussions."
        />

        <div className="contact-cinematic-stage">
          {/* LEFT COLUMN: Crimson Butterfly Entrance & Continuous Graceful Flutter */}
          <div className="contact-butterfly-column" aria-hidden="true">
            <div className="contact-butterfly-ambient-halo" />

            <div className="contact-butterfly-entrance">
              <div className="contact-butterfly-float">
                <div className="contact-butterfly-blend-shell">
                  <div className="contact-butterfly-rig">
                    <img
                      src={BUTTERFLY_ASSET_SRC}
                      alt=""
                      decoding="async"
                      className="contact-butterfly-layer contact-butterfly-wing--left"
                    />
                    <img
                      src={BUTTERFLY_ASSET_SRC}
                      alt=""
                      decoding="async"
                      className="contact-butterfly-layer contact-butterfly-wing--right"
                    />
                    <img
                      src={BUTTERFLY_ASSET_SRC}
                      alt=""
                      decoding="async"
                      className="contact-butterfly-layer contact-butterfly-body"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Existing Contact Details & Staggered Reveal */}
          <div className="contact-centerpiece-card interactive-target">
            <span className="contact-kicker-tag contact-stagger-item" style={{ '--stagger-delay': '0.22s' }}>
              DIRECT INQUIRIES & COLLABORATIONS
            </span>

            <h3 className="contact-lead-display contact-stagger-item" style={{ '--stagger-delay': '0.36s' }}>
              Every connection begins with a little spark.
              <span className="display-crimson-italic">Let&apos;s turn idea into action</span>
            </h3>

            <p className="contact-narrative-sub contact-stagger-item" style={{ '--stagger-delay': '0.50s' }}>
              Whether you want to discuss algorithmic problem solving, explore frontend design, or collaborate on a hackathon project—my inbox is always open.
            </p>

            {/* Email Box with One-Click Copy */}
            <div className="contact-email-interactive-bar contact-stagger-item" style={{ '--stagger-delay': '0.64s' }}>
              <div className="email-label-wrap">
                <span className="email-icon-svg">✉</span>
                <a href={`mailto:${personalInfo.email}`} className="email-anchor">
                  {personalInfo.email}
                </a>
              </div>
              <button
                type="button"
                className="copy-trigger-pill interactive-target"
                onClick={handleCopy}
                aria-label="Copy email address"
              >
                {copied ? 'COPIED TO CLIPBOARD ✦' : 'COPY EMAIL'}
              </button>
            </div>

            {/* Action Buttons: Resume & Send Email */}
            <div className="contact-action-buttons contact-stagger-item" style={{ '--stagger-delay': '0.78s' }}>
              <a
                href={personalInfo.resumeUrl}
                download="Sindhuja_Muthusamy_Resume.pdf"
                className="contact-primary-btn interactive-target"
              >
                <span>DOWNLOAD RESUME (PDF)</span>
                <span className="btn-down-arrow">↓</span>
              </a>

              <a
                href={`mailto:${personalInfo.email}`}
                className="contact-secondary-btn interactive-target"
              >
                <span>INITIATE EMAIL</span>
                <span className="btn-ext-arrow">↗</span>
              </a>
            </div>

            {/* Verified Platforms Directory */}
            <div className="verified-platforms-matrix contact-stagger-item" style={{ '--stagger-delay': '0.92s' }}>
              <span className="matrix-title">VERIFIED PLATFORMS & PROFILES</span>
              <div className="matrix-chips-row">
                <a
                  href={personalInfo.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="matrix-chip interactive-target"
                >
                  <span className="chip-name">LINKEDIN</span>
                  <span className="chip-arrow">↗</span>
                </a>

                <a
                  href={personalInfo.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="matrix-chip interactive-target"
                >
                  <span className="chip-name">GITHUB</span>
                  <span className="chip-arrow">↗</span>
                </a>

                <a
                  href={personalInfo.socials.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="matrix-chip interactive-target"
                >
                  <span className="chip-name">LEETCODE</span>
                  <span className="chip-arrow">↗</span>
                </a>

                <a
                  href={personalInfo.socials.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="matrix-chip interactive-target"
                >
                  <span className="chip-name">THE STUDENT STACK</span>
                  <span className="chip-arrow">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Cinematic Closing Footer */}
        <footer className="scarlet-editorial-footer">
          <div className="footer-col-left">
            <span className="footer-signature">SINDHUJA MUTHUSAMY</span>
            <span className="footer-detail-meta">
              Computer Science & Engineering • Rajalakshmi Engineering College
            </span>
          </div>

          <div className="footer-col-right">
            <span className="footer-copyright">
              PORTFOLIO 2026 • BUILT FROM CURIOSITY. GROUNDED BY RIGOR.
            </span>
          </div>
        </footer>
      </div>
    </section>
  );
}

