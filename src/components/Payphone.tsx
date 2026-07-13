import React from "react";
import { useCurrentFrame } from "remotion";

interface PayphoneProps {
  scale?: number;
  opacity?: number;
}

/**
 * Period payphone (mid-80s Bell style): steel wall unit, rotary-era coin
 * body, handset resting on the left cradle hook. The handset and its coiled
 * cord sway gently — as if recently hung up, or stirred by a draft that
 * shouldn't exist underground.
 */
export const Payphone: React.FC<PayphoneProps> = ({
  scale = 1,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();

  // Two incommensurate sine periods so the sway never reads as a metronome —
  // more like residual motion than animation.
  const sway =
    2.2 * Math.sin(frame * 0.045) + 0.9 * Math.sin(frame * 0.0135 + 1.7);
  // Cord lags slightly behind the handset.
  const cordSway =
    2.6 * Math.sin(frame * 0.045 - 0.6) + 1.1 * Math.sin(frame * 0.0135 + 1.1);

  const steel = "#5a616b";
  const steelDark = "#42474f";
  const steelEdge = "#6d747f";
  const faceplate = "#2e3138";

  return (
    <div
      style={{
        position: "relative",
        width: 150,
        height: 260,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Wall-mount backplate */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 5,
          width: 140,
          height: 210,
          background: `linear-gradient(160deg, ${steelEdge} 0%, ${steel} 40%, ${steelDark} 100%)`,
          borderRadius: 8,
          boxShadow: "0 6px 14px rgba(0,0,0,0.5)",
        }}
      />

      {/* Main coin body */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 30,
          width: 100,
          height: 182,
          background: `linear-gradient(150deg, ${steel} 0%, ${steelDark} 85%)`,
          borderRadius: 6,
          border: `1px solid ${steelEdge}`,
        }}
      >
        {/* Coin slot plate */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 70,
            height: 26,
            background: faceplate,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 26,
              height: 4,
              background: "#0d0e10",
              borderRadius: 2,
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.9)",
            }}
          />
        </div>

        {/* Instruction card window */}
        <div
          style={{
            position: "absolute",
            top: 44,
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 22,
            background: "#b9b4a3",
            borderRadius: 2,
            border: `2px solid ${faceplate}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 3,
            padding: "0 5px",
          }}
        >
          <div style={{ height: 2, background: "#7a7668" }} />
          <div style={{ height: 2, background: "#7a7668", width: "70%" }} />
        </div>

        {/* Rotary dial */}
        <div
          style={{
            position: "absolute",
            top: 76,
            left: "50%",
            transform: "translateX(-50%)",
            width: 62,
            height: 62,
            background: faceplate,
            borderRadius: "50%",
            border: `3px solid ${steelEdge}`,
          }}
        >
          {/* Finger holes */}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 28 + 20 * Math.cos(a) - 5,
                  top: 28 + 20 * Math.sin(a) - 5,
                  width: 10,
                  height: 10,
                  background: "#14161a",
                  borderRadius: "50%",
                }}
              />
            );
          })}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 16,
              height: 16,
              background: steelDark,
              borderRadius: "50%",
            }}
          />
        </div>

        {/* Coin return */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 34,
            height: 20,
            background: "#0d0e10",
            borderRadius: 3,
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.9)",
          }}
        />
      </div>

      {/* Cradle hook (left side) */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 8,
          width: 22,
          height: 46,
          background: steelDark,
          borderRadius: "4px 0 0 4px",
        }}
      />

      {/* Handset — pivots from the cradle hook, swaying gently */}
      <div
        style={{
          position: "absolute",
          top: 44,
          left: -6,
          width: 26,
          height: 96,
          transform: `rotate(${sway}deg)`,
          transformOrigin: "50% 12px",
        }}
      >
        {/* Earpiece */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 26,
            height: 30,
            background: "#1b1d21",
            borderRadius: "50% 50% 35% 35%",
          }}
        />
        {/* Handle */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 7,
            width: 12,
            height: 48,
            background: "#1b1d21",
            borderRadius: 6,
          }}
        />
        {/* Mouthpiece */}
        <div
          style={{
            position: "absolute",
            top: 66,
            left: 0,
            width: 26,
            height: 30,
            background: "#1b1d21",
            borderRadius: "35% 35% 50% 50%",
          }}
        />
      </div>

      {/* Coiled cord — SVG loops from handset base to phone body, lagging the sway */}
      <svg
        width={70}
        height={110}
        viewBox="0 0 70 110"
        style={{
          position: "absolute",
          top: 130,
          left: 0,
          overflow: "visible",
          transform: `rotate(${cordSway}deg)`,
          transformOrigin: "8px 0px",
        }}
      >
        <path
          d={Array.from({ length: 9 })
            .map((_, i) => {
              const y = 4 + i * 9;
              const x = 8 + i * 3.2;
              return `${i === 0 ? "M" : "L"} ${x - 6} ${y} A 6 4.5 0 1 0 ${
                x + 6
              } ${y + 4.5}`;
            })
            .join(" ")}
          fill="none"
          stroke="#1b1d21"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
