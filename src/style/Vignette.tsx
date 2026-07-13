import React from "react";
import { AbsoluteFill } from "remotion";

type VignetteProps = {
  /** Edge darkness, 0–1. Default 0.55. */
  strength?: number;
  /** Where the darkening begins, as a % of the radius. Default 55. */
  innerRadius?: number;
};

/**
 * Radial-gradient vignette. Topmost of the style overlays.
 */
export const Vignette: React.FC<VignetteProps> = ({
  strength = 0.55,
  innerRadius = 55,
}) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `radial-gradient(ellipse at center, rgba(0,0,0,0) ${innerRadius}%, rgba(0,0,0,${strength}) 100%)`,
      }}
    />
  );
};
