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
import { Commuter } from "../../components/Commuter";
import { SecondCommuter } from "../../components/SecondCommuter";
import { TrainRush, trainRushShake } from "../../components/TrainRush";
import { ColorGrade } from "../../style/ColorGrade";

/** Scene 3: The Second Commuter (0:26–0:41) — 450 frames @ 30fps. */
export const SCENE3_DURATION = 450;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---- Timeline (scene-local frames) ----
const WOMAN_ENTER_START = 20;
const WOMAN_ENTER_END = 115; // she reaches her spot, a few feet from him
const HALF_TURN_START = 140; // he half-turns, maybe starts to speak
const HALF_TURN_END = 180;
const TRAIN_START = 180;
const TRAIN_DURATION = 130; // approach → rush → depart; ends at 310
const WOMAN_BOARD_START = 240; // she dissolves into the light
const WOMAN_GONE = 275;
const STEP_START = 330; // he steps toward the platform edge
const STEP_END = 385;
const LOOK_TUNNEL = 395; // leans, looking down the tunnel. Nothing.

/* ============================================================================
 * AUDIO CUE — SCENE 3 TRAIN PASS: THE LOUDEST MOMENT IN THE FILM
 * ============================================================================
 * Per Design/ANIMATION_DESIGN_V2.md this is the only full-volume,
 * full-bodied sound in the film so far: the rumble builds from
 * TRAIN_START, hits peak (volume 1.0 — nothing else in the film should
 * reach this) around frame 250, holds through her boarding, then HARD
 * CUTS to silence at frame 300. No fade. The silence after the cut is
 * the point — hold it thin and empty while he steps to the edge.
 *
 * The envelope below is fully wired. To activate:
 *   1. Drop the sound file at  public/audio/train-rush.mp3
 *      (build: rumble swell → full-bodied wall of sound → cut master at
 *      the file level too if possible, so the tail doesn't leak)
 *   2. Replace the null below with  staticFile("audio/train-rush.mp3")
 *      (import staticFile from "remotion")
 * ==========================================================================*/
const TRAIN_SOUND_SRC: string | null = staticFile("audio/train-rush.mp3");

export const SCENE3_TRAIN_AUDIO = {
  startFrame: TRAIN_START,
  peakFrame: 250,
  hardCutFrame: 300,
  /** Full scale. Everything else in the film sits well below this. */
  peakVolume: 1.0,
};

/** Rumble builds → full volume at peak → holds → hard cut to zero. */
const trainVolume = (f: number): number => {
  const local = f + TRAIN_START; // Sequence-relative → scene frame
  if (local >= SCENE3_TRAIN_AUDIO.hardCutFrame) return 0;
  return interpolate(
    local,
    [TRAIN_START, TRAIN_START + 35, SCENE3_TRAIN_AUDIO.peakFrame, SCENE3_TRAIN_AUDIO.hardCutFrame - 1],
    [0, 0.3, SCENE3_TRAIN_AUDIO.peakVolume, SCENE3_TRAIN_AUDIO.peakVolume],
    clamp
  );
};

export const Scene3_SecondCommuter: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- Second commuter: enter → stand → board (dissolve into light) ----
  const womanX = interpolate(
    frame,
    [WOMAN_ENTER_START, WOMAN_ENTER_END],
    [620, 0],
    clamp
  );
  const walking = frame >= WOMAN_ENTER_START && frame < WOMAN_ENTER_END;
  const womanOpacity = interpolate(frame, [WOMAN_BOARD_START, WOMAN_GONE], [1, 0], clamp);
  const womanBlur = interpolate(frame, [WOMAN_BOARD_START, WOMAN_GONE], [0, 10], clamp);
  // She drifts up toward the track edge as the light takes her.
  const womanBoardY = interpolate(frame, [WOMAN_BOARD_START, WOMAN_GONE], [0, -28], clamp);

  // ---- Ghost commuter: half-turn toward her, return, step to the edge ----
  const halfTurn = interpolate(
    frame,
    [HALF_TURN_START, HALF_TURN_END, 240, 285],
    [0, 1, 1, 0],
    clamp
  );
  const stepProgress = interpolate(frame, [STEP_START, STEP_END], [0, 1], clamp);
  const tunnelLean = interpolate(frame, [LOOK_TUNNEL, LOOK_TUNNEL + 30], [0, 1], clamp);

  // Half-turn: rotate toward her (she's to his right) with a slight shift.
  // Step: moves up/right toward the platform edge, slightly away from camera.
  const hisRotate = halfTurn * 7 - tunnelLean * 5;
  const hisX = halfTurn * 12 + stepProgress * 55 - tunnelLean * 14;
  const hisY = stepProgress * -52;
  const hisScale = 1 - stepProgress * 0.05;

  // ---- Train shake on the whole set ----
  const inTrain = frame >= TRAIN_START && frame < TRAIN_START + TRAIN_DURATION;
  const shake = inTrain
    ? trainRushShake(frame - TRAIN_START, TRAIN_DURATION)
    : { x: 0, y: 0 };

  // The grade thins while the light overwhelms the frame, then clamps back.
  const gradeIntensity = interpolate(frame, [215, 250, 290, 315], [1, 0.65, 0.65, 1], clamp);
  // Fluorescents stutter as the train passes.
  const platformFlicker = inTrain ? 0.8 : 0.25;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0d0d" }}>
      {/* Set + characters shake together during the pass */}
      <AbsoluteFill style={{ transform: `translate(${shake.x}px, ${shake.y}px)` }}>
        <Platform flickerIntensity={platformFlicker} />

        {/* Ghost commuter — down-left, where he's been since Scene 1 */}
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "26%",
            transform: `translate(${hisX}px, ${hisY}px) rotate(${hisRotate}deg) scale(${hisScale})`,
          }}
        >
          <Commuter breathFog />
        </div>

        {/* The second commuter — a few feet to his right. She never looks at him. */}
        {frame >= WOMAN_ENTER_START && frame < WOMAN_GONE + 5 && (
          <div
            style={{
              position: "absolute",
              bottom: "10.5%",
              left: "44%",
              transform: `translate(${womanX}px, ${womanBoardY}px)`,
            }}
          >
            <SecondCommuter
              walking={walking}
              opacity={womanOpacity}
              blur={womanBlur}
              scale={0.96}
            />
          </div>
        )}
      </AbsoluteFill>

      {/* Her train: blur, glow, and wind — never a legible object */}
      <Sequence from={TRAIN_START} durationInFrames={TRAIN_DURATION}>
        <TrainRush durationInFrames={TRAIN_DURATION} />
      </Sequence>

      <ColorGrade mode="cold" intensity={gradeIntensity} />

      {/* AUDIO: peak-volume train pass, hard cut to silence at frame 300.
          Inert until TRAIN_SOUND_SRC is set — see the cue block above. */}
      {TRAIN_SOUND_SRC && (
        <Sequence from={TRAIN_START} durationInFrames={SCENE3_TRAIN_AUDIO.hardCutFrame - TRAIN_START}>
          <Audio src={TRAIN_SOUND_SRC} volume={trainVolume} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
