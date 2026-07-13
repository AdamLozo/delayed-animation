import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { ColorGrade } from "../style/ColorGrade";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

type GhostTrainProps = {
  /**
   * 0–1 approach: headlights bloom in the tunnel, the train slides in
   * and stops. Pass an eased value — the train should decelerate.
   */
  arrival: number;
  /**
   * 0–1 door opening. One-way by design: Scene 8's ambiguity rule means
   * the doors never close on screen, so never animate this back down.
   */
  doorsOpen: number;
  /** Overall opacity, for flicker treatments. Default 1. */
  opacity?: number;
};

/**
 * His train, finally arriving. Kept minimal and silhouetted — the era is
 * deliberately unreadable: no livery, no route signs, no visible interior.
 * The open doors reveal only warm light (the film's one warm note outside
 * the flashback), graded with the warm ColorGrade clipped to the doorway
 * so the platform around it stays cold.
 */
export const GhostTrain: React.FC<GhostTrainProps> = ({
  arrival,
  doorsOpen,
  opacity = 1,
}) => {
  const a = clamp01(arrival);
  const d = clamp01(doorsOpen);

  // Headlights lead the train: bloom rises through the first 40% of the
  // approach, then dims as the body itself fills the frame.
  const headlightBloom = interpolate(a, [0, 0.3, 0.85, 1], [0, 1, 0.7, 0.4]);

  // The body slides in from the tunnel (screen left) and stops.
  const trainX = interpolate(a, [0.2, 1], [-105, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bodyVisible = a > 0.2;
  // Leading edge of the hull, in % of frame width — the nose glow rides it.
  const noseX = trainX + 100;

  // Door panels part from the center; the aperture is pure warm light.
  const DOOR_W = 220;
  const DOOR_H = 330;
  const panelShift = d * (DOOR_W / 2);

  // Warm spill onto the platform grows with the opening.
  const spill = d;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {/* Headlight bloom from the tunnel mouth, screen left — the deep glow
          before the body emerges */}
      <div
        style={{
          position: "absolute",
          left: "-12%",
          top: "24%",
          width: "60%",
          height: "55%",
          background:
            "radial-gradient(ellipse at 22% 50%, rgba(255, 246, 220, 1) 0%, rgba(255, 238, 195, 0.7) 28%, rgba(210, 218, 228, 0.22) 58%, rgba(0,0,0,0) 75%)",
          borderRadius: "50%",
          filter: "blur(10px)",
          opacity: headlightBloom,
        }}
      />
      {/* Light sweep across the platform floor as the train pulls in */}
      <div
        style={{
          position: "absolute",
          left: `${interpolate(a, [0.1, 0.9], [-40, 55], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}%`,
          bottom: 0,
          width: "45%",
          height: "30%",
          background:
            "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(235, 240, 245, 0.14) 45%, rgba(0,0,0,0) 100%)",
          opacity: headlightBloom * 0.9,
        }}
      />

      {/* Train body — a dark, era-less silhouette */}
      {bodyVisible && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "26%",
            height: "48%",
            transform: `translateX(${trainX}%)`,
          }}
        >
          {/* Hull */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, #10141b 0%, #0b0e14 55%, #070a0f 100%)",
              borderRadius: "18px 18px 6px 6px",
              boxShadow: "0 18px 40px rgba(0,0,0,0.6)",
            }}
          />
          {/* Faint roofline catch-light — shape, not detail */}
          <div
            style={{
              position: "absolute",
              top: 6,
              left: "2%",
              right: "2%",
              height: 3,
              background: "rgba(160, 180, 200, 0.14)",
              borderRadius: 3,
            }}
          />
          {/* Window band: dark glass, no interior readable */}
          <div
            style={{
              position: "absolute",
              top: "16%",
              left: "3%",
              right: "3%",
              height: "26%",
              background:
                "linear-gradient(180deg, rgba(30, 40, 52, 0.9) 0%, rgba(16, 22, 30, 0.95) 100%)",
              borderRadius: 8,
            }}
          />
          {/* Faint cold reflection streak on the glass */}
          <div
            style={{
              position: "absolute",
              top: "18%",
              left: "8%",
              width: "30%",
              height: "8%",
              background:
                "linear-gradient(100deg, rgba(0,0,0,0) 0%, rgba(150, 175, 195, 0.09) 50%, rgba(0,0,0,0) 100%)",
              borderRadius: 6,
            }}
          />

          {/* Doorway — centered; the panels part onto warm light */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "4%",
              width: DOOR_W,
              height: DOOR_H,
              transform: "translateX(-50%)",
              borderRadius: "6px 6px 0 0",
              overflow: "hidden",
            }}
          >
            {/* The interior: warm light and nothing else. The warm grade is
                clipped to this aperture — the only warm-graded pixels on the
                platform. */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 50% 42%, #ffe9bd 0%, #ffcf85 45%, #e8a352 80%, #c47f35 100%)",
                opacity: d,
              }}
            />
            <div style={{ position: "absolute", inset: 0, opacity: d }}>
              <ColorGrade mode="warm" intensity={0.9} />
            </div>
            {/* Soft bloom past the door frame edges */}
            <div
              style={{
                position: "absolute",
                inset: -14,
                background:
                  "radial-gradient(ellipse at 50% 50%, rgba(255, 224, 160, 0.35) 0%, rgba(0,0,0,0) 70%)",
                filter: "blur(8px)",
                opacity: d,
              }}
            />

            {/* Door panels sliding apart (they only ever open) */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: "50%",
                background: "linear-gradient(180deg, #0e1219 0%, #090c11 100%)",
                borderRight: "2px solid rgba(180, 200, 215, 0.10)",
                transform: `translateX(${-panelShift}px)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                width: "50%",
                background: "linear-gradient(180deg, #0e1219 0%, #090c11 100%)",
                borderLeft: "2px solid rgba(180, 200, 215, 0.10)",
                transform: `translateX(${panelShift}px)`,
              }}
            />
          </div>
        </div>
      )}

      {/* Nose glow — the headlights themselves, leading the hull. Rendered
          above the body so the light always precedes the silhouette. */}
      {bodyVisible && (
        <div
          style={{
            position: "absolute",
            left: `${noseX - 16}%`,
            top: "34%",
            width: "34%",
            height: "36%",
            background:
              "radial-gradient(ellipse at 30% 55%, rgba(255, 248, 225, 0.95) 0%, rgba(255, 240, 200, 0.5) 30%, rgba(215, 225, 235, 0.15) 60%, rgba(0,0,0,0) 78%)",
            borderRadius: "50%",
            filter: "blur(9px)",
            opacity: headlightBloom,
          }}
        />
      )}

      {/* Warm spill from the open doors onto the cold platform floor */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          width: 620,
          height: "30%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255, 210, 140, 0.34) 0%, rgba(255, 190, 110, 0.14) 45%, rgba(0,0,0,0) 75%)",
          opacity: spill,
        }}
      />
    </AbsoluteFill>
  );
};
