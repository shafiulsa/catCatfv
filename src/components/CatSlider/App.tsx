/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  Volume2,
  VolumeX,
  Plus,
  ChevronDown,
  Sparkles,
  Droplet,
  Compass,
  ArrowRight
} from "lucide-react";

import { SLIDES } from "./data";
import { ConcentricCounter } from "./components/ConcentricCounter";
import { BackgroundVideo } from "./components/BackgroundVideo";
import { TechDrawer } from "./components/TechDrawer";


import "./index.css";
import { useAmbientSynth } from "./hooks/useAmbientSynth";


export default function CatSlider() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load the immersive Web Audio Synthesizer
  const { isMuted, toggleMute, updateEngineProfile } = useAmbientSynth();

  const currentSlide = SLIDES[activeIndex];

  // DOM Refs for GSAP text dissolves
  const labelRef = useRef<HTMLSpanElement>(null);
  const superTitleRef = useRef<HTMLSpanElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const progressBarsRef = useRef<HTMLDivElement>(null);

  // Reference to handle wheel scrubbing debounce
  const lastWheelTime = useRef<number>(0);

  // Transition slides
  const handleSlideChange = (index: number) => {
    if (index === activeIndex || isScrolling) return;

    setIsScrolling(true);

    // Safety release: guarantee that isScrolling is reset to false after 1.2s in all cases
    const safetyTimer = setTimeout(() => {
      setIsScrolling(false);
    }, 1200);

    // Filter out any potential null refs (like labelRef which is not assigned) to prevent GSAP errors
    const elementsToAnimate = [
      superTitleRef.current,
      mainTitleRef.current,
      descRef.current
    ].filter((el): el is HTMLElement => el !== null);

    // 1. GSAP Text Out-dissolve animation
    gsap.to(elementsToAnimate, {
      opacity: 0,
      y: 12,
      duration: 0.35,
      stagger: 0.04,
      ease: "power2.in",
      onComplete: () => {
        // Change slide source state representing title labels and active video URL
        setActiveIndex(index);

        // Update browser audio profile to match the dynamic power mode
        updateEngineProfile(SLIDES[index].id);

        // 2. GSAP Text In-dissolve animation on the newly rendered state nodes
        setTimeout(() => {
          const freshElements = [
            superTitleRef.current,
            mainTitleRef.current,
            descRef.current
          ].filter((el): el is HTMLElement => el !== null);

          gsap.fromTo(
            freshElements,
            { opacity: 0, y: -12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.06,
              ease: "power2.out",
              onComplete: () => {
                clearTimeout(safetyTimer);
                setIsScrolling(false);
              },
            }
          );
        }, 50);
      },
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (drawerOpen) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        const nextIdx = (activeIndex + 1) % SLIDES.length;
        handleSlideChange(nextIdx);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        const prevIdx = (activeIndex - 1 + SLIDES.length) % SLIDES.length;
        handleSlideChange(prevIdx);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, drawerOpen, isScrolling]);

  // Scroll slide transitions disabled as requested.

  // Trigger audio adjustments when mute status is changed
  const handleToggleSound = () => {
    toggleMute();
    // After toggling, trigger pitch update to match active slide
    setTimeout(() => {
      updateEngineProfile(currentSlide.id);
    }, 100);
  };

  return (
    <div ref={containerRef} className="relative w-full pt-3 h-screen bg-[#030303] text-white flex flex-col justify-between overflow-hidden font-sans select-none" id="main-app-container">

      {/* 1. Cinematic Background Video Loop layer */}
      <BackgroundVideo videoUrl={currentSlide.videoUrl} activeId={currentSlide.id} />

      {/* 2. Vector Editorial Curved Masks & Ambient Light Grains */}
      {/* Dynamic grain film overlay to simulate print paper or cinematic noise */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay z-22">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Top Left Rounded Mask */}
      <div className="absolute top-0 left-0 w-64 h-64 z-15 pointer-events-none lg:block hidden">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-[#050505]">
          <path d="M0 0 L0 100 L100 0 Z" />
        </svg>
      </div>

      {/* Bottom Right Rounded Mask */}
      <div className="absolute bottom-0 right-0 w-64 h-64 z-15 pointer-events-none rotate-180 lg:block hidden">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-[#050505]">
          <path d="M0 0 L100 0 C60 0 0 60 0 100 Z" />
        </svg>
      </div>



      {/* 3. Global Navigation Header */}
      <header className="flex items-center justify-center relative z-30 w-full pt-8 pb-4" id="global-header">
        <div className="mx-auto w-full px-6 lg:px-12 flex items-center justify-between" style={{ maxWidth: '1380px' }}>
          {/* Top Left Branding */}
          <div className="flex flex-col select-none" id="brand-left">
            <span className="font-mono text-xs font-bold tracking-[0.3em] text-blue-400 uppercase select-none opacity-90">
              ROSSINAVI
            </span>
            <span className="font-display text-[9px] font-bold tracking-[0.4em] text-gray-400 uppercase mt-0.5 select-none opacity-85">
              BLUE EXPERIENCE
            </span>
          </div>

          {/* Top Center Logo wordmark */}
          <div className="flex flex-col items-center select-none" id="brand-logo-center">
            <h1
              className={`font-display text-2xl lg:text-3xl font-bold tracking-[0.55em] text-white transition-all duration-700 neon-text-orange`}
              style={{ textShadow: currentSlide.id === 1 ? "0 0 6px rgba(59,130,246,0.6)" : currentSlide.id === 2 ? "0 0 10px rgba(255,94,0,0.6)" : "0 0 6px rgba(6,182,212,0.6)" }}
            >
              SEACAT
            </h1>
            <span className="font-mono text-[7px] font-medium tracking-[0.5em] text-gray-400 mt-1 uppercase">
              NEW SUPERYACHT GENERATION
            </span>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-4" id="header-actions-right">
            {/* Ambient Synthesizer Control */}
            <button
              onClick={handleToggleSound}
              className="group flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-white/20 bg-zinc-950/40 backdrop-blur-sm transition-all duration-300 pointer-events-auto text-white/80 hover:text-white cursor-pointer focus:outline-none"
              title={isMuted ? "Enable Ambient Audio Synthesizer" : "Mute Soundscape"}
              id="audio-synth-toggle"
            >
              {isMuted ? (
                <VolumeX size={15} className="group-hover:scale-110 transition-transform" />
              ) : (
                <Volume2 size={15} className="group-hover:scale-110 transition-transform text-seacat-orange animate-pulse" style={{ color: currentSlide.id === 2 ? "#ff5e00" : undefined }} />
              )}
            </button>

            {/* Plus Specs Drawer Action */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="group relative flex items-center justify-center w-11 h-11 rounded-full border border-white/15 bg-zinc-950/40 backdrop-blur-sm pointer-events-auto cursor-pointer focus:outline-none"
              aria-label="View superyacht technical specifications drawer"
              id="tech-spec-toggle"
            >
              {/* Spinning colorful glow halo */}
              <div
                className="absolute inset-[-1.5px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]"
                style={{
                  background: `conic-gradient(from 0deg, ${currentSlide.id === 1 ? "#3b82f6" : currentSlide.id === 2 ? "#ff5e00" : "#06b6d4"
                    }, transparent 70%)`,
                  animation: "spin 5s linear infinite"
                }}
              />
              <div className="absolute inset-[0.5px] rounded-full bg-zinc-950" />
              <Plus size={16} className="relative z-10 text-white group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center flex-col relative z-20 pointer-events-none" id="main-center-stage">

        {/* Absolute center Concentric Counter */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <ConcentricCounter
            percentage={currentSlide.percentage}
            label={currentSlide.label}
            subLabel={currentSlide.percentageLabel}
            activeId={currentSlide.id}
            accentColor={currentSlide.accentTextColor}
          />
        </div>

        {/* Max-width container for the text panel to align left-center */}
        <div className="w-full mx-auto px-6 lg:px-12 flex-1 flex flex-col justify-center" style={{ maxWidth: '1380px' }}>

          <div className="pointer-events-auto text-left pl-6" id="text-dissolve-panel" style={{ maxWidth: '520px' }}>

            {/* Horizontal indicators placed above text */}
            <div
              className="flex items-center pb-3 justify-start gap-3 pb-5 pointer-events-auto"
              id="slider-horizontal-progress-nav"
            >
              {SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => handleSlideChange(idx)}
                  className="group relative py-2 focus:outline-none cursor-pointer"
                  aria-label={`Go to slide ${slide.label}`}
                  id={`nav-line-button-${slide.id}`}
                >
                  <div
                    className={`h-[1.5px] rounded-full transition-all duration-500 ${activeIndex === idx
                        ? "w-11 bg-white opacity-100"
                        : "w-6 bg-white/30 group-hover:bg-white/60 opacity-60"
                      }`}
                  />
                </button>
              ))}
            </div>

            {/* Text description content */}
            <span
              ref={superTitleRef}
              className="block font-mono text-[9px] tracking-[0.4em] text-white/50 uppercase mb-3"
            >
              {currentSlide.mode}
            </span>
            <h2
              ref={mainTitleRef}
              className="font-serif font-light text-4xl lg:text-5xl tracking-tight text-white mb-4 italic"
            >
              {currentSlide.title.split(' ')[0]} <span className="not-italic font-bold font-sans tracking-wide text-[#F0F0F0]">{currentSlide.title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p
              ref={descRef}
              className="text-xs lg:text-[13px] font-sans text-gray-400/90 leading-relaxed mb-2"
              style={{ maxWidth: '380px' }}
            >
              {currentSlide.description}
            </p>
          </div>
        </div>
      </main>

      <footer className="relative flex items-center justify-center z-30 w-full pb-8 pt-4" id="app-footer-bar">
        <div className="mx-auto w-full px-6 lg:px-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6" style={{ maxWidth: '1380px' }}>

          {/* Left Side: Empty now (moved to center) but keeps layout space if needed */}
          <div className="max-w-xl flex flex-col items-start text-left" id="footer-left-content">
          </div>

          {/* Right Side: Navigation details & badging */}
          <div className="flex flex-col items-start lg:items-end justify-between lg:h-6" id="footer-right-content">

            {/* Click hint to prompt scrolling */}
            <div className="hidden lg:flex items-center gap-1.5 opacity-40 hover:opacity-75 transition-opacity duration-300 select-none pb-4" id="scroll-prompt-block">
              <span className="font-mono text-[9px] font-semibold tracking-wider text-white uppercase">
                USE SCROLL WHEEL TO SCRUB MODES
              </span>
              <ArrowRight size={10} className="text-white rotate-90" />
            </div>

            <div className="flex items-center justify-between w-full lg:w-auto gap-8 lg:gap-11" id="footer-badging-subrow">
              {/* Scroll Next chevron arrow trigger */}
              <button
                onClick={() => {
                  const nextIdx = (activeIndex + 1) % SLIDES.length;
                  handleSlideChange(nextIdx);
                }}
                className="group flex flex-col items-center justify-center p-3 rounded-full border border-white/5 hover:border-white/20 bg-zinc-950/20 backdrop-blur-sm text-white/50 hover:text-white transition-all cursor-pointer pointer-events-auto focus:outline-none"
                title="Next mode"
                aria-label="Next slide"
                id="next-chevron-arrow-button"
              >
                <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
              </button>

              {/* Futuristic Sustainability/Quality Badge */}
              <div
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-zinc-950/60 backdrop-blur-md select-none"
                id="sustainability-badge"
              >
                <div className="relative flex items-center justify-center w-2.5 h-2.5">
                  <span className="absolute w-full h-full rounded-full bg-emerald-500 animate-ping opacity-45" />
                  <span className="relative w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <span className="font-mono text-[8px] font-bold tracking-widest text-emerald-400 uppercase">
                  EMISSION ZERO CERTIFIED
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 6. Technical specifications detailed drawer overlay */}
      <TechDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slideTitle={currentSlide.title}
        percentage={currentSlide.percentage}
        activeId={currentSlide.id}
      />

    </div>
  );
}
