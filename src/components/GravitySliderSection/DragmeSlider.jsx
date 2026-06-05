import { motion, useMotionValue } from "motion/react";
import { useEffect, useRef, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import "./GravitySliderSection.css";

export default function DragmeSlider({ isOverlapping, setIsOverlapping }) {
  const containerRef = useRef(null);
  const handleRef = useRef(null);

  // Motion value for x tracking
  const x = useMotionValue(0);

  // Stable overlap checker — always calls setIsOverlapping with the latest value
  // React will bail out of re-renders if the value hasn't actually changed.
  const checkOverlap = useCallback(() => {
    if (containerRef.current && handleRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const handleRect = handleRef.current.getBoundingClientRect();
      const tolerance = 5; // pixels tolerance
      const reached = handleRect.right >= containerRect.right - tolerance;
      setIsOverlapping(reached);
    }
  }, [setIsOverlapping]);

  // Subscribe to motion-value changes — fires on every drag frame
  useEffect(() => {
    const unsubscribe = x.on("change", checkOverlap);
    return unsubscribe;
  }, [x, checkOverlap]);

  return (
    <div
      ref={containerRef}
      className="dragme-container"
    >
      {/* Dashed horizontal vector slider tracks */}
      <div className="dragme-track" />

      {/* Guide sliding prompt text */}
      <span
        className="dragme-prompt"
        style={{
          opacity: isOverlapping ? 0 : 0.6,
        }}
      >
        TURN ON THE LIGHTS
      </span>

      {/* Target sliding controller handle */}
      <motion.div
        ref={handleRef}
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0}
        dragMomentum={false}
        onDrag={checkOverlap}
        onDragEnd={checkOverlap}
        style={{ x }}
        className="dragme-handle"
      >
        {/* Infinite rotating dash pattern */}
        <div className="cir" />
        
        {/* Visual SVGs */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
          <g id="Ellipse_1" data-name="Ellipse 1">
            <circle cx="350" cy="350" r="350" fill="none" stroke="#ff9823" strokeWidth="20" strokeLinecap="round" strokeDasharray="1081" />
            <circle cx="350" cy="350" r="342.5" fill="none" />
          </g>
        </svg>

        {/* Arrow icon shown when in Sleep Mode (left side) using non-unmounting opacity control to prevent pointer loss */}
        <ArrowRight
          className="arrow-icon"
          style={{ opacity: isOverlapping ? 0 : 1 }}
        />

        {/* "C" text shown in Light Mode (right side) matching screenshot 2 using non-unmounting opacity control */}
        <span 
          className="c-text"
          style={{ opacity: isOverlapping ? 1 : 0 }}
        >
          C
        </span>
      </motion.div>

      {/* Extreme Right Circle Endpoint */}
      <div className="end-reach">
        <div
          className="on-cir"
          style={{
            backgroundColor: isOverlapping ? "#ffffff" : "#ff9823",
            transform: isOverlapping ? "scale(1.2)" : "scale(1)",
          }}
        />
      </div>

      {/* Invisible math anchor collision tracker */}
      <div className="dragme-end-anchor" />
    </div>
  );
}
