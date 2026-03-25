import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      // ── Brand colours ──────────────────────────────────────────
      colors: {
        // CB2-inspired: near-black as primary accent (replaces warm gold)
        gold: {
          50:  "#fdf8ef",
          100: "#f9efd7",
          200: "#f3ddb0",
          300: "#e8c87c",
          400: "#ddb96a",   // hover state — slightly lighter
          500: "#c9a96e",   // brand gold
          DEFAULT: "#c9a96e",
          600: "#b8924f",
          700: "#9a7840",
          800: "#7c5f32",
          900: "#5e4825",
        },
        // CB2-inspired: clean neutral off-white (replaces warm cream)
        cream: {
          50:  "#ffffff",
          100: "#fafafa",
          200: "#f5f5f3",
          DEFAULT: "#f5f5f3",
          300: "#ebebeb",
          400: "#e0e0e0",
        },
        charcoal: {
          DEFAULT: "#1a1a1a",
          50:  "#f5f5f5",
          100: "#e0e0e0",
          200: "#bdbdbd",
          300: "#9e9e9e",
          400: "#757575",
          500: "#616161",
          600: "#424242",
          700: "#303030",
          800: "#222222",
          900: "#1a1a1a",
          950: "#111111",
        },
      },

      // ── Typography ─────────────────────────────────────────────
      fontFamily: {
        serif:  ["var(--font-cormorant)", "Georgia", "serif"],
        sans:   ["var(--font-inter)", "system-ui", "sans-serif"],
        mono:   ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-2xl": ["4.5rem",   { lineHeight: "1.1",  letterSpacing: "-0.02em" }],
        "display-xl":  ["3.75rem",  { lineHeight: "1.1",  letterSpacing: "-0.02em" }],
        "display-lg":  ["3rem",     { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "display-md":  ["2.25rem",  { lineHeight: "1.2",  letterSpacing: "-0.01em" }],
        "display-sm":  ["1.875rem", { lineHeight: "1.25" }],
      },

      // ── Spacing ────────────────────────────────────────────────
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "section": "6rem",
      },

      // ── Animations ─────────────────────────────────────────────
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-100%)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "shimmer": {
          "0%, 100%": { backgroundPosition: "-200% center" },
          "50%":       { backgroundPosition: "200% center" },
        },
      },
      animation: {
        "fade-in":      "fade-in 0.4s ease-out both",
        "slide-in-left": "slide-in-left 0.35s cubic-bezier(0.4, 0, 0.2, 1) both",
        "shimmer":      "shimmer 2s linear infinite",
      },

      // ── Borders & Shadows ──────────────────────────────────────
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "luxury":    "0 4px 30px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
        "luxury-lg": "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
        "gold":      "0 0 0 2px #c9a96e",
      },

      // ── Screen breakpoints ─────────────────────────────────────
      screens: {
        "3xl": "1920px",
      },

      // ── Max widths ─────────────────────────────────────────────
      maxWidth: {
        "8xl":  "88rem",
        "9xl":  "100rem",
        "10xl": "112rem",
      },
    },
  },
  plugins: [],
};

export default config;
