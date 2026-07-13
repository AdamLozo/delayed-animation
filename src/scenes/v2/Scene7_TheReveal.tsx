import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {
  Commuter,
  lerpColor,
  SKIN_OLD,
  SKIN_YOUNG,
} from "../../components/Commuter";
import { ColorGrade } from "../../style/ColorGrade";
import { FilmGrain } from "../../style/FilmGrain";
import { Vignette } from "../../style/Vignette";

/**
 * Scene 7: The Reveal (1:15–1:27).
 * He looks down. The shirt: faded '86 Celtics championship print.
 * Then his hands — old. Then a dark window returns an elderly reflection.
 * Slow, quiet realization. No sting; underplay it.
 */
export const SCENE7_DURATION = 360; // 12 s @ 30 fps

// Beat boundaries (frames)
const SHIRT_CUT = 90; // medium shot → shirt close-up insert
const HANDS_CUT = 150; // shirt → hands close-up
const FACE_CUT = 230; // hands → face under the light
const REFLECT_CUT = 290; // face → reflection (Step 3)

/** Irregular fluorescent flicker — never a clean loop. */
const useFlicker = (frame: number, depth: number) => {
  const wave =
    Math.sin(frame * 0.47) * 0.5 +
    Math.sin(frame * 0.19 + 2.1) * 0.3 +
    Math.sin(frame * 0.83 + 0.7) * 0.2;
  return 1 - depth + depth * interpolate(wave, [-1, 1], [0.86, 1]);
};

/**
 * Shot 7a: medium shot under the platform light. He's still, breathing;
 * the head tilts down; the camera dollies slowly toward his chest.
 */
const MediumShot: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = useFlicker(frame, 0.12);

  // The look down: slow, eased — a decision, not a glance.
  const lookDown = interpolate(frame, [20, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Signature slow dolly-in, aimed at the chest.
  const dolly = interpolate(frame, [10, SHIRT_CUT], [1, 1.38], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #0c1114 0%, #141b1e 55%, #10161a 78%, #0a0e11 100%)",
      }}
    >
      {/* Tiled wall band behind him, barely lit */}
      <div
        style={{
          position: "absolute",
          top: "18%",
          left: 0,
          right: 0,
          height: "38%",
          background:
            "repeating-linear-gradient(90deg, #1a2326 0px, #1a2326 88px, #131a1d 88px, #131a1d 92px)",
          opacity: 0.5,
        }}
      />
      {/* Platform floor */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "22%",
          background: "linear-gradient(180deg, #232a2d 0%, #14181b 100%)",
        }}
      />
      {/* Fluorescent pool from above */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 900,
          height: "88%",
          background:
            "radial-gradient(ellipse 50% 62% at 50% 0%, rgba(210, 235, 225, 0.20) 0%, rgba(180, 210, 200, 0.08) 45%, rgba(0,0,0,0) 72%)",
          opacity: flicker,
        }}
      />

      {/* Dolly: scale toward chest height */}
      <AbsoluteFill
        style={{
          transform: `scale(${dolly})`,
          transformOrigin: "50% 58%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ marginTop: 60 }}>
          <Commuter scale={1.7} showShirt lookDown={lookDown} breathFog />
        </div>
      </AbsoluteFill>

      {/* Floor shadow under him */}
      <div
        style={{
          position: "absolute",
          bottom: "16%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 380,
          height: 46,
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 70%)",
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Shot 7b: the insert — the shirt fills the frame. Faded green fabric,
 * cracked screen-print: BOSTON CELTICS / shamrock / 1986 WORLD CHAMPIONS.
 * What he's been wearing the whole film, finally read.
 */
const ShirtCloseup: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - SHIRT_CUT;
  const flicker = useFlicker(frame, 0.1);

  // Continue the push-in, much slower — the realization settles.
  const push = interpolate(local, [0, HANDS_CUT - SHIRT_CUT], [1, 1.05], {
    extrapolateRight: "clamp",
  });
  // Fabric rises and falls with his breath.
  const breathe = Math.sin(frame * 0.05) * 6;

  // Cracked-print texture: slivers of shirt color eating into the letters.
  const crackle =
    "repeating-linear-gradient(107deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 5px, rgba(47, 106, 72, 0.85) 5px, rgba(47, 106, 72, 0.85) 6.5px), " +
    "repeating-linear-gradient(23deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 9px, rgba(47, 106, 72, 0.7) 9px, rgba(47, 106, 72, 0.7) 10px)";

  return (
    <AbsoluteFill style={{ background: "#1c4530", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${push}) translateY(${breathe}px)`,
          transformOrigin: "50% 46%",
        }}
      >
        {/* Fabric base — two-step cel bands, not smooth gradients */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(115deg, #2f6a48 0%, #2f6a48 34%, #285c3e 34%, #285c3e 60%, #224f36 60%, #224f36 82%, #1c4530 82%)",
          }}
        />
        {/* Fold shadows — hard-edged diagonal creases */}
        <div
          style={{
            position: "absolute",
            top: "-8%",
            left: "12%",
            width: 90,
            height: "120%",
            background: "rgba(12, 34, 22, 0.55)",
            transform: "rotate(9deg)",
            borderRadius: 40,
            filter: "blur(26px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-4%",
            right: "16%",
            width: 60,
            height: "115%",
            background: "rgba(12, 34, 22, 0.4)",
            transform: "rotate(-7deg)",
            borderRadius: 30,
            filter: "blur(22px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "38%",
            width: 46,
            height: "70%",
            background: "rgba(16, 42, 28, 0.45)",
            transform: "rotate(14deg)",
            borderRadius: 24,
            filter: "blur(18px)",
          }}
        />
        {/* Highlight band where the platform light lands */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "28%",
            width: "34%",
            height: "100%",
            background: "rgba(120, 180, 145, 0.14)",
            transform: "rotate(4deg)",
            opacity: flicker,
          }}
        />

        {/* The print — faded, cracked, unmistakable */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 26,
            fontFamily:
              "'Arial Black', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 26,
                opacity: 0.78,
              }}
            >
              <div
                style={{
                  fontSize: 96,
                  fontWeight: 900,
                  letterSpacing: 14,
                  color: "#e3d489",
                  textShadow: "0 3px 0 rgba(10, 30, 20, 0.35)",
                }}
              >
                BOSTON CELTICS
              </div>
              <div
                style={{
                  width: 210,
                  height: 210,
                  borderRadius: "50%",
                  background: "#d8c46f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 130,
                  boxShadow: "inset 0 -10px 0 rgba(10, 30, 20, 0.25)",
                  filter: "saturate(0.7)",
                }}
              >
                ☘️
              </div>
              <div
                style={{
                  fontSize: 150,
                  fontWeight: 900,
                  letterSpacing: 30,
                  color: "#e3d489",
                  lineHeight: 1,
                  textShadow: "0 4px 0 rgba(10, 30, 20, 0.35)",
                }}
              >
                1986
              </div>
              <div
                style={{
                  fontSize: 62,
                  fontWeight: 900,
                  letterSpacing: 20,
                  color: "#e3d489",
                }}
              >
                WORLD CHAMPIONS
              </div>
            </div>
            {/* Forty years of wear: cracks in the screen print */}
            <div
              style={{
                position: "absolute",
                inset: -20,
                background: crackle,
                opacity: 0.8,
              }}
            />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** One palm-up hand. Old details (creases, spots, bony shading) fade in with `age`. */
const Hand: React.FC<{ age: number; skin: string; flip?: boolean }> = ({
  age,
  skin,
  flip = false,
}) => {
  const creaseColor = "rgba(128, 86, 52, 0.85)";
  const fingerHeights = [150, 175, 185, 155];
  return (
    <div
      style={{
        position: "relative",
        width: 220,
        height: 360,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      {/* Fingers, slightly fanned */}
      {fingerHeights.map((h, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: 158,
            left: 10 + i * 52,
            width: 42,
            height: h,
            background: skin,
            borderRadius: 21,
            transform: `rotate(${(i - 1.5) * 4}deg)`,
            transformOrigin: "bottom center",
          }}
        >
          {/* Joint creases */}
          <div style={{ position: "absolute", top: "36%", left: 5, right: 5, height: 3, borderRadius: 2, background: creaseColor, opacity: age * 0.9 }} />
          <div style={{ position: "absolute", top: "66%", left: 5, right: 5, height: 3, borderRadius: 2, background: creaseColor, opacity: age * 0.9 }} />
          {/* Bony shading toward the tip */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 21,
              background:
                "linear-gradient(180deg, rgba(90, 60, 35, 0.30) 0%, rgba(90, 60, 35, 0) 45%)",
              opacity: age,
            }}
          />
        </div>
      ))}
      {/* Thumb */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: -30,
          width: 46,
          height: 130,
          background: skin,
          borderRadius: 23,
          transform: "rotate(32deg)",
        }}
      >
        <div style={{ position: "absolute", top: "42%", left: 5, right: 5, height: 3, borderRadius: 2, background: creaseColor, opacity: age * 0.9 }} />
      </div>
      {/* Palm */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 212,
          height: 176,
          background: skin,
          borderRadius: "30px 30px 44px 44px",
          overflow: "hidden",
        }}
      >
        {/* Palm creases — arcs that deepen with age */}
        <div style={{ position: "absolute", top: 34, left: 18, width: 150, height: 60, borderTop: `4px solid ${creaseColor}`, borderRadius: "50%", opacity: 0.25 + age * 0.75 }} />
        <div style={{ position: "absolute", top: 62, left: 40, width: 150, height: 60, borderTop: `4px solid ${creaseColor}`, borderRadius: "50%", opacity: 0.25 + age * 0.75 }} />
        <div style={{ position: "absolute", top: 66, left: -30, width: 120, height: 130, borderRight: `4px solid ${creaseColor}`, borderRadius: "50%", opacity: 0.25 + age * 0.75 }} />
        {/* Age spots */}
        <div style={{ position: "absolute", top: 116, left: 32, width: 16, height: 12, background: "#a8794f", borderRadius: "50%", opacity: age * 0.8 }} />
        <div style={{ position: "absolute", top: 138, left: 150, width: 12, height: 9, background: "#a8794f", borderRadius: "50%", opacity: age * 0.7 }} />
        <div style={{ position: "absolute", top: 96, left: 172, width: 10, height: 8, background: "#a8794f", borderRadius: "50%", opacity: age * 0.6 }} />
        {/* Hollowed, papery shading */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 45%, rgba(90, 60, 35, 0.22) 0%, rgba(90, 60, 35, 0) 62%)",
            opacity: age,
          }}
        />
      </div>
      {/* Faded green sleeve at the wrist */}
      <div
        style={{
          position: "absolute",
          bottom: -70,
          left: -14,
          width: 240,
          height: 84,
          background: "#29613f",
          borderRadius: 16,
        }}
      />
    </div>
  );
};

/**
 * Shot 7c: his hands rise into the light, palms up. Under the fluorescent
 * pool the truth surfaces — creases, spots, bone. A tremor arrives with it.
 */
const HandsCloseup: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - HANDS_CUT;
  const flicker = useFlicker(frame, 0.12);

  // Hands lift into frame first...
  const rise = interpolate(local, [0, 28], [300, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // ...then, held under the light, they age. Slow — a realization.
  const age = interpolate(local, [32, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const push = interpolate(local, [0, FACE_CUT - HANDS_CUT], [1, 1.1], {
    extrapolateRight: "clamp",
  });
  // The tremor arrives with the age.
  const tremor = age * Math.sin(frame * 0.85) * 0.5;
  const skin = lerpColor(SKIN_YOUNG, SKIN_OLD, age);

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #0c1114 0%, #141b1e 55%, #10161a 78%, #0a0e11 100%)",
      }}
    >
      {/* Fluorescent pool from above */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1100,
          height: "92%",
          background:
            "radial-gradient(ellipse 50% 62% at 50% 0%, rgba(210, 235, 225, 0.22) 0%, rgba(180, 210, 200, 0.09) 45%, rgba(0,0,0,0) 72%)",
          opacity: flicker,
        }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${push})`,
          transformOrigin: "50% 55%",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 70,
            transform: `translateY(${140 + rise}px) rotate(${tremor}deg)`,
          }}
        >
          <div style={{ transform: "rotate(7deg)" }}>
            <Hand age={age} skin={skin} />
          </div>
          <div style={{ transform: "rotate(-7deg)" }}>
            <Hand age={age} skin={skin} flip />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Shot 7d: he lifts his head into the light, and the light does to his face
 * what it did to his hands. Gray arrives; the lines settle in.
 */
const FaceCloseup: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - FACE_CUT;
  const flicker = useFlicker(frame, 0.1);

  // Head lifts from the hands he was staring at...
  const lift = interpolate(local, [0, 40], [0.55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  // ...as the age surfaces, trailing the hands by a beat.
  const age = interpolate(local, [8, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const push = interpolate(local, [0, 70], [1, 1.09], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #0c1114 0%, #141b1e 60%, #0a0e11 100%)",
      }}
    >
      {/* Fluorescent pool, tight on the face */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1000,
          height: "85%",
          background:
            "radial-gradient(ellipse 46% 58% at 50% 0%, rgba(210, 235, 225, 0.24) 0%, rgba(180, 210, 200, 0.09) 45%, rgba(0,0,0,0) 72%)",
          opacity: flicker,
        }}
      />
      <AbsoluteFill
        style={{
          transform: `scale(${push})`,
          transformOrigin: "50% 50%",
        }}
      >
        {/* Scaled so the head fills the frame; shirt shoulders enter below */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translate(-50%, 180px) scale(8)",
            transformOrigin: "top center",
          }}
        >
          <Commuter scale={1} showShirt aging={age} lookDown={lift} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Shot 7e: over his shoulder, a dark window set into a tiled pillar.
 * The glass returns him elderly — the flicker catches it, and it stays.
 * The final image of the scene.
 */
const ReflectionShot: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - REFLECT_CUT;
  const flicker = useFlicker(frame, 0.14);

  // The reflection emerges as the light finds the glass — then it stays.
  const emerge = interpolate(local, [8, 45], [0, 0.62], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  // Slow, inevitable push toward the window.
  const push = interpolate(local, [0, SCENE7_DURATION - REFLECT_CUT], [1, 1.16], {
    extrapolateRight: "clamp",
  });
  // The frame settles darker around the final image.
  const settle = interpolate(local, [52, 70], [0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #0b1013 0%, #12181b 55%, #0a0e11 100%)",
      }}
    >
      {/* Dim fluorescent pool, off to the side */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "38%",
          width: 900,
          height: "80%",
          background:
            "radial-gradient(ellipse 48% 58% at 50% 0%, rgba(210, 235, 225, 0.14) 0%, rgba(180, 210, 200, 0.06) 45%, rgba(0,0,0,0) 72%)",
          opacity: flicker,
        }}
      />

      <AbsoluteFill
        style={{ transform: `scale(${push})`, transformOrigin: "50% 42%" }}
      >
        {/* Tiled pillar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 680,
            background:
              "repeating-linear-gradient(90deg, #1b2427 0px, #1b2427 82px, #141b1e 82px, #141b1e 86px)",
            boxShadow: "inset 0 0 120px rgba(0,0,0,0.55)",
          }}
        />

        {/* The dark window */}
        <div
          style={{
            position: "absolute",
            top: 130,
            left: "50%",
            transform: "translateX(-50%)",
            width: 470,
            height: 640,
            background: "#0d1517",
            border: "16px solid #232f33",
            borderRadius: 6,
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
          }}
        >
          {/* The elderly reflection, catching the light */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: emerge * flicker,
              filter: "blur(1.5px)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translate(-50%, 55px) scale(2.1)",
                transformOrigin: "top center",
              }}
            >
              <Commuter scale={1} showShirt age="old" />
            </div>
          </div>
          {/* Glass: green cast, sheen streaks, dark edges */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(30, 60, 50, 0.18)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "-20%",
              left: "8%",
              width: 70,
              height: "140%",
              background: "rgba(200, 225, 215, 0.05)",
              transform: "rotate(16deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "-20%",
              left: "34%",
              width: 26,
              height: "140%",
              background: "rgba(200, 225, 215, 0.04)",
              transform: "rotate(16deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.5) 100%)",
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Foreground: his young back, soft focus — dark hair, faded green */}
      <div
        style={{
          position: "absolute",
          bottom: -50,
          left: "6%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          filter: "blur(7px) brightness(0.72)",
        }}
      >
        <div
          style={{
            width: 350,
            height: 410,
            background: "#2c2015",
            borderRadius: "48% 48% 42% 42%",
          }}
        />
        <div
          style={{
            width: 960,
            height: 330,
            marginTop: -70,
            background: "#1f4c33",
            borderRadius: "70px 70px 0 0",
          }}
        />
      </div>

      {/* The image settles */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.8) 100%)",
          opacity: settle,
        }}
      />
    </AbsoluteFill>
  );
};

export const Scene7_TheReveal: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0e11" }}>
      {/* Beat 1 — the shirt. Beat 2 — hands, then face.
          Beat 3 — the reflection, the final image. Straight insert cuts. */}
      {frame < SHIRT_CUT ? (
        <MediumShot />
      ) : frame < HANDS_CUT ? (
        <ShirtCloseup />
      ) : frame < FACE_CUT ? (
        <HandsCloseup />
      ) : frame < REFLECT_CUT ? (
        <FaceCloseup />
      ) : (
        <ReflectionShot />
      )}

      <ColorGrade mode="cold" />
      <FilmGrain />
      <Vignette strength={0.6} />
    </AbsoluteFill>
  );
};
