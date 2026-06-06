/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface BackgroundVideoProps {
  videoUrl: string;
  activeId: number;
}

/**
 * BackgroundVideo — Dual-layer video with:
 *
 * 1. INFINITE LOOP  ─ both videos use `loop={true}`. No ended event, no black
 *    flash, no rewind stutter. Seamless forever.
 *
 * 2. LEFT-TO-RIGHT DISSOLVE WIPE  ─ when the slide changes, the incoming video
 *    layer is clipped to nothing (hidden on the right side) then GSAP sweeps its
 *    clipPath open from left → right in ~1 second with a feathered gradient-mask
 *    "soft edge" div that rides alongside the wipe front, blurring the boundary
 *    so it reads as a dissolve-wipe rather than a hard cut.
 */
export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ videoUrl }) => {
  // 0 = Layer A is the visible front, 1 = Layer B is the visible front
  const [frontLayer, setFrontLayer] = useState<0 | 1>(0);

  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);

  // Feather-edge div that rides the wipe front for the dissolve look
  const wipeEdgeRef = useRef<HTMLDivElement>(null);

  const frontLayerRef = useRef<0 | 1>(0);
  frontLayerRef.current = frontLayer;

  const isFirstMount = useRef(true);
  const prevUrlRef = useRef<string>("");
  const isWiping = useRef(false);

  // ─────────────────────────────────────────────────────────────
  // Mount + URL change handler
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    const wipeEdge = wipeEdgeRef.current;
    if (!videoA || !videoB || !wipeEdge) return;

    // ── First mount: just boot layer A ──────────────────────────
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevUrlRef.current = videoUrl;

      videoA.src = videoUrl;
      videoA.load();
      videoA.play().catch(() => {});

      // Layer A fully visible, Layer B hidden off-right
      gsap.set(videoA, { clipPath: "inset(0 0% 0 0)", zIndex: 1 });
      gsap.set(videoB, { clipPath: "inset(0 100% 0 0)", zIndex: 2 });
      gsap.set(wipeEdge, { opacity: 0, x: "-100%" });
      return;
    }

    // No real change
    if (videoUrl === prevUrlRef.current || isWiping.current) return;
    prevUrlRef.current = videoUrl;
    isWiping.current = true;

    const currentFront = frontLayerRef.current;
    const nextFront: 0 | 1 = currentFront === 0 ? 1 : 0;

    const frontVideo = currentFront === 0 ? videoA : videoB;
    const backVideo  = nextFront  === 0 ? videoA : videoB;

    // Prepare the incoming layer: load new URL, clip it fully off-screen right
    backVideo.src = videoUrl;
    backVideo.load();
    gsap.set(backVideo, { clipPath: "inset(0 100% 0 0)", zIndex: 2, opacity: 1 });
    gsap.set(frontVideo, { zIndex: 1, opacity: 1 });

    // ── Start the wipe once the video can play ───────────────────
    const doWipe = () => {
      backVideo.play().catch(() => {});

      // Position wipe-edge at far left (0%), hidden
      gsap.set(wipeEdge, { opacity: 1, left: "0%", x: "0%" });

      const tl = gsap.timeline({
        onComplete: () => {
          // Tidy up: old layer gets clipped off-right for next transition
          gsap.set(frontVideo, { clipPath: "inset(0 100% 0 0)" });
          gsap.set(wipeEdge, { opacity: 0 });
          isWiping.current = false;
          setFrontLayer(nextFront);
        },
      });

      // Sweep the incoming video open from left → right
      tl.to(backVideo, {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.1,
        ease: "power3.inOut",
      });

      // Wipe-edge feather div travels left → right in sync
      tl.to(
        wipeEdge,
        {
          left: "100%",
          duration: 1.1,
          ease: "power3.inOut",
        },
        0 // start at same time
      );
    };

    const onCanPlay = () => {
      backVideo.removeEventListener("canplay", onCanPlay);
      clearTimeout(fallback);
      doWipe();
    };

    const fallback = setTimeout(() => {
      backVideo.removeEventListener("canplay", onCanPlay);
      doWipe();
    }, 450);

    backVideo.addEventListener("canplay", onCanPlay);

    return () => {
      backVideo.removeEventListener("canplay", onCanPlay);
      clearTimeout(fallback);
    };
  }, [videoUrl]);

  // ─────────────────────────────────────────────────────────────
  // Handle smooth fade to black on video loop replay
  // ─────────────────────────────────────────────────────────────
  const handleVideoEnded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    
    // Prevent concurrent trigger loops
    if (video.dataset.isReplaying === "true") return;
    video.dataset.isReplaying = "true";

    // Fade to black smoothly
    gsap.to(video, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        // Reset playback position
        video.currentTime = 0;
        video.play().then(() => {
          // Fade back in seamlessly
          gsap.to(video, {
            opacity: 1,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
              video.dataset.isReplaying = "false";
            }
          });
        }).catch(() => {
          video.dataset.isReplaying = "false";
          // Fallback if play fails
          gsap.to(video, { opacity: 1, duration: 0.5 });
        });
      }
    });
  };

  // ─────────────────────────────────────────────────────────────
  // Shared CSS for both video layers
  // ─────────────────────────────────────────────────────────────
  const sharedVideoStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "scale(1.02)",
    filter: "brightness(0.7) contrast(1.05) saturate(0.95)",
    pointerEvents: "none",
    opacity: 1,
  };

  return (
    <div
      className="absolute inset-0 w-full h-full bg-[#050505] overflow-hidden"
      id="bg-video-container"
    >
      {/* ── Layer A (starts as front) ─────────────────────────── */}
      <video
        ref={videoARef}
        style={sharedVideoStyle}
        muted
        playsInline
        onEnded={handleVideoEnded}
        id="bg-video-layer-a"
      />

      {/* ── Layer B (starts as back) ──────────────────────────── */}
      <video
        ref={videoBRef}
        style={sharedVideoStyle}
        muted
        playsInline
        onEnded={handleVideoEnded}
        id="bg-video-layer-b"
      />

      {/* ── Wipe-edge feather: soft gradient that rides the wipe front ── */}
      {/* Creates the "dissolve" softness along the wipe boundary          */}
      <div
        ref={wipeEdgeRef}
        id="wipe-edge-feather"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "120px",       // width of the soft dissolve band
          height: "100%",
          transform: "translateX(-50%)",
          background:
            "linear-gradient(to right, transparent 0%, rgba(5,5,5,0.55) 40%, rgba(5,5,5,0.55) 60%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 3,
          opacity: 0,
          filter: "blur(8px)",
        }}
      />

      {/* ── Atmospheric deep-water vignette ─────────────────────── */}
      <div
        id="vignette-overlay"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 10,
          background:
            "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.75) 100%)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
};
