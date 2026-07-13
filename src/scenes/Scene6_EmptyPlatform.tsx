import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Platform } from "../components/Platform";
import { DelaySign } from "../components/DelaySign";

export const Scene6_EmptyPlatform: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in from black
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Title fade in
  const titleOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <Platform flickerIntensity={0.2} />

      {/* Delay sign - still showing 7 MIN */}
      <div
        style={{
          position: "absolute",
          top: "18%",
          right: "15%",
        }}
      >
        <DelaySign scale={0.8} />
      </div>

      {/* Empty bench - no one there */}
      <div
        style={{
          position: "absolute",
          bottom: "27%",
          left: "35%",
          width: 200,
          height: 40,
          background: "#5a5a5a",
          borderRadius: 5,
        }}
      />

      {/* Title card */}
      <div
        style={{
          position: "absolute",
          bottom: "40%",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: titleOpacity,
        }}
      >
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 120,
            fontWeight: "normal",
            color: "#ff6b00",
            textShadow: "0 0 30px rgba(255, 107, 0, 0.5)",
            letterSpacing: 15,
            margin: 0,
          }}
        >
          DELAYED
        </h1>
      </div>

      {/* Vignette effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
