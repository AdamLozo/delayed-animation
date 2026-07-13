import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Commuter } from "../components/Commuter";

export const Scene5_Reveal: React.FC = () => {
  const frame = useCurrentFrame();

  // Zoom into shirt
  const scale = interpolate(frame, [0, 120], [1, 2], {
    extrapolateRight: "clamp",
  });

  // Fade/flicker effect on commuter
  const commuterOpacity = interpolate(
    frame,
    [120, 180, 200, 220, 240],
    [1, 0.7, 0.9, 0.5, 0.3],
    { extrapolateRight: "clamp" }
  );

  // Background darkens
  const bgDarkness = interpolate(frame, [0, 240], [0.1, 0.4], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `rgba(10, 10, 15, ${0.9 + bgDarkness})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center 60%", // Focus on shirt area
        }}
      >
        <Commuter scale={1.2} showShirt={true} opacity={commuterOpacity} age="old" />
      </div>

      {/* Realization text */}
      {frame > 180 && (
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(255,255,255,0.6)",
            fontSize: 24,
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            opacity: interpolate(frame, [180, 210], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          They don't remember anything before the platform.
        </div>
      )}
    </AbsoluteFill>
  );
};
