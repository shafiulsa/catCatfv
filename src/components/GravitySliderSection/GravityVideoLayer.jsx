import { useEffect, useRef } from "react";
import "./GravitySliderSection.css";

export default function GravityVideoLayer({ isOverlapping, videoSrc }) {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);

  // Auto-play insurance
  useEffect(() => {
    if (video1Ref.current) {
      video1Ref.current.play().catch((err) => console.log("Video 1 auto-play deferred:", err));
    }
    if (video2Ref.current) {
      video2Ref.current.play().catch((err) => console.log("Video 2 auto-play deferred:", err));
    }
  }, [videoSrc]);

  return (
    <>
      {/* Background Video 2 (Glowing Night Render - Under) */}
      <video
        ref={video2Ref}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="gravity-video gravity-video--base"
      />
      
      {/* Background Video 1 (Dusk/Light Render - Overlay) */}
      <video
        ref={video1Ref}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        style={{ opacity: isOverlapping ? 0 : 1 }}
        className="gravity-video"
      />
    </>
  );
}
