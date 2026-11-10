import { useRef } from 'react';
import SectionHeader from '../common/SectionHeader';
import { publishedArticles } from '../../data/portfolioData';
import { useViewportPresence } from '../../hooks/useViewportActivation';
import './WritingSection.css';

export default function WritingSection() {
  const sectionRef = useRef(null);
  const { hasEntered } = useViewportPresence(sectionRef, { threshold: 0.08 });

  return (
    <section
      id="writing"
      ref={sectionRef}
      className={`scarlet-section writing-section ${hasEntered ? 'is-entered' : ''}`}
      aria-label="Technical Writing"
    >
      <div className="section-container">
        <SectionHeader
          number="07"
          label="PUBLICATIONS & ESSAYS"
          title="THE STUDENT STACK"
          subtitle="I learn by explaining. Authoring beginner-friendly deep dives into web mechanics, programming, and AI tools."
        />

        <div className="writing-editorial-spread">
          {/* Magazine Marquee Header */}
          <div className="magazine-banner-row">
            <div className="magazine-identity">
              <span className="mag-bullet">●</span>
              <span className="mag-name">THE STUDENT STACK TECHNICAL BLOG</span>
            </div>
            <a
              href="https://thestudentstacktech.blogspot.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mag-visit-btn interactive-target"
            >
              <span>BROWSE ALL ARTICLES ON BLOGGER</span>
              <span className="mag-arrow">↗</span>
            </a>
          </div>

          {/* Articles Dual Magazine Layout */}
          <div className="magazine-articles-grid">
            {publishedArticles.map((article, index) => (
              <article key={index} className="magazine-article-card interactive-target">
                <div className="article-card-header">
                  <span className="article-kicker">{article.category}</span>
                  <span className="article-readtime">{article.readTime}</span>
                </div>

                <h3 className="article-headline-text">{article.title}</h3>

                <p className="article-excerpt-text">{article.excerpt}</p>

                <div className="article-card-footer">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-read-btn interactive-target"
                  >
                    <span>READ ARTICLE ON BLOGGER</span>
                    <span className="read-arrow">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
