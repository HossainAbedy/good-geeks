/* FILE: src/styles/tokens.ts */
export const tokens = {
  colors: {
    // Primary brand blue (used for buttons, CTAs)
    primary: "#0046FF",

    // Accent cyan for gradients and highlights
    secondary: "#00C2FF",

    // Gradient combining primary -> secondary
    accentGradient: "linear-gradient(135deg, #0046FF 0%, #00C2FF 100%)",

    // Light background for sections/cards
    neutral100: "#F5F7FA",

    // Dark text
    neutral900: "#0A0A0A",

    // Muted text for body copy
    textMuted: "#555555",
  },

  typography: {
    // Preferred fonts: Segoe UI Variable (Windows), then Poppins, Inter, system fallbacks
    fontFamily:
      `"Segoe UI Variable", "Segoe UI", "Poppins", "Inter", system-ui, -apple-system, "Helvetica Neue", Arial`,

    // Headline sizing defaults (you can tune per variant in theme)
    h1: { fontSize: "2.25rem", fontWeight: 700 },
    h2: { fontSize: "1.75rem", fontWeight: 700 },
    h3: { fontSize: "1.25rem", fontWeight: 700 },
  },

  // Spacing helper (use tokens.spacing(2) => "16px")
  spacing: (n: number) => `${n * 8}px`,
};

