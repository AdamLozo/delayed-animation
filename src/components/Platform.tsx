import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface PlatformProps {
  flickerIntensity?: number;
}

export const Platform: React.FC<PlatformProps> = ({ flickerIntensity = 0 }) => {
  const frame = useCurrentFrame();

  // Subtle light flicker effect
  const flicker = flickerIntensity > 0
    ? interpolate(
        Math.sin(frame * 0.5) + Math.sin(frame * 0.3),
        [-2, 2],
        [0.95, 1]
      )
    : 1;

  const lightColor = `rgba(200, 220, 200, ${0.15 * flicker})`;

  return (
    <AbsoluteFill>
      {/* Ceiling */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "15%",
          background: "#2a2a2a",
        }}
      />

      {/* Fluorescent lights */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "10%",
          width: "80%",
          height: "4%",
          background: `linear-gradient(90deg, ${lightColor} 0%, ${lightColor} 18%, transparent 18%, transparent 22%, ${lightColor} 22%, ${lightColor} 48%, transparent 48%, transparent 52%, ${lightColor} 52%, ${lightColor} 78%, transparent 78%, transparent 82%, ${lightColor} 82%, ${lightColor} 100%)`,
          boxShadow: `0 20px 60px ${lightColor}`,
        }}
      />

      {/* Back wall - tiled */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: 0,
          right: 0,
          height: "45%",
          background: `
            repeating-linear-gradient(
              90deg,
              #3d4a3d 0px,
              #3d4a3d 98px,
              #2a332a 98px,
              #2a332a 100px
            ),
            repeating-linear-gradient(
              0deg,
              #3d4a3d 0px,
              #3d4a3d 48px,
              #2a332a 48px,
              #2a332a 50px
            )
          `,
          backgroundBlendMode: "multiply",
        }}
      />

      {/* MBTA System Map on wall */}
      <div
        style={{
          position: "absolute",
          top: "18%",
          left: "60%",
          width: 180,
          height: 140,
          background: "#f5f5dc",
          border: "3px solid #2a2a2a",
          borderRadius: 3,
          padding: 8,
          boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* Map title */}
        <div style={{ fontSize: 9, fontWeight: "bold", textAlign: "center", color: "#1a1a1a" }}>
          MBTA RAPID TRANSIT
        </div>

        {/* Simplified subway lines */}
        <div style={{ flex: 1, position: "relative", padding: 4 }}>
          {/* Red Line */}
          <div style={{ position: "absolute", top: 10, left: 20, width: 60, height: 3, background: "#dc2f02" }} />
          <div style={{ position: "absolute", top: 10, left: 80, width: 3, height: 30, background: "#dc2f02" }} />

          {/* Orange Line */}
          <div style={{ position: "absolute", top: 30, left: 50, width: 3, height: 50, background: "#e85d04" }} />
          <div style={{ position: "absolute", top: 80, left: 20, width: 33, height: 3, background: "#e85d04" }} />

          {/* Green Line */}
          <div style={{ position: "absolute", top: 45, left: 80, width: 60, height: 3, background: "#007a33" }} />
          <div style={{ position: "absolute", top: 20, left: 120, width: 3, height: 28, background: "#007a33" }} />

          {/* Blue Line */}
          <div style={{ position: "absolute", top: 60, left: 100, width: 50, height: 3, background: "#003da5" }} />

          {/* Station dots */}
          <div style={{ position: "absolute", top: 8, left: 48, width: 5, height: 5, borderRadius: "50%", background: "#1a1a1a" }} />
          <div style={{ position: "absolute", top: 28, left: 48, width: 5, height: 5, borderRadius: "50%", background: "#e85d04", border: "2px solid #000" }} />
          <div style={{ position: "absolute", top: 43, left: 118, width: 5, height: 5, borderRadius: "50%", background: "#1a1a1a" }} />
        </div>

        {/* Aged/yellowed effect */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(180,160,120,0.15)",
          pointerEvents: "none",
          borderRadius: 3,
        }} />
      </div>

      {/* Orange stripe (MBTA Orange Line) */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: 0,
          right: 0,
          height: "8%",
          background: "linear-gradient(180deg, #e85d04 0%, #dc2f02 100%)",
        }}
      />

      {/* Platform floor */}
      <div
        style={{
          position: "absolute",
          top: "60%",
          left: 0,
          right: 0,
          bottom: 0,
          background: "#4a4a4a",
        }}
      />

      {/* Yellow safety strip */}
      <div
        style={{
          position: "absolute",
          top: "60%",
          left: 0,
          right: 0,
          height: "3%",
          background: `repeating-linear-gradient(
            90deg,
            #ffd60a 0px,
            #ffd60a 30px,
            #1a1a1a 30px,
            #1a1a1a 40px
          )`,
        }}
      />

      {/* Track area (dark void) */}
      <div
        style={{
          position: "absolute",
          top: "63%",
          left: 0,
          right: 0,
          height: "12%",
          background: "#0a0a0a",
        }}
      />

      {/* Opposite platform hint */}
      <div
        style={{
          position: "absolute",
          top: "75%",
          left: 0,
          right: 0,
          bottom: 0,
          background: "#3a3a3a",
          opacity: 0.5,
        }}
      />

      {/* Graffiti tags on wall */}
      <div
        style={{
          position: "absolute",
          top: "22%",
          left: "5%",
          fontSize: 32,
          fontFamily: "Arial Black, sans-serif",
          fontWeight: "bold",
          color: "#ff0055",
          opacity: 0.7,
          transform: "rotate(-8deg) skewX(-5deg)",
          textShadow: "2px 2px 0 #000",
        }}
      >
        ROXBURY
      </div>

      <div
        style={{
          position: "absolute",
          top: "28%",
          right: "12%",
          fontSize: 24,
          fontFamily: "Arial Black, sans-serif",
          fontWeight: "bold",
          color: "#00ff88",
          opacity: 0.6,
          transform: "rotate(5deg)",
          textShadow: "2px 2px 0 #000",
        }}
      >
        SOCKS
      </div>

      <div
        style={{
          position: "absolute",
          top: "48%",
          left: "35%",
          fontSize: 18,
          fontFamily: "Arial, sans-serif",
          color: "#ffffff",
          opacity: 0.5,
          transform: "rotate(-3deg)",
        }}
      >
        617 4 LIFE
      </div>

      {/* Grime/stains on tiles */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "15%",
          width: 80,
          height: 120,
          background: "radial-gradient(ellipse, rgba(40,30,20,0.4) 0%, transparent 70%)",
          filter: "blur(5px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "40%",
          right: "25%",
          width: 100,
          height: 90,
          background: "radial-gradient(ellipse, rgba(30,30,30,0.5) 0%, transparent 70%)",
          filter: "blur(4px)",
        }}
      />

      {/* Garbage on platform floor */}
      <div
        style={{
          position: "absolute",
          bottom: "25%",
          left: "15%",
          width: 15,
          height: 20,
          background: "#d4a574",
          borderRadius: "2px",
          transform: "rotate(45deg)",
          opacity: 0.8,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "26%",
          left: "18%",
          width: 12,
          height: 8,
          background: "#8a8a8a",
          borderRadius: "50%",
          opacity: 0.7,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "24%",
          right: "30%",
          width: 25,
          height: 3,
          background: "#ffffff",
          opacity: 0.6,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "23%",
          right: "28%",
          width: 18,
          height: 22,
          background: "#c04040",
          borderRadius: "2px 2px 0 0",
          opacity: 0.7,
        }}
      />

      {/* Newspaper/flyer debris */}
      <div
        style={{
          position: "absolute",
          bottom: "27%",
          left: "45%",
          width: 35,
          height: 25,
          background: "#e8e0d0",
          transform: "rotate(-25deg)",
          opacity: 0.8,
          boxShadow: "0 2px 3px rgba(0,0,0,0.3)",
        }}
      />
    </AbsoluteFill>
  );
};
