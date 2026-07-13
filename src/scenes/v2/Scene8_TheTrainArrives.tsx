import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { GhostTrain } from "../../components/GhostTrain";
import { Commuter } from "../../components/Commuter";
import { DelaySign } from "../../components/DelaySign";
import { ColorGrade } from "../../style/ColorGrade";
import { FilmGrain } from "../../style/FilmGrain";
import { Vignette } from "../../style/Vignette";

/**
 * Scene 8: The Train Arrives (1:27–1:39).
 *
 * AMBIGUITY RULE (structural, not decorative): we never show him inside
 * the train, and we never show the doors close. The scene ends mid-step,
 * before the threshold — his silhouette against the door light is the
 * last thing we see of him. Nothing here may resolve whether he boards:
 * - the doors only ever open (GhostTrain.doorsOpen is monotonic),
 * - the final shot crops his feet, so the step never lands on screen,
 * - the camera never follows him toward the door and never shows the
 *   doorway floor edge, so there is no spatial proof of arrival,
 * - the scene has no frames after the step begins to complete.
 */

export const SCENE8_DURATION = 360; // 12 s @ 30 fps

// Shot boundaries
const SHOT_LIGHTS_END = 115; // wide: headlights bloom, train slides in, stops
const SHOT_DOORS_END = 195; //  closer: a beat of stillness, doors open
const SHOT_SIGN_END = 240; //   insert: his glance — still "DELAYED – 7 MIN"
//                              240–360: behind him, the step, the cut

// Irregular flicker for the delay sign — never a clean loop.
const signFlicker = (frame: number) => {
  const seed = Math.sin(frame * 12.9898) * 43758.5453;
  const r = seed - Math.floor(seed);
  // Mostly steady, occasionally dips hard.
  return r > 0.92 ? 0.55 + r * 0.3 : 0.92 + r * 0.08;
};

/** Minimal cold platform: floor, safety strip, tiled wall. Built inline —
 * the scene lives in near-darkness and only needs shapes. */
const PlatformShell: React.FC = () => (
  <AbsoluteFill>
    {/* Tiled wall */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, #1a2028 0%, #141a21 70%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: "8%",
        left: 0,
        right: 0,
        height: "50%",
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(90,110,120,0.10) 0 2px, rgba(0,0,0,0) 2px 90px), repeating-linear-gradient(0deg, rgba(90,110,120,0.10) 0 2px, rgba(0,0,0,0) 2px 44px)",
      }}
    />
    {/* Platform floor */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "26%",
        background: "linear-gradient(180deg, #262c33 0%, #1b2026 100%)",
      }}
    />
    {/* Yellow safety strip at the platform edge */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: "24.5%",
        height: 14,
        background: "#8a7a2e",
        opacity: 0.85,
      }}
    />
  </AbsoluteFill>
);

export const Scene8_TheTrainArrives: React.FC = () => {
  const frame = useCurrentFrame();

  // --- Train timeline (shared by shots A and B so the world is continuous)
  // Approach: decelerating — fast out of the tunnel, easing to a stop.
  const arrival = interpolate(frame, [10, SHOT_LIGHTS_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // Doors: open once, during shot B, and never animate back down.
  const doorsOpen = interpolate(frame, [135, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ background: "#0b0e12", overflow: "hidden" }}>
      {/* ——— Shot A: wide. Headlights bloom — and this time he sees them. */}
      <Sequence from={0} durationInFrames={SHOT_LIGHTS_END}>
        <AbsoluteFill>
          <PlatformShell />
          <ColorGrade mode="cold" />
          {/* GhostTrain sits above the cold grade so its doorway stays the
              only warm-graded light in the frame. */}
          <GhostTrain arrival={arrival} doorsOpen={0} />
          {/* He watches from frame right — silhouetted, small, facing the
              tunnel. Angle is lateral: his feet and the platform edge are
              both visible here, which is fine — the train hasn't stopped. */}
          <div
            style={{
              position: "absolute",
              right: "16%",
              bottom: "10%",
              filter: "brightness(0.14) contrast(1.15)",
            }}
          >
            <Commuter scale={1.15} showShirt breathFog />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ——— Shot B: closer on the doors. Stillness, then they open on warm
             light with no visible interior. He stays at frame edge, clearly
             ON the platform, several strides from the door — distance is
             legible, so no boarding can be inferred. */}
      <Sequence from={SHOT_LIGHTS_END} durationInFrames={SHOT_DOORS_END - SHOT_LIGHTS_END}>
        <AbsoluteFill style={{ transform: "scale(1.25)", transformOrigin: "50% 60%" }}>
          <PlatformShell />
          <ColorGrade mode="cold" />
          <GhostTrain arrival={1} doorsOpen={doorsOpen} />
          <div
            style={{
              position: "absolute",
              right: "13%",
              bottom: "8%",
              filter: "brightness(0.12) contrast(1.15)",
            }}
          >
            <Commuter scale={1.3} showShirt breathFog />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ——— Shot C: insert, his POV glance — the sign still reads
             "DELAYED – 7 MIN". Signature slow dolly-in toward the sign;
             flicker is irregular, seeding doubt. */}
      <Sequence from={SHOT_DOORS_END} durationInFrames={SHOT_SIGN_END - SHOT_DOORS_END}>
        <AbsoluteFill
          style={{
            background: "#0a0d11",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              transform: `scale(${interpolate(
                frame,
                [SHOT_DOORS_END, SHOT_SIGN_END],
                [1, 1.07]
              )})`,
              opacity: signFlicker(frame),
            }}
          >
            <DelaySign scale={1.6} />
          </div>
          <ColorGrade mode="cold" intensity={0.7} />
        </AbsoluteFill>
      </Sequence>

      {/* ——— Shot D: behind him. His silhouette against the door light.
             Framed from the knees up — his feet never appear, so the step
             starts but is never seen to land. The camera drifts in but does
             NOT follow him; the doorway floor edge is hidden behind his
             body and the light bloom. The scene cuts mid-step. */}
      <Sequence from={SHOT_SIGN_END} durationInFrames={SCENE8_DURATION - SHOT_SIGN_END}>
        {(() => {
          // The step: begins at f336, would complete around f372 — but the
          // scene ends at 360. It never completes on screen. Moving away
          // from camera = slight shrink + rise; no lateral cheat that could
          // read as stepping back.
          const step = interpolate(frame, [336, 372], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.quad),
          });
          const stepScale = 1 - step * 0.05;
          const stepRise = step * 14;
          // Slow, inevitable dolly-in toward the light — the camera
          // approaches the doors, never enters them.
          const dolly = interpolate(
            frame,
            [SHOT_SIGN_END, SCENE8_DURATION],
            [1.35, 1.45]
          );
          return (
            <AbsoluteFill style={{ transform: `scale(${dolly})`, transformOrigin: "50% 55%" }}>
              <PlatformShell />
              <ColorGrade mode="cold" />
              <GhostTrain arrival={1} doorsOpen={1} />
              {/* Centered on the doorway, dark against the warm light.
                  Bottom offset is negative: knees-up crop, feet off frame. */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: "-16%",
                  transform: `translateX(-50%) translateY(${-stepRise}px) scale(${2.1 * stepScale})`,
                  transformOrigin: "50% 100%",
                  filter: "brightness(0.05) contrast(1.2)",
                }}
              >
                <Commuter scale={1} showShirt />
              </div>
            </AbsoluteFill>
          );
        })()}
      </Sequence>

      {/* Always-on finish, both modes */}
      <FilmGrain />
      <Vignette strength={0.6} />
    </AbsoluteFill>
  );
};
