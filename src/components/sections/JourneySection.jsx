import { useEffect, useRef, useState } from 'react';
import SectionHeader from '../common/SectionHeader';
import JourneyFlyingBackground from '../common/JourneyFlyingBackground';
import { academicJourney } from '../../data/portfolioData';
import { useViewportPresence } from '../../hooks/useViewportActivation';
import './JourneySection.css';

export default function JourneySection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const { hasEntered } = useViewportPresence(sectionRef, { threshold: 0.06 });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalHeight = rect.height;
      const currentScroll = windowHeight - rect.top;

      let progress = (currentScroll / (totalHeight + windowHeight * 0.5)) * 100;
      progress = Math.max(0, Math.min(100, progress));
      setScrollProgress(progress);

      // Determine active chapter based on viewport position
      const cards = containerRef.current.querySelectorAll('.chapter-entry');
      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        if (cardRect.top <= windowHeight * 0.55 && cardRect.bottom >= windowHeight * 0.2) {
          setActiveChapter(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className={`scarlet-section journey-section ${hasEntered ? 'is-entered' : ''}`}
      aria-label="Academic Journey"
    >
      {/* Dramatic Flying Silhouette & Scroll-Waving Crimson Cloth Background */}
      <JourneyFlyingBackground sectionRef={sectionRef} />

      <div className="section-container journey-content-foreground">
        <SectionHeader
          number="02"
          label="CHRONOLOGY & MILESTONES"
          title={
            <>
              <span className="journey-chapters-cursive">Five Chapters</span> OF RIGOR
            </>
          }
          subtitle="An unbroken record of academic excellence, competitive problem solving, and intentional growth."
        />

        <div className="journey-timeline-wrapper" ref={containerRef}>
          {/* Continuous Interactive Crimson Line */}
          <div className="timeline-spine-track" aria-hidden="true">
            <div
              className="timeline-spine-fill"
              style={{ height: `${scrollProgress}%` }}
            />
            <div
              className="timeline-spine-glow-head"
              style={{ top: `${scrollProgress}%` }}
            />
          </div>

          {/* Chapters Stack */}
          <div className="journey-chapters-stack">
            {academicJourney.map((item, index) => {
              const isActive = activeChapter === index;
              return (
                <article
                  key={item.chapter}
                  className={`chapter-entry interactive-target ${isActive ? 'active' : ''}`}
                  style={{ '--chapter-delay': `${0.1 + index * 0.09}s` }}
                  onClick={() => setActiveChapter(index)}
                >
                  {/* Timeline Node Indicator */}
                  <div className="chapter-node">
                    <span className="node-number">{item.chapter}</span>
                    <span className="node-pulse" />
                  </div>

                  {/* Chapter Card Content */}
                  <div className="chapter-card-inner">
                    <div className="chapter-header-row">
                      <div className="chapter-badge-wrap">
                        <span className="chapter-year">{item.year}</span>
                        <span className="chapter-grade">{item.grade}</span>
                      </div>
                      <span className="chapter-index-label">{`CHAPTER // ${item.chapter}`}</span>
                    </div>

                    <h3 className="chapter-score-hero">{item.score}</h3>

                    <div className="chapter-distinctions-flow">
                      {item.distinctions.map((dist, dIdx) => (
                        <span
                          key={dIdx}
                          className={`distinction-badge ${dist.includes('Centum') || dist.includes('Topper') || dist.includes('Top 10') || dist.includes('9.6') ? 'highlight' : ''}`}
                        >
                          <span className="dist-icon">✦</span>
                          <span>{dist}</span>
                        </span>
                      ))}
                    </div>

                    <p className="chapter-narrative-text">{item.narrative}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

