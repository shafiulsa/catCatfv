import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './DetailDrawer.css';

/**
 * DetailDrawer
 *
 * Slide-in panel from the right. Animated in/out with GSAP.
 * The semi-transparent backdrop blurs the video behind it.
 * Scroll engine is paused while this is open (via setDrawerOpen in parent).
 */
export default function DetailDrawer({ isOpen, section, onClose }) {
  const drawerRef = useRef(null);
  const contentItemsRef = useRef([]);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    if (isOpen) {
      // Slide drawer in
      gsap.fromTo(
        drawer,
        { x: '100%' },
        { x: '0%', duration: 0.65, ease: 'power4.out' }
      );
      // Stagger content items
      if (contentItemsRef.current.length) {
        gsap.fromTo(
          contentItemsRef.current,
          { opacity: 0, x: 24 },
          {
            opacity: 1,
            x: 0,
            duration: 0.55,
            stagger: 0.1,
            delay: 0.35,
            ease: 'power3.out',
          }
        );
      }
    } else {
      gsap.to(drawer, { x: '100%', duration: 0.5, ease: 'power3.in' });
    }
  }, [isOpen]);

  // Keyboard close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Collect stagger targets via ref callback
  const addToRefs = (el) => {
    if (el && !contentItemsRef.current.includes(el)) {
      contentItemsRef.current.push(el);
    }
  };

  // Reset ref list when section changes
  useEffect(() => { contentItemsRef.current = []; }, [section]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        ref={drawerRef}
        className="detail-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={section?.annotation.detail.heading ?? 'Section detail'}
        style={{ transform: 'translateX(100%)' }} /* initial off-screen */
      >
        {/* Close button */}
        <button
          className="detail-drawer__close"
          onClick={onClose}
          aria-label="Close panel"
        >
          <span className="close-icon">✕</span>
        </button>

        <div className="detail-drawer__scroll-area">
          {section && (
            <>
              {/* Section number */}
              <p ref={addToRefs} className="detail-drawer__section-label">
                SECTION {String(section.id).padStart(2, '0')}
              </p>

              {/* Heading */}
              <h3 ref={addToRefs} className="detail-drawer__heading">
                {section.annotation.detail.heading}
              </h3>

              {/* Divider */}
              <div ref={addToRefs} className="detail-drawer__divider" />

              {/* Description */}
              <p ref={addToRefs} className="detail-drawer__description">
                {section.annotation.detail.description}
              </p>

              {/* Subtitle & Title echo */}
              <div ref={addToRefs} className="detail-drawer__meta">
                <span className="meta-label">{section.annotation.subtitle}</span>
                <span className="meta-value">{section.annotation.title}</span>
              </div>

              {/* Media placeholder */}
              <div ref={addToRefs} className="detail-drawer__media">
                <div className="media-inner">
                  <button className="media-play" aria-label="Play video">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M8 5v14l11-7L8 5z" />
                    </svg>
                  </button>
                  <span className="media-label">WATCH FILM</span>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
