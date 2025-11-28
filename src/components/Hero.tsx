// src/components/Hero.jsx
"use client";

import React from "react";
import Image from "next/image";
import {
  Box,
  Button,
  Typography,
  Container,
  Stack,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Hero() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const primaryGradient = "linear-gradient(90deg,#0066FF 0%,#00C389 60%,#C69C00 100%)";
  const shimmerKeyframes = {
    "@keyframes shimmer": {
      "0%": { backgroundPosition: "200% 0" },
      "100%": { backgroundPosition: "-200% 0" },
    },
  };

  return (
    <Box
      component="section"
      aria-label="Hero — GoodGeeks IT services"
      sx={{
        width: "100%",
        py: { xs: 6, md: 12 },
        background:
          "radial-gradient(1200px 400px at 10% 10%, rgba(6,57,122,0.12), transparent 10%), linear-gradient(180deg,#041330 0%, #06223b 40%, #072b45 100%)",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blob (subtle animated) */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          right: "-10%",
          top: "-8%",
          width: { xs: 220, sm: 360, md: 560 },
          height: { xs: 220, sm: 360, md: 560 },
          background:
            "radial-gradient(closest-side, rgba(0,197,168,0.12), rgba(0,197,168,0.04) 40%, transparent 60%)",
          filter: "blur(40px)",
          transform: "rotate(15deg)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 6 }}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Left visual — image + floating device card */}
          <Box
            sx={{
              flex: "1 1 52%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Main hero photo */}
            <Box
              sx={{
                width: { xs: "100%", md: "92%" },
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 18px 50px rgba(3,18,46,0.6)",
                transform: { xs: "none", md: "translateX(-8%)" },
              }}
            >
              <Image
                src="/images/hero/hero-tech.png"
                alt="Technician helping a customer with a laptop"
                width={1200}
                height={760}
                style={{ width: "100%", height: "auto", display: "block" }}
                priority
              />
            </Box>

            {/* Floating devices illustration — top-right of image */}
            <Box
              sx={{
                position: "absolute",
                right: { xs: 10, md: -24 },
                top: { xs: "60%", md: "18%" },
                transform: "translateY(-50%)",
                width: { xs: 160, sm: 220, md: 320 },
                pointerEvents: "none",
                animation: "float 6s ease-in-out infinite",
                "@keyframes float": {
                  "0%": { transform: "translateY(-2%)" },
                  "50%": { transform: "translateY(2%)" },
                  "100%": { transform: "translateY(-2%)" },
                },
              }}
            >
              <Box
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(2,8,23,0.4)",
                }}
              >
                <Image
                  src="/images/hero/hero-tech.png"
                  alt="Devices illustration"
                  width={1200}
                  height={800}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </Box>
            </Box>
          </Box>

          {/* Right content */}
          <Box
            sx={{
              flex: "1 1 44%",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: { xs: "flex-start", md: "flex-start" },
              textAlign: { xs: "left", md: "left" },
            }}
          >
            {/* Super small badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                background: "rgba(255,255,255,0.06)",
                px: 2,
                py: 0.5,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.06)",
                width: "fit-content",
                fontWeight: 700,
                letterSpacing: "0.02em",
                color: "rgba(255,255,255,0.92)",
              }}
            >
              <Typography variant="caption" component="span">
                Trusted • On-site & Remote
              </Typography>
            </Box>

            {/* Headline */}
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2rem", sm: "2.4rem", md: "3rem" },
                lineHeight: 1.02,
                letterSpacing: "-0.01em",
                mt: 0.5,
                background: "linear-gradient(90deg,#fff 0%, rgba(255,255,255,0.92) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
                maxWidth: "100%",
              }}
            >
              Fast, local IT support that simply works
            </Typography>

            {/* Subtext */}
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.88)",
                fontSize: { xs: "0.98rem", md: "1.05rem" },
                maxWidth: 540,
              }}
            >
              Same-day on-site repairs, reliable business IT, secure backups and Wi-Fi installations — backed by a nationwide technician network.
            </Typography>

            {/* CTAs + phone */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                href="#contact"
                sx={{
                  fontWeight: 800,
                  px: 4,
                  py: "10px",
                  borderRadius: "12px",
                  backgroundImage: primaryGradient,
                  backgroundSize: "200% 100%",
                  boxShadow: "0 12px 36px rgba(6,57,122,0.28)",
                  transition: "transform .18s ease, box-shadow .18s ease",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: "0 18px 48px rgba(6,57,122,0.34)" },
                  ...shimmerKeyframes,
                  backgroundPosition: "0 0",
                }}
                aria-label="Book IT Support"
              >
                Book IT Support
                <ArrowForwardIcon sx={{ ml: 1 }} />
              </Button>

              <Button
                variant="outlined"
                size="large"
                href="tel:+61400000000"
                startIcon={<PhoneIcon />}
                sx={{
                  borderColor: "rgba(255,255,255,0.16)",
                  color: "#fff",
                  fontWeight: 700,
                  px: 3.5,
                  py: "10px",
                  borderRadius: "12px",
                  "&:hover": {
                    borderColor: "#FFD60A",
                    color: "#FFD60A",
                    background: "transparent",
                  },
                }}
                aria-label="Call GoodGeeks"
              >
                Call Now
              </Button>
            </Stack>

            {/* Trust row */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
                mt: 1,
              }}
              aria-hidden
            >
              {/* Example logos (replace with real images in /public/logo) */}
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Image src="/logo/goodgeeks-logo.png" alt="GoodGeeks" width={88} height={28} />
                <Image src="/logo/jim-it-logo.png" alt="Jim's IT" width={88} height={28} />
              </Box>

              <Box sx={{ color: "rgba(255,255,255,0.72)", fontSize: 13, ml: 1 }}>
                <span style={{ fontWeight: 700 }}>4.9</span> ★ (1200+ reviews)
              </Box>
            </Box>

            {/* Small helper / feature chips */}
            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
              <Box sx={{ px: 2, py: 0.6, background: "rgba(255,255,255,0.06)", borderRadius: 999, fontWeight: 700 }}>
                On-site Repairs
              </Box>
              <Box sx={{ px: 2, py: 0.6, background: "rgba(255,255,255,0.04)", borderRadius: 999, fontWeight: 700 }}>
                Same-day Service
              </Box>
              <Box sx={{ px: 2, py: 0.6, background: "rgba(255,255,255,0.04)", borderRadius: 999, fontWeight: 700 }}>
                Warranty Available
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Container>

      {/* subtle bottom wave */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -1,
          height: { xs: 60, md: 120 },
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
          clipPath:
            "ellipse(50% 100% at 50% 100%)",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
}
