import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Commuter } from "../../components/Commuter";
import { Platform } from "../../components/Platform";
import { ColorGrade } from "../../style/ColorGrade";
import { FilmGrain } from "../../style/FilmGrain";
import { Vignette } from "../../style/Vignette";
import { FlickerCut } from "../../style/transitions/FlickerCut";

/**
 * Scene 6: Flashback — 1987 (1:07–1:15).
 * The only warm scene in the film: pouring out of Boston Garden after a win.
 * Banner 16 glimpsed through the doors; he's young, laughing, the shirt new
 * and bright green.
 *
 * Beats:
 *   SURFACE  0–12     memory slams in, already mid-roar
 *   POUR     12–150   crowd streaming out of the Garden doors
 *   PEAK     150–239  push-in on him, cheer builds to maximum warmth
 *   CUT      240      hardest FlickerCut in the film
 *   COLD     240–269  the platform, alone, dead (stand-in for Scene 7 open)
 */
const FLASHBACK_FRAMES = 240; // 8 s — the design doc's full 1:07–1:15
const COLD_TAIL_FRAMES = 30;
export const SCENE6_DURATION = FLASHBACK_FRAMES + COLD_TAIL_FRAMES;
export const SCENE6_CUT_FRAME = FLASHBACK_FRAMES;

const PEAK_START = 150;

/** Boston Garden exterior at night — brick, marquee, doors spilling light. */
const GardenExterior: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Night sky, warm-cast */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, #241a20 0%, #3a2a24 55%, #4a3626 100%)",
        }}
      />

      {/* Garden facade — brick */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "6%",
          right: "6%",
          height: "56%",
          background: `
            repeating-linear-gradient(
              0deg,
              #6a4030 0px, #6a4030 22px,
              #4e2e22 22px, #4e2e22 25px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(0,0,0,0) 0px, rgba(0,0,0,0) 55px,
              rgba(30,15,10,0.5) 55px, rgba(30,15,10,0.5) 58px
            )
          `,
          backgroundBlendMode: "multiply",
          boxShadow: "0 0 120px rgba(255, 180, 80, 0.15) inset",
        }}
      />

      {/* Marquee */}
      <div
        style={{
          position: "absolute",
          top: "14%",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "18px 60px 14px",
          background: "#1c1410",
          border: "6px solid #7a5a30",
          borderRadius: 6,
          boxShadow: "0 0 90px rgba(255, 200, 100, 0.55)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Arial Black, sans-serif",
            fontSize: 58,
            letterSpacing: 10,
            color: "#ffe9b0",
            textShadow:
              "0 0 18px rgba(255, 210, 120, 0.9), 0 0 50px rgba(255, 170, 60, 0.6)",
          }}
        >
          BOSTON GARDEN
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: "Arial, sans-serif",
            fontSize: 22,
            letterSpacing: 6,
            color: "#ffd27a",
            textShadow: "0 0 12px rgba(255, 190, 90, 0.8)",
          }}
        >
          HOME OF THE CELTICS
        </div>
      </div>

      {/* Doorway row — light pouring out */}
      {[-2, -1, 0, 1, 2].map((d) => (
        <div
          key={d}
          style={{
            position: "absolute",
            top: "42%",
            left: `calc(50% + ${d * 150}px)`,
            transform: "translateX(-50%)",
            width: 110,
            height: "22%",
            background:
              "linear-gradient(180deg, #ffedb8 0%, #ffca6a 60%, #f0a040 100%)",
            borderRadius: "6px 6px 0 0",
            border: "5px solid #3a241a",
            borderBottom: "none",
            boxShadow: "0 0 70px rgba(255, 200, 100, 0.75)",
            overflow: "hidden",
          }}
        >
          {/* Banner 16 — glimpsed through the center door only */}
          {d === 0 && (
            <div
              style={{
                position: "absolute",
                top: 10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 52,
                height: 66,
                background: "#007a33",
                clipPath: "polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Arial Black, sans-serif",
                fontSize: 26,
                color: "#ffffff",
              }}
            >
              16
            </div>
          )}
        </div>
      ))}

      {/* Light pools on the pavement below each door */}
      <div
        style={{
          position: "absolute",
          top: "62%",
          left: 0,
          right: 0,
          bottom: 0,
          background: "#4a3828",
        }}
      />
      {[-2, -1, 0, 1, 2].map((d) => (
        <div
          key={`pool-${d}`}
          style={{
            position: "absolute",
            top: "63%",
            left: `calc(50% + ${d * 150}px)`,
            transform: "translateX(-50%)",
            width: 340,
            height: 260,
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(255, 210, 120, 0.4) 0%, rgba(255, 190, 90, 0.12) 45%, transparent 75%)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/** One silhouetted fan pouring out of the doors toward the street. */
const CrowdFigure: React.FC<{ index: number; frame: number }> = ({
  index,
  frame,
}) => {
  const rx = random(`s6-fig-x-${index}`);
  const rs = random(`s6-fig-speed-${index}`);
  const rz = random(`s6-fig-size-${index}`);

  const cycle = 150 + rs * 130;
  const p = ((frame + rx * cycle * 7) % cycle) / cycle;

  const endX = 6 + rx * 88;
  const x = interpolate(p, [0, 1], [46 + (rx - 0.5) * 12, endX]);
  const y = interpolate(p, [0, 1], [58, 104]);
  const s = interpolate(p, [0, 1], [0.35, 1.35]) * (0.75 + rz * 0.5);
  const bob = Math.sin((frame + index * 13) * 0.28) * 3;
  const fade = interpolate(p, [0, 0.08, 0.88, 1], [0, 1, 1, 0]);
  const armsUp = index % 3 === 0;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -100%) translateY(${bob}px) scale(${s})`,
        opacity: fade * 0.9,
      }}
    >
      {/* Head */}
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#2c1a10",
          margin: "0 auto",
        }}
      />
      {/* Cheering arms */}
      {armsUp && (
        <>
          <div
            style={{
              position: "absolute",
              top: 6,
              left: -8,
              width: 8,
              height: 34,
              background: "#2c1a10",
              borderRadius: 4,
              transform: "rotate(35deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 6,
              right: -8,
              width: 8,
              height: 34,
              background: "#2c1a10",
              borderRadius: 4,
              transform: "rotate(-35deg)",
            }}
          />
        </>
      )}
      {/* Body */}
      <div
        style={{
          width: 30,
          height: 52,
          borderRadius: "8px 8px 3px 3px",
          background: "#2c1a10",
          margin: "-2px auto 0",
        }}
      />
    </div>
  );
};

/** Gold / green / white confetti drifting down through the marquee glow. */
const Confetti: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(26).fill(0).map((_, i) => {
        const rx = random(`s6-conf-x-${i}`);
        const rs = random(`s6-conf-s-${i}`);
        const rc = random(`s6-conf-c-${i}`);
        const cycle = 90 + rs * 90;
        const p = ((frame + rx * cycle * 3) % cycle) / cycle;
        const y = p * 112 - 6;
        const x = rx * 100 + Math.sin(frame * 0.09 + i * 1.7) * 2.2;
        const color =
          rc < 0.4 ? "#ffd700" : rc < 0.7 ? "#00a844" : "#fff5e0";
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: 7 + rs * 5,
              height: 10 + rs * 4,
              background: color,
              opacity: 0.85,
              transform: `rotate(${frame * 4 + i * 40}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Scene6_Flashback: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow, inevitable dolly-in toward him — plus a live handheld sway the
  // platform scenes never get. Memory moves; the platform doesn't.
  const dolly = interpolate(frame, [0, FLASHBACK_FRAMES], [1, 1.16], {
    extrapolateRight: "clamp",
  });
  const swayX = Math.sin(frame * 0.07) * 6 + Math.sin(frame * 0.023) * 4;
  const swayY = Math.cos(frame * 0.05) * 4;

  // Cheer builds into the cut — the cut lands mid-jump, at peak warmth.
  const peak = interpolate(frame, [PEAK_START, FLASHBACK_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const jump = -Math.abs(Math.sin(frame * 0.11)) * (14 + 12 * peak);

  // SURFACE: the memory bursts in overexposed — a blown-out first instant
  // that settles fast. No ramp-up in the content itself: the crowd, sway,
  // and dolly are already running at frame 0. It was always playing; we
  // just cut into it.
  const surfaceBloom = interpolate(frame, [0, 3, 14], [0.95, 0.55, 0], {
    extrapolateRight: "clamp",
  });

  const inFlashback = frame < SCENE6_CUT_FRAME;

  if (!inFlashback) {
    // COLD: back on the platform, alone. Dead still — no dolly, no sway,
    // no light flicker. The room tone after the roar. (Stand-in for the
    // Scene 7 opening; trim at assembly if Scene 7 picks up here.)
    return (
      <AbsoluteFill style={{ backgroundColor: "#0d0f0d" }}>
        <Platform flickerIntensity={0} />
        <div
          style={{
            position: "absolute",
            left: "38%",
            top: "63%",
            transform: "translate(-50%, -100%) scale(0.85)",
            transformOrigin: "bottom center",
          }}
        >
          <Commuter showShirt breathFog />
        </div>
        <ColorGrade mode="cold" intensity={1} />
        <FilmGrain />
        <Vignette strength={0.7} innerRadius={45} />
        {/* The hardest flicker in the film — the cut hides inside it */}
        <FlickerCut
          at={SCENE6_CUT_FRAME}
          durationInFrames={16}
          harshness={1}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1410" }}>
      {/* ——— The memory ——— */}
      <AbsoluteFill
        style={{
          transform: `scale(${dolly}) translate(${swayX}px, ${swayY}px)`,
        }}
      >
        <GardenExterior />

        {new Array(16).fill(0).map((_, i) => (
          <CrowdFigure key={i} index={i} frame={frame} />
        ))}

        <Confetti frame={frame} />

        {/* Him — young, laughing, the shirt new and bright green */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "-3%",
            transform: `translateX(-50%) translateY(${jump}px)`,
            filter: "saturate(1.25) brightness(1.08)",
          }}
        >
          <Commuter
            scale={1.6}
            showShirt
            brightShirt
            expression="laughing"
            armsRaised
          />
        </div>
      </AbsoluteFill>

      {/* Warmth swells toward the cut — grade runs slightly hot at the peak */}
      <ColorGrade mode="warm" intensity={1 + 0.15 * peak} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(255, 220, 140, 0.5) 0%, transparent 65%)",
          opacity: 0.12 * peak,
          pointerEvents: "none",
        }}
      />

      <FilmGrain />
      <Vignette strength={0.45} innerRadius={60} />

      {/* SURFACE: overexposed burst as the memory forces its way in */}
      {surfaceBloom > 0 && (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background: "#fff3d8",
            opacity: surfaceBloom,
          }}
        />
      )}
      {/* Entry stutter — the janitor's line tearing the memory open.
          Ordinary scene-to-scene harshness; the exit is the violent one. */}
      <FlickerCut at={4} durationInFrames={8} harshness={0.65} />

      {/* Exit: the flicker builds mid-cheer, before the content cut —
          same instance parameters as the cold side so the strobe pattern
          is continuous across the cut. Maximum harshness; do not soften. */}
      <FlickerCut at={SCENE6_CUT_FRAME} durationInFrames={16} harshness={1} />

      {/* AUDIO: warm, full crowd roar — already at full intensity from
          frame 0 (the memory arrives mid-roar). The Sequence ends at
          SCENE6_CUT_FRAME, and the cold tail (frame >= cut) renders no
          audio, so the roar cuts DEAD to silence exactly at the flicker-cut.
          Design V2: "crowd roar, warm and full → cut to dead room tone." */}
      <Sequence from={0} durationInFrames={SCENE6_CUT_FRAME}>
        <Audio src={staticFile("audio/crowd-roar.mp3")} volume={0.85} />
      </Sequence>
    </AbsoluteFill>
  );
};
