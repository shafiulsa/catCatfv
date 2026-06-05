import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * useScrollEngine
 *
 * Core state machine that drives the scroll-video experience.
 * - Attaches wheel & touch events with { passive: false } so preventDefault works.
 * - Debounces rapid scroll inputs (80ms window).
 * - Locks all input while a transition is in progress.
 * - Exposes setDrawerOpen() so the drawer can pause scrolling.
 *
 * @param {HTMLElement|null} containerRef  - The element to attach listeners to.
 * @param {number}           totalSections - Number of video sections.
 * @returns {object}
 */
export default function useScrollEngine(containerRef, totalSections) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState(null); // 'forward' | 'reverse' | null

  // Refs keep the event handlers up-to-date without re-binding.
  const isTransitioningRef = useRef(false);
  const currentSectionRef = useRef(0);
  const drawerOpenRef = useRef(false);
  const accumulatedDelta = useRef(0);
  const debounceTimer = useRef(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    currentSectionRef.current = currentSection;
    
    // STRICT SCROLL LOCK: Only allow body scrolling when hero is completely finished
    if (currentSection === totalSections) {
      document.body.style.overflowY = 'auto';
      document.body.style.overflowX = 'hidden';
    } else {
      document.body.style.overflow = 'hidden';
      // Ensure we stay at the top while locked in the hero
      if (window.scrollY > 0) {
        window.scrollTo(0, 0);
      }
    }
  }, [currentSection, totalSections]);

  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  /** Trigger a section transition. */
  const triggerTransition = useCallback((dir) => {
    const section = currentSectionRef.current;
    if (dir === 'forward' && section < totalSections) {
      setCurrentSection(section + 1);
      setDirection('forward');
      setIsTransitioning(true);
    } else if (dir === 'reverse' && section > 0) {
      setCurrentSection(section - 1);
      setDirection('reverse');
      setIsTransitioning(true);
    }
    accumulatedDelta.current = 0;
  }, [totalSections]);

  /** Called by VideoLayer when the video's 'ended' event fires. */
  const onTransitionComplete = useCallback(() => {
    setIsTransitioning(false);
    setDirection(null);
    accumulatedDelta.current = 0;
  }, []);

  /** Block scroll while drawer is open. */
  const setDrawerOpen = useCallback((isOpen) => {
    drawerOpenRef.current = isOpen;
  }, []);

  /* ─── Attach / detach event listeners on the container ─── */
  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;

    const onWheel = (e) => {
      if (isTransitioningRef.current || drawerOpenRef.current) return;

      // Allow natural scroll down when at the last section
      if (currentSectionRef.current === totalSections && e.deltaY > 0) {
        return;
      }
      // Allow natural scroll when the window is scrolled past the top hero
      if (window.scrollY > 0) {
        return;
      }

      e.preventDefault();
      accumulatedDelta.current += e.deltaY;

      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        const delta = accumulatedDelta.current;
        if (Math.abs(delta) < 30) { accumulatedDelta.current = 0; return; }
        triggerTransition(delta > 0 ? 'forward' : 'reverse');
      }, 60);
    };

    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e) => {
      if (isTransitioningRef.current || drawerOpenRef.current) return;
      
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      
      // Allow natural scroll down when at the last section
      if (currentSectionRef.current === totalSections && delta > 0) {
        return;
      }
      // Allow natural scroll when the window is scrolled past the top hero
      if (window.scrollY > 0) {
        return;
      }

      if (Math.abs(delta) < 50) return;
      triggerTransition(delta > 0 ? 'forward' : 'reverse');
    };

    // We can no longer use passive: false if we want to allow natural scrolling for touch events
    // However, since we return early when we WANT natural scrolling, preventing default inside
    // the event listener when needed is fine for wheel. Touch events don't easily allow e.preventDefault
    // conditionally on touchEnd if passive is true, but wheel does.
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    // Let's add a global listener for scrolling back up to trigger reverse on the hero when hitting top
    const onGlobalScroll = () => {
      // If they scrolled all the way to top, and are at the last section, we don't automatically go back,
      // but next wheel up will trigger the transition because window.scrollY === 0.
    };
    window.addEventListener('scroll', onGlobalScroll);

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('scroll', onGlobalScroll);
      clearTimeout(debounceTimer.current);
    };
  }, [containerRef, triggerTransition]);

  return {
    currentSection,
    isTransitioning,
    direction,
    onTransitionComplete,
    setDrawerOpen,
  };
}
