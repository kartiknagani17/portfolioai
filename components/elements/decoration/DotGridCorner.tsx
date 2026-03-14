type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface Props {
  corner: Corner;
  color?: string;
}

const POSITION_CLASS: Record<Corner, string> = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-right": "bottom-0 right-0",
};

export default function DotGridCorner({
  corner,
  color = "var(--color-accent)",
}: Props) {
  const dots = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      dots.push(
        <div
          key={`${row}-${col}`}
          className="rounded-full"
          style={{
            width: 6,
            height: 6,
            background: color,
            margin: 2,
          }}
        />
      );
    }
  }
  return (
    <div
      className={`absolute grid grid-cols-5 gap-0.5 ${POSITION_CLASS[corner]} p-2`}
      style={{ width: 38, height: 38 }}
    >
      {dots}
    </div>
  );
}
