import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface LostAndFoundProps {
  scale?: number;
  /** 0–1. Parent-driven reveal; the rack should live in shadow until the scene lifts it. */
  opacity?: number;
}

/**
 * Wall-mounted lost-and-found rack. Unclaimed clothes from several decades —
 * a '50s letterman jacket, a '60s trench, a '70s disco shirt, a Bruins jersey,
 * a '90s windbreaker. Other peaks, other ghosts. Background dressing only:
 * colors are pre-faded and the whole rack self-dims so it never pulls focus.
 */

type Garment = {
  /** Hanger x-position along the rail */
  x: number;
  /** How far the garment hangs below the rail (uneven = unclaimed) */
  drop: number;
  render: () => React.ReactNode;
};

const LettermanJacket: React.FC = () => (
  <div style={{ position: "relative", width: 78, height: 92 }}>
    {/* Body — faded maroon wool */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 12,
        width: 54,
        height: 88,
        background: "#6e4048",
        borderRadius: "10px 10px 6px 6px",
      }}
    />
    {/* Cream leather sleeves, hanging limp */}
    <div
      style={{
        position: "absolute",
        top: 4,
        left: 2,
        width: 16,
        height: 74,
        background: "#c8bda4",
        borderRadius: 8,
        transform: "rotate(4deg)",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 4,
        right: 2,
        width: 16,
        height: 74,
        background: "#c8bda4",
        borderRadius: 8,
        transform: "rotate(-4deg)",
      }}
    />
    {/* Ribbed collar + hem */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 24,
        width: 30,
        height: 7,
        background: "#c8bda4",
        borderRadius: 4,
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 12,
        width: 54,
        height: 6,
        background: "#c8bda4",
        borderRadius: 3,
      }}
    />
    {/* Chenille letter */}
    <div
      style={{
        position: "absolute",
        top: 26,
        left: 20,
        width: 16,
        height: 18,
        background: "#c8bda4",
        borderRadius: 2,
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "Georgia, serif",
        color: "#6e4048",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      W
    </div>
  </div>
);

const TrenchCoat: React.FC = () => (
  <div style={{ position: "relative", width: 70, height: 104 }}>
    {/* Long beige body, gone gray with dust */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 8,
        width: 54,
        height: 102,
        background: "#9a917c",
        borderRadius: "9px 9px 4px 4px",
      }}
    />
    {/* Lapels */}
    <div
      style={{
        position: "absolute",
        top: 2,
        left: 22,
        width: 12,
        height: 26,
        background: "#847c69",
        transform: "skewY(14deg)",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 2,
        right: 22,
        width: 12,
        height: 26,
        background: "#847c69",
        transform: "skewY(-14deg)",
      }}
    />
    {/* Belt, hanging loose on one side */}
    <div
      style={{
        position: "absolute",
        top: 52,
        left: 8,
        width: 54,
        height: 6,
        background: "#7a7260",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 56,
        left: 14,
        width: 5,
        height: 30,
        background: "#7a7260",
        transform: "rotate(6deg)",
      }}
    />
  </div>
);

const DiscoShirt: React.FC = () => (
  <div style={{ position: "relative", width: 72, height: 80 }}>
    {/* Body — burnt orange, loud once */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 10,
        width: 52,
        height: 76,
        background: "#a2643c",
        borderRadius: "8px 8px 5px 5px",
      }}
    />
    {/* Oversized '70s collar */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 14,
        width: 20,
        height: 16,
        background: "#8a5230",
        clipPath: "polygon(0 0, 100% 0, 20% 100%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 14,
        width: 20,
        height: 16,
        background: "#8a5230",
        clipPath: "polygon(0 0, 100% 0, 80% 100%)",
      }}
    />
    {/* Faded swirl-pattern hints */}
    {[
      { top: 26, left: 18 },
      { top: 44, left: 38 },
      { top: 58, left: 22 },
    ].map((p, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          top: p.top,
          left: p.left,
          width: 12,
          height: 12,
          border: "2px solid rgba(220, 200, 160, 0.4)",
          borderRadius: "50%",
        }}
      />
    ))}
  </div>
);

const BruinsJersey: React.FC = () => (
  <div style={{ position: "relative", width: 80, height: 84 }}>
    {/* Black body */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 10,
        width: 60,
        height: 80,
        background: "#2b2b28",
        borderRadius: "9px 9px 5px 5px",
      }}
    />
    {/* Short hockey sleeves */}
    <div
      style={{
        position: "absolute",
        top: 6,
        left: 0,
        width: 14,
        height: 42,
        background: "#2b2b28",
        borderRadius: 7,
        transform: "rotate(6deg)",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 6,
        right: 0,
        width: 14,
        height: 42,
        background: "#2b2b28",
        borderRadius: 7,
        transform: "rotate(-6deg)",
      }}
    />
    {/* Gold chest stripe, dulled */}
    <div
      style={{
        position: "absolute",
        top: 34,
        left: 10,
        width: 60,
        height: 9,
        background: "#a8863c",
      }}
    />
    {/* Faded number */}
    <div
      style={{
        position: "absolute",
        top: 48,
        left: 10,
        width: 60,
        textAlign: "center",
        fontSize: 22,
        fontWeight: 800,
        fontFamily: "Arial, sans-serif",
        color: "rgba(168, 134, 60, 0.55)",
      }}
    >
      7
    </div>
  </div>
);

const Windbreaker: React.FC = () => (
  <div style={{ position: "relative", width: 74, height: 86 }}>
    {/* '90s color-block, teal gone gray-green */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 10,
        width: 54,
        height: 82,
        background: "#4a7a74",
        borderRadius: "9px 9px 5px 5px",
      }}
    />
    {/* Purple diagonal block */}
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 10,
        width: 54,
        height: 26,
        background: "#5c4a6e",
        clipPath: "polygon(0 30%, 100% 0, 100% 70%, 0 100%)",
      }}
    />
    {/* Zipper */}
    <div
      style={{
        position: "absolute",
        top: 4,
        left: 36,
        width: 2,
        height: 74,
        background: "rgba(200, 200, 200, 0.45)",
      }}
    />
    {/* Sleeves */}
    <div
      style={{
        position: "absolute",
        top: 4,
        left: 0,
        width: 15,
        height: 66,
        background: "#4a7a74",
        borderRadius: 7,
        transform: "rotate(5deg)",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 4,
        right: 0,
        width: 15,
        height: 66,
        background: "#4a7a74",
        borderRadius: 7,
        transform: "rotate(-5deg)",
      }}
    />
  </div>
);

const Hanger: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
    {/* Hook */}
    <div
      style={{
        width: 10,
        height: 14,
        border: "3px solid #8a8a8a",
        borderBottom: "none",
        borderRadius: "6px 6px 0 0",
      }}
    />
    {/* Shoulder bar */}
    <div
      style={{
        width: 58,
        height: 4,
        background: "#8a8a8a",
        clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
        marginTop: -2,
      }}
    />
    <div style={{ marginTop: -4 }}>{children}</div>
  </div>
);

export const LostAndFound: React.FC<LostAndFoundProps> = ({
  scale = 1,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();

  // One garment sways almost imperceptibly — disturbed recently, or never still.
  const sway = interpolate(Math.sin(frame * 0.045), [-1, 1], [-0.9, 0.9]);

  const garments: Garment[] = [
    { x: 0, drop: 6, render: () => <LettermanJacket /> },
    { x: 92, drop: 2, render: () => <TrenchCoat /> },
    { x: 182, drop: 9, render: () => <DiscoShirt /> },
    { x: 264, drop: 4, render: () => <BruinsJersey /> },
    { x: 356, drop: 7, render: () => <Windbreaker /> },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: 470,
        height: 200,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        opacity,
        // Self-dim so the rack reads as periphery even at full reveal
        filter: "saturate(0.7) brightness(0.78)",
      }}
    >
      {/* Faded sign */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 150,
          padding: "4px 14px",
          background: "#3a4448",
          border: "2px solid #566066",
          borderRadius: 3,
          fontSize: 15,
          letterSpacing: 3,
          fontFamily: "Arial, sans-serif",
          color: "rgba(210, 214, 210, 0.62)",
        }}
      >
        LOST &amp; FOUND
      </div>

      {/* Rail brackets */}
      {[20, 235, 450].map((x) => (
        <div
          key={x}
          style={{
            position: "absolute",
            top: 36,
            left: x,
            width: 6,
            height: 16,
            background: "#5a5a5a",
          }}
        />
      ))}
      {/* Metal rail */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 0,
          width: 470,
          height: 6,
          background: "linear-gradient(180deg, #7a7a7a, #4e4e4e)",
          borderRadius: 3,
        }}
      />

      {/* Garments — uneven drops, decades out of order, never claimed */}
      {garments.map((g, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 44 + g.drop,
            left: g.x,
            transform: i === 2 ? `rotate(${sway}deg)` : undefined,
            transformOrigin: "top center",
          }}
        >
          <Hanger>{g.render()}</Hanger>
        </div>
      ))}
    </div>
  );
};
