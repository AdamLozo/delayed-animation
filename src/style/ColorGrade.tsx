import React from "react";
import { AbsoluteFill } from "remotion";

export type ColorGradeMode = "cold" | "warm";

type ColorGradeProps = {
  mode: ColorGradeMode;
  /** 0–1 multiplier on the grade strength. Default 1. */
  intensity?: number;
};

/**
 * Full-frame grading overlay. Render it above scene content, below
 * FilmGrain/Vignette. "cold" is the platform's blue-teal desaturation;
 * "warm" is the Scene 6 flashback's golden lift.
 */
export const ColorGrade: React.FC<ColorGradeProps> = ({
  mode,
  intensity = 1,
}) => {
  const cold = mode === "cold";

  const tint = cold
    ? "linear-gradient(180deg, rgba(70, 100, 130, 0.28) 0%, rgba(40, 60, 85, 0.38) 100%)"
    : "linear-gradient(180deg, rgba(255, 190, 90, 0.30) 0%, rgba(200, 110, 40, 0.34) 100%)";

  // Cold crushes shadows toward blue-black; warm lifts them toward amber.
  const shadowWash = cold
    ? "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 40%, rgba(10, 20, 35, 0.35) 100%)"
    : "radial-gradient(ellipse at 50% 45%, rgba(255, 220, 150, 0.12) 0%, rgba(80, 40, 10, 0.25) 100%)";

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background: tint,
          mixBlendMode: cold ? "color" : "soft-light",
          opacity: intensity,
        }}
      />
      <AbsoluteFill
        style={{
          background: shadowWash,
          mixBlendMode: "multiply",
          opacity: intensity,
        }}
      />
      <AbsoluteFill
        style={{
          backdropFilter: cold
            ? `saturate(${1 - 0.35 * intensity}) brightness(${1 - 0.08 * intensity})`
            : `saturate(${1 + 0.15 * intensity}) brightness(${1 + 0.05 * intensity}) sepia(${0.2 * intensity})`,
        }}
      />
    </AbsoluteFill>
  );
};
