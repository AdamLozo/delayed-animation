import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { ColorGrade } from "../../style/ColorGrade";
import { Parallax } from "../../style/Parallax";

/**
 * Scene 1 (V2): Platform Establishing + Wrongness Pt. 1 — 420 frames / 14s.
 *
 * The platform is rebuilt from the V1 Platform component's vocabulary but
 * split into three depth layers so the dolly-in can parallax them:
 *   - Backdrop: ceiling, fluorescents, tile wall, orange stripe, map,
 *     fare poster (the wrongness beat), graffiti, grime, tunnel mouth
 *   - TrackBed: the dark void between the viewer and the far wall
 *   - NearPlatform: our platform floor, safety strip, debris, bench, pillars
 *
 * Every layer bleeds past the frame edges so lateral parallax drift
 * never exposes a seam.
 */

// Shared bleed wrapper: each layer is 120% wide, centered, so it can
// drift horizontally without showing its edges.
const Bleed: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      bottom: 0,
      left: "-10%",
      width: "120%",
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Backdrop — far wall and everything mounted on it
// ---------------------------------------------------------------------------

const FarePoster: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: "21%",
      left: "63%",
      width: 112,
      height: 152,
      background: "#d6cdb4",
      border: "2px solid #35322a",
      borderRadius: 2,
      transform: "rotate(-1.2deg)",
      boxShadow: "0 3px 7px rgba(0,0,0,0.45)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      padding: 8,
      fontFamily: "Georgia, 'Times New Roman', serif",
      color: "#2b2822",
    }}
  >
    <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: "bold" }}>
      M B T A
    </div>
    <div
      style={{
        width: "78%",
        height: 1,
        background: "#4a463c",
        opacity: 0.6,
      }}
    />
    <div style={{ fontSize: 13, letterSpacing: 1 }}>FARE</div>
    <div style={{ fontSize: 14, letterSpacing: 1 }}>ONE WAY</div>
    <div style={{ fontSize: 24, fontWeight: "bold" }}>60&cent;</div>
    <div style={{ fontSize: 8, opacity: 0.75, textAlign: "center" }}>
      EXACT CHANGE APPRECIATED
    </div>
    {/* Aging: yellowed film + a water stain in one corner */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(160deg, rgba(150,130,90,0.22) 0%, rgba(120,105,70,0.30) 100%)",
        borderRadius: 2,
      }}
    />
    <div
      style={{
        position: "absolute",
        top: -6,
        right: -8,
        width: 52,
        height: 44,
        background:
          "radial-gradient(ellipse, rgba(90,75,50,0.4) 0%, transparent 70%)",
        filter: "blur(3px)",
      }}
    />
  </div>
);

const Backdrop: React.FC<{ lightAlpha: number }> = ({ lightAlpha }) => {
  const lightColor = `rgba(200, 220, 210, ${lightAlpha})`;

  return (
    <Bleed>
      {/* Ceiling */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "13%",
          background: "#24272a",
        }}
      />

      {/* Fluorescent fixtures */}
      <div
        style={{
          position: "absolute",
          top: "7%",
          left: "8%",
          width: "84%",
          height: "3.5%",
          background: `linear-gradient(90deg, ${lightColor} 0%, ${lightColor} 16%, transparent 16%, transparent 24%, ${lightColor} 24%, ${lightColor} 46%, transparent 46%, transparent 54%, ${lightColor} 54%, ${lightColor} 76%, transparent 76%, transparent 84%, ${lightColor} 84%, ${lightColor} 100%)`,
          boxShadow: `0 26px 70px ${lightColor}`,
        }}
      />

      {/* Tiled far wall */}
      <div
        style={{
          position: "absolute",
          top: "13%",
          left: 0,
          right: 0,
          height: "43%",
          background: `
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 96px,
              rgba(10, 16, 14, 0.5) 96px,
              rgba(10, 16, 14, 0.5) 100px
            ),
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 46px,
              rgba(10, 16, 14, 0.5) 46px,
              rgba(10, 16, 14, 0.5) 50px
            ),
            linear-gradient(180deg, #46544f 0%, #39453f 55%, #2e3833 100%)
          `,
        }}
      />

      {/* Tunnel mouth — dark arch swallowing the wall at frame left */}
      <div
        style={{
          position: "absolute",
          top: "17%",
          left: "1%",
          width: "12%",
          height: "39%",
          background:
            "linear-gradient(90deg, #000 0%, #000 62%, rgba(4, 7, 9, 0.85) 80%, transparent 100%)",
          borderRadius: "0 46% 0 0 / 0 38% 0 0",
          boxShadow: "inset -30px 0 40px rgba(0,0,0,0.9)",
        }}
      />

      {/* Orange Line stripe */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: 0,
          right: 0,
          height: "6.5%",
          background: "linear-gradient(180deg, #e85d04 0%, #c94f02 100%)",
        }}
      />

      {/* MBTA system map (carried over from V1) */}
      <div
        style={{
          position: "absolute",
          top: "17%",
          left: "44%",
          width: 170,
          height: 132,
          background: "#f0ecd8",
          border: "3px solid #26282a",
          borderRadius: 3,
          padding: 7,
          boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: "bold",
            textAlign: "center",
            color: "#1a1a1a",
            fontFamily: "Arial, sans-serif",
          }}
        >
          MBTA RAPID TRANSIT
        </div>
        <div style={{ position: "relative", height: 96, marginTop: 4 }}>
          <div style={{ position: "absolute", top: 8, left: 18, width: 58, height: 3, background: "#dc2f02" }} />
          <div style={{ position: "absolute", top: 8, left: 76, width: 3, height: 30, background: "#dc2f02" }} />
          <div style={{ position: "absolute", top: 26, left: 48, width: 3, height: 50, background: "#e85d04" }} />
          <div style={{ position: "absolute", top: 74, left: 18, width: 33, height: 3, background: "#e85d04" }} />
          <div style={{ position: "absolute", top: 42, left: 76, width: 58, height: 3, background: "#007a33" }} />
          <div style={{ position: "absolute", top: 18, left: 114, width: 3, height: 27, background: "#007a33" }} />
          <div style={{ position: "absolute", top: 58, left: 96, width: 46, height: 3, background: "#003da5" }} />
          <div style={{ position: "absolute", top: 24, left: 46, width: 6, height: 6, borderRadius: "50%", background: "#e85d04", border: "2px solid #000" }} />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(180,160,120,0.18)",
            borderRadius: 3,
          }}
        />
      </div>

      {/* Fare poster — Wrongness Pt. 1. Never highlighted; just there. */}
      <FarePoster />

      {/* Graffiti */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "20%",
          fontSize: 30,
          fontFamily: "Arial Black, sans-serif",
          fontWeight: "bold",
          color: "#ff0055",
          opacity: 0.6,
          transform: "rotate(-8deg) skewX(-5deg)",
          textShadow: "2px 2px 0 #000",
        }}
      >
        ROXBURY
      </div>
      <div
        style={{
          position: "absolute",
          top: "27%",
          left: "78%",
          fontSize: 22,
          fontFamily: "Arial Black, sans-serif",
          fontWeight: "bold",
          color: "#00ff88",
          opacity: 0.5,
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
          left: "34%",
          fontSize: 17,
          fontFamily: "Arial, sans-serif",
          color: "#ffffff",
          opacity: 0.45,
          transform: "rotate(-3deg)",
        }}
      >
        617 4 LIFE
      </div>

      {/* Grime */}
      <div
        style={{
          position: "absolute",
          top: "24%",
          left: "15%",
          width: 80,
          height: 120,
          background:
            "radial-gradient(ellipse, rgba(40,30,20,0.4) 0%, transparent 70%)",
          filter: "blur(5px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "70%",
          width: 100,
          height: 90,
          background:
            "radial-gradient(ellipse, rgba(30,30,30,0.5) 0%, transparent 70%)",
          filter: "blur(4px)",
        }}
      />
    </Bleed>
  );
};

// ---------------------------------------------------------------------------
// TrackBed — the void between us and the far wall
// ---------------------------------------------------------------------------

const TrackBed: React.FC = () => (
  <Bleed>
    <div
      style={{
        position: "absolute",
        top: "56%",
        left: 0,
        right: 0,
        height: "16%",
        background: "linear-gradient(180deg, #101312 0%, #060808 60%, #0a0c0b 100%)",
      }}
    />
    {/* Faint rail glints */}
    <div
      style={{
        position: "absolute",
        top: "61%",
        left: 0,
        right: 0,
        height: 2,
        background:
          "linear-gradient(90deg, transparent 0%, rgba(160,180,175,0.18) 30%, rgba(160,180,175,0.28) 50%, rgba(160,180,175,0.14) 75%, transparent 100%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: "67%",
        left: 0,
        right: 0,
        height: 2,
        background:
          "linear-gradient(90deg, transparent 5%, rgba(160,180,175,0.22) 40%, rgba(160,180,175,0.3) 60%, transparent 95%)",
      }}
    />
  </Bleed>
);

// ---------------------------------------------------------------------------
// NearPlatform — our floor, safety strip, debris, bench, pillars
// ---------------------------------------------------------------------------

const NearPlatform: React.FC = () => (
  <Bleed>
    {/* Platform floor */}
    <div
      style={{
        position: "absolute",
        top: "72%",
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(180deg, #43474a 0%, #35383b 100%)",
      }}
    />

    {/* Yellow safety strip along the platform edge */}
    <div
      style={{
        position: "absolute",
        top: "72%",
        left: 0,
        right: 0,
        height: "3%",
        background: `repeating-linear-gradient(
          90deg,
          #d9b60c 0px,
          #d9b60c 30px,
          #17181a 30px,
          #17181a 40px
        )`,
      }}
    />

    {/* Bench */}
    <div
      style={{
        position: "absolute",
        top: "79%",
        left: "22%",
        width: 210,
        height: 16,
        background: "#5b5e60",
        borderRadius: 4,
        boxShadow: "0 26px 18px -12px rgba(0,0,0,0.5)",
      }}
    />
    <div style={{ position: "absolute", top: "80.4%", left: "22.5%", width: 10, height: 44, background: "#3f4244" }} />
    <div style={{ position: "absolute", top: "80.4%", left: "31.5%", width: 10, height: 44, background: "#3f4244" }} />

    {/* Debris (from V1: cup, can, papers) */}
    <div
      style={{
        position: "absolute",
        top: "84%",
        left: "48%",
        width: 34,
        height: 24,
        background: "#e4dccb",
        transform: "rotate(-25deg)",
        opacity: 0.75,
        boxShadow: "0 2px 3px rgba(0,0,0,0.3)",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: "87%",
        left: "63%",
        width: 15,
        height: 20,
        background: "#c9a26e",
        borderRadius: 2,
        transform: "rotate(45deg)",
        opacity: 0.75,
      }}
    />
    <div
      style={{
        position: "absolute",
        top: "89%",
        left: "36%",
        width: 18,
        height: 22,
        background: "#b04040",
        borderRadius: "2px 2px 0 0",
        opacity: 0.65,
      }}
    />

    {/* Structural pillars — strongest foreground depth cue */}
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: "18%",
        left: "13%",
        width: 92,
        background:
          "linear-gradient(90deg, #23282b 0%, #3a4145 45%, #2c3235 100%)",
        boxShadow: "12px 0 24px rgba(0,0,0,0.45)",
      }}
    >
      {/* Pillar band */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: 0,
          right: 0,
          height: 40,
          background: "#c94f02",
          opacity: 0.85,
        }}
      />
    </div>
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: "18%",
        left: "81%",
        width: 110,
        background:
          "linear-gradient(90deg, #1f2427 0%, #363d41 45%, #282e31 100%)",
        boxShadow: "12px 0 24px rgba(0,0,0,0.45)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: 0,
          right: 0,
          height: 40,
          background: "#c94f02",
          opacity: 0.85,
        }}
      />
    </div>
  </Bleed>
);

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

export const SCENE1_DURATION = 420;

// Lateral drift speeds (px/frame). Foreground slides ~4x faster than the
// far wall; max total drift (0.45 * 420 = 189px) stays inside the 10%
// layer bleed (192px) so no seam can appear even at scale 1.
const BG_SPEED = 0.12;
const MID_SPEED = 0.28;
const FG_SPEED = 0.45;

export const Scene1_Establishing: React.FC = () => {
  const frame = useCurrentFrame();

  // Opening fade from black.
  const fadeIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });

  // The dolly-in: a slow scale push across the entire scene. The fare
  // poster sits near the push origin, so it starts sub-legible at wide
  // framing and crosses into readability around the scene's midpoint
  // while the parallax drift carries the camera past it.
  const dolly = interpolate(frame, [0, SCENE1_DURATION], [1, 1.32], {
    easing: Easing.inOut(Easing.sin),
    extrapolateRight: "clamp",
  });

  // Irregular fluorescent flicker: two incommensurate sines for slow
  // breathing, plus a hash-driven deeper dip every few blocks so the
  // timing never reads as periodic.
  const block = Math.floor(frame / 6);
  const hashRaw = Math.sin(block * 12.9898) * 43758.5453;
  const hash = hashRaw - Math.floor(hashRaw);
  const dip = hash < 0.09 ? 0.045 : 0;
  const lightAlpha =
    0.13 +
    0.025 * Math.sin(frame * 0.13) +
    0.015 * Math.sin(frame * 0.047 + 2.1) -
    dip;

  return (
    <AbsoluteFill style={{ background: "#0b0d0f", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${dolly})`,
          transformOrigin: "58% 40%",
          opacity: fadeIn,
        }}
      >
        <Parallax speed={BG_SPEED}>
          <Backdrop lightAlpha={lightAlpha} />
        </Parallax>
        <Parallax speed={MID_SPEED}>
          <TrackBed />
        </Parallax>
        <Parallax speed={FG_SPEED}>
          <NearPlatform />
        </Parallax>
      </AbsoluteFill>
      <ColorGrade mode="cold" />
    </AbsoluteFill>
  );
};
