"use client";

const POSITIONS = [
  { top: "10%", left: "5%" },
  { top: "20%", right: "10%" },
  { top: "5%", left: "30%" },
  { top: "15%", right: "25%" },
  { bottom: "20%", left: "8%" },
  { bottom: "10%", right: "15%" },
  { bottom: "25%", left: "20%" },
  { top: "30%", right: "5%" },
  { top: "8%", left: "50%" },
  { bottom: "15%", right: "8%" },
  { top: "25%", left: "15%" },
  { bottom: "8%", left: "40%" },
];

interface Props {
  dotColors?: string[];
}

const DEFAULT_COLORS = [
  "#22C55E",
  "#EF4444",
  "#3B82F6",
  "#EAB308",
  "#1A1A1A",
];

export default function ConfettiDots({ dotColors = DEFAULT_COLORS }: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {POSITIONS.map((pos, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            ...pos,
            background: dotColors[i % dotColors.length],
          }}
        />
      ))}
    </div>
  );
}
