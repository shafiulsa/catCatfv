/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Zap } from "lucide-react";

interface ConcentricCounterProps {
  percentage: number;
  label: string;
  subLabel: string;
  activeId: number;
  accentColor: string;
}

export const ConcentricCounter: React.FC<ConcentricCounterProps> = ({
  percentage,
  label,
  subLabel,
  activeId,
  accentColor,
}) => {
  const [currentPercent, setCurrentPercent] = useState<number>(0);
  const [currentRadius, setCurrentRadius] = useState<number>(105);
  const [currentScale, setCurrentScale] = useState<number>(0.8);
  const [outerArcRotation, setOuterArcRotation] = useState<number>(0);

  // References for animation targets
  const containerRef = useRef<HTMLDivElement>(null);
  const prevIdRef = useRef<number>(activeId);

  // Target angles for the indicator:
  // Slide 1 (01) -> 45 degrees
  // Slide 2 (02) -> 180 degrees
  // Slide 3 (03) -> 300 degrees
  const getAngleForSlide = (id: number) => {
    switch (id) {
      case 1:
        return 45;
      case 2:
        return 180;
      case 3:
        return 300;
      default:
        return 0;
    }
  };

  useEffect(() => {
    const targetPercent = percentage;
    const targetAngle = getAngleForSlide(activeId);

    // Initial values before starting animation
    const animState = {
      percent: 0,
      radius: 90,
      scale: 0.78,
      rotation: prevIdRef.current === activeId ? 0 : getAngleForSlide(prevIdRef.current),
    };

    // Kill any existing animations on this state object
    gsap.killTweensOf(animState);

    // Dynamic, premium one-shot expansion of radius and counting percent when slide loads
    gsap.to(animState, {
      percent: targetPercent,
      radius: 110, // expanded premium radius
      scale: 1.0, // target natural scale
      rotation: targetAngle,
      duration: 1.6,
      ease: "power3.out",
      onUpdate: () => {
        setCurrentPercent(Math.round(animState.percent));
        setCurrentRadius(animState.radius);
        setCurrentScale(animState.scale);
        setOuterArcRotation(animState.rotation);
      },
    });

    // Also add a subtle magnetic entrance scale to the whole element for tactile feedback
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { filter: "brightness(0.5) contrast(0.8)", scale: 0.92 },
        { filter: "brightness(1) contrast(1)", scale: 1, duration: 1.2, ease: "power2.out" }
      );
    }

    prevIdRef.current = activeId;
  }, [activeId, percentage]);

  // SVG dimensions
  const size = 380;
  const center = size / 2;

  // Concentric ring radii based on dynamic currentRadius
  const innerGlowRadius = currentRadius * 0.85;
  const orangeRingRadius = currentRadius;
  const dottedOrbitRadius = currentRadius * 1.15;
  const outerTrackRadius = currentRadius * 1.28;

  // Mathematical dash array calculation for active percentage ring
  // Circumference = 2 * pi * r
  const orangeCircumference = 2 * Math.PI * orangeRingRadius;
  const dashOffset = orangeCircumference - (orangeCircumference * currentPercent) / 100;

  // Polar helper to position labels (01, 02, 03) around the dial
  const getCoordinatesForAngle = (angleInDegrees: number, radius: number) => {
    // Offset by -90 degrees so 0 degrees is at the top
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: center + radius * Math.cos(angleInRadians),
      y: center + radius * Math.sin(angleInRadians),
    };
  };

  // Node coordinate coordinates
  const p01 = getCoordinatesForAngle(45, dottedOrbitRadius);
  const p02 = getCoordinatesForAngle(180, dottedOrbitRadius);
  const p03 = getCoordinatesForAngle(300, dottedOrbitRadius);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center pointer-events-none select-none"
      style={{ width: size, height: size }}
      id="concentric-counter-wrapper"
    >
      {/* Background ambient lighting radiating from center */}
      <div 
        className="absolute w-72 h-72 rounded-full pointer-events-none transition-colors duration-1000 mix-blend-screen opacity-15 blur-3xl"
        style={{
          backgroundColor: activeId === 1 ? "#0066ff" : activeId === 2 ? "#ff5e00" : "#00f0ff",
        }}
      />

      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        className="relative z-10 overflow-visible"
        id="concentric-svg"
      >
        <defs>
          {/* Linear gradient for orange ring */}
          <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff9f43" />
            <stop offset="100%" stopColor="#ff5e00" />
          </linearGradient>

          {/* Cyan/Blue gradient */}
          <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Blue/Water gradient */}
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          {/* Outer glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g style={{ transform: `scale(${currentScale})`, transformOrigin: `${center}px ${center}px` }}>
          {/* 1. Inner delicate decorative circles */}
          <circle
            cx={center}
            cy={center}
            r={innerGlowRadius}
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.5"
            strokeOpacity="0.1"
          />

          <circle
            cx={center}
            cy={center}
            r={innerGlowRadius - 8}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            strokeDasharray="2, 6"
            strokeOpacity="0.2"
          />

          {/* 2. Main customizable colored percentages ring */}
          <circle
            cx={center}
            cy={center}
            r={orangeRingRadius}
            fill="none"
            stroke="#111111"
            strokeWidth="5"
          />

          {/* Primary active dynamic progress arc */}
          <circle
            cx={center}
            cy={center}
            r={orangeRingRadius}
            fill="none"
            stroke={
              activeId === 1
                ? "url(#blueGradient)"
                : activeId === 2
                ? "url(#orangeGradient)"
                : "url(#cyanGradient)"
            }
            strokeWidth="4"
            strokeDasharray={orangeCircumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{
              transition: "stroke 1s ease",
              filter: `drop-shadow(0 0 6px ${
                activeId === 1
                  ? "rgba(37, 99, 235, 0.5)"
                  : activeId === 2
                  ? "rgba(255, 94, 0, 0.6)"
                  : "rgba(6, 182, 212, 0.5)"
              })`,
            }}
          />

          {/* Decorative segmented mask overlay on percentage circle to give tech detail */}
          <circle
            cx={center}
            cy={center}
            r={orangeRingRadius}
            fill="none"
            stroke="#030303"
            strokeWidth="5"
            strokeDasharray="3, 15"
            strokeOpacity="0.35"
          />

          {/* 3. Outer dotted fine index track */}
          <circle
            cx={center}
            cy={center}
            r={dottedOrbitRadius}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            strokeDasharray="1, 8"
            strokeOpacity="0.15"
          />

          {/* 4. Labels orbiting around: 01, 02, 03 */}
          {/* Label 01 */}
          <g>
            <circle
              cx={p01.x}
              cy={p01.y}
              r="14"
              fill={activeId === 1 ? "#030303" : "transparent"}
              stroke={activeId === 1 ? (activeId === 1 ? "#3b82f6" : "#ff5e00") : "transparent"}
              strokeWidth="1"
              className="transition-all duration-500"
            />
            {activeId === 1 && (
              <circle
                cx={p01.x}
                cy={p01.y}
                r="3"
                fill="#3b82f6"
              />
            )}
            <text
              x={p01.x}
              y={p01.y + 4}
              textAnchor="middle"
              className={`font-mono text-[9px] font-bold tracking-tight ${
                activeId === 1 ? "fill-blue-400 font-extrabold scale-110" : "fill-gray-500"
              } transition-all duration-300`}
            >
              01
            </text>
          </g>

          {/* Label 02 */}
          <g>
            <circle
              cx={p02.x}
              cy={p02.y}
              r="14"
              fill={activeId === 2 ? "#030303" : "transparent"}
              stroke={activeId === 2 ? "#ff5e00" : "transparent"}
              strokeWidth="1"
              className="transition-all duration-500"
            />
            {activeId === 2 && (
              <circle
                cx={p02.x}
                cy={p02.y}
                r="3"
                fill="#ff5e00"
              />
            )}
            <text
              x={p02.x}
              y={p02.y + 4}
              textAnchor="middle"
              className={`font-mono text-[9px] font-bold tracking-tight ${
                activeId === 2 ? "fill-orange font-extrabold scale-110" : "fill-gray-500"
              } transition-all duration-300`}
              style={{ fill: activeId === 2 ? "#ff5e00" : undefined }}
            >
              02
            </text>
          </g>

          {/* Label 03 */}
          <g>
            <circle
              cx={p03.x}
              cy={p03.y}
              r="14"
              fill={activeId === 3 ? "#030303" : "transparent"}
              stroke={activeId === 3 ? "#06b6d4" : "transparent"}
              strokeWidth="1"
              className="transition-all duration-500"
            />
            {activeId === 3 && (
              <circle
                cx={p03.x}
                cy={p03.y}
                r="3"
                fill="#06b6d4"
              />
            )}
            <text
              x={p03.x}
              y={p03.y + 4}
              textAnchor="middle"
              className={`font-mono text-[9px] font-bold tracking-tight ${
                activeId === 3 ? "fill-cyan-400 font-extrabold scale-110" : "fill-gray-500"
              } transition-all duration-300`}
            >
              03
            </text>
          </g>

          {/* 5. Outer ultra-fine solid track */}
          <circle
            cx={center}
            cy={center}
            r={outerTrackRadius}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.06"
            strokeWidth="1"
          />

          {/* 6. Rotating indicator arc that houses the triangular pointing cursor */}
          {/* We rotate the entire nested group targeting the specific angle */}
          <g style={{ transform: `rotate(${outerArcRotation}deg)`, transformOrigin: `${center}px ${center}px`, transition: "transform 0.1s ease-out" }}>
            {/* White sweep indicator arc, wraps around 90 degrees */}
            <path
              d={`M ${center + outerTrackRadius * Math.cos(-Math.PI / 4)} ${
                center + outerTrackRadius * Math.sin(-Math.PI / 4)
              } A ${outerTrackRadius} ${outerTrackRadius} 0 0 1 ${
                center + outerTrackRadius * Math.cos(Math.PI / 4)
              } ${center + outerTrackRadius * Math.sin(Math.PI / 4)}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeOpacity="0.85"
            />

            {/* Dynamic triangular tracking arrow cursor, pointing inwards */}
            <g transform={`translate(${center + outerTrackRadius}, ${center}) rotate(-90)`}>
              <polygon
                points="0,0 -4,8 4,8"
                fill="#ffffff"
                className="filter drop-shadow-sm"
              />
            </g>
          </g>
        </g>
      </svg>

      {/* 7. Beautifully aligned, high-contrast overlay text inside the absolute center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto z-20">
        {/* Subtle lightning icon */}
        <div className="mb-2 transition-transform duration-700 hover:scale-125">
          <Zap
            size={18}
            className={`fill-current ${
              activeId === 1
                ? "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                : activeId === 2
                ? "text-orange drop-shadow-[0_0_8px_rgba(255,94,0,0.6)]"
                : "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
            } transition-colors duration-500`}
            style={{ color: activeId === 2 ? "#ff5e00" : undefined }}
          />
        </div>

        {/* Big percentage value */}
        <div className="flex items-baseline justify-center select-none font-serif">
          <span 
            className="text-8xl lg:text-9xl font-light text-white tracking-tighter italic leading-none"
            id="center-percentage-text"
          >
            {currentPercent}
          </span>
          <span className="text-xl font-sans font-medium text-gray-400/80 tracking-normal ml-0.5 select-none">%</span>
        </div>

        {/* Bottom mode description */}
        <div className="mt-2 text-center">
          <span className="font-mono text-[9px] font-bold tracking-widest text-gray-400 uppercase select-none opacity-80">
            {subLabel}
          </span>
        </div>
      </div>
    </div>
  );
};
