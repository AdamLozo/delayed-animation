import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

type FilmGrainProps = {
  /** Overlay opacity, 0–1. Default 0.08 — visible on stills, subliminal in motion. */
  opacity?: number;
  /** How often the grain pattern re-seeds, in frames. Default 2 (15 Hz at 30 fps). */
  refreshEvery?: number;
};

/**
 * Animated film-grain overlay using an SVG turbulence filter re-seeded on a
 * frame interval, so renders are deterministic (same frame → same grain).
 * Render above ColorGrade, below Vignette.
 */
export const FilmGrain: React.FC<FilmGrainProps> = ({
  opacity = 0.08,
  refreshEvery = 2,
}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / Math.max(1, refreshEvery));

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id="delayed-film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#delayed-film-grain)" />
      </svg>
    </AbsoluteFill>
  );
};
