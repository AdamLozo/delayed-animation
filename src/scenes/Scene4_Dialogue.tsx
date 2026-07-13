import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Sequence } from "remotion";
import { Platform } from "../components/Platform";
import { Commuter } from "../components/Commuter";
import { Janitor } from "../components/Janitor";

const DialogueBubble: React.FC<{ text: string; isJanitor?: boolean }> = ({
  text,
  isJanitor = false,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: isJanitor ? "15%" : "25%",
        left: isJanitor ? "25%" : "55%",
        background: "rgba(255,255,255,0.95)",
        padding: "15px 25px",
        borderRadius: 20,
        maxWidth: 350,
        fontSize: 22,
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        color: "#1a1a1a",
        opacity,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {text}
      {/* Speech bubble tail */}
      <div
        style={{
          position: "absolute",
          bottom: -15,
          left: isJanitor ? 30 : "auto",
          right: isJanitor ? "auto" : 30,
          width: 0,
          height: 0,
          borderLeft: "15px solid transparent",
          borderRight: "15px solid transparent",
          borderTop: "20px solid rgba(255,255,255,0.95)",
        }}
      />
    </div>
  );
};

export const Scene4_Dialogue: React.FC = () => {
  return (
    <AbsoluteFill>
      <Platform flickerIntensity={0.4} />

      {/* Janitor on left */}
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "20%",
        }}
      >
        <Janitor scale={0.7} isSweeping={false} />
      </div>

      {/* Commuter on right */}
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "25%",
        }}
      >
        <Commuter scale={0.7} />
      </div>

      {/* Dialogue sequence */}
      <Sequence from={30} durationInFrames={90}>
        <DialogueBubble
          text="You're still waiting for the 11:42?"
          isJanitor
        />
      </Sequence>

      <Sequence from={150} durationInFrames={150}>
        <DialogueBubble
          text="...That train's been delayed since 1987."
          isJanitor
        />
      </Sequence>
    </AbsoluteFill>
  );
};
