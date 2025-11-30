// src/components/Footer.jsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Snackbar,
  Alert,
  Link as MuiLink,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setSnack({
        open: true,
        message: "Please enter a valid email",
        severity: "error",
      });
      return;
    }

    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSnack({
        open: true,
        message: "Subscribed — check your inbox",
        severity: "success",
      });
      setEmail("");
    } catch (err) {
      setSnack({
        open: true,
        message: "Subscription failed. Try again later.",
        severity: "error",
      });
    }
  };

  const phoneNumber = "+61426542214";
  const telHref = `tel:${phoneNumber}`;
  const waHref = "https://wa.me/61426542214";

  return (
    <Box component="footer" sx={{ background: "#071022", color: "#E6EEF9", pt: 8, pb: 6 }}>
      <Container maxWidth="lg">
        {/* Top section: Flexbox instead of Grid */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 6,
          }}
        >
          {/* Brand + About */}
          <Box sx={{ flex: "1 1 280px", minWidth: 280 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box sx={{ position: "relative", width: 160, height: 48 }}>
                <Image
                  src="/logo/goodgeeks-logo.png"
                  alt="Good Geeks"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </Box>
            </Box>

            <Typography sx={{ color: "rgba(230,238,249,0.85)", mb: 3 }}>
              Friendly, fast and reliable IT support for homes and small businesses
              across Melbourne. On-site, remote and same-day service available.
            </Typography>

            <Stack direction="row" spacing={1}>
              <IconButton href="#" size="large" sx={{ color: "inherit" }}>
                <FacebookIcon />
              </IconButton>
              <IconButton href="#" size="large" sx={{ color: "inherit" }}>
                <InstagramIcon />
              </IconButton>
              <IconButton href="#" size="large" sx={{ color: "inherit" }}>
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Box>

          {/* Quick Links */}
          <Box sx={{ flex: "1 1 160px", minWidth: 160 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 800 }}>
              Quick links
            </Typography>
            <Stack spacing={1}>
              <MuiLink href="/#services" underline="none" color="inherit">
                Services
              </MuiLink>
              <MuiLink href="/#about" underline="none" color="inherit">
                About
              </MuiLink>
              <MuiLink href="/#reviews" underline="none" color="inherit">
                Reviews
              </MuiLink>
              <MuiLink href="/contact" underline="none" color="inherit">
                Contact
              </MuiLink>
            </Stack>
          </Box>

          {/* Contact */}
          <Box sx={{ flex: "1 1 220px", minWidth: 220 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 800 }}>
              Contact
            </Typography>
            <Typography sx={{ color: "rgba(230,238,249,0.85)" }}>
              Phone: <MuiLink href={telHref} color="inherit">{phoneNumber}</MuiLink>
            </Typography>
            <Typography sx={{ color: "rgba(230,238,249,0.85)" }}>
              WhatsApp: <MuiLink href={waHref} color="inherit" target="_blank" rel="noopener noreferrer">{phoneNumber}</MuiLink>
            </Typography>
            <Typography sx={{ color: "rgba(230,238,249,0.85)", mt: 1 }}>
              Email: <MuiLink href="mailto:hello@goodgeeks.nz" color="inherit">hello@goodgeeks.nz</MuiLink>
            </Typography>
            <Typography sx={{ mt: 1, color: "rgba(230,238,249,0.7)" }}>
              Open: Mon–Sat 8:00am – 7:00pm
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                startIcon={<PhoneIcon />}
                href={telHref}
                sx={{
                  backgroundImage: "linear-gradient(90deg,#00C853,#00E676)",
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Call Now
              </Button>
              <Button
                variant="contained"
                startIcon={<WhatsAppIcon />}
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  backgroundImage: "linear-gradient(90deg,#00BFA5,#1DE9B6)",
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                WhatsApp
              </Button>
            </Stack>
          </Box>

          {/* Newsletter */}
          <Box sx={{ flex: "1 1 240px", minWidth: 240 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 800 }}>
              Newsletter
            </Typography>
            <Typography sx={{ color: "rgba(230,238,249,0.8)", mb: 1 }}>
              Stay updated with tips & offers. No spam, unsubscribe anytime.
            </Typography>

            <Box
              component="form"
              onSubmit={subscribe}
              sx={{ display: "flex", gap: 1, mt: 2 }}
            >
              <TextField
                variant="filled"
                size="small"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{ disableUnderline: true }}
                fullWidth
                sx={{
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 1,
                  input: { color: "#E6EEF9" },
                }}
              />
              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundImage: "linear-gradient(90deg,#0066FF,#00C4FF)",
                  fontWeight: 800,
                  px: 3,
                }}
              >
                Go
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.06)", mt: 6, pt: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography sx={{ color: "rgba(230,238,249,0.7)" }}>
              © {new Date().getFullYear()} GoodGeeks — All rights reserved.
            </Typography>

            <Stack direction="row" spacing={2}>
              <MuiLink href="/privacy-policy" color="inherit" underline="hover">
                Privacy
              </MuiLink>
              <MuiLink href="/terms" color="inherit" underline="hover">
                Terms
              </MuiLink>
            </Stack>
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack({ ...snack, open: false })}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
