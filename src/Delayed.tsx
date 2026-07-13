import { AbsoluteFill, Audio, Sequence, staticFile, interpolate, useCurrentFrame } from "remotion";
import { Scene1_PlatformWide } from "./scenes/Scene1_PlatformWide";
import { Scene2_SignCloseup } from "./scenes/Scene2_SignCloseup";
import { Scene3_PanDetails } from "./scenes/Scene3_PanDetails";
import { Scene4_Dialogue } from "./scenes/Scene4_Dialogue";
import { Scene5_Reveal } from "./scenes/Scene5_Reveal";
import { Scene6_EmptyPlatform } from "./scenes/Scene6_EmptyPlatform";

export const Delayed: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade out music in the last 2 seconds (60 frames at 30fps)
  const musicVolume = interpolate(
    frame,
    [1290, 1350], // Start fade at frame 1290, end at 1350
    [0.4, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1a1a" }}>
      {/* Background Music - Noir Jazz with fade out */}
      <Audio src={staticFile("noir-ambient.mp3")} volume={musicVolume} />

      {/* Scene 1: Platform Wide Shot (0-8 sec, frames 0-240) */}
      <Sequence from={0} durationInFrames={240}>
        <Scene1_PlatformWide />
      </Sequence>

      {/* Scene 2: Sign Close-up (8-14 sec, frames 240-420) */}
      <Sequence from={240} durationInFrames={180}>
        <Scene2_SignCloseup />
      </Sequence>

      {/* Scene 3: Pan Details (14-22 sec, frames 420-660) */}
      <Sequence from={420} durationInFrames={240}>
        <Scene3_PanDetails />
      </Sequence>

      {/* Scene 4: Dialogue (22-32 sec, frames 660-960) */}
      <Sequence from={660} durationInFrames={300}>
        <Scene4_Dialogue />
      </Sequence>

      {/* Scene 5: Reveal (32-40 sec, frames 960-1200) */}
      <Sequence from={960} durationInFrames={240}>
        <Scene5_Reveal />
      </Sequence>

      {/* Scene 6: Empty Platform + Title (40-45 sec, frames 1200-1350) */}
      <Sequence from={1200} durationInFrames={150}>
        <Scene6_EmptyPlatform />
      </Sequence>
    </AbsoluteFill>
  );
};
