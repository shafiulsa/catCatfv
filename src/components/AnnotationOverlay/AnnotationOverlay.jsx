import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './AnnotationOverlay.css';

/**
 * AnnotationOverlay
 *
 * Displays a subtitle, title, and interactive "+" diamond marker
 * for a single section. Animated in by GSAP when the section is
 * active and not transitioning. Fades out instantly on transition start.
 *
 * The marker position (x, y) comes from the sections config and
 * is expressed as viewport-percentage strings (e.g. "55%", "42%").
 */
export default function AnnotationOverlay({
  section,
  isActive,
  isTransitioning,
  onMarkerClick,
}) {
  const wrapRef = useRef(null);
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);
  const markerRef = useRef(null);
  const pulseAnim = useRef(null); // keep reference to the pulse tween

  // Fade in on rest state, fade out on transition
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    if (isActive && !isTransitioning) {
      // Kill any running fade-out
      gsap.killTweensOf(wrap);

      // Stagger-animate the 3 elements in
      gsap.fromTo(
        [subtitleRef.current, titleRef.current, markerRef.current],
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          onComplete: () => {
            // Gentle pulse on marker after it appears
            pulseAnim.current = gsap.to(markerRef.current, {
              scale: 1.08,
              duration: 1.4,
              yoyo: true,
              repeat: -1,
              ease: 'sine.inOut',
            });
          },
        }
      );
    } else {
      // Kill pulse and fade everything out quickly
      pulseAnim.current?.kill();
      gsap.to(
        [subtitleRef.current, titleRef.current, markerRef.current],
        { opacity: 0, y: -8, duration: 0.25, ease: 'power2.in' }
      );
    }

    return () => {
      pulseAnim.current?.kill();
    };
  }, [isActive, isTransitioning]);

  if (!section) return null;

  const { annotation } = section;
  const { marker } = annotation;

  return (
    <div
      ref={wrapRef}
      className="annotation"
      style={{ left: marker.x, top: marker.y }}
      aria-hidden={!isActive}
    >
      {/* Marker + connector line */}
      <button
        ref={markerRef}
        className="annotation__marker"
        style={{ opacity: 0 }} /* initial for GSAP */
        onClick={() => isActive && !isTransitioning && onMarkerClick(section)}
        aria-label={`Learn more about ${annotation.title}`}
        tabIndex={isActive && !isTransitioning ? 0 : -1}
      >
        <span className="annotation__marker-plus">+</span>
        <span className="annotation__marker-diamond" />
        <span className="annotation__marker-ring" />
      </button>

      {/* Text block below / beside the marker */}
      <div className="annotation__text">
        <p ref={subtitleRef} className="annotation__subtitle" style={{ opacity: 0 }}>
          {annotation.subtitle}
        </p>
        <h2 ref={titleRef} className="annotation__title" style={{ opacity: 0 }}>
          {annotation.title}
        </h2>
      </div>
    </div>
  );
}
