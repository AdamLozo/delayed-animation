import React from "react";
import { AbsoluteFill, Audio, Series, interpolate, staticFile } from "remotion";
import { FlickerCut } from "./style/transitions/FlickerCut";
import { Scene1_Establishing, SCENE1_DURATION } from "./scenes/v2/Scene1_Establishing";
import { Scene2_StillWaiting, SCENE2_DURATION } from "./scenes/v2/Scene2_StillWaiting";
import {
  Scene3_SecondCommuter,
  SCENE3_DURATION,
  SCENE3_TRAIN_AUDIO,
} from "./scenes/v2/Scene3_SecondCommuter";
import { Scene4_TheDetails, SCENE4_DURATION } from "./scenes/v2/Scene4_TheDetails";
import { Scene5_Janitor, SCENE5_DURATION } from "./scenes/v2/Scene5_Janitor";
import { Scene6_Flashback, SCENE6_DURATION } from "./scenes/v2/Scene6_Flashback";
import { Scene7_TheReveal, SCENE7_DURATION } from "./scenes/v2/Scene7_TheReveal";
import { Scene8_TheTrainArrives, SCENE8_DURATION } from "./scenes/v2/Scene8_TheTrainArrives";
import { Scene9_EmptyPlatformTitle, SCENE9_DURATION } from "./scenes/v2/Scene9_EmptyPlatformTitle";

/**
 * ============================================================================
 * DELAYED — MASTER COMPOSITION
 * ============================================================================
 * Sequences all nine V2 scenes back-to-back via <Series>. Each scene keeps
 * its own internal timing and audio; this file only lays them end to end.
 *
 * Assembly is being built in stages (per the approved assembly plan):
 *   Step 1 — the <Series> spine, all 9 scenes in order.        [done]
 *   Step 2 — FlickerCut overlays at scene boundaries.          [done]
 *   Step 3 (this pass) — the film-length ambient bed (Track 1).
 *
 * Absolute scene-start frames in the master timeline (for boundary overlays
 * and audio keying added in later steps):
 *   Scene 1  @    0   (420)
 *   Scene 2  @  420   (360)   boundary 1→2 @  420
 *   Scene 3  @  780   (450)   boundary 2→3 @  780
 *   Scene 4  @ 1230   (300)   boundary 3→4 @ 1230
 *   Scene 5  @ 1530   (555)   boundary 4→5 @ 1530
 *   Scene 6  @ 2085   (270)   boundary 5→6 @ 2085   (straight cut)
 *   Scene 7  @ 2355   (360)   boundary 6→7 @ 2355   (straight cut)
 *   Scene 8  @ 2715   (360)   boundary 7→8 @ 2715
 *   Scene 9  @ 3075   (240)   boundary 8→9 @ 3075
 *   TOTAL       3315 frames (110.5 s @ 30 fps)
 * ==========================================================================*/
/**
 * FlickerCut overlays at scene boundaries. `at` is the ABSOLUTE master-timeline
 * frame; because these render at the composition root (no wrapping <Sequence>),
 * FlickerCut's internal useCurrentFrame() reads absolute frames directly.
 *
 * Two boundaries are deliberately STRAIGHT CUTS with no overlay here:
 *   5→6 @ 2085 — Scene 6 has its own built-in entry flicker (harshness 0.65)
 *                at its local frame 4; a boundary overlay would double it.
 *   6→7 @ 2355 — Scene 6's internal harshness-1.0 flicker at its local frame
 *                240 plus its 30-frame cold tail already delivers this cut.
 */
const BOUNDARY_FLICKERS: { at: number; harshness: number }[] = [
  { at: 420, harshness: 0.35 }, // 1→2
  { at: 780, harshness: 0.35 }, // 2→3
  { at: 1230, harshness: 0.4 }, // 3→4
  { at: 1530, harshness: 0.35 }, // 4→5
  // 5→6 @ 2085 — straight cut (Scene 6 built-in entry flicker)
  // 6→7 @ 2355 — straight cut (Scene 6 built-in exit flicker + cold tail)
  { at: 2715, harshness: 0.4 }, // 7→8
  { at: 3075, harshness: 0.65 }, // 8→9
];

export const DELAYED_TOTAL_DURATION =
  SCENE1_DURATION +
  SCENE2_DURATION +
  SCENE3_DURATION +
  SCENE4_DURATION +
  SCENE5_DURATION +
  SCENE6_DURATION +
  SCENE7_DURATION +
  SCENE8_DURATION +
  SCENE9_DURATION;

// ---- Absolute scene-start frames in the master timeline ----
const SCENE3_START = SCENE1_DURATION + SCENE2_DURATION; // 780
const SCENE4_START = SCENE3_START + SCENE3_DURATION; //    1230
const SCENE5_START = SCENE4_START + SCENE4_DURATION; //    1530
const SCENE6_START = SCENE5_START + SCENE5_DURATION; //    2085
// Scene 6 flashback body ends at 2325; cold tail runs 2325-2355. Both are
// dead-quiet, so the ambient bed treats the whole scene as one hard-zero range.
const COLD_TAIL_END = SCENE6_START + SCENE6_DURATION; //  2355  (Scene 6 exit)
const SCENE7_START = COLD_TAIL_END; //                    2355
const SCENE9_START =
  SCENE1_DURATION +
  SCENE2_DURATION +
  SCENE3_DURATION +
  SCENE4_DURATION +
  SCENE5_DURATION +
  SCENE6_DURATION +
  SCENE7_DURATION +
  SCENE8_DURATION; //                                     3075

// Scene 3's train pass — the loudest moment in the film — keyed off the
// scene's own exported timing constants so the duck tracks it precisely.
const TRAIN_START_ABS = SCENE3_START + SCENE3_TRAIN_AUDIO.startFrame; // 960
const TRAIN_PEAK_ABS = SCENE3_START + SCENE3_TRAIN_AUDIO.peakFrame; //  1030
const TRAIN_CUT_ABS = SCENE3_START + SCENE3_TRAIN_AUDIO.hardCutFrame; //1080

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * TRACK 1 — the ambient bed. A single film-length noir drone whose volume is
 * shaped by hand across the whole timeline (absolute frames — the <Audio> has
 * no wrapping <Sequence>, so its volume callback receives master frames).
 *
 *   Scenes 1-4 (0-1530)    moderate open, thinning progressively to
 *                          near-silence; DUCKED to ~0.1 across Scene 3's
 *                          train peak, held thin through the hard cut.
 *   Scene 5   (1530-2085)  low, present bed.
 *   Scene 6   (2085-2355)  HARD ZERO — the warm world (flashback roar) owns
 *                          the sound; dead-quiet continues through the cold tail.
 *   Scenes 7-8 (2355-3075) barely-there.
 *   Scene 9   (3075+)      fully zero — the silence under the title is the point.
 */
const ambientVolume = (f: number): number => {
  // Scene 9 — the title card plays in full silence.
  if (f >= SCENE9_START) return 0;
  // Scenes 7-8 — barely there.
  if (f >= SCENE7_START) {
    return interpolate(
      f,
      [SCENE7_START, SCENE7_START + 20, SCENE9_START - 1, SCENE9_START],
      [0, 0.025, 0.025, 0],
      clamp
    );
  }
  // Scene 6 — flashback body + cold tail: hard zero.
  if (f >= SCENE6_START) return 0;
  // Scene 5 — low, present bed.
  if (f >= SCENE5_START) {
    return interpolate(
      f,
      [SCENE5_START, SCENE5_START + 30, SCENE6_START - 1, SCENE6_START],
      [0.03, 0.05, 0.05, 0],
      clamp
    );
  }
  // Scenes 1-4 — moderate open, thinning to near-silence, with the train duck.
  return interpolate(
    f,
    [0, 420, TRAIN_START_ABS, TRAIN_PEAK_ABS, TRAIN_CUT_ABS, SCENE4_START, SCENE5_START],
    [0.4, 0.3, 0.22, 0.1, 0.12, 0.06, 0.03],
    clamp
  );
};

export const Delayed: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0d0d" }}>
      {/* TRACK 1 — film-length ambient bed (volume shaped in ambientVolume). */}
      <Audio src={staticFile("noir-ambient.mp3")} volume={ambientVolume} />

      <Series>
        <Series.Sequence durationInFrames={SCENE1_DURATION}>
          <Scene1_Establishing />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE2_DURATION}>
          <Scene2_StillWaiting />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE3_DURATION}>
          <Scene3_SecondCommuter />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE4_DURATION}>
          <Scene4_TheDetails />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE5_DURATION}>
          <Scene5_Janitor />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE6_DURATION}>
          <Scene6_Flashback />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE7_DURATION}>
          <Scene7_TheReveal />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE8_DURATION}>
          <Scene8_TheTrainArrives />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE9_DURATION}>
          <Scene9_EmptyPlatformTitle />
        </Series.Sequence>
      </Series>

      {/* Boundary FlickerCuts — top layer, absolute master frames. The two
          Scene-6-adjacent boundaries are intentionally absent (straight cuts). */}
      {BOUNDARY_FLICKERS.map(({ at, harshness }) => (
        <FlickerCut key={at} at={at} harshness={harshness} />
      ))}
    </AbsoluteFill>
  );
};
