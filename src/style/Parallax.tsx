import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

type ParallaxProps = {
  /**
   * Pixels of drift per frame. Positive moves the layer left/up (background
   * layers use small values, foreground layers larger ones).
   */
  speed: number;
  /** Drift axis. Default "x" (the Scene 1/4 lateral pans). */
  axis?: "x" | "y";
  /** Frame the drift starts from, relative to the enclosing Sequence. Default 0. */
  startFrame?: number;
  /**
   * Overrides the frame driving the drift, so a scene can ease or settle its
   * pan (e.g. Scene 4's decelerating camera). Defaults to the real frame.
   */
  panFrame?: number;
  children: React.ReactNode;
};

/**
 * Wraps one layer of a parallax stack and offsets it by frame count.
 * Stack several with different speeds to get depth: e.g. tunnel wall at
 * speed 0.3, pillars at 0.8, posters at 1.5.
 */
export const Parallax: React.FC<ParallaxProps> = ({
  speed,
  axis = "x",
  startFrame = 0,
  panFrame,
  children,
}) => {
  const frame = useCurrentFrame();
  const drive = panFrame ?? frame;
  const offset = -(drive - startFrame) * speed;
  const transform =
    axis === "x" ? `translateX(${offset}px)` : `translateY(${offset}px)`;

  return (
    <AbsoluteFill style={{ transform, willChange: "transform" }}>
      {children}
    </AbsoluteFill>
  );
};
