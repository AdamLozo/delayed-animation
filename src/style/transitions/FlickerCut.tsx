import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";

type FlickerCutProps = {
  /** Frame (relative to the enclosing Sequence) the flicker is centered on. */
  at: number;
  /** Total flicker length in frames. Default 12 (~0.4 s at 30 fps). */
  durationInFrames?: number;
  /**
   * 0–1. How violent the cut is. Gentle scene-to-scene transitions sit
   * around 0.3–0.5; the Scene 6→7 warmth-ripped-away cut should run 1.
   * Harshness raises flash amplitude, adds white blowouts between the
   * black drops, and lets the flicker overshoot brightness on recovery.
   */
  harshness?: number;
};

/**
 * Brightness-flicker transition echoing the delay sign's irregular stutter.
 * Render it as the top layer of the outgoing scene (or across a cut inside
 * a master sequence): it strobes the frame dark/bright around `at`, so the
 * actual content cut hides inside one of the black drops.
 */
export const FlickerCut: React.FC<FlickerCutProps> = ({
  at,
  durationInFrames = 12,
  harshness = 0.5,
}) => {
  const frame = useCurrentFrame();
  const start = at - Math.floor(durationInFrames / 2);
  const t = frame - start;

  if (t < 0 || t >= durationInFrames) {
    return null;
  }

  // Envelope: flicker builds into the cut and decays out of it.
  const envelope = interpolate(
    t,
    [0, durationInFrames * 0.4, durationInFrames * 0.6, durationInFrames],
    [0, 1, 1, 0],
  );

  // Irregular stutter, like the delay sign: deterministic per-frame noise
  // decides whether this frame drops to black or blows out to white.
  const noise = random(`flicker-${at}-${t}`);
  const dropsBlack = noise < 0.45 + 0.25 * harshness;
  const blowsOut = !dropsBlack && noise > 1 - 0.3 * harshness;

  const amplitude = envelope * (0.5 + 0.5 * harshness);

  if (blowsOut) {
    return (
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          backgroundColor: "white",
          opacity: amplitude * 0.85,
        }}
      />
    );
  }

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundColor: "black",
        opacity: dropsBlack ? amplitude : amplitude * 0.25,
      }}
    />
  );
};
