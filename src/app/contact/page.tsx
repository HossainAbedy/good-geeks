//src/app/contact/page.txs
"use client";

import React from "react";
import { Box, Container, Typography, Stack, Paper, Button, Link as MuiLink } from "@mui/material";
import ContactBooking from "../../components/ContactBooking";

export default function ContactPage() {
  const phone = "+61426542214";
  const waLink = "https://wa.me/61426542214";

  return (
    <Box>
      {/* HERO */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: "center",
          background: "linear-gradient(90deg, #0066FF, #00C4FF)",
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, mb: 2, fontSize: { xs: "2.0rem", md: "3rem" } }}
          >
            Contact & Booking
          </Typography>

          <Typography sx={{ maxWidth: 680, mx: "auto", opacity: 0.95, mb: 3 }}>
            Need help today? Book online or send us a message — we respond fast across Melbourne.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            <Button
              variant="contained"
              href="#contact"
              sx={{
                backgroundImage: "linear-gradient(90deg,#FFD60A,#FFC300)",
                color: "#000",
                fontWeight: 800,
                px: 4,
              }}
            >
              Book a Visit
            </Button>

            <Button
              variant="outlined"
              href={`tel:${phone}`}
              sx={{
                color: "#fff",
                borderColor: "rgba(255,255,255,0.35)",
                "&:hover": { borderColor: "#FFD60A", color: "#FFD60A" },
                px: 4,
                fontWeight: 700,
              }}
            >
              Call {phone}
            </Button>

            <Button
              variant="contained"
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundImage: "linear-gradient(90deg,#00BFA5,#1DE9B6)",
                px: 4,
                fontWeight: 700,
              }}
            >
              WhatsApp Quote
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* INFO BLOCK */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={4} direction={{ xs: "column", md: "row" }} justifyContent="space-between">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4, flex: 1, background: "#fff" }}>
            <Typography variant="h5" fontWeight={700} mb={2}>
              Get in touch
            </Typography>

            <Stack spacing={1.2}>
              <Typography component="div">
                <strong>📞 Phone:</strong>{" "}
                <MuiLink href={`tel:${phone}`} underline="none">
                  {phone}
                </MuiLink>
              </Typography>

              <Typography component="div">
                <strong>📧 Email:</strong>{" "}
                <MuiLink href="mailto:support@goodgeeks.com" underline="none">
                  support@goodgeeks.com
                </MuiLink>
              </Typography>

              <Typography component="div">
                <strong>📍 Locations:</strong> Melbourne, Richmond, Carlton, Hawthorn & nearby
              </Typography>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={1}>
                Opening Hours
              </Typography>
              <Typography>Mon–Fri: 9:00 AM – 7:00 PM</Typography>
              <Typography>Sat: 10:00 AM – 5:00 PM</Typography>
              <Typography>Sun: Closed</Typography>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 4, borderRadius: 4, flex: 1, background: "#fff" }}>
            <Typography variant="h5" fontWeight={700} mb={2}>
              Service Areas
            </Typography>
            <Stack spacing={1.2}>
              <Typography>✔ Melbourne CBD</Typography>
              <Typography>✔ Richmond</Typography>
              <Typography>✔ Carlton</Typography>
              <Typography>✔ Hawthorn</Typography>
              <Typography>✔ Brunswick</Typography>
              <Typography>✔ St Kilda</Typography>
              <Typography>✔ Southbank</Typography>
            </Stack>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                Prefer a quick quote? Click the WhatsApp button at the top and send a short message — we'll respond quickly.
              </Typography>
            </Box>
          </Paper>
        </Stack>
      </Container>

      {/* MAP (responsive) */}
      <Box sx={{ px: 2, mb: 6 }}>
        <Box
          sx={{
            width: "100%",
            height: { xs: 260, sm: 340, md: 420 },
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(2,6,23,0.08)",
          }}
        >
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31586.49457760134!2d144.94665173177078!3d-37.81362720000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xfb198b7e34a2b90!2sMelbourne%2C%20VIC!5e0!3m2!1sen!2sau!4v1700000000000"
            title="GoodGeeks service area map - Melbourne"
          />
        </Box>
      </Box>

      {/* CONTACT FORM */}
      <Container maxWidth="lg" sx={{ pb: 12 }}>
        <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, background: "#fff" }}>
          <Typography variant="h4" fontWeight={800} mb={4}>
            Send us a message
          </Typography>

          <ContactBooking />
        </Paper>
      </Container>
    </Box>
  );
}
