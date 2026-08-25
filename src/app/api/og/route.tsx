import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "Coshift").slice(0, 160);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          backgroundColor: "#050614",
          backgroundImage:
            "radial-gradient(ellipse at 70% 30%, #33C5F333 0%, #050614 55%)",
          color: "#F4F2EC",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#33C5F3",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {/* small mark */}
          <svg width="40" height="64" viewBox="0 0 64 96">
            <rect x="14" y="0" width="36" height="20" fill="#33C5F3" />
            <path
              fill="#4DD0FF"
              d="M14 26 H 50 C 50 26, 50 38, 42 42 C 36 45, 28 47, 22 52 C 14 58, 14 70, 22 74 C 28 77, 36 79, 42 82 C 50 86, 50 96, 50 96 H 14 C 14 96, 14 86, 22 82 C 28 79, 36 77, 42 74 C 50 70, 50 58, 42 52 C 36 47, 28 45, 22 42 C 14 38, 14 26, 14 26 Z"
            />
          </svg>
          <span>Coshift</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            lineHeight: 1.02,
            letterSpacing: -2,
            fontWeight: 800,
            maxWidth: 980,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#F4F2EC99",
            fontSize: 22,
            letterSpacing: 0.5,
          }}
        >
          <span>One team for your whole digital system · Algeria</span>
          <span style={{ color: "#33C5F3" }}>coshift.agency</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
