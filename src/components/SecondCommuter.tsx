import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface SecondCommuterProps {
  scale?: number;
  opacity?: number;
  /** Walk-cycle bob and leg scissor while she crosses the platform. */
  walking?: boolean;
  /** Cool phone-screen light on her face and hand. On by default. */
  phoneGlow?: boolean;
  /** Extra blur, for dissolving into the train light. */
  blur?: number;
}

/**
 * Scene 3's woman: unmistakably modern — earbuds, phone, contemporary
 * quilted coat. She never looks up from the phone; the head is fixed in a
 * downward tilt so she can't meet the ghost commuter's eyes.
 */
export const SecondCommuter: React.FC<SecondCommuterProps> = ({
  scale = 1,
  opacity = 1,
  walking = false,
  phoneGlow = true,
  blur = 0,
}) => {
  const frame = useCurrentFrame();

  // Standing: slow breathe. Walking: faster bob synced to the leg scissor.
  const breathe = interpolate(Math.sin(frame * 0.05), [-1, 1], [-1.5, 1.5]);
  const walkBob = Math.abs(Math.sin(frame * 0.22)) * -5;
  const legSwing = Math.sin(frame * 0.22) * 9;
  const lean = walking ? 2.5 : 0;

  const skin = "#e0b48c";
  const coat = "#7a8471"; // muted sage — a color that doesn't exist in 1987 transit-wear
  const coatShadow = "#666f5e";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${scale}) translateY(${walking ? walkBob : breathe}px) rotate(${lean}deg)`,
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
      }}
    >
      {/* Head — tilted down toward the phone, permanently */}
      <div
        style={{
          width: 54,
          height: 62,
          background: skin,
          borderRadius: "50% 50% 45% 45%",
          position: "relative",
          transform: "rotate(8deg) translateX(4px)",
        }}
      >
        {/* Hair — dark, pulled into a low bun */}
        <div
          style={{
            position: "absolute",
            top: -6,
            left: 2,
            right: 2,
            height: 34,
            background: "#241a12",
            borderRadius: "50% 50% 20% 20%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 26,
            right: -12,
            width: 20,
            height: 20,
            background: "#241a12",
            borderRadius: "50%",
          }}
        />
        {/* Downcast eyes — lids, not pupils; she's reading the screen */}
        <div style={{ position: "absolute", top: 36, left: 10, width: 9, height: 3, background: "#3a2a20", borderRadius: 2 }} />
        <div style={{ position: "absolute", top: 36, right: 12, width: 9, height: 3, background: "#3a2a20", borderRadius: 2 }} />
        {/* Earbud — small white stud with a short stem */}
        <div style={{ position: "absolute", top: 34, left: -3, width: 8, height: 8, background: "#f2f2f2", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: 40, left: -2, width: 4, height: 12, background: "#f2f2f2", borderRadius: 3 }} />

        {/* Phone-screen light on the underside of her face */}
        {phoneGlow && (
          <div
            style={{
              position: "absolute",
              bottom: -2,
              left: 8,
              width: 38,
              height: 24,
              background: "radial-gradient(ellipse at 50% 100%, rgba(170, 200, 255, 0.55) 0%, transparent 70%)",
              borderRadius: "50%",
              filter: "blur(3px)",
            }}
          />
        )}
      </div>

      {/* Neck */}
      <div style={{ width: 16, height: 10, background: skin }} />

      {/* Coat — contemporary quilted puffer, straight silhouette */}
      <div
        style={{
          width: 92,
          height: 130,
          background: `repeating-linear-gradient(
            0deg,
            ${coat} 0px,
            ${coat} 22px,
            ${coatShadow} 22px,
            ${coatShadow} 25px
          )`,
          borderRadius: "14px 14px 6px 6px",
          position: "relative",
        }}
      >
        {/* Zipper line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 3,
            height: "100%",
            background: "#4a5244",
          }}
        />
        {/* High collar */}
        <div
          style={{
            position: "absolute",
            top: -8,
            left: 18,
            right: 18,
            height: 14,
            background: coat,
            borderRadius: "8px 8px 0 0",
          }}
        />

        {/* Far arm, hanging */}
        <div
          style={{
            position: "absolute",
            left: -20,
            top: 12,
            width: 22,
            height: 74,
            background: `repeating-linear-gradient(0deg, ${coat} 0px, ${coat} 18px, ${coatShadow} 18px, ${coatShadow} 20px)`,
            borderRadius: 10,
            transform: "rotate(8deg)",
          }}
        />

        {/* Near arm — bent, holding the phone at chest height */}
        <div
          style={{
            position: "absolute",
            right: -18,
            top: 14,
            width: 22,
            height: 52,
            background: `repeating-linear-gradient(0deg, ${coat} 0px, ${coat} 18px, ${coatShadow} 18px, ${coatShadow} 20px)`,
            borderRadius: 10,
            transform: "rotate(-32deg)",
          }}
        />
        {/* Forearm reaching across */}
        <div
          style={{
            position: "absolute",
            right: 2,
            top: 52,
            width: 44,
            height: 18,
            background: coat,
            borderRadius: 9,
            transform: "rotate(-12deg)",
          }}
        />
        {/* Hand */}
        <div
          style={{
            position: "absolute",
            right: 34,
            top: 46,
            width: 14,
            height: 14,
            background: skin,
            borderRadius: "50%",
          }}
        />

        {/* Phone */}
        <div
          style={{
            position: "absolute",
            right: 38,
            top: 32,
            width: 20,
            height: 34,
            background: "#101418",
            borderRadius: 4,
            transform: "rotate(-6deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {phoneGlow && (
            <div
              style={{
                width: 16,
                height: 30,
                background: "linear-gradient(180deg, #bcd4ff 0%, #8fb0e8 100%)",
                borderRadius: 2,
                boxShadow: "0 0 18px 6px rgba(150, 190, 255, 0.45)",
              }}
            />
          )}
        </div>
      </div>

      {/* Legs — slim dark jeans; scissor when walking */}
      <div style={{ display: "flex", gap: 8 }}>
        <div
          style={{
            width: 26,
            height: 88,
            background: "#1e2430",
            borderRadius: "0 0 4px 4px",
            transform: walking ? `rotate(${legSwing}deg)` : undefined,
            transformOrigin: "top center",
          }}
        />
        <div
          style={{
            width: 26,
            height: 88,
            background: "#1e2430",
            borderRadius: "0 0 4px 4px",
            transform: walking ? `rotate(${-legSwing}deg)` : undefined,
            transformOrigin: "top center",
          }}
        />
      </div>

      {/* Sneakers — white, unmistakably now */}
      <div style={{ display: "flex", gap: 8, marginTop: -2 }}>
        <div style={{ width: 30, height: 12, background: "#e8e8e4", borderRadius: "6px 8px 2px 2px" }} />
        <div style={{ width: 30, height: 12, background: "#e8e8e4", borderRadius: "6px 8px 2px 2px" }} />
      </div>
    </div>
  );
};
