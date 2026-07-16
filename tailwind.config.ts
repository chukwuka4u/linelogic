import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class", "dark"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lyne: {
          purple: {
            700: "#40196D", // primary brand — buttons, headings, links
            900: "#2B0F4D", // deepest ink-purple — gradients, dark surfaces
          },
          lime: {
            400: "#C6FE1E", // accent — live status, CTA highlight
            500: "#B3E81A", // hover/darker state for lime elements
          },
          ink: "#1A1025", // primary text on light backgrounds
          body: "#4A4356", // secondary/paragraph text
          muted: "#7A7286", // tertiary text, captions, placeholders
          border: "#D9D1E8", // input & card borders
          divider: "#EBE6F2", // hairlines, separators
          surface: "#FAF8FC", // page background
          "surface-muted": "#F2ECFB", // subtle fills — badges, hover states
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"], // headlines
        body: ["Inter", "sans-serif"], // body copy, UI text
        mono: ["JetBrains Mono", "monospace"], // ticket numbers, code-like data
      },
    },
  },

  plugins: [
    animatePlugin,
  ],
};

export default config;