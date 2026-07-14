import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Platform } from "../../components/Platform";
import { DelaySign } from "../../components/DelaySign";
import { ColorGrade } from "../../style/ColorGrade";
import { FilmGrain } from "../../style/FilmGrain";
import { Vignette } from "../../style/Vignette";

/**
 * Scene 9: Empty Platform + Title (final scene).
 * Wide shot, platform empty — no commuter, no janitor, no train.
 * The sign still reads "DELAYED – 7 MIN", exactly as it always has.
 */
export const SCENE9_DURATION = 240; // 8 s — extra hold so the title can breathe

// Beat markers (30 fps) — exported for the assembly pass
export const HORN_START = 60; // 2.0 s — one distant train horn out of the silence
export const HORN_END = 120; // 4.0 s — fully faded by here
const TITLE_FADE_START = HORN_END + 15; // title only lands once the horn is gone
const TITLE_FADE_END = TITLE_FADE_START + 60; // 2 s fade, then holds to the end

export const Scene9_EmptyPlatformTitle: React.FC = () => {
  const frame = useCurrentFrame();

  // Signature move: one last slow dolly-in toward the sign. Slow and
  // inevitable — the camera only approaches.
  const dolly = interpolate(frame, [0, SCENE9_DURATION], [1, 1.07]);

  const titleOpacity = interpolate(
    frame,
    [TITLE_FADE_START, TITLE_FADE_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${dolly})`,
          transformOrigin: "50% 30%",
        }}
      >
        <Platform flickerIntensity={1} />

        {/* The sign, unchanged — still "DELAYED – 7 MIN" */}
        <div
          style={{
            position: "absolute",
            top: "16%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <DelaySign scale={0.9} />
        </div>
      </AbsoluteFill>

      {/* AUDIO: the scene is otherwise SILENT (no ambient bed — the silence
          is the point after Scene 8's swell). One distant train horn out of
          that silence, fading: HORN_START (frame 60) → gone by HORN_END
          (frame 120). Design V2: "silence; one distant train horn, fading." */}
      <Sequence from={HORN_START} durationInFrames={HORN_END - HORN_START}>
        <Audio
          src={staticFile("audio/train-horn-distant.mp3")}
          volume={(f) =>
            interpolate(f, [0, HORN_END - HORN_START], [0.45, 0], {
              extrapolateRight: "clamp",
            })
          }
        />
      </Sequence>

      <ColorGrade mode="cold" />

      {/* Title card — the film's final beat. Fades in over the empty
          platform in the sign's LED orange, echoing the one thing that
          never changed. Under the grain/vignette so it sits in the film. */}
      <AbsoluteFill
        style={{
          background: `rgba(0, 0, 0, ${titleOpacity * 0.35})`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 150,
            letterSpacing: 42,
            paddingLeft: 42, // recenters — letterSpacing trails the last glyph
            color: "#ff6b00",
            textShadow: "0 0 24px rgba(255, 107, 0, 0.7)",
            opacity: titleOpacity,
          }}
        >
          DELAYED
        </div>
      </AbsoluteFill>

      <FilmGrain />
      <Vignette />
    </AbsoluteFill>
  );
};
