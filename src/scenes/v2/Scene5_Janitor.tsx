import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
} from "remotion";
import { Platform } from "../../components/Platform";
import { Commuter } from "../../components/Commuter";
import { Janitor } from "../../components/Janitor";
import { LostAndFound } from "../../components/LostAndFound";
import { ColorGrade } from "../../style/ColorGrade";
import { FilmGrain } from "../../style/FilmGrain";
import { Vignette } from "../../style/Vignette";

/**
 * Scene 5: The Janitor (design V2, 0:51–1:07).
 * He stops sweeping, leans on the broom, and delivers the exchange with
 * worn-in pity. The third line — "You always ask that" — lands softer,
 * an aside as he resumes sweeping, not an exclamation.
 */

export const SCENE5_DURATION = 555; // 18.5 s @ 30 fps — stretched from the doc's 16 s floor so the aside and the rack get air

// Beat map (frames)
const JANITOR_STOPS = 84; // sweeping → leaning
const LINE1 = { from: 108, dur: 84 }; // "You're still waiting for the 11:42?"
const NOD = { from: 202, dur: 26 }; // commuter's small nod
const LINE2 = { from: 240, dur: 96 }; // "…That train's been delayed since 1987."
const RESUME_SWEEP = 372; // ~2 s of silence, then broom again
const LINE3 = { from: 390, dur: 88 }; // "You always ask that." — soft, half-swallowed
// Line 3 ends at 478; the last ~2.5 s are just sweeping, the platform, and the rack.

// Rack reveal: strictly the back half, after the "1987" beat has landed.
// It doesn't enter — the light over it slowly comes up, as if a tube upstage
// is warming. The camera never turns toward it. Fully settled before the
// aside finishes, so the tail holds a still image.
const RACK_REVEAL = { from: 336, to: 450 };

const Subtitle: React.FC<{ text: string; soft?: boolean }> = ({
  text,
  soft = false,
}) => {
  const frame = useCurrentFrame();
  // The soft line seeps in rather than appearing
  const opacity = interpolate(frame, [0, soft ? 28 : 12], [0, soft ? 0.72 : 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: "7%",
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: "Georgia, serif",
        fontStyle: soft ? "italic" : "normal",
        fontSize: soft ? 30 : 36,
        letterSpacing: soft ? 1.5 : 0.5,
        color: soft ? "rgba(215, 220, 218, 1)" : "rgba(240, 242, 240, 1)",
        textShadow: "0 2px 12px rgba(0,0,0,0.85)",
        opacity,
      }}
    >
      {text}
    </div>
  );
};

export const Scene5_Janitor: React.FC = () => {
  const frame = useCurrentFrame();

  // Signature slow dolly — the camera only ever approaches
  const dolly = interpolate(frame, [0, SCENE5_DURATION], [1, 1.055]);

  const leaning = frame >= JANITOR_STOPS && frame < RESUME_SWEEP;

  // Small nod: a dip of the whole figure, weighted at the feet
  const nod =
    frame >= NOD.from && frame <= NOD.from + NOD.dur
      ? Math.sin(((frame - NOD.from) / NOD.dur) * Math.PI) * 4
      : 0;

  // Light coming up on the rack: a slow lift with a faint fluorescent
  // waver, never reaching full presence.
  const rackLift = interpolate(
    frame,
    [RACK_REVEAL.from, RACK_REVEAL.to],
    [0, 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const rackWaver =
    rackLift > 0 ? 1 - 0.06 * (0.5 + 0.5 * Math.sin(frame * 0.31)) : 1;
  const rackOpacity = rackLift * rackWaver;

  return (
    <AbsoluteFill style={{ background: "#0d1114" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${dolly})`,
          transformOrigin: "42% 55%",
        }}
      >
        <Platform flickerIntensity={0.35} />

        {/* Lost-and-found rack on the wall behind the janitor — upstage left,
            small, lost in shadow until the back half of the scene */}
        <div
          style={{
            position: "absolute",
            top: "26%",
            left: "9%",
          }}
        >
          <LostAndFound scale={0.55} opacity={rackOpacity} />
        </div>

        {/* Janitor in the middle distance, left */}
        <div
          style={{
            position: "absolute",
            bottom: "24%",
            left: "26%",
          }}
        >
          <Janitor scale={0.62} isSweeping leaning={leaning} />
        </div>

        {/* Commuter in the nearer ground, right */}
        <div
          style={{
            position: "absolute",
            bottom: "18%",
            right: "24%",
            transform: `translateY(${nod}px) rotate(${nod * 0.5}deg)`,
            transformOrigin: "bottom center",
          }}
        >
          <Commuter scale={0.8} />
        </div>
      </AbsoluteFill>

      {/* Dialogue — understated lower thirds, not bubbles */}
      <Sequence from={LINE1.from} durationInFrames={LINE1.dur}>
        <Subtitle text="You're still waiting for the 11:42?" />
      </Sequence>
      <Sequence from={LINE2.from} durationInFrames={LINE2.dur}>
        <Subtitle text="…That train's been delayed since 1987." />
      </Sequence>
      {/* The aside: softer, smaller, said mostly to the floor as he sweeps */}
      <Sequence from={LINE3.from} durationInFrames={LINE3.dur}>
        <Subtitle text="You always ask that." soft />
      </Sequence>

      <ColorGrade mode="cold" />
      <Vignette />
      <FilmGrain />
    </AbsoluteFill>
  );
};
