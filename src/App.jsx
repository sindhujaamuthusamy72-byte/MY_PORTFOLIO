import { useState, useEffect, useRef } from 'react';
import HeroSection from './components/HeroSection';
import CustomCursor from './components/common/CustomCursor';
import AboutSection from './components/sections/AboutSection';
import JourneySection from './components/sections/JourneySection';
import AchievementsSection from './components/sections/AchievementsSection';
import ProjectsSection from './components/sections/ProjectsSection';
import ExperienceSection from './components/sections/ExperienceSection';
import SkillsSection from './components/sections/SkillsSection';
import WritingSection from './components/sections/WritingSection';
import ContactSection from './components/sections/ContactSection';
import { useViewportPresence } from './hooks/useViewportActivation';
import './App.css';

const STUDENT_CAP_SRC = encodeURI('/Gemini_Generated_Image_hg6efbhg6efbhg6e (1).png');

export default function App() {
  const [activeNav, setActiveNav] = useState('about');
  const capBandRef = useRef(null);
  const { hasEntered: capBandEntered } = useViewportPresence(capBandRef, { threshold: 0.04 });

  // Track active section for sticky directory
  useEffect(() => {
    const sectionIds = ['about', 'journey', 'achievements', 'projects', 'experience', 'skills', 'writing', 'contact'];

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveNav(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="portfolio-body">
      {/* Subtle Desktop Custom Cursor */}
      <CustomCursor />

      {/* ====================================================================
          HOMEPAGE (IMMUTABLE & PROTECTED)
          Cinematic Intro Video, Floating Red Cloth, SINDHUJA Movie-Title Reveal
          ==================================================================== */}
      <HeroSection onEnterWorld={() => handleScrollToSection('about')} />

      {/* Sticky Scarlet Section Directory Bar with Active State */}
      <nav className="scarlet-sticky-directory" aria-label="Sections Directory">
        <div className="directory-nav-inner">
          <a
            href="#about"
            className={`directory-link interactive-target ${activeNav === 'about' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleScrollToSection('about'); }}
          >
            About
          </a>
          <span className="directory-sep-slash">/</span>
          <a
            href="#journey"
            className={`directory-link interactive-target ${activeNav === 'journey' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleScrollToSection('journey'); }}
          >
            Journey
          </a>
          <span className="directory-sep-slash">/</span>
          <a
            href="#achievements"
            className={`directory-link interactive-target ${activeNav === 'achievements' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleScrollToSection('achievements'); }}
          >
            Achievements
          </a>
          <span className="directory-sep-slash">/</span>
          <a
            href="#projects"
            className={`directory-link interactive-target ${activeNav === 'projects' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleScrollToSection('projects'); }}
          >
            Projects
          </a>
          <span className="directory-sep-slash">/</span>
          <a
            href="#experience"
            className={`directory-link interactive-target ${activeNav === 'experience' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleScrollToSection('experience'); }}
          >
            Experience
          </a>
          <span className="directory-sep-slash">/</span>
          <a
            href="#skills"
            className={`directory-link interactive-target ${activeNav === 'skills' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleScrollToSection('skills'); }}
          >
            Skills
          </a>
          <span className="directory-sep-slash">/</span>
          <a
            href="#writing"
            className={`directory-link interactive-target ${activeNav === 'writing' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleScrollToSection('writing'); }}
          >
            Writing
          </a>
          <span className="directory-sep-slash">/</span>
          <a
            href="#contact"
            className={`directory-link interactive-target ${activeNav === 'contact' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleScrollToSection('contact'); }}
          >
            Contact
          </a>
        </div>
      </nav>

      {/* ====================================================================
          REMAINING SECTIONS — THE SCARLET EXPERIENCE
          ==================================================================== */}

      {/* 01. About Section with Crimson Rim-Lit Portrait & Interactive Keywords */}
      <AboutSection />

      {/* 02. Interactive Five-Chapter Academic Journey with Crimson Progress Line */}
      <JourneySection />

      {/* 03. Achievements Gallery with Prominent Hintro Plaque */}
      <AchievementsSection />

      {/* 04 & 05 Shared Continuous Background: Crimson Student Cap across Purposeful Platforms & Leadership */}
      <div
        ref={capBandRef}
        className={`platforms-leadership-band ${capBandEntered ? 'is-cap-entered' : ''}`}
      >
        <div className="student-cap-shared-backdrop" aria-hidden="true">
          <div className="student-cap-sticky-stage">
            <div className="student-cap-media-shell">
              <img
                src={STUDENT_CAP_SRC}
                alt=""
                decoding="async"
                className="student-cap-bg-image"
              />
            </div>
          </div>
        </div>

        {/* 04. Horizontal Project Showcase with Interactive Case Studies */}
        <ProjectsSection />

        {/* 05. Interactive Roles & Leadership Timeline */}
        <ExperienceSection />
      </div>

      {/* 06. Typographic Honest Skill Matrix */}
      <SkillsSection />

      {/* 07. Magazine-Style Editorial Writing Section for Student Stack */}
      <WritingSection />

      {/* 08. Cinematic Crimson Closing Atmosphere & Contact */}
      <ContactSection />
    </div>
  );
}
