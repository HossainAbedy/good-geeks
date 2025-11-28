/* FILE: src/styles/theme.ts */
import { createTheme } from "@mui/material/styles";
import { tokens } from "./tokens";

declare module "@mui/material/styles" {
  interface Palette {
    neutralCustom?: { main: string };
  }
  interface PaletteOptions {
    neutralCustom?: { main?: string };
  }
}

const theme = createTheme({
  palette: {
    primary: { main: tokens.colors.primary },
    secondary: { main: tokens.colors.secondary },
    background: { default: tokens.colors.neutral100, paper: "#ffffff" },
    text: { primary: tokens.colors.neutral900, secondary: tokens.colors.textMuted },
    neutralCustom: { main: tokens.colors.neutral900 },
  },

  typography: {
    fontFamily: tokens.typography.fontFamily,
    h1: {
      ...tokens.typography.h1,
      lineHeight: 1.08,
      letterSpacing: "-0.02em",
    },
    h2: {
      ...tokens.typography.h2,
      lineHeight: 1.12,
    },
    h3: {
      ...tokens.typography.h3,
      lineHeight: 1.2,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      color: tokens.colors.textMuted,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },

  shape: {
    // Slightly larger radius so cards / buttons match Services look
    borderRadius: 16,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // set default background & font smoothing
        body: {
          backgroundColor: tokens.colors.neutral100,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          padding: "10px 22px",
          fontWeight: 700,
        },
        containedPrimary: {
          // use gradient for primary contained buttons
          backgroundImage: tokens.colors.accentGradient,
          backgroundSize: "200% 200%",
          color: "#fff",
          boxShadow: "0 8px 20px rgba(4, 102, 255, 0.18)",
          "&:hover": {
            transform: "translateY(-2px)",
            filter: "brightness(0.98)",
          },
        },
        outlined: {
          borderRadius: 12,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          // glass / Win11-like look used in Services
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.85), rgba(245,247,255,0.8))",
          backdropFilter: "blur(8px)",
          boxShadow: "0 8px 24px rgba(16,24,40,0.06)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        subtitle1: { color: tokens.colors.textMuted },
      },
    },

    MuiContainer: {
      defaultProps: {
        maxWidth: "lg",
      },
    },
  },
});

export default theme;
