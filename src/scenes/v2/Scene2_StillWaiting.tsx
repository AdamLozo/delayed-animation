import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Commuter } from "../../components/Commuter";
import { Payphone } from "../../components/Payphone";
import { ColorGrade } from "../../style/ColorGrade";
import { FilmGrain } from "../../style/FilmGrain";

export const SCENE2_DURATION = 360; // 12s @ 30fps (0:14–0:26)

/**
 * Scene 2: Still Waiting + Wrongness Pt. 2.
 * Closer framing on the commuter. His breath fogs for the first time —
 * it's colder than it was. Behind him, a payphone receiver sways as if
 * recently hung up. Nobody else is here.
 * Slow push-in through the second half.
 */
export const Scene2_StillWaiting: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow dolly-in over the second half of the scene.
  const push = interpolate(frame, [180, 360], [1, 1.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#0c0f12", overflow: "hidden" }}>
      {/* Camera push-in wraps the whole set */}
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        {/* Tiled wall — institutional, close framing */}
        <AbsoluteFill
          style={{
            background: [
              // Grout lines
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 2px, transparent 2px, transparent 90px)",
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 2px, transparent 2px, transparent 90px)",
              // Tile color, faintly green, darker toward edges
              "radial-gradient(ellipse at 50% 35%, #3d4a44 0%, #2a332f 55%, #1a201d 100%)",
            ].join(", "),
          }}
        />

        {/* Grime band low on the wall */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 240,
            height: 70,
            background:
              "linear-gradient(180deg, transparent 0%, rgba(20,24,20,0.5) 50%, transparent 100%)",
          }}
        />

        {/* Floor */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 250,
            background: "linear-gradient(180deg, #23282a 0%, #131618 100%)",
            borderTop: "2px solid rgba(0,0,0,0.6)",
          }}
        />

        {/* Overhead fluorescent pool centered on the commuter */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -80,
            transform: "translateX(-50%)",
            width: 900,
            height: 700,
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(190, 215, 195, 0.14) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        {/* Payphone on the wall behind him, off to the right */}
        <div style={{ position: "absolute", right: 380, top: 260 }}>
          <Payphone scale={1.15} />
        </div>
        {/* Payphone's faint wall shadow */}
        <div
          style={{
            position: "absolute",
            right: 350,
            top: 290,
            width: 190,
            height: 280,
            background:
              "radial-gradient(ellipse at 40% 40%, rgba(0,0,0,0.35) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Commuter — closer framing, breath fogging for the first time */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 130,
            transform: "translateX(-50%)",
          }}
        >
          <Commuter scale={1.7} showShirt breathFog />
        </div>
        {/* His floor shadow */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 110,
            transform: "translateX(-50%)",
            width: 320,
            height: 50,
            background:
              "radial-gradient(ellipse, rgba(0,0,0,0.45) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>

      {/* Grade: colder than Scene 1 — the temperature is dropping */}
      <ColorGrade mode="cold" intensity={1.12} />
      <FilmGrain opacity={0.06} />

      {/* AUDIO: subtle clock tick under the ambient buzz, unease building
          across the scene. Design V2: "subtle ticking under the buzz."
          Looped (asset ~5s) and kept low so it sits beneath the bed. */}
      <Audio
        src={staticFile("audio/clock-tick.mp3")}
        loop
        volume={(f) =>
          interpolate(f, [0, SCENE2_DURATION], [0.18, 0.4], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    </AbsoluteFill>
  );
};
