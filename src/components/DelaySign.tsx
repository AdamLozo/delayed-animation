import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface DelaySignProps {
  scale?: number;
}

export const DelaySign: React.FC<DelaySignProps> = ({ scale = 1 }) => {
  const frame = useCurrentFrame();

  // Subtle glow pulse
  const glowIntensity = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.8, 1]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#1a1a1a",
        border: "4px solid #333",
        borderRadius: 8,
        padding: `${20 * scale}px ${40 * scale}px`,
        boxShadow: `0 0 ${30 * glowIntensity}px rgba(255, 100, 0, 0.3)`,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 28 * scale,
          color: "#ff6b00",
          textShadow: `0 0 ${10 * glowIntensity}px #ff6b00`,
          letterSpacing: 2,
          marginBottom: 8,
        }}
      >
        DELAYED
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 48 * scale,
          fontWeight: "bold",
          color: "#ff6b00",
          textShadow: `0 0 ${15 * glowIntensity}px #ff6b00`,
        }}
      >
        7 MIN
      </div>
    </div>
  );
};
