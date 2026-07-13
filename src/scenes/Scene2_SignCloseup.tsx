import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { DelaySign } from "../components/DelaySign";

export const Scene2_SignCloseup: React.FC = () => {
  const frame = useCurrentFrame();

  // Zoom effect
  const scale = interpolate(frame, [0, 180], [1, 1.1], {
    extrapolateRight: "clamp",
  });

  // Flicker effect
  const flicker = Math.sin(frame * 0.3) > 0.8 ? 0.9 : 1;

  return (
    <AbsoluteFill
      style={{
        background: "#1a1a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale})`,
      }}
    >
      <div style={{ opacity: flicker }}>
        <DelaySign scale={2.5} />
      </div>

      {/* Commuter's reflection/silhouette at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 100,
          height: 150,
          background: "rgba(0,0,0,0.5)",
          borderRadius: "50% 50% 0 0",
          filter: "blur(10px)",
        }}
      />
    </AbsoluteFill>
  );
};
