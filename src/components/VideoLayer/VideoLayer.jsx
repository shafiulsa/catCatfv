import { useRef, useEffect, useCallback, memo } from 'react';
import gsap from 'gsap';
import './VideoLayer.css';

/**
 * VideoLayer
 *
 * Renders TWO hidden <video> elements — one for forward, one for reverse.
 * All 10 src attributes are pre-set on mount so the browser can begin
 * buffering immediately. On each transition, we:
 *   1. Bring the correct video to the front (z-index).
 *   2. Reset to frame 0 and play.
 *   3. Fade the active video in (GSAP) so there is never a black flash.
 *   4. On 'ended', call onTransitionComplete to unlock scrolling.
 *
 * We use TWO refs (forwardRef / reverseRef) to avoid the browser having
 * to re-decode the stream every time we swap src.
 */
function VideoLayer({
  sections,
  currentSection,
  direction,
  isTransitioning,
  onTransitionComplete,
}) {
  // One element per direction — both live in the DOM at all times.
  const forwardRef = useRef(null);
  const reverseRef = useRef(null);
  // Track which src is currently loaded in each element.
  const forwardSrcRef = useRef(null);
  const reverseSrcRef = useRef(null);

  /** Pre-set the src for the video that will play next and begin buffering. */
  const primeFwd = useCallback((url) => {
    const el = forwardRef.current;
    if (!el || forwardSrcRef.current === url) return;
    forwardSrcRef.current = url;
    el.src = url;
    el.load();
  }, []);

  const primeRev = useCallback((url) => {
    const el = reverseRef.current;
    if (!el || reverseSrcRef.current === url) return;
    reverseSrcRef.current = url;
    el.src = url;
    el.load();
  }, []);

  /**
   * Whenever the section changes (before a transition starts),
   * prime the NEXT forward + reverse videos so they are ready.
   */
  useEffect(() => {
    // Forward: section we will go to next.
    const nextFwdIdx = currentSection; // sections is 0-indexed; currentSection is 1-based
    if (nextFwdIdx < sections.length) {
      primeFwd(sections[nextFwdIdx].forwardVideo);
    }
    // Reverse: section we can come back from.
    const nextRevIdx = currentSection - 1;
    if (nextRevIdx >= 0) {
      primeRev(sections[nextRevIdx].reverseVideo);
    }
  }, [currentSection, sections, primeFwd, primeRev]);

  /** Play the correct video when a transition is triggered. */
  useEffect(() => {
    if (!isTransitioning || !direction) return;

    let activeEl, inactiveEl;

    if (direction === 'forward') {
      activeEl = forwardRef.current;
      inactiveEl = reverseRef.current;
      // Ensure the correct src is loaded
      const srcIdx = currentSection - 1;
      if (srcIdx >= 0 && srcIdx < sections.length) {
        const url = sections[srcIdx].forwardVideo;
        if (forwardSrcRef.current !== url) {
          forwardSrcRef.current = url;
          activeEl.src = url;
        }
      }
    } else {
      activeEl = reverseRef.current;
      inactiveEl = forwardRef.current;
      // Reverse video for the section we are LEAVING (currentSection + 1 before state update)
      const srcIdx = currentSection; // already decremented
      if (srcIdx >= 0 && srcIdx < sections.length) {
        const url = sections[srcIdx].reverseVideo;
        if (reverseSrcRef.current !== url) {
          reverseSrcRef.current = url;
          activeEl.src = url;
        }
      }
    }

    if (!activeEl) { onTransitionComplete(); return; }

    // Bring active video to top, keep inactive below
    activeEl.style.zIndex = '2';
    if (inactiveEl) inactiveEl.style.zIndex = '1';

    // Reset playhead
    activeEl.currentTime = 0;

    const handleEnded = () => {
      onTransitionComplete();
    };

    const handleError = () => {
      console.warn('VideoLayer: video error, completing transition anyway.');
      onTransitionComplete();
    };

    activeEl.addEventListener('ended', handleEnded, { once: true });
    activeEl.addEventListener('error', handleError, { once: true });

    // Fade in the active video (from 0 to 1) and play
    gsap.fromTo(activeEl, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'none' });

    const playPromise = activeEl.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Autoplay blocked (e.g. browser policy) — unlock scroll.
        onTransitionComplete();
      });
    }

    return () => {
      activeEl.removeEventListener('ended', handleEnded);
      activeEl.removeEventListener('error', handleError);
    };
  }, [isTransitioning, direction, currentSection, sections, onTransitionComplete]);

  return (
    <div className="video-layer">
      <video
        ref={forwardRef}
        className="video-layer__video"
        muted
        playsInline
        preload="auto"
      />
      <video
        ref={reverseRef}
        className="video-layer__video"
        muted
        playsInline
        preload="auto"
      />
      <div className="video-layer__vignette" />
    </div>
  );
}

export default memo(VideoLayer);
