//src/components/AboutUs.tsx
"use client";

import { Box, Container, Grid, Typography, Button, Stack } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <Box
      component="section"
      id="about"
      sx={{
        py: { xs: 8, md: 12 },
        background: "linear-gradient(180deg, #F9FBFF 0%, #F3F7FF 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={8}
          alignItems="center"
        >
          {/* LEFT SECTION — TEXT */}
          <Grid item xs={12} md={6}>
            <Stack
              component={motion.div}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              spacing={3}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.2,
                  background: "linear-gradient(90deg, #0A69C1, #00A6FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                About Good Geeks — Jim's IT Melbourne
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: "text.secondary", fontSize: "1.1rem" }}
              >
                Good Geeks (Jim’s IT Melbourne) provides fast, friendly and
                reliable IT support for homes and small businesses across
                Melbourne. From laptop repairs to complete business IT
                management — we handle it all with transparent pricing and no
                tech jargon.
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: "text.secondary", fontSize: "1.1rem" }}
              >
                Backed by the national Jim’s IT Network, our technicians follow
                trusted processes for cybersecurity, data protection and
                long-term reliability — keeping your business running and your
                family devices safe.
              </Typography>

              <Button
                href="#contact"
                variant="contained"
                sx={{
                  mt: 1,
                  px: 4,
                  py: 1.6,
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  borderRadius: "12px",
                  background: "linear-gradient(90deg, #0077FF, #00C6FF)",
                  boxShadow: "0 8px 25px rgba(0,118,255,0.25)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #0066DD, #00B3EE)",
                  },
                }}
              >
                Get a Free Quote
              </Button>
            </Stack>
          </Grid>

          {/* RIGHT SECTION — IMAGE */}
          <Grid item xs={12} md={6}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              sx={{
                position: "relative",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
              }}
            >
              <Image
                src="/images/tech-hero-melbourne.jpg"
                alt="Good Geeks team in Melbourne"
                width={900}
                height={560}
                style={{ width: "100%", height: "auto", display: "block" }}
              />

              {/* Gradient Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "60%",
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))",
                }}
              />

              {/* Glass Caption Card */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  backdropFilter: "blur(10px)",
                  background: "rgba(255,255,255,0.18)",
                  borderRadius: "16px",
                  px: 3,
                  py: 1.5,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                <Typography sx={{ color: "white", fontSize: "1rem", fontWeight: 600 }}>
                  Your Local Melbourne IT Specialists
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}