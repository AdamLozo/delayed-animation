import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Platform } from "../components/Platform";
import { Commuter } from "../components/Commuter";
import { DelaySign } from "../components/DelaySign";

export const Scene1_PlatformWide: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <Platform flickerIntensity={0.3} />

      {/* Delay sign - upper right */}
      <div
        style={{
          position: "absolute",
          top: "18%",
          right: "15%",
        }}
      >
        <DelaySign scale={0.8} />
      </div>

      {/* Commuter - center, waiting */}
      <div
        style={{
          position: "absolute",
          bottom: "28%",
          left: "45%",
          transform: "translateX(-50%)",
        }}
      >
        <Commuter scale={0.6} />
      </div>

      {/* Bench */}
      <div
        style={{
          position: "absolute",
          bottom: "27%",
          left: "20%",
          width: 200,
          height: 40,
          background: "#5a5a5a",
          borderRadius: 5,
        }}
      />
    </AbsoluteFill>
  );
};
