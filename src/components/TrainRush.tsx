import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface TrainRushProps {
  /** Total length of the effect; place inside a Sequence of this length. */
  durationInFrames: number;
}

// Deterministic pseudo-random — Remotion renders must be frame-pure.
const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Phase boundaries as fractions of the effect duration. */
const APPROACH_END = 0.3;
const RUSH_END = 0.75;

/**
 * Camera/scene shake envelope for the train's passage. The scene applies
 * this to its content wrapper so the whole platform trembles, not just
 * the light overlay.
 */
export const trainRushShake = (frame: number, durationInFrames: number) => {
  const p = frame / durationInFrames;
  const amp = interpolate(
    p,
    [0, APPROACH_END, 0.5, RUSH_END, 0.9],
    [0, 1.5, 4.5, 3, 0],
    clamp
  );
  return {
    x: Math.sin(frame * 1.7) * amp,
    y: Math.cos(frame * 2.3) * amp * 0.6,
  };
};

/**
 * Her train, from his POV: never a legible object — an approaching glow
 * deep in the tunnel, a headlight sweep across the tiles, then a wall of
 * motion-blurred light and wind crossing the frame, and it's gone.
 *
 * Three phases: approach (0–30%), rush (30–75%), depart (75–100%).
 * Travels left → right.
 */
export const TrainRush: React.FC<TrainRushProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const p = frame / durationInFrames;

  // ---- Approach: tunnel glow + headlight sweep across the wall tiles ----
  const tunnelGlow = interpolate(p, [0, 0.12, APPROACH_END, 0.5], [0, 0.35, 0.9, 0.4], clamp);
  const sweepX = interpolate(p, [0.06, APPROACH_END + 0.05], [-35, 115], clamp);
  const sweepOpacity = interpolate(p, [0.06, 0.15, APPROACH_END, 0.42], [0, 0.7, 0.9, 0], clamp);

  // ---- Rush: full-frame wash, light streaks, speed lines ----
  const wash = interpolate(p, [APPROACH_END, 0.5, RUSH_END, 0.88], [0, 0.42, 0.32, 0], clamp);
  const streakOpacity = interpolate(p, [APPROACH_END - 0.04, 0.4, RUSH_END, 0.92], [0, 1, 0.9, 0], clamp);
  // Streaks accelerate as the train departs.
  const speedMult = interpolate(p, [APPROACH_END, RUSH_END, 1], [1, 1.4, 2.2], clamp);
  // High-frequency flicker — windows and gaps whipping past.
  const flicker = 0.75 + 0.25 * Math.sin(frame * 2.1) * Math.sin(frame * 3.7);

  // ---- Depart: tail light receding down the right tunnel ----
  const tailGlow = interpolate(p, [0.78, 0.86, 1], [0, 0.5, 0], clamp);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {/* Approaching headlight glow, deep in the left tunnel at track height */}
      <div
        style={{
          position: "absolute",
          top: "58%",
          left: "-12%",
          width: "45%",
          height: "26%",
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(235, 245, 255, 0.95) 0%, rgba(180, 210, 255, 0.5) 35%, transparent 70%)",
          opacity: tunnelGlow,
          filter: "blur(18px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Headlight sweep crossing the wall tiles */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: `${sweepX}%`,
          width: "28%",
          height: "52%",
          background:
            "linear-gradient(100deg, transparent 0%, rgba(230, 240, 255, 0.85) 45%, rgba(230, 240, 255, 0.85) 55%, transparent 100%)",
          opacity: sweepOpacity,
          filter: "blur(24px)",
          transform: "skewX(-12deg)",
          mixBlendMode: "screen",
        }}
      />

      {/* Full-frame wash — the wall of light at peak */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(200, 220, 255, 0.5) 0%, rgba(235, 240, 255, 0.9) 62%, rgba(200, 215, 250, 0.6) 100%)",
          opacity: wash * flicker,
          mixBlendMode: "screen",
        }}
      />

      {/* Motion-blurred light streaks across the track band. Even indices
          are cool headlight-white; odds are warm amber — window light
          strobing past, the only trace of an interior we ever show. */}
      {Array.from({ length: 10 }).map((_, i) => {
        const r1 = rand(i + 1);
        const r2 = rand(i + 20);
        const r3 = rand(i + 40);
        const warm = i % 2 === 1;
        const speed = (26 + r1 * 48) * speedMult;
        const x = ((frame * speed + r2 * 2400) % 2600) - 300;
        const y = 56 + r3 * 24; // % — track band and platform edge
        const h = 6 + r1 * 26;
        const w = 320 + r2 * 520;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${y}%`,
              left: x,
              width: w,
              height: h,
              background: warm
                ? "linear-gradient(90deg, transparent, rgba(255, 214, 150, 0.85), transparent)"
                : "linear-gradient(90deg, transparent, rgba(215, 232, 255, 0.9), transparent)",
              opacity: streakOpacity * (0.5 + r3 * 0.5) * flicker,
              filter: `blur(${8 + r1 * 12}px)`,
              mixBlendMode: "screen",
            }}
          />
        );
      })}

      {/* Thin hard speed lines — wind made visible */}
      {Array.from({ length: 6 }).map((_, i) => {
        const r1 = rand(i + 60);
        const r2 = rand(i + 80);
        const speed = (60 + r1 * 60) * speedMult;
        const x = ((frame * speed + r2 * 2400) % 2800) - 400;
        return (
          <div
            key={`line-${i}`}
            style={{
              position: "absolute",
              top: `${34 + r1 * 48}%`,
              left: x,
              width: 500 + r2 * 400,
              height: 2,
              background:
                "linear-gradient(90deg, transparent, rgba(240, 246, 255, 0.7), transparent)",
              opacity: streakOpacity * 0.7,
              filter: "blur(1px)",
              mixBlendMode: "screen",
            }}
          />
        );
      })}

      {/* Ceiling bounce — the light is too big for the room */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "22%",
          background:
            "linear-gradient(180deg, rgba(215, 230, 255, 0.65) 0%, transparent 100%)",
          opacity: wash * 0.8,
          filter: "blur(10px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Tail light receding into the right tunnel */}
      <div
        style={{
          position: "absolute",
          top: "62%",
          right: "-6%",
          width: "22%",
          height: "14%",
          background:
            "radial-gradient(ellipse at 80% 50%, rgba(255, 80, 60, 0.8) 0%, transparent 65%)",
          opacity: tailGlow,
          filter: "blur(14px)",
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};
