/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";

export function useAmbientSynth() {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Audio nodes representation
  const humOscRef = useRef<OscillatorNode | null>(null);
  const noiseNodeRef = useRef<AudioWorkletNode | ScriptProcessorNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const humGainRef = useRef<GainNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);

  // Initialize Audio Context on demand
  const initAudio = () => {
    if (audioCtxRef.current) return;

    // Standard cross-browser setup
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Master Gain node
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // --- 1. Synthesize Sea Waves (Low Filtered White Noise) ---
    // Since AudioWorklet can be tricky, ScriptProcessor is robust across browsers for noise synthesis
    const bufferSize = 4096;
    let lastOut = 0.0;
    const noiseNode = ctx.createScriptProcessor(bufferSize, 1, 1);
    noiseNode.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Simple low-pass filter to generate pinkish/brownish ocean noise
        lastOut = 0.99 * lastOut + 0.01 * white;
        output[i] = lastOut;
      }
    };

    const waveFilter = ctx.createBiquadFilter();
    waveFilter.type = "lowpass";
    waveFilter.frequency.setValueAtTime(180, ctx.currentTime);
    waveFilter.Q.setValueAtTime(1, ctx.currentTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, ctx.currentTime);

    noiseNode.connect(waveFilter);
    waveFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    noiseNodeRef.current = noiseNode;
    filterNodeRef.current = waveFilter;
    noiseGainRef.current = noiseGain;

    // --- 2. Synthesize Luxury Electric Hum (Low Frequency sine + triangle nodes) ---
    const humOsc = ctx.createOscillator();
    humOsc.type = "sine";
    // 55Hz represents a deep sub-bass electric motor engine hum
    humOsc.frequency.setValueAtTime(55, ctx.currentTime);

    const humGain = ctx.createGain();
    humGain.gain.setValueAtTime(0.12, ctx.currentTime);

    humOsc.connect(humGain);
    humGain.connect(masterGain);
    humOsc.start();

    humOscRef.current = humOsc;
    humGainRef.current = humGain;

    // --- 3. Waves modulation loop (mimic tide breathing) ---
    // Automatically sweep lowpass filter frequency up and down for breathing tide effect
    const modulateWaves = () => {
      if (!ctx || ctx.state === "closed" || !waveFilter) return;
      const now = ctx.currentTime;
      // Oscillate filter cutoff between 120Hz and 320Hz every 6 seconds
      const waveFreq = 220 + 100 * Math.sin(now * 1.05); 
      waveFilter.frequency.setValueAtTime(waveFreq, now);
      requestAnimationFrame(modulateWaves);
    };
    modulateWaves();
  };

  // Toggle Mute/Unmute
  const toggleMute = () => {
    if (isMuted) {
      // Unmuting
      try {
        initAudio();
        const ctx = audioCtxRef.current;
        if (ctx) {
          if (ctx.state === "suspended") {
            ctx.resume();
          }
          // Smoothly ramp volume up to prevent popping
          masterGainRef.current?.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.5);
          setIsMuted(false);
        }
      } catch (err) {
        console.error("Web Audio initialization failed:", err);
      }
    } else {
      // Muting
      const ctx = audioCtxRef.current;
      if (ctx && masterGainRef.current) {
        // Smoothly ramp volume down
        masterGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35);
        setTimeout(() => {
          setIsMuted(true);
        }, 400);
      }
    }
  };

  // Adjust frequencies and textures on slide change to represent drive modes
  const updateEngineProfile = (slideId: number) => {
    const ctx = audioCtxRef.current;
    if (!ctx || isMuted) return;

    const now = ctx.currentTime;

    if (slideId === 1) {
      // Pure Silent Electric hum
      humOscRef.current?.frequency.exponentialRampToValueAtTime(55, now + 1.2);
      humGainRef.current?.gain.linearRampToValueAtTime(0.15, now + 1.2);
      noiseGainRef.current?.gain.linearRampToValueAtTime(0.5, now + 1.2);
    } else if (slideId === 2) {
      // Recharge Hybrid drone
      humOscRef.current?.frequency.exponentialRampToValueAtTime(73.4, now + 1.2); // F#2 note - slightly higher hybrid whine
      humGainRef.current?.gain.linearRampToValueAtTime(0.22, now + 1.2);
      noiseGainRef.current?.gain.linearRampToValueAtTime(0.35, now + 1.2);
    } else if (slideId === 3) {
      // Solar/Wind high pitch gentle charge hum
      humOscRef.current?.frequency.exponentialRampToValueAtTime(110, now + 1.2); // A2 note
      humGainRef.current?.gain.linearRampToValueAtTime(0.08, now + 1.2);
      noiseGainRef.current?.gain.linearRampToValueAtTime(0.6, now + 1.2); // more gentle waves
    }
  };

  // Cleanup synthesis context on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return {
    isMuted,
    toggleMute,
    updateEngineProfile,
  };
}
