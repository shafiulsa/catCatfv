import React, { useRef } from "react";
import "./BrainSection.css";

export default function BrainSection() {
  const videoRef = useRef(null);

  // const handleVideoError = () => {
  //   // Falls back gracefully if video asset has path issues
  //   if (videoRef.current) {
  //     videoRef.current.src = "https://assets.mixkit.co/videos/preview/mixkit-cyber-brain-glowing-with-connections-42512-large.mp4";
  //     videoRef.current.play().catch(err => console.log("Auto playback fallback failed: ", err));
  //   }
  // };

  return (
    <section className="ai-section-container h-full w-full" id="ai-infotainment-section">
      {/* 1. Backdrop Video Loop Layer (renders behind brain and UI text overlay) */}
      <video
        ref={videoRef}
        src="/brain/4e7a159c-a32c-41d9-8ee2-102986531bb0.webm"
        autoPlay
        loop
        muted
        playsInline
        // onError={handleVideoError}
        className="video-background-layer"
        id="bg-video-fluid"
      />

      {/* Solid black horizontal background vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/90 z-3 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-transparent to-bg/95 z-3 pointer-events-none" />

      {/* 2. Left Slanted Sleek Black Docking Panel Overlay */}
      <div className="diagonal-brand-panel" id="diagonal-yacht-blade" />

      {/* Left Margin Brand Sidebar Navigation Links */}
      <div className="sidebar-brand-nav" id="sidebar-yacht-meta">
        <span className="sidebar-label-main">ROSSINAVI</span>
        <span className="sidebar-label-sub">BLUE EXPERIENCE</span>
      </div>

      {/* 3. Center Header: Seacat Branding Logo Wordmark */}
      <header className="seacat-header" id="seacat-brandcard">
        <div className="seacat-logo-container">
          <span className="logo-letter letter-orange">S</span>
          <span className="logo-letter letter-orange">E</span>
          <span className="logo-letter letter-orange">A</span>
          <span className="logo-letter letter-chrome">C</span>
          <span className="logo-letter letter-chrome">A</span>
          <span className="logo-letter letter-chrome">T</span>
        </div>
        <div className="seacat-logo-sub">NEW SUPERYACHT GENERATION</div>
      </header>

      {/* 5. Lower Column Layout: AI Title and Deep Descriptions */}
      <main className="content-grid-overlay">
        <div className="bottom-info-block" id="ai-text-block">
          
          <h2 className="info-title" id="ai-main-title">
            AI & INFOTAINMENT
          </h2>

          <div className="info-columns-layout" id="ai-split-paragraph">
            {/* Column 1: Core AI & Navigation Vision */}
            <div className="info-column" id="paragraph-col-1">
              <p>
                Imagine being in the middle of the blue Caribbean and having the most
                advanced technology at your disposal. It’s not a movie. It’s{" "}
                <span className="text-white font-medium">Sea Cat</span>.
                Monitoring battery performance, checking emissions, making your
                navigation just perfect: artificial intelligence is the
                very soul of this catamaran. A brain capable of learning and
                anticipating the needs of guests on board. Energy efficiency is
                guaranteed.
              </p>
            </div>

            {/* Column 2: Hybrid Power Management & Cultural Geolocation Infotainment */}
            <div className="info-column" id="paragraph-col-2">
              <p>
                Where a hybrid-electric propulsion system is installed, the software is
                also able to manage the battery pack in order to keep it in the
                optimal range. And with AI, every trip is also a show. The AI is
                equipped with an infotainment system that offers weather services,
                geographic-cultural information, and the routes of boats. Through
                geolocation, it can recognise natural features and detect events on land.
              </p>
            </div>
          </div>

        </div>
      </main>
    </section>
  );
}

