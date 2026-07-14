import { Composition } from "remotion";
import { Delayed, DELAYED_TOTAL_DURATION } from "./Delayed";
import { Scene1_Establishing, SCENE1_DURATION } from "./scenes/v2/Scene1_Establishing";
import { Scene2_StillWaiting, SCENE2_DURATION } from "./scenes/v2/Scene2_StillWaiting";
import { Scene3_SecondCommuter, SCENE3_DURATION } from "./scenes/v2/Scene3_SecondCommuter";
import { Scene4_TheDetails, SCENE4_DURATION } from "./scenes/v2/Scene4_TheDetails";
import { Scene5_Janitor, SCENE5_DURATION } from "./scenes/v2/Scene5_Janitor";
import { Scene6_Flashback, SCENE6_DURATION } from "./scenes/v2/Scene6_Flashback";
import { Scene7_TheReveal, SCENE7_DURATION } from "./scenes/v2/Scene7_TheReveal";
import { Scene8_TheTrainArrives, SCENE8_DURATION } from "./scenes/v2/Scene8_TheTrainArrives";
import { Scene9_EmptyPlatformTitle, SCENE9_DURATION } from "./scenes/v2/Scene9_EmptyPlatformTitle";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Master composition — all nine scenes sequenced end to end. */}
      <Composition
        id="Delayed"
        component={Delayed}
        durationInFrames={DELAYED_TOTAL_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V2-Scene1"
        component={Scene1_Establishing}
        durationInFrames={SCENE1_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V2-Scene2"
        component={Scene2_StillWaiting}
        durationInFrames={SCENE2_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V2-Scene3"
        component={Scene3_SecondCommuter}
        durationInFrames={SCENE3_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V2-Scene4"
        component={Scene4_TheDetails}
        durationInFrames={SCENE4_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V2-Scene5"
        component={Scene5_Janitor}
        durationInFrames={SCENE5_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V2-Scene6"
        component={Scene6_Flashback}
        durationInFrames={SCENE6_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V2-Scene7"
        component={Scene7_TheReveal}
        durationInFrames={SCENE7_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V2-Scene8"
        component={Scene8_TheTrainArrives}
        durationInFrames={SCENE8_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V2-Scene9"
        component={Scene9_EmptyPlatformTitle}
        durationInFrames={SCENE9_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
