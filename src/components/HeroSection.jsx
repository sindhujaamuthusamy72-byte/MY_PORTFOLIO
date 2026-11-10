import { useState, useEffect, useRef, useCallback } from 'react';
import './HeroSection.css';

/**
 * HeroSection Component
 *
 * Plays `/videos/scarlet-opening.mp4` full-screen on load (closed eyes -> open ->
 * iris transformation -> crimson portal -> red cloth floating in darkness).
 * At `REVEAL_TIMESTAMP` (~6.35s, as the red cloth floats into the air), reveals the
 * portfolio typography and navigation cleanly. When the video finishes (`~7.93s`),
 * stops naturally right on the floating red cloth frame against pure black.
 */

const REVEAL_TIMESTAMP = 6.35;
const CLOTH_STOP_TIMESTAMP = 7.75;

export default function HeroSection({ onEnterWorld }) {
  const videoRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealTriggeredRef = useRef(prefersReducedMotion);
  const stoppedAtClothRef = useRef(prefersReducedMotion);

  const [isRevealed, setIsRevealed] = useState(prefersReducedMotion);
  const [isIntroComplete, setIsIntroComplete] = useState(prefersReducedMotion);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = useCallback(
    (id) => {
      setMobileMenuOpen(false);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (onEnterWorld) {
        onEnterWorld();
      }
    },
    [onEnterWorld]
  );

  const handleEnterWorldClick = (e) => {
    e.preventDefault();
    scrollToSection('about');
  };

  const stopAtFloatingCloth = useCallback((video) => {
    stoppedAtClothRef.current = true;
    revealTriggeredRef.current = true;
    setIsRevealed(true);
    setIsIntroComplete(true);
    setAutoplayBlocked(false);

    if (video) {
      const targetTime = video.duration && video.duration > 1
        ? Math.max(CLOTH_STOP_TIMESTAMP, video.duration - 0.08)
        : CLOTH_STOP_TIMESTAMP;
      if (video.currentTime < CLOTH_STOP_TIMESTAMP) {
        video.currentTime = targetTime;
      }
      if (!video.paused) {
        video.pause();
      }
    }
  }, []);

  const handleSkipIntro = () => {
    stopAtFloatingCloth(videoRef.current);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e) => {
      if (e.matches) {
        stopAtFloatingCloth(videoRef.current);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [stopAtFloatingCloth]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrameId;

    const checkPlaybackProgress = () => {
      if (video && !video.paused) {
        if (video.currentTime >= REVEAL_TIMESTAMP && !revealTriggeredRef.current) {
          revealTriggeredRef.current = true;
          setIsRevealed(true);
        }

        if (video.duration && video.currentTime >= video.duration - 0.05) {
          video.pause();
          stoppedAtClothRef.current = true;
          setIsIntroComplete(true);
          return;
        }
      }
      if (!stoppedAtClothRef.current) {
        animationFrameId = requestAnimationFrame(checkPlaybackProgress);
      }
    };

    const tryPlayIntro = () => {
      if (stoppedAtClothRef.current || video.readyState < 2) return;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setAutoplayBlocked(false);
          })
          .catch(() => {
            setAutoplayBlocked(true);
          });
      }
    };

    const handleLoadedMetadata = () => {
      if (stoppedAtClothRef.current) {
        stopAtFloatingCloth(video);
        return;
      }
      if (video.readyState >= 3) {
        tryPlayIntro();
      }
    };

    const handleCanPlay = () => {
      tryPlayIntro();
    };

    const handlePlaying = () => {
      setAutoplayBlocked(false);
    };

    const handleError = () => {
      stopAtFloatingCloth(video);
    };

    const handleEnded = () => {
      revealTriggeredRef.current = true;
      stoppedAtClothRef.current = true;
      setIsRevealed(true);
      setIsIntroComplete(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);

    // Pause hero playback when user scrolls far below Hero before intro ends; resume if scrolled back
    const headerEl = video.closest('header');
    let observer;
    if (headerEl && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          const isVisible = entries.some((entry) => entry.isIntersecting);
          if (stoppedAtClothRef.current) return;
          if (!isVisible && !video.paused) {
            video.pause();
          } else if (isVisible && video.paused && video.readyState >= 2) {
            video.play().catch(() => {});
          }
        },
        { threshold: 0, rootMargin: '220px 0px 220px 0px' }
      );
      observer.observe(headerEl);
    }

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    if (!stoppedAtClothRef.current) {
      animationFrameId = requestAnimationFrame(checkPlaybackProgress);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (observer) observer.disconnect();
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
    };
  }, [stopAtFloatingCloth]);

  const handleStartExperience = () => {
    const video = videoRef.current;
    if (video) {
      video
        .play()
        .then(() => {
          setAutoplayBlocked(false);
        })
        .catch(() => {
          stopAtFloatingCloth(video);
        });
    } else {
      stopAtFloatingCloth(null);
    }
  };

  return (
    <header className="hero-viewport" id="hero" aria-label="Hero Section">
      {/* 1. Background Video Layer (Plays intro and stops cleanly on floating red cloth) */}
      <div className="hero-video-container" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video"
          src="/videos/scarlet-opening.mp4"
          muted
          playsInline
          autoPlay
          preload="auto"
        >
          <source
            src="/videos/Woman_opening_eyes_in_darkness_95e3ebb7_1080p_gwr_video_mvp.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-cinematic-overlay" />
      </div>

      {/* Autoplay Fallback Trigger */}
      {autoplayBlocked && !isIntroComplete && (
        <button
          type="button"
          className="hero-autoplay-fallback"
          onClick={handleStartExperience}
          aria-label="Play cinematic intro"
        >
          <span className="fallback-pulse" />
          <span className="fallback-text">START CINEMATIC EXPERIENCE</span>
          <span className="fallback-icon">▶</span>
        </button>
      )}

      {/* Unobtrusive Skip Intro Trigger during intro video */}
      {!isIntroComplete && !autoplayBlocked && (
        <button
          type="button"
          className="hero-floating-skip"
          onClick={handleSkipIntro}
          aria-label="Skip cinematic introduction"
        >
          <span>SKIP INTRO</span>
          <span className="skip-arrow">⏭</span>
        </button>
      )}

      {/* 2. Foreground Content & Editorial Layout */}
      <div className="hero-content-layer">
        {/* Top Minimal Navigation Bar */}
        <nav className={`hero-nav ${isRevealed ? 'revealed' : ''}`} aria-label="Main Navigation">
          {/* Top Left: S. | Helloo, Welcome!! */}
          <div className="hero-brand">
            <a
              href="#hero"
              className="brand-monogram"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('hero');
              }}
            >
              <span className="brand-letter">S</span>
              <span className="brand-dot">.</span>
            </a>
            <span className="brand-v-divider" aria-hidden="true" />
            <div className="brand-titles-wrap">
              <span className="brand-title-line">Helloo, Welcome!!</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="hero-nav-links">
            <li className="active-item">
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
                ABOUT
              </a>
            </li>
            <li>
              <a href="#journey" onClick={(e) => { e.preventDefault(); scrollToSection('journey'); }}>
                JOURNEY
              </a>
            </li>
            <li>
              <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}>
                PROJECTS
              </a>
            </li>
            <li>
              <a href="#achievements" onClick={(e) => { e.preventDefault(); scrollToSection('achievements'); }}>
                ACHIEVEMENTS
              </a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>
                CONTACT
              </a>
            </li>
          </ul>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            className={`hero-mobile-toggle ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </nav>

        {/* Mobile Navigation Drawer */}
        <div className={`hero-mobile-drawer ${mobileMenuOpen ? 'active' : ''}`} aria-hidden={!mobileMenuOpen}>
          <div className="mobile-drawer-inner">
            <span className="mobile-drawer-label">NAVIGATION</span>
            <ul className="mobile-nav-list">
              <li>
                <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
                  ABOUT
                </a>
              </li>
              <li>
                <a href="#journey" onClick={(e) => { e.preventDefault(); scrollToSection('journey'); }}>
                  JOURNEY
                </a>
              </li>
              <li>
                <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}>
                  PROJECTS
                </a>
              </li>
              <li>
                <a href="#achievements" onClick={(e) => { e.preventDefault(); scrollToSection('achievements'); }}>
                  ACHIEVEMENTS
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>
                  CONTACT
                </a>
              </li>
            </ul>
            <div className="mobile-drawer-footer">
              <span>SINDHUJA</span>
            </div>
          </div>
        </div>

        {/* 3. Left-Aligned Centerpiece Reveal */}
        <div className={`hero-left-centerpiece ${isRevealed ? 'revealed' : ''}`}>
          {/* Step 1: SINDHUJA in Soft Ivory Serif */}
          <div className="centerpiece-name-wrap">
            <h1 className="centerpiece-name">SINDHUJA</h1>
          </div>

          {/* Step 2: I WAS NEVER MADE TO BLEND IN. in Scarlet Red */}
          <p className="centerpiece-statement">I WAS NEVER MADE TO BLEND IN.</p>

          {/* Step 3: Supporting Line with Leading Wavy Arrow */}
          <div className="centerpiece-support-wrap">
            <div className="support-arrow-indicator" aria-hidden="true">
              <svg
                className="arrow-wave-svg"
                width="46"
                height="10"
                viewBox="0 0 46 10"
                fill="none"
              >
                <path
                  d="M1 5 C 5 2, 9 2, 12.5 5 S 20 8, 24 5 S 31.5 2, 35.5 5 S 42 7.5, 45 5"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
              <span className="arrow-head">›</span>
            </div>
            <p className="centerpiece-support-text">Built from curiosity. Driven by ambition.</p>
          </div>

          {/* Step 4: Rectangular CTA Button [ ENTER MY WORLD ↗ ] */}
          <div className="centerpiece-cta-wrap">
            <a
              href="#about"
              className="centerpiece-cta-btn"
              onClick={handleEnterWorldClick}
              role="button"
            >
              <span className="cta-text">ENTER MY WORLD</span>
              <span className="cta-icon">↗</span>
            </a>
          </div>
        </div>

        {/* 4. Bottom Elements */}
        <footer className={`hero-bottom-bar ${isRevealed ? 'revealed' : ''}`}>
          <div className="bottom-left-tag">
            <span className="tag-text">CSE STUDENT • DEVELOPER • DREAMER</span>
          </div>

          <button
            type="button"
            className="bottom-right-scroll"
            onClick={() => scrollToSection('about')}
            aria-label="Scroll to explore portfolio"
          >
            <span className="scroll-text">SCROLL TO EXPLORE</span>
            <span className="scroll-divider" aria-hidden="true" />
            <svg className="scroll-sparkle-star" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 0 L13.8 10.2 L24 12 L13.8 13.8 L12 24 L10.2 13.8 L0 12 L10.2 10.2 Z" fill="#B3213C" />
            </svg>
          </button>
        </footer>
      </div>
    </header>
  );
}
