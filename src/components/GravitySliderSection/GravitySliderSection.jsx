import { useState } from "react";
import GravityVideoLayer from "./GravityVideoLayer";
import DragmeSlider from "./DragmeSlider";
import "./GravitySliderSection.css";

export default function GravitySliderSection() {
  const [isOverlapping, setIsOverlapping] = useState(false);

  // The local .webm file added by the user inside /public is served at "/9731c87a-8d0a-406d-bfce-f816f9c2c951.webm"
  const videoSrc = "/9731c87a-8d0a-406d-bfce-f816f9c2c951.webm";

  return (
    <section className="gravity-slider-section">
      {/* Background Videos with cross-fade logic */}
      <GravityVideoLayer isOverlapping={isOverlapping} videoSrc={videoSrc} />

      {/* TOP HUD BAR */}
      <header className="gravity-header">
        {/* Left branding */}
        <div className="gravity-brand-left">
          <span className="gravity-brand-main">
            ROSSINAVI
          </span>
          <span className="gravity-brand-sub">
            BLUE EXPERIENCE
          </span>
        </div>

        {/* Center Logo */}
        <div className="gravity-logo-center">
          <h1 className="gravity-logo-title">
            <span className="text-orange">SEA</span>
            <span className="text-blue">CAT</span>
          </h1>
          <span className="gravity-logo-tagline">
            NEW SUPERYACHT GENERATION
          </span>
        </div>

        {/* Right menu utility circle */}
        <div className="gravity-menu-btn-wrapper">
          <button 
            type="button"
            aria-label="Add element"
            className="gravity-menu-btn"
          >
            +
          </button>
        </div>
      </header>

      {/* RIGHT SLATE SLIDER ACCENT LINE */}
      <div className="gravity-accent-line">
        <div 
          className="gravity-accent-fill"
          style={{ 
            height: isOverlapping ? "100%" : "20%"
          }}
        />
      </div>

      {/* Physics-based dragging slider interface */}
      <DragmeSlider isOverlapping={isOverlapping} setIsOverlapping={setIsOverlapping} />

      {/* BOTTOM SECTION (HIBERNATION PARAGRAPH INFO) */}
      <footer className="gravity-footer">
        <div className="gravity-footer-inner">
          {/* Section title heading */}
          <div>
            <h2 className="gravity-footer-title">
              HIBERNATION
            </h2>
          </div>

          {/* Description text block */}
          <div>
            <p className="gravity-footer-desc">
              When Sea Cat is stationary and moored, it becomes the largest power bank in the world. In fact, consumption is reduced to a minimum and the energy generated can be sold to the quay or to a private property. There is enough energy to supply lighting to an entire villa.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}
