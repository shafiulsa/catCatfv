import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { VolumeX, Sun, ChevronDown, Anchor, MoveRight, Layers, Cpu, BatteryCharging } from "lucide-react";
import "./AiInfotainment.css";

/* ── Image imports (copied into catCatfv/src/assets) ── */
import seacatDayMain from "../../assets/seacat_day_main_1780729363409.png";
import seacatCyanNight from "../../assets/seacat_cyan_night_1780729383802.png";
import seacatIslandDock from "../../assets/seacat_island_dock_1780729403038.png";
import seacatInterior from "../../assets/seacat_interior_empty_1780735147796.png";
import seacatSolarDeck from "../../assets/seacat_solar_deck_1780729437184.png";

export default function AiInfotainment() {
  const containerRef = useRef(null);

  /* ── Navigation & Interactive States ── */
  const [activeTab, setActiveTab] = useState("bento");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [hoveredSpecs, setHoveredSpecs] = useState(null);

  /* ── Web Audio ocean waves synthesizer refs ── */
  const audioContextRef = useRef(null);
  const waveGainNodeRef = useRef(null);
  const filterNodeRef = useRef(null);
  const oscillatorIntervalRef = useRef(null);

  /* ── Ambient Sound Toggle ── */
  const toggleAmbientSound = () => {
    if (isAudioPlaying) {
      if (waveGainNodeRef.current && audioContextRef.current) {
        waveGainNodeRef.current.gain.setValueAtTime(waveGainNodeRef.current.gain.value, audioContextRef.current.currentTime);
        waveGainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioContextRef.current.currentTime + 1.2);
        setTimeout(() => {
          setIsAudioPlaying(false);
        }, 1200);
      } else {
        setIsAudioPlaying(false);
      }
    } else {
      try {
        if (!audioContextRef.current) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          const ctx = new AudioContextClass();
          audioContextRef.current = ctx;

          const bufferSize = ctx.sampleRate * 4;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);

          let lastOut = 0.0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut * 0.99 + white * 0.01);
            lastOut = output[i];
            output[i] *= 3.5;
          }

          const noiseSource = ctx.createBufferSource();
          noiseSource.buffer = noiseBuffer;
          noiseSource.loop = true;

          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(320, ctx.currentTime);
          filter.Q.setValueAtTime(1.0, ctx.currentTime);

          const gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(0.0, ctx.currentTime);

          noiseSource.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);

          noiseSource.start(0);

          waveGainNodeRef.current = gainNode;
          filterNodeRef.current = filter;

          let cycle = 0;
          const swellInterval = setInterval(() => {
            if (waveGainNodeRef.current && filterNodeRef.current && audioContextRef.current) {
              const now = audioContextRef.current.currentTime;
              cycle += Math.PI / 12;
              const swellIntensity = Math.sin(cycle) * 0.5 + 0.5;

              waveGainNodeRef.current.gain.linearRampToValueAtTime(0.08 + (swellIntensity * 0.22), now + 1.2);
              filterNodeRef.current.frequency.linearRampToValueAtTime(260 + (swellIntensity * 280), now + 1.2);
            }
          }, 1500);

          oscillatorIntervalRef.current = swellInterval;
        }

        if (audioContextRef.current.state === "suspended") {
          audioContextRef.current.resume();
        }

        if (waveGainNodeRef.current && audioContextRef.current) {
          waveGainNodeRef.current.gain.setValueAtTime(0.0001, audioContextRef.current.currentTime);
          waveGainNodeRef.current.gain.exponentialRampToValueAtTime(0.3, audioContextRef.current.currentTime + 1.5);
        }

        setIsAudioPlaying(true);
      } catch (err) {
        console.error("Web Audio initialization failed", err);
        setIsAudioPlaying(false);
      }
    }
  };

  const handleScrollTracking = () => {
    if (!containerRef.current) return;
    const scrollPosition = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight || window.innerHeight;

    const calculatedIndex = Math.round(scrollPosition / height);
    const sections = ["bento", "meraviglia"];

    if (calculatedIndex >= 0 && calculatedIndex < sections.length) {
      if (activeTab !== sections[calculatedIndex]) {
        setActiveTab(sections[calculatedIndex]);
      }
    }
  };

  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScrollTracking);
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScrollTracking);
      }
      if (oscillatorIntervalRef.current) {
        clearInterval(oscillatorIntervalRef.current);
      }
    };
  }, [activeTab]);

  const scrollToSection = (id) => {
    const targetElement = document.getElementById(id);
    if (targetElement && containerRef.current) {
      targetElement.scrollIntoView({ behavior: "smooth" });
      setActiveTab(id);
    }
  };

  return (
    <div className="ai-section-container" ref={containerRef}>

      {/* ── FLOATING SOUNDSCAPE CONTROL PUCK ── */}
      <button
        type="button"
        id="soundscape-control-puck"
        className="floating-audio-puck"
        onClick={toggleAmbientSound}
        aria-label="Toggle ambient wave sounds"
      >
        {isAudioPlaying ? (
          <div className="soundwave-bars-row">
            <span className="soundwave-bar bar-1"></span>
            <span className="soundwave-bar bar-2"></span>
            <span className="soundwave-bar bar-3"></span>
            <span className="soundwave-bar bar-4"></span>
          </div>
        ) : (
          <VolumeX size={18} />
        )}
      </button>

      {/* ── RIGHT MARGIN NAVIGATION DOTS ── */}
      <div className="scroll-elevator-nav" id="experience-navigator">
        <button
          className={`elevator-dot ${activeTab === "bento" ? "active" : ""}`}
          onClick={() => scrollToSection("bento")}
          aria-label="Scroll to Bento Gallery"
        >
          <span className="elevator-dot-tooltip">BENTO GALLERY</span>
        </button>
        <button
          className={`elevator-dot ${activeTab === "meraviglia" ? "active" : ""}`}
          onClick={() => scrollToSection("meraviglia")}
          aria-label="Scroll to Into The Meraviglia"
        >
          <span className="elevator-dot-tooltip">MERAVIGLIA</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 1: BENTO GRID GALLERY
          ══════════════════════════════════════════ */}
      <section className="seacat-section-slide bento-slide" id="bento">
        <div className="bento-inner">

          {/* Header */}
          <div className="bento-header">
            <div className="bento-header-label">ECO-SAILING SPECS</div>
            <h2 className="bento-header-title">SEACAT BENTO SHOWCASE</h2>
          </div>

          {/* Bento Grid */}
          <div className="bento-grid">

            {/* Box 1 – Hero Large */}
            <div
              className="bento-cell bento-hero"
              onMouseEnter={() => setHoveredSpecs("ecology")}
              onMouseLeave={() => setHoveredSpecs(null)}
            >
              <img src={seacatDayMain} alt="Seacat Day rendering" className="bento-cell-img" />
              <div className="bento-cell-gradient" />

              <div className="bento-cell-tags">
                <span className="tag-accent">ECO CHIC 01</span>
                <span className="tag-dark">LOA: 20.35M</span>
              </div>

              <div className="bento-cell-bottom-info">
                <h4 className="bento-cell-title">ROSSINAVI CATAMARAN INTEGRITY</h4>
                <p className="bento-cell-desc">
                  Built entirely of grade solar materials, merging a lightweight space-frame aluminum hull with low fluid drag coefficients.
                </p>
              </div>

              {/* Hover specs overlay */}
              <div className={`bento-hover-overlay hover-orange ${hoveredSpecs === "ecology" ? "visible" : ""}`}>
                <div className="hover-header">
                  <Layers className="hover-icon-orange" size={16} />
                  <span className="hover-label-orange">ARCHITECTURE HIGHLIGHTS</span>
                </div>
                <div className="hover-specs-grid">
                  <div>
                    <div className="spec-label">BEAM overall</div>
                    <div className="spec-value">13.75 m / 45.1 ft</div>
                  </div>
                  <div>
                    <div className="spec-label">MAXIMUM DRAFT</div>
                    <div className="spec-value">1.65 m / 5.4 ft</div>
                  </div>
                  <div>
                    <div className="spec-label">GROSS TONNAGE</div>
                    <div className="spec-value">~ 180 GT</div>
                  </div>
                  <div>
                    <div className="spec-label">CRUISING mode</div>
                    <div className="spec-value">Pure Electric silent</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2 – Solar Deck */}
            <div
              className="bento-cell bento-solar"
              onMouseEnter={() => setHoveredSpecs("solar")}
              onMouseLeave={() => setHoveredSpecs(null)}
            >
              <img src={seacatSolarDeck} alt="Solar deck details" className="bento-cell-img" />
              <div className="bento-cell-gradient bento-cell-gradient--dark" />

              <div className="bento-cell-tags">
                <span className="tag-green">
                  <Sun size={10} /> SOLAR TECHNOLOGY
                </span>
              </div>

              <div className="bento-cell-bottom-info">
                <h4 className="bento-cell-title bento-cell-title--with-arrow">
                  PHOTOVOLTAIC CELLS <MoveRight size={10} className="arrow-icon-sea" />
                </h4>
                <div className="bento-cell-mono-desc">154 SQ.M OF INTEGRATED GENERATOR TILES • TO COMFORT THE OCEANS</div>
              </div>

              {/* Hover Solar Info */}
              <div className={`bento-hover-overlay hover-green ${hoveredSpecs === "solar" ? "visible" : ""}`}>
                <div className="hover-header">
                  <BatteryCharging size={14} className="hover-icon-green" />
                  <span className="hover-label-green">SOLAR CAPACITIES</span>
                </div>
                <div className="hover-body-text">
                  Custom dark carbon photovoltaics feed electricity directly into high-energy cells to ensure up to 100% hotel load independence.
                </div>
                <div className="hover-accent-sea">ANNUAL EMISSIONS REDUCTIONS: OVER 40 TONS OF CO₂</div>
              </div>
            </div>

            {/* Box 3 – Interior */}
            <div className="bento-cell bento-interior">
              <img src={seacatInterior} alt="Teak interior" className="bento-cell-img" />
              <div className="bento-cell-gradient" />
              <div className="bento-cell-bottom-info bento-cell-bottom-info--compact">
                <span className="bento-micro-label bento-micro-label--sea">PREMIUM CABIN</span>
                <span className="bento-micro-title">SENSORY SILENCE</span>
              </div>
            </div>

            {/* Box 4 – Island dock */}
            <div className="bento-cell bento-island">
              <img src={seacatIslandDock} alt="Sea Cat near cliffs" className="bento-cell-img" />
              <div className="bento-cell-gradient" />
              <div className="bento-cell-bottom-info bento-cell-bottom-info--compact">
                <span className="bento-micro-label bento-micro-label--orange">ECO DESTINATIONS</span>
                <span className="bento-micro-title">PROTECTED BAYS</span>
              </div>
            </div>

            {/* Box 5 – Cyan Glow Night */}
            <div
              className="bento-cell bento-night"
              onMouseEnter={() => setHoveredSpecs("electric")}
              onMouseLeave={() => setHoveredSpecs(null)}
            >
              <img src={seacatCyanNight} alt="Seacat Cyan Glow at Night" className="bento-cell-img" />
              <div className="bento-cell-gradient bento-cell-gradient--dark" />

              <div className="bento-cell-tags">
                <span className="tag-cyan">TURQUOISE GLOW</span>
              </div>

              <div className="bento-cell-bottom-info">
                <h4 className="bento-cell-title">NIGHT SAILING MODE DETECTOR</h4>
                <div className="bento-cell-mono-desc">100% PURE ELECTRIC SILENT • REDUCING MECHANICAL STRAINS TO ZERO</div>
              </div>

              {/* Hover specs */}
              <div className={`bento-hover-overlay hover-cyan ${hoveredSpecs === "electric" ? "visible" : ""}`}>
                <div className="hover-header">
                  <Cpu size={14} className="hover-icon-cyan" />
                  <span className="hover-label-cyan">PROPULSION INTELLIGENCE</span>
                </div>
                <div className="hover-body-text">
                  Advanced battery pack monitored by AI systems. Full electric navigation allows overnight access to closed sanctuaries with zero footprint.
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="interactive-indicator interactive-indicator--clickable"
            onClick={() => scrollToSection("meraviglia")}
          >
            <ChevronDown size={14} className="bounce-icon" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2: MERAVIGLIA
          ══════════════════════════════════════════ */}
      <section className="seacat-section-slide meraviglia-slide" id="meraviglia">
        <div className="meraviglia-inner">

          {/* Top Header */}
          <div className="meraviglia-top-bar">
            <div className="seacat-logo-container">
              <span className="logo-letter letter-orange">S</span>
              <span className="logo-letter letter-orange">E</span>
              <span className="logo-letter letter-orange">A</span>
              <span className="logo-letter letter-chrome">C</span>
              <span className="logo-letter letter-chrome">A</span>
              <span className="logo-letter letter-chrome">T</span>
            </div>
            <div className="meraviglia-top-label">SEACAT EXPERIENCE</div>
          </div>

          {/* Overlapping Content */}
          <div className="meraviglia-composite">

            {/* Main Hero Night Block */}
            <div className="meraviglia-hero-block">
              <img src={seacatCyanNight} alt="Seacat glowing underwater turquoise sunset" className="meraviglia-hero-img" />
              <div className="cyan-pulse-overlay" />
              <div className="meraviglia-hero-vignette" />
            </div>

            {/* Floating Narrative Card */}
            <motion.div
              className="editorial-story-card meraviglia-story-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1 }}
            >
              <div className="story-header-brand">SENSORIAL EXPERIENCE</div>
              <h3 className="meraviglia-title">
                INTO THE <br />
                <span className="meraviglia-italic">MERAVIGLIA</span>
              </h3>

              <p className="story-body-text">
                The sound of every single wave. The wind that paints your moments with pristine peace.
                The sea in all its wonderful and incredible organic purity. Electric sailing elicits
                a multitude of premium sensations, but there is one that you will never forget: experiencing
                the natural habitat without human limits. Enjoying the absolute pleasure of silence,
                nature will welcome you and lull you in its arms.
              </p>
            </motion.div>

            {/* Understory Smaller Pictures */}
            <div className="meraviglia-side-images">
              <div className="meraviglia-side-thumb">
                <img src={seacatIslandDock} alt="Ocean shore island dock" className="meraviglia-thumb-img" />
              </div>
              <div className="meraviglia-side-thumb meraviglia-side-thumb--large">
                <img src={seacatInterior} alt="Teak lounge cabin sunset view" className="meraviglia-thumb-img" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="meraviglia-footer">
            <div className="meraviglia-footer-copy">
              ROSSINAVI © 2026 • SEACAT ENERGY CATAMARAN SERIES • POWERED BY BLUE EXPERIENCE
            </div>
            <div className="meraviglia-footer-links">
              <a href="https://www.rossinavi.it" target="_blank" rel="noopener noreferrer">ROSSINAVI.IT</a>
              <a href="https://blue.rossinavi.it" target="_blank" rel="noopener noreferrer">BLUE EXPERIENCE</a>
              <span className="footer-divider">|</span>
              <span className="footer-crafted">MADE WITH INTENTIONAL CRAFTSMANSHIP</span>
            </div>
          </footer>

        </div>
      </section>

    </div>
  );
}
