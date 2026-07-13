import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface JanitorProps {
  scale?: number;
  isSweeping?: boolean;
  /** Stopped, weight resting on the broom — the worn-in pity pose. */
  leaning?: boolean;
}

export const Janitor: React.FC<JanitorProps> = ({
  scale = 1,
  isSweeping = true,
  leaning = false,
}) => {
  const frame = useCurrentFrame();

  const sweeping = isSweeping && !leaning;

  // Sweeping motion
  const sweepAngle = sweeping
    ? interpolate(Math.sin(frame * 0.15), [-1, 1], [-15, 15])
    : 0;

  // Leaning: whole figure tips slightly toward the planted broom
  const bodyTilt = leaning ? -3 : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${scale}) rotate(${bodyTilt}deg)`,
        transformOrigin: "bottom center",
      }}
    >
      {/* Head */}
      <div
        style={{
          width: 55,
          height: 65,
          background: "#c4956a",
          borderRadius: "50% 50% 45% 45%",
          position: "relative",
        }}
      >
        {/* Cap */}
        <div
          style={{
            position: "absolute",
            top: -8,
            left: -5,
            right: -5,
            height: 25,
            background: "#1a3a5c",
            borderRadius: "10px 10px 0 0",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 12,
            left: -10,
            right: -10,
            height: 8,
            background: "#1a3a5c",
          }}
        />
        {/* Eyes (knowing look) */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 10,
            width: 12,
            height: 8,
            background: "#2a2a2a",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 10,
            width: 12,
            height: 8,
            background: "#2a2a2a",
            borderRadius: "50%",
          }}
        />
        {/* Slight frown/concerned expression */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 20,
            height: 3,
            background: "#8a6a5a",
            borderRadius: 2,
          }}
        />
      </div>

      {/* Neck */}
      <div
        style={{
          width: 18,
          height: 12,
          background: "#c4956a",
        }}
      />

      {/* Body - MBTA uniform */}
      <div
        style={{
          width: 90,
          height: 110,
          background: "#1a3a5c",
          borderRadius: "8px 8px 0 0",
          position: "relative",
        }}
      >
        {/* MBTA patch hint */}
        <div
          style={{
            position: "absolute",
            top: 15,
            left: 15,
            width: 25,
            height: 15,
            background: "#e85d04",
            borderRadius: 3,
            fontSize: 6,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          MBTA
        </div>

        {/* Arms */}
        <div
          style={{
            position: "absolute",
            left: -22,
            top: 8,
            width: 22,
            height: 75,
            background: "#1a3a5c",
            borderRadius: 8,
            transform: `rotate(${20 + sweepAngle * 0.3}deg)`,
            transformOrigin: "top center",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -22,
            top: 8,
            width: 22,
            height: 75,
            background: "#1a3a5c",
            borderRadius: 8,
            transform: `rotate(${leaning ? -48 : -30 + sweepAngle * 0.5}deg)`,
            transformOrigin: "top center",
          }}
        />
      </div>

      {/* Legs */}
      <div style={{ display: "flex", gap: 8 }}>
        <div
          style={{
            width: 32,
            height: 90,
            background: "#2a2a3a",
            borderRadius: "0 0 5px 5px",
          }}
        />
        <div
          style={{
            width: 32,
            height: 90,
            background: "#2a2a3a",
            borderRadius: "0 0 5px 5px",
          }}
        />
      </div>

      {/* Broom */}
      <div
        style={{
          position: "absolute",
          right: -60,
          top: 80,
          width: 8,
          height: 150,
          background: "#8b7355",
          borderRadius: 4,
          transform: `rotate(${leaning ? 7 : sweepAngle}deg)`,
          transformOrigin: "top center",
        }}
      >
        {/* Broom head */}
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: -15,
            width: 40,
            height: 30,
            background: "#5a4a3a",
            borderRadius: "0 0 5px 5px",
          }}
        />
      </div>
    </div>
  );
};
