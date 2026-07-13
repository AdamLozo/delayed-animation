import React from "react";
import { useCurrentFrame } from "remotion";

const BEAM_W = 560;
const BEAM_H = 820;
/** Cone spread: narrow at the fixture, wide at the floor. */
const BEAM_CLIP = "polygon(38% 0%, 62% 0%, 92% 100%, 8% 100%)";

const fract = (x: number) => x - Math.floor(x);
/** Deterministic per-mote randomness — same frame always renders the same. */
const hash = (i: number, salt: number) =>
  fract(Math.sin(i * 127.1 + salt * 311.7) * 43758.5453);

const MOTES = Array.from({ length: 46 }, (_, i) => ({
  across: hash(i, 1),
  y0: hash(i, 2) * BEAM_H,
  fallSpeed: 0.06 + hash(i, 3) * 0.18,
  swayAmp: 8 + hash(i, 4) * 26,
  swayPeriod: 90 + hash(i, 5) * 140,
  phase: hash(i, 6) * Math.PI * 2,
  size: 2 + hash(i, 7) * 3.5,
  twinklePeriod: 60 + hash(i, 8) * 90,
}));

/**
 * A single fluorescent beam with dust motes drifting through it (Scene 4).
 * Motes fall slowly, sway, and twinkle; everything is clipped to the cone
 * so dust only reads where the light does.
 */
export const DustBeam: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ position: "relative", width: BEAM_W, height: BEAM_H }}>
      {/* fixture tube */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: BEAM_W / 2 - 90,
          width: 180,
          height: 9,
          borderRadius: 5,
          background: "#cfe4f2",
          boxShadow: "0 0 18px 4px rgba(200,225,245,0.55)",
        }}
      />
      {/* beam cone */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: BEAM_CLIP,
          background:
            "linear-gradient(180deg, rgba(195,220,240,0.17) 0%, rgba(195,220,240,0.10) 45%, rgba(195,220,240,0.03) 100%)",
        }}
      />
      {/* brighter core */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: "polygon(45% 0%, 55% 0%, 74% 100%, 26% 100%)",
          background:
            "linear-gradient(180deg, rgba(210,230,245,0.12) 0%, rgba(210,230,245,0.02) 100%)",
        }}
      />
      {/* pool where the light meets the floor */}
      <div
        style={{
          position: "absolute",
          left: BEAM_W / 2 - 220,
          top: BEAM_H - 46,
          width: 440,
          height: 64,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(190,215,235,0.10), transparent 70%)",
        }}
      />
      {/* dust motes, clipped to the cone */}
      <div style={{ position: "absolute", inset: 0, clipPath: BEAM_CLIP }}>
        {MOTES.map((m, i) => {
          const y = (m.y0 + frame * m.fallSpeed) % BEAM_H;
          const depth = y / BEAM_H; // 0 fixture → 1 floor
          const halfW = (0.12 + 0.3 * depth) * BEAM_W;
          const sway =
            Math.sin((frame / m.swayPeriod) * Math.PI * 2 + m.phase) *
            m.swayAmp;
          const x = BEAM_W / 2 + (m.across - 0.5) * 2 * halfW * 0.9 + sway;
          const twinkle =
            0.5 +
            0.5 * Math.sin((frame / m.twinklePeriod) * Math.PI * 2 + m.phase);
          const opacity = (0.18 + 0.55 * twinkle) * (1 - depth * 0.4);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: m.size,
                height: m.size,
                borderRadius: "50%",
                background: "rgba(232,242,250,0.9)",
                boxShadow: "0 0 4px 1px rgba(220,235,248,0.5)",
                filter: "blur(0.6px)",
                opacity,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
