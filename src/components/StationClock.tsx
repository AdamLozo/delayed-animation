import React from "react";
import { useCurrentFrame } from "remotion";

type StationClockProps = {
  /** Outer diameter in px. Default 200. */
  size?: number;
};

/**
 * Wall-mounted analog station clock, stuck at 11:42. Once a second the
 * second hand twitches forward a few degrees and falls back — it keeps
 * trying to tick and never advances.
 */
export const StationClock: React.FC<StationClockProps> = ({ size = 200 }) => {
  const frame = useCurrentFrame();
  const twitch = frame % 30 < 3 ? 4 : 0;

  const hourAngle = ((11 + 42 / 60) / 12) * 360; // 351°
  const minuteAngle = (42 / 60) * 360; // 252°
  const secondAngle = 174 + twitch; // stuck at ~29s

  const markers = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * 2 * Math.PI;
    const major = i % 3 === 0;
    const r1 = major ? 74 : 79;
    return (
      <line
        key={i}
        x1={100 + r1 * Math.sin(a)}
        y1={100 - r1 * Math.cos(a)}
        x2={100 + 86 * Math.sin(a)}
        y2={100 - 86 * Math.cos(a)}
        stroke="#3a3630"
        strokeWidth={major ? 5 : 2.5}
      />
    );
  });

  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <defs>
        <radialGradient id="station-clock-grime" cx="0.5" cy="0.5" r="0.5">
          <stop offset="55%" stopColor="rgba(60,50,35,0)" />
          <stop offset="88%" stopColor="rgba(60,50,35,0.28)" />
          <stop offset="100%" stopColor="rgba(40,34,24,0.5)" />
        </radialGradient>
      </defs>
      {/* housing */}
      <circle cx="100" cy="100" r="98" fill="#15161a" />
      <circle cx="100" cy="100" r="92" fill="#2a2c32" />
      {/* face */}
      <circle cx="100" cy="100" r="87" fill="#d6d0c2" />
      {markers}
      {/* hands */}
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="52"
        stroke="#26231e"
        strokeWidth="7"
        strokeLinecap="round"
        transform={`rotate(${hourAngle}, 100, 100)`}
      />
      <line
        x1="100"
        y1="106"
        x2="100"
        y2="26"
        stroke="#26231e"
        strokeWidth="5"
        strokeLinecap="round"
        transform={`rotate(${minuteAngle}, 100, 100)`}
      />
      <line
        x1="100"
        y1="110"
        x2="100"
        y2="22"
        stroke="#7a3b3b"
        strokeWidth="2"
        transform={`rotate(${secondAngle}, 100, 100)`}
      />
      <circle cx="100" cy="100" r="5" fill="#1c1a17" />
      {/* aged glass */}
      <circle cx="100" cy="100" r="87" fill="url(#station-clock-grime)" />
      <path
        d="M 42 62 A 72 72 0 0 1 118 30 A 90 90 0 0 0 42 62 Z"
        fill="rgba(255,255,255,0.10)"
      />
    </svg>
  );
};
