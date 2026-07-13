import React from "react";

interface VintagePosterProps {
  type: "concert" | "fare" | "celtics" | "safety" | "concert87" | "garden86";
  /** Lifts the top-right corner off the wall (Scene 4 pan detail). */
  peeling?: boolean;
}

export const VintagePoster: React.FC<VintagePosterProps> = ({
  type,
  peeling = false,
}) => {
  const posters = {
    concert: {
      bg: "#d4c4a4",
      title: "BOSTON GARDEN",
      subtitle: "LIVE IN CONCERT",
      detail: "TICKETS $12.50",
      accent: "#8b0000",
    },
    fare: {
      bg: "#e8e0d0",
      title: "MBTA",
      subtitle: "FARE: $0.60",
      detail: "EXACT CHANGE",
      accent: "#e85d04",
    },
    celtics: {
      bg: "#007a33",
      title: "CELTICS",
      subtitle: "1986 CHAMPS",
      detail: "BANNER #16",
      accent: "#ffd700",
    },
    safety: {
      bg: "#ffd60a",
      title: "STAND BACK",
      subtitle: "FROM PLATFORM EDGE",
      detail: "MBTA",
      accent: "#1a1a1a",
    },
    concert87: {
      bg: "#cbbfa0",
      title: "ORPHEUM THEATRE",
      subtitle: "WORLD TOUR 1987",
      detail: "MARCH 14 · $15.00",
      accent: "#5c1a1a",
    },
    garden86: {
      bg: "#c4b48e",
      title: "BOSTON GARDEN",
      subtitle: "NEW YEAR'S EVE '86",
      detail: "DOORS 8PM",
      accent: "#1f3a5f",
    },
  };

  const poster = posters[type];

  return (
    <div
      style={{
        position: "relative",
        width: 120,
        height: 160,
        background: poster.bg,
        border: "3px solid #2a2a2a",
        borderRadius: 4,
        padding: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        filter: "sepia(30%) brightness(0.8)",
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: "bold",
          color: poster.accent,
          textAlign: "center",
        }}
      >
        {poster.title}
      </div>
      <div
        style={{
          fontSize: 11,
          color: "#2a2a2a",
          textAlign: "center",
        }}
      >
        {poster.subtitle}
      </div>
      <div
        style={{
          fontSize: 10,
          color: "#4a4a4a",
          textAlign: "center",
        }}
      >
        {poster.detail}
      </div>
      {peeling && (
        <>
          <div
            style={{
              position: "absolute",
              top: -3,
              right: -3,
              width: 36,
              height: 36,
              background: "#141414",
              clipPath: "polygon(0 0, 100% 0, 100% 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -3,
              right: -3,
              width: 34,
              height: 34,
              background:
                "linear-gradient(225deg, #efe8d8 0%, #b8ad94 55%, #8f8570 100%)",
              clipPath: "polygon(0 0, 100% 100%, 0 100%)",
              boxShadow: "-3px 3px 4px rgba(0,0,0,0.45)",
            }}
          />
        </>
      )}
    </div>
  );
};
