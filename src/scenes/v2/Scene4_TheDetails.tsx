import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Parallax } from "../../style/Parallax";
import { FilmGrain } from "../../style/FilmGrain";
import { ColorGrade } from "../../style/ColorGrade";
import { VintagePoster } from "../../components/VintagePoster";
import { StationClock } from "../../components/StationClock";
import { DustBeam } from "../../components/DustBeam";

/** Scene 4: Wrongness Pt. 3 — The Details (0:41–0:51). */
export const SCENE4_DURATION = 300;

// Parallax stack, back to front. Over 300 frames the poster layer travels
// 600px, which is what the wall layout below is spaced against.
const WALL_SPEED = 0.7;
const FLOOR_SPEED = 1.2;
const BEAM_SPEED = 1.6;
const DETAIL_SPEED = 2.0;
const PILLAR_SPEED = 3.4;

const WALL_HEIGHT = 760;

type PosterPlacement = {
  x: number;
  y: number;
  type: React.ComponentProps<typeof VintagePoster>["type"];
  rotate: number;
  scale: number;
  peeling?: boolean;
};

// Laid out left to right in pan order; the clock sits past the last poster
// so it is the final detail the camera reaches.
const POSTERS: PosterPlacement[] = [
  { x: 150, y: 330, type: "concert", rotate: -2, scale: 2.1, peeling: true },
  { x: 560, y: 360, type: "celtics", rotate: 1.5, scale: 2.0 },
  { x: 1060, y: 340, type: "concert87", rotate: -1, scale: 2.15, peeling: true },
  { x: 1500, y: 365, type: "garden86", rotate: 2, scale: 2.0, peeling: true },
  { x: 1880, y: 350, type: "fare", rotate: -1.5, scale: 1.9 },
];

const CLOCK_X = 2180;
const CLOCK_Y = 240;

/** Frame the camera settles on; the rest of the scene holds still. */
const PAN_SETTLE = 255;

export const Scene4_TheDetails: React.FC = () => {
  const frame = useCurrentFrame();
  // Eased camera: full travel is covered by PAN_SETTLE with a slow
  // deceleration, then the frame holds for the final quiet beat — the clock
  // is the last detail revealed before the stillness.
  const panFrame = interpolate(frame, [0, PAN_SETTLE], [0, SCENE4_DURATION], {
    easing: Easing.bezier(0.33, 0, 0.2, 1),
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#0c0e10", overflow: "hidden" }}>
      {/* tiled platform wall */}
      <Parallax speed={WALL_SPEED} panFrame={panFrame}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 2800,
            height: WALL_HEIGHT,
            background:
              "repeating-linear-gradient(0deg, #1e2226 0px, #1e2226 2px, transparent 2px, transparent 95px)," +
              "repeating-linear-gradient(90deg, #1e2226 0px, #1e2226 2px, transparent 2px, transparent 190px)," +
              "linear-gradient(180deg, #3a4148 0%, #31373d 55%, #23282c 100%)",
          }}
        />
        {/* water-stain grime */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 2800,
            height: WALL_HEIGHT,
            background:
              "radial-gradient(ellipse 340px 500px at 420px 0px, rgba(10,12,10,0.45), transparent 70%)," +
              "radial-gradient(ellipse 260px 620px at 1450px 0px, rgba(10,12,10,0.38), transparent 70%)," +
              "radial-gradient(ellipse 420px 380px at 2350px 60px, rgba(10,12,10,0.42), transparent 70%)",
          }}
        />
        {/* cold fluorescent washes on the wall */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 2800,
            height: WALL_HEIGHT,
            background:
              "radial-gradient(ellipse 300px 700px at 850px 0px, rgba(190,210,225,0.10), transparent 75%)," +
              "radial-gradient(ellipse 300px 700px at 2250px 0px, rgba(190,210,225,0.12), transparent 75%)",
          }}
        />
      </Parallax>

      {/* platform floor */}
      <Parallax speed={FLOOR_SPEED} panFrame={panFrame}>
        <div
          style={{
            position: "absolute",
            top: WALL_HEIGHT,
            left: 0,
            width: 2800,
            height: 1080 - WALL_HEIGHT,
            background: "linear-gradient(180deg, #22262a 0%, #131619 100%)",
          }}
        />
        {/* faded platform-edge warning stripe */}
        <div
          style={{
            position: "absolute",
            top: WALL_HEIGHT + 200,
            left: 0,
            width: 2800,
            height: 26,
            background: "#8a7a2e",
            opacity: 0.35,
          }}
        />
      </Parallax>

      {/* fluorescent beam with dust motes — its own depth, just behind the poster plane */}
      <Parallax speed={BEAM_SPEED} panFrame={panFrame}>
        <div style={{ position: "absolute", top: 0, left: 595 }}>
          <DustBeam />
        </div>
      </Parallax>

      {/* wall details: posters, then the stopped clock */}
      <Parallax speed={DETAIL_SPEED} panFrame={panFrame}>
        {POSTERS.map((p) => (
          <div
            key={`${p.type}-${p.x}`}
            style={{
              position: "absolute",
              top: p.y,
              left: p.x,
              transform: `rotate(${p.rotate}deg) scale(${p.scale})`,
              transformOrigin: "top left",
              filter: "drop-shadow(4px 6px 6px rgba(0,0,0,0.5))",
            }}
          >
            <VintagePoster type={p.type} peeling={p.peeling} />
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            top: CLOCK_Y,
            left: CLOCK_X,
            filter: "drop-shadow(5px 8px 10px rgba(0,0,0,0.6))",
          }}
        >
          <StationClock size={230} />
        </div>
      </Parallax>

      {/* foreground steel pillars */}
      <Parallax speed={PILLAR_SPEED} panFrame={panFrame}>
        {[700, 2400].map((x) => (
          <div
            key={x}
            style={{
              position: "absolute",
              top: 0,
              left: x,
              width: 120,
              height: 1080,
              background:
                "linear-gradient(90deg, #0a0c0d 0%, #1d2326 35%, #262d31 50%, #171c1f 70%, #070809 100%)",
            }}
          />
        ))}
      </Parallax>

      <ColorGrade mode="cold" intensity={1} />
      <FilmGrain opacity={0.1} />
    </AbsoluteFill>
  );
};
