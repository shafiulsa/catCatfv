import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

import useScrollEngine from '../../hooks/useScrollEngine';
import SECTIONS from '../../data/sections';
import { preloadVideos, getAllVideoUrls } from '../../utils/videoPreloader';

import VideoLayer from '../VideoLayer/VideoLayer';
import AnnotationOverlay from '../AnnotationOverlay/AnnotationOverlay';
import DetailDrawer from '../DetailDrawer/DetailDrawer';
import ProgressIndicator from '../ProgressIndicator/ProgressIndicator';

import './ScrollVideoHero.css';

/**
 * ScrollVideoHero
 *
 * Root orchestrator for the immersive scroll experience.
 *
 * Lifecycle:
 *  1. Mount → preload all 10 WebM files → show cinematic preloader.
 *  2. On preload complete → GSAP fade the preloader out, reveal intro screen.
 *  3. User scrolls → useScrollEngine fires → VideoLayer plays the correct webm.
 *  4. Video ends → annotation fades in.
 *  5. User clicks "+" → DetailDrawer slides in (scroll locked).
 */
export default function ScrollVideoHero({ onCompleteStatusChange }) {
  /* ── State ── */
  const [isPreloading, setIsPreloading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [selectedSection, setSelectedSection] = useState(null);

  /* ── Refs ── */
  const heroRef = useRef(null);       // Scroll event target
  const preloaderRef = useRef(null);  // GSAP fade target

  /* ── Scroll engine ── */
  const {
    currentSection,
    isTransitioning,
    direction,
    onTransitionComplete,
    setDrawerOpen,
  } = useScrollEngine(heroRef, SECTIONS.length);

  /* ── Preload all videos then animate out the preloader ── */
  useEffect(() => {
    const urls = getAllVideoUrls(SECTIONS);
    preloadVideos(urls, (loaded, total) => {
      setLoadProgress(Math.round((loaded / total) * 100));
    }).then(() => {
      // Small hold so the bar visually reaches 100%
      setTimeout(() => {
        gsap.to(preloaderRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => setIsPreloading(false),
        });
      }, 400);
    });
  }, []);

  /* ── Notify App of completion status ── */
  useEffect(() => {
    if (onCompleteStatusChange) {
      onCompleteStatusChange(currentSection === SECTIONS.length);
    }
  }, [currentSection, onCompleteStatusChange]);

  /* ── Keep drawer open state in sync with scroll engine ── */
  useEffect(() => {
    setDrawerOpen(!!selectedSection);
  }, [selectedSection, setDrawerOpen]);

  /* ── Handlers ── */
  const handleMarkerClick = useCallback((section) => {
    setSelectedSection(section);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedSection(null);
  }, []);

  /* ────────────────────────────────────────────────────── */

  return (
    <>
      {/* ── Preloader (rendered above everything, GSAP fades it out) ── */}
      {isPreloading && (
        <div ref={preloaderRef} className="preloader">
          <div className="preloader__inner">
            <div className="preloader__wordmark">
              <span className="preloader__wordmark-main">SEACAT</span>
              <span className="preloader__wordmark-sub">NEW SUPERYACHT GENERATION</span>
            </div>
            <div className="preloader__track">
              <div
                className="preloader__fill"
                style={{ transform: `scaleX(${loadProgress / 100})` }}
              />
            </div>
            <span className="preloader__pct">{loadProgress}%</span>
          </div>
        </div>
      )}

      {/* ── Hero Scene ── */}
      <main ref={heroRef} className="scroll-hero">

        {/* Full-screen video background */}
        <VideoLayer
          sections={SECTIONS}
          currentSection={currentSection}
          direction={direction}
          isTransitioning={isTransitioning}
          onTransitionComplete={onTransitionComplete}
        />

        {/* ── Intro overlay (Section 0) ── */}
        <div className={`intro-overlay ${currentSection === 0 && !isTransitioning ? 'is-visible' : ''}`}>
          <h1 className="intro-overlay__title">SEACAT</h1>
          <p className="intro-overlay__sub">NEW SUPERYACHT GENERATION</p>
          <div className="intro-overlay__cue">
            <span>SCROLL TO EXPLORE</span>
            <div className="cue-line" />
          </div>
        </div>

        {/* ── Annotations — one per section, GSAP manages opacity ── */}
        {SECTIONS.map((section, idx) => (
          <AnnotationOverlay
            key={section.id}
            section={section}
            isActive={currentSection === idx + 1}
            isTransitioning={isTransitioning}
            onMarkerClick={handleMarkerClick}
          />
        ))}

        {/* ── Right-edge progress dots ── */}
        <ProgressIndicator
          totalSections={SECTIONS.length}
          currentSection={currentSection}
        />

        {/* ── Header / nav bar ── */}
        <header className="hero-header">
          <div className="hero-header__left">
            <a href="#" className="hero-nav-link">ROSSINAVI</a>
            <a href="#" className="hero-nav-link hero-nav-link--accent">BLUE EXPERIENCE</a>
          </div>
          <div className="hero-header__center">
            <span className="hero-wordmark">SEACAT</span>
            <span className="hero-wordmark-sub">NEW SUPERYACHT GENERATION</span>
          </div>
          <div className="hero-header__right">
            {/* Section counter */}
            <span className="section-counter">
              {currentSection > 0
                ? `${String(currentSection).padStart(2, '0')} / ${String(SECTIONS.length).padStart(2, '0')}`
                : ''}
            </span>
          </div>
        </header>

      </main>

      {/* ── Detail Drawer (outside .scroll-hero so it sits above everything) ── */}
      <DetailDrawer
        isOpen={!!selectedSection}
        section={selectedSection}
        onClose={handleCloseDrawer}
      />
    </>
  );
}
