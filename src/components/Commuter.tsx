import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const mixChannel = (a: number, b: number, t: number) =>
  Math.round(a + (b - a) * t);

/** Linear blend between two #rrggbb colors. */
export const lerpColor = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${mixChannel(pa[0], pb[0], t)}, ${mixChannel(pa[1], pb[1], t)}, ${mixChannel(pa[2], pb[2], t)})`;
};

export const SKIN_YOUNG = "#d4a574";
export const SKIN_OLD = "#c9a882";

interface CommuterProps {
  scale?: number;
  showShirt?: boolean;
  opacity?: number;
  age?: "young" | "old";
  /** Visible breath — the cold is arriving. Off by default. */
  breathFog?: boolean;
  /** "laughing" — crescent eyes, open laugh. Flashback only. */
  expression?: "tired" | "laughing";
  /** Arms thrown up mid-cheer. Flashback only. */
  armsRaised?: boolean;
  /** The shirt as it was in 1987 — new, bright green. */
  brightShirt?: boolean;
  /** 0–1: head tilts forward, eyes downcast. Scene 7's slow realization. */
  lookDown?: number;
  /** 0–1: how much of his true age shows. age="old" behaves as aging=1. */
  aging?: number;
}

export const Commuter: React.FC<CommuterProps> = ({
  scale = 1,
  showShirt = false,
  opacity = 1,
  age = "young",
  breathFog = false,
  expression = "tired",
  armsRaised = false,
  brightShirt = false,
  lookDown = 0,
  aging = 0,
}) => {
  const isOld = age === "old";
  // How much of his true age shows: the discrete prop, or the gradual one.
  const ageAmt = isOld ? 1 : clamp01(aging);
  const skin = lerpColor(SKIN_YOUNG, SKIN_OLD, ageAmt);
  const hairColor = lerpColor("#3a2a1a", "#9a9a9a", ageAmt);
  const laughing = expression === "laughing";
  const shirtColor = showShirt
    ? brightShirt
      ? "#00a844"
      : "#007a33"
    : "#4a4a5a";
  const frame = useCurrentFrame();

  // Subtle breathing/idle animation
  const breathe = interpolate(
    Math.sin(frame * 0.05),
    [-1, 1],
    [-2, 2]
  );

  // Breath fog: one small puff per cycle, drifting up and dissolving.
  // Cycle is deliberately long so it reads as occasional, not rhythmic.
  const FOG_CYCLE = 160;
  const FOG_LIFE = 70;
  const fogT = frame % FOG_CYCLE;
  const fogProgress = Math.min(1, fogT / FOG_LIFE);
  const fogActive = breathFog && fogT < FOG_LIFE;
  // Quick appear, slow dissolve; peaks early then fades.
  const fogOpacity = fogActive
    ? interpolate(fogProgress, [0, 0.15, 1], [0, 0.4, 0])
    : 0;
  const fogScale = interpolate(fogProgress, [0, 1], [0.4, 1.5]);
  const fogRise = interpolate(fogProgress, [0, 1], [0, -26]);
  const fogDrift = interpolate(fogProgress, [0, 1], [0, 10]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${scale}) translateY(${breathe}px)`,
        opacity,
      }}
    >
      {/* Head */}
      <div
        style={{
          width: 60,
          height: 70,
          background: skin,
          borderRadius: "50% 50% 45% 45%",
          position: "relative",
          transform: lookDown
            ? `perspective(300px) rotateX(${lookDown * -26}deg) translateY(${lookDown * 5}px)`
            : undefined,
          transformOrigin: "50% 100%",
        }}
      >
        {/* Hair */}
        <div
          style={{
            position: "absolute",
            top: -5,
            left: 5,
            right: 5,
            height: 30 - 10 * ageAmt,
            background: hairColor,
            borderRadius: "50% 50% 0 0",
          }}
        />
        {/* Wrinkles — surface with age */}
        {ageAmt > 0 && (
          <>
            <div style={{ position: "absolute", top: 22, left: 8, width: 15, height: 2, background: "#a08060", borderRadius: 2, opacity: ageAmt }} />
            <div style={{ position: "absolute", top: 22, right: 8, width: 15, height: 2, background: "#a08060", borderRadius: 2, opacity: ageAmt }} />
            <div style={{ position: "absolute", top: 45, left: "50%", transform: "translateX(-50%)", width: 25, height: 2, background: "#a08060", borderRadius: 2, opacity: ageAmt }} />
          </>
        )}
        {/* Eyes (tired/aged, or laughing crescents) */}
        {laughing ? (
          <>
            <div
              style={{
                position: "absolute",
                top: 31,
                left: 11,
                width: 12,
                height: 7,
                borderTop: "4px solid #2a2a2a",
                borderRadius: "50% 50% 0 0",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 31,
                right: 11,
                width: 12,
                height: 7,
                borderTop: "4px solid #2a2a2a",
                borderRadius: "50% 50% 0 0",
              }}
            />
            {/* Open laugh */}
            <div
              style={{
                position: "absolute",
                top: 46,
                left: "50%",
                transform: "translateX(-50%)",
                width: 18,
                height: 13,
                background: "#5a2626",
                border: "2px solid #2a2a2a",
                borderTop: "none",
                borderRadius: "0 0 50% 50%",
              }}
            />
          </>
        ) : (
          <>
            <div
              style={{
                position: "absolute",
                top: 30 + lookDown * 3,
                left: 12,
                width: 10,
                height: (6 - 2 * ageAmt) * (1 - lookDown * 0.45),
                background: "#2a2a2a",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 30 + lookDown * 3,
                right: 12,
                width: 10,
                height: (6 - 2 * ageAmt) * (1 - lookDown * 0.45),
                background: "#2a2a2a",
                borderRadius: "50%",
              }}
            />
          </>
        )}

        {/* Breath fog — small puff at mouth height, rising and dissolving */}
        {fogActive && (
          <div
            style={{
              position: "absolute",
              top: 48,
              left: "50%",
              transform: `translate(-50%, 0) translate(${fogDrift}px, ${fogRise}px) scale(${fogScale})`,
              opacity: fogOpacity,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "relative",
                width: 30,
                height: 20,
                filter: "blur(4px)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 4,
                  width: 16,
                  height: 14,
                  background: "rgba(220, 230, 240, 0.8)",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 10,
                  top: 0,
                  width: 18,
                  height: 16,
                  background: "rgba(210, 225, 240, 0.7)",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 6,
                  top: 8,
                  width: 14,
                  height: 11,
                  background: "rgba(225, 235, 245, 0.6)",
                  borderRadius: "50%",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Neck */}
      <div
        style={{
          width: 20,
          height: 15,
          background: skin,
        }}
      />

      {/* Body/Shirt */}
      <div
        style={{
          width: 100,
          height: 120,
          background: shirtColor,
          borderRadius: "10px 10px 0 0",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showShirt && (
          <>
            {/* Celtics shamrock hint */}
            <div
              style={{
                width: 40,
                height: 40,
                background: "#ffd700",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              ☘️
            </div>
            {/* '86 text */}
            <div
              style={{
                position: "absolute",
                bottom: 10,
                fontSize: 14,
                color: "#ffd700",
                fontWeight: "bold",
              }}
            >
              '86 CHAMPS
            </div>
          </>
        )}

        {/* Arms (hanging, or thrown up mid-cheer) */}
        <div
          style={{
            position: "absolute",
            left: -25,
            top: armsRaised ? 0 : 10,
            width: 25,
            height: 80,
            background: shirtColor,
            borderRadius: 10,
            transform: armsRaised ? "rotate(150deg)" : "rotate(10deg)",
            transformOrigin: armsRaised ? "top center" : undefined,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -25,
            top: armsRaised ? 0 : 10,
            width: 25,
            height: 80,
            background: shirtColor,
            borderRadius: 10,
            transform: armsRaised ? "rotate(-150deg)" : "rotate(-10deg)",
            transformOrigin: armsRaised ? "top center" : undefined,
          }}
        />
      </div>

      {/* Legs */}
      <div style={{ display: "flex", gap: 10 }}>
        <div
          style={{
            width: 35,
            height: 100,
            background: "#2a2a3a",
            borderRadius: "0 0 5px 5px",
          }}
        />
        <div
          style={{
            width: 35,
            height: 100,
            background: "#2a2a3a",
            borderRadius: "0 0 5px 5px",
          }}
        />
      </div>
    </div>
  );
};
