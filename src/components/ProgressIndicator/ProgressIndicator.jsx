import './ProgressIndicator.css';

/**
 * ProgressIndicator
 *
 * Vertical strip of dots on the right edge. The active dot
 * (matching currentSection) glows with the accent color.
 * Section 0 (intro) shows no active dot.
 */
export default function ProgressIndicator({ totalSections, currentSection }) {
  return (
    <nav className="progress-indicator" aria-label="Section progress">
      {Array.from({ length: totalSections }, (_, i) => {
        const sectionNum = i + 1;
        const isActive = currentSection === sectionNum;
        return (
          <div
            key={sectionNum}
            className={`progress-indicator__dot ${isActive ? 'is-active' : ''}`}
            role="presentation"
            title={`Section ${sectionNum}`}
          />
        );
      })}
    </nav>
  );
}
