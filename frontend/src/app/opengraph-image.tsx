import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt     = "Modulas — Bespoke Furniture. Elevated Interiors.";
export const size    = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display:         "flex",
          flexDirection:   "column",
          justifyContent:  "space-between",
          width:           "100%",
          height:          "100%",
          backgroundColor: "#0f0f0f",
          padding:         "72px 80px",
          fontFamily:      "serif",
        }}
      >
        {/* Top: logo wordmark */}
        <div
          style={{
            display:       "flex",
            alignItems:    "center",
            gap:           "12px",
          }}
        >
          <div
            style={{
              width:           "10px",
              height:          "10px",
              backgroundColor: "#C9A96E",
              transform:       "rotate(45deg)",
            }}
          />
          <span
            style={{
              fontSize:      "16px",
              letterSpacing: "0.4em",
              color:         "#C9A96E",
              textTransform: "uppercase",
              fontFamily:    "sans-serif",
            }}
          >
            MODULAS
          </span>
        </div>

        {/* Middle: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <p
            style={{
              fontSize:      "11px",
              letterSpacing: "0.35em",
              color:         "#C9A96E",
              textTransform: "uppercase",
              fontFamily:    "sans-serif",
              margin:        0,
            }}
          >
            Luxury Furniture · Crafted in India
          </p>
          <h1
            style={{
              fontSize:   "72px",
              fontWeight: "300",
              color:      "#f5f0e8",
              lineHeight: "1.05",
              margin:     0,
              maxWidth:   "760px",
            }}
          >
            Bespoke Furniture.
            <br />
            Elevated Interiors.
          </h1>
          <p
            style={{
              fontSize:   "18px",
              color:      "rgba(245,240,232,0.45)",
              margin:     0,
              fontFamily: "sans-serif",
              fontWeight: "300",
              maxWidth:   "520px",
            }}
          >
            Modular kitchens, wardrobes, and custom furniture —
            designed and crafted for Indian homes.
          </p>
        </div>

        {/* Bottom: stats row */}
        <div
          style={{
            display:       "flex",
            alignItems:    "center",
            gap:           "48px",
            paddingTop:    "32px",
            borderTop:     "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {[
            { value: "850+",  label: "Projects Done" },
            { value: "98%",   label: "Client Satisfaction" },
            { value: "4.9★",  label: "Client Rating" },
            { value: "10yr",  label: "Frame Warranty" },
          ].map(({ value, label }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span
                style={{
                  fontSize:   "28px",
                  color:      "#f5f0e8",
                  fontWeight: "300",
                }}
              >
                {value}
              </span>
              <span
                style={{
                  fontSize:      "11px",
                  letterSpacing: "0.15em",
                  color:         "rgba(245,240,232,0.35)",
                  textTransform: "uppercase",
                  fontFamily:    "sans-serif",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
