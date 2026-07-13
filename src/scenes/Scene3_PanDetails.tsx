import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Platform } from "../components/Platform";
import { VintagePoster } from "../components/VintagePoster";

export const Scene3_PanDetails: React.FC = () => {
  const frame = useCurrentFrame();

  // Pan from left to right
  const panX = interpolate(frame, [0, 240], [0, -400], {
    extrapolateRight: "clamp",
  });

  // Subtle zoom
  const scale = interpolate(frame, [0, 240], [1.2, 1.3], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: "200%",
          height: "100%",
          transform: `translateX(${panX}px) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <Platform flickerIntensity={0.5} />

        {/* Vintage posters on wall */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            display: "flex",
            gap: 40,
          }}
        >
          <VintagePoster type="concert" />
          <VintagePoster type="fare" />
          <VintagePoster type="celtics" />
        </div>

        {/* Empty bench */}
        <div
          style={{
            position: "absolute",
            bottom: "30%",
            left: "25%",
            width: 250,
            height: 50,
            background: "#4a4a4a",
            borderRadius: 5,
          }}
        />

        {/* Another empty bench */}
        <div
          style={{
            position: "absolute",
            bottom: "30%",
            left: "55%",
            width: 250,
            height: 50,
            background: "#4a4a4a",
            borderRadius: 5,
          }}
        />

        {/* Fog/cold breath effect */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(200,200,220,0.1) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
