import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  centered?: boolean;
}

export function GradientHeading({
  children,
  size = "lg",
  centered = true,
}: Props) {
  const sizes = { sm: "24px", md: "32px", lg: "40px" };
  return (
    <h2
      style={{
        fontFamily: '"Space Grotesk", sans-serif',
        fontWeight: 800,
        textTransform: "uppercase",
        textAlign: centered ? "center" : "left",
        fontSize: sizes[size],
        letterSpacing: "0.04em",
        background:
          "linear-gradient(135deg, #FF6B6B 0%, #FF4E8A 50%, #8B5CF6 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: "40px",
      }}
    >
      {children}
    </h2>
  );
}
