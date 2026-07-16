/**
 * Lyne design tokens.
 *
 * These mirror `tailwind.config.ts` exactly. Prefer the Tailwind classes
 * (`bg-lyne-purple-700`, `font-display`, etc.) in JSX — reach for these
 * raw values only where a className can't apply, e.g. SVG `fill`,
 * `<canvas>` drawing, or a charting library that wants a hex string.
 */

export const lyneColors = {
  purple700: "#40196D",
  purple900: "#2B0F4D",
  lime400: "#C6FE1E",
  lime500: "#B3E81A",
  ink: "#1A1025",
  body: "#4A4356",
  muted: "#7A7286",
  border: "#D9D1E8",
  divider: "#EBE6F2",
  surface: "#FAF8FC",
  surfaceMuted: "#F2ECFB",
} as const;

export const lyneFonts = {
  display: "'Space Grotesk', sans-serif",
  body: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const;

export type LyneColor = keyof typeof lyneColors;
export type LyneFont = keyof typeof lyneFonts;