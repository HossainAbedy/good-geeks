// src/components/WhyChooseUs.tsx
"use client";

import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShieldIcon from "@mui/icons-material/Shield";
import StarIcon from "@mui/icons-material/Star";

export default function WhyChooseUs() {
  const cards = [
    {
      title: "Local & Rapid Response",
      body: "Same-day onsite visits across Melbourne suburbs. Fast, reliable technicians.",
      icon: <LocalShippingIcon sx={{ fontSize: 30 }} />,
    },
    {
      title: "Trusted Network",
      body: "Part of Jim’s IT network — proven processes, verified training, consistent quality.",
      icon: <StarIcon sx={{ fontSize: 30 }} />,
    },
    {
      title: "Secure & Certified",
      body: "Security-first approach: secure backups, safe remote support & privacy-respecting practices.",
      icon: <ShieldIcon sx={{ fontSize: 30 }} />,
    },
    {
      title: "Clear Pricing",
      body: "Transparent fixed-price small jobs and predictable managed service rates.",
      icon: <CheckCircleIcon sx={{ fontSize: 30 }} />,
    },
  ];

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 8 }, backgroundColor: "#fff" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            mb: 5,
            fontSize: { xs: "1.9rem", md: "2.3rem" },
          }}
        >
          Why Choose Good Geeks
        </Typography>

        {/** CARD WRAPPER */}
        <Stack
          spacing={3}
          direction="row"
          flexWrap="wrap"
          justifyContent="center"
          alignItems="stretch"
          sx={{ width: "100%", gap: 3 }}
        >
          {cards.map((c) => (
            <Paper
              key={c.title}
              elevation={0}
              sx={{
                width: { xs: "100%", sm: "47%", md: "22%" },
                p: 3,
                borderRadius: 3,
                boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
                display: "flex",
                gap: 2,
                alignItems: "flex-start",
                transition: "0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                },
              }}
            >
              {/** ICON */}
              <Box
                sx={{
                  minWidth: 56,
                  height: 56,
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "linear-gradient(135deg, #0046FF 0%, #00C2FF 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(0, 80, 255, 0.25)",
                }}
              >
                {c.icon}
              </Box>

              {/** TEXT */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.35,
                    mb: 0.5,
                    fontSize: "1.1rem",
                  }}
                >
                  {c.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.55 }}
                >
                  {c.body}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
