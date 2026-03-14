interface Props {
  variant: 1 | 2 | 3;
}

export default function ServiceIllustration({ variant }: Props) {
  const size = 120;
  if (variant === 1) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className="mx-auto"
      >
        <ellipse cx="60" cy="70" rx="50" ry="25" fill="#E5E5E5" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="20"
            y1={50 + i * 8}
            x2="100"
            y2={50 + i * 8}
            stroke="#D0D0D0"
            strokeWidth="1"
          />
        ))}
      </svg>
    );
  }
  if (variant === 2) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className="mx-auto"
      >
        <path
          d="M30 90 L45 60 L60 75 L75 45 L90 70 L90 95 L30 95 Z"
          fill="#E8E8E8"
        />
        <path
          d="M25 85 L40 55 L55 70 L70 40 L85 65 L85 90 L25 90 Z"
          fill="#D8D8D8"
        />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className="mx-auto">
      <circle cx="60" cy="55" r="40" fill="#EBEBEB" />
      <circle cx="60" cy="55" r="25" fill="#DDDDDD" />
      <circle cx="60" cy="55" r="10" fill="#D0D0D0" />
    </svg>
  );
}
