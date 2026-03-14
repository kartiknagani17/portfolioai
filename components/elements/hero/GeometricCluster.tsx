"use client";

export default function GeometricCluster() {
  return (
    <div
      className="relative w-[380px] h-[380px] max-w-full mx-auto md:mx-0"
      style={{
        animation: "float 4s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
      {/* Large teal circle with lavender ellipse */}
      <div
        className="absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          background: "#2D9B83",
          top: "10%",
          left: "5%",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 80,
          height: 60,
          background: "#B8A9D9",
          top: "25%",
          left: "15%",
        }}
      />
      {/* Large yellow circle with pink starburst */}
      <div
        className="absolute rounded-full"
        style={{
          width: 220,
          height: 220,
          background: "#F5C842",
          top: "25%",
          left: "25%",
        }}
      />
      <svg
        className="absolute"
        style={{ top: "35%", left: "38%", width: 48, height: 48 }}
        viewBox="0 0 24 24"
      >
        <polygon
          fill="#F472B6"
          points="12,2 14,8 20,8 15,12 17,18 12,14 7,18 9,12 4,8 10,8"
        />
      </svg>
      {/* Cream rounded square with orange star */}
      <div
        className="absolute"
        style={{
          width: 80,
          height: 80,
          background: "#F0EDE8",
          borderRadius: 12,
          top: "50%",
          left: "10%",
        }}
      />
      <svg
        className="absolute"
        style={{ top: "52%", left: "18%", width: 32, height: 32 }}
        viewBox="0 0 24 24"
      >
        <polygon
          fill="#F5A623"
          points="12,2 14,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 10,9"
        />
      </svg>
    </div>
  );
}
