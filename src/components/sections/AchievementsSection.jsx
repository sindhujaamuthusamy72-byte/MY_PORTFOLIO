import { useState, useEffect, useRef } from 'react';
import SectionHeader from '../common/SectionHeader';
import { featuredAchievement, otherAchievements } from '../../data/portfolioData';
import { useScrollVideoLifecycle } from '../../hooks/useViewportActivation';
import './AchievementsSection.css';

const DRAGON_VIDEO_SRC = encodeURI('/videos/Animated_crimson_dragon_breathin\u2026_874425f5_1080p.mp4');
const FIRE_SPIT_TIMESTAMP = 3.1; // Exact moment dragon opens jaws and breathes crimson fire

export default function AchievementsSection() {
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const sectionRef = useRef(null);
  const dragonVideoRef = useRef(null);

  const {
    hasEntered,
    prefersReducedMotion,
    hasEnded,
    hasError,
  } = useScrollVideoLifecycle({
    sectionRef,
    videoRef: dragonVideoRef,
    threshold: 0.08,
    offscreenMargin: '220px 0px 220px 0px',
    reducedMotionSeekOffsetFromEnd: 0.35,
  });

  const [isTextRevealed, setIsTextRevealed] = useState(prefersReducedMotion);

  // Synchronize text reveal strictly to dragon spitting fire (~3.1s), with wall-clock / error failsafe
  useEffect(() => {
    if (prefersReducedMotion || hasEnded || hasError) {
      const raf = requestAnimationFrame(() => setIsTextRevealed(true));
      return () => cancelAnimationFrame(raf);
    }
    if (!hasEntered) return;

    const video = dragonVideoRef.current;
    let rafId;
    let revealed = false;

    const revealText = () => {
      if (revealed) return;
      revealed = true;
      setIsTextRevealed(true);
    };

    const startTime = performance.now();

    const monitorFireBreath = () => {
      const videoTime = video && !video.paused && video.currentTime > 0 ? video.currentTime : 0;
      const wallElapsed = (performance.now() - startTime) / 1000;
      const elapsed = Math.max(videoTime, wallElapsed);

      if (elapsed >= FIRE_SPIT_TIMESTAMP) {
        revealText();
        return;
      }

      rafId = requestAnimationFrame(monitorFireBreath);
    };

    rafId = requestAnimationFrame(monitorFireBreath);
    const fallbackTimer = window.setTimeout(revealText, 3250);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.clearTimeout(fallbackTimer);
    };
  }, [hasEntered, hasEnded, hasError, prefersReducedMotion]);

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className={`scarlet-section achievements-section ${hasEntered ? 'is-video-active' : ''} ${
        isTextRevealed ? 'is-text-revealed' : ''
      }`}
      aria-label="Achievements Gallery"
    >
      {/* Full-Section Background Dragon Video Canvas */}
      <div className="achievements-dragon-bg-layer" aria-hidden="true">
        <div className="achievements-dragon-sticky-viewport">
          <video
            ref={dragonVideoRef}
            className="achievements-dragon-bg-video"
            src={DRAGON_VIDEO_SRC}
            muted
            playsInline
            preload="auto"
          />
          <div className="achievements-dragon-bg-vignette" />
          <div className="achievements-dragon-readability-scrim" />
        </div>
      </div>

      {/* Foreground Achievements Content (Appears right as Dragon Spits Fire) */}
      <div className={`section-container achievements-foreground ${isTextRevealed ? 'is-revealed' : ''}`}>
        <SectionHeader
          number="03"
          label="DISTINCTIONS & HONORS"
          title="RECOGNITION OF VALUE"
          subtitle="Milestones earned through competitive performance, campus leadership, and academic discipline."
        />

        {/* PROMINENT FEATURED MARQUEE: HINTRO CAMPUS LEADER 2.0 */}
        <div className="featured-plaque-container interactive-target">
          <div className="plaque-corner-accent top-left" />
          <div className="plaque-corner-accent bottom-right" />

          <div className="plaque-header-bar">
            <span className="plaque-kicker">FEATURED LEADERSHIP RECOGNITION</span>
            <span className="plaque-rank-pill">{featuredAchievement.rank}</span>
          </div>

          <div className="plaque-body">
            <div className="plaque-title-column">
              <h3 className="plaque-main-title">{featuredAchievement.title}</h3>
              <p className="plaque-description">{featuredAchievement.description}</p>

              {/* Verified Honors Pillars */}
              <div className="plaque-honors-list">
                {featuredAchievement.honors.map((honor, idx) => (
                  <div key={idx} className="honor-row">
                    <span className="honor-bullet">✦</span>
                    <span className="honor-text">{honor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metric Cubes Grid */}
            <div className="plaque-metrics-grid">
              <div className="metric-cube highlight">
                <span className="metric-cube-val">{featuredAchievement.rank.split(' ')[0]}</span>
                <span className="metric-cube-lbl">PLACE IN PROGRAM</span>
              </div>
              <div className="metric-cube highlight-crimson">
                <span className="metric-cube-val">{featuredAchievement.prize.split(' ')[0]}</span>
                <span className="metric-cube-lbl">CASH PRIZE AWARDED</span>
              </div>
              <div className="metric-cube">
                <span className="metric-cube-val">{featuredAchievement.peopleOnboarded}</span>
                <span className="metric-cube-lbl">PEOPLE ONBOARDED</span>
              </div>
              <div className="metric-cube">
                <span className="metric-cube-val">{featuredAchievement.workshopAttendees}</span>
                <span className="metric-cube-lbl">WORKSHOP ATTENDEES</span>
              </div>
            </div>
          </div>
        </div>

        {/* OTHER VERIFIED ACHIEVEMENTS GALLERY */}
        <div className="other-achievements-grid">
          {otherAchievements.map((item, index) => {
            const isSelected = selectedAchievement === index;
            return (
              <div
                key={index}
                className={`achievement-card-item interactive-target ${isSelected ? 'expanded' : ''}`}
                onClick={() => setSelectedAchievement(isSelected ? null : index)}
              >
                <div className="card-top-meta">
                  <span className="card-category-tag">{item.category}</span>
                  <span className="card-expand-hint">{isSelected ? 'COLLAPSE —' : 'DETAILS +'}</span>
                </div>

                <h4 className="card-item-title">{item.title}</h4>
                <div className="card-highlight-badge">{item.highlight}</div>
                <p className="card-description-text">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
