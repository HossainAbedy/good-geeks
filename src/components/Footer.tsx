// src/components/Footer.jsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Grid,
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
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setSnack({ open: true, message: "Please enter a valid email", severity: "error" });
      return;
    }

    try {
      // TODO: implement server handler at /api/subscribe
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSnack({ open: true, message: "Subscribed — check your inbox", severity: "success" });
      setEmail("");
    } catch (err) {
      setSnack({ open: true, message: "Subscription failed. Try again later.", severity: "error" });
    }
  };

  return (
    <Box component="footer" sx={{ background: "#071022", color: "#E6EEF9", pt: 8, pb: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About / Logo */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box sx={{ position: "relative", width: 140, height: 44 }}>
                <Image src="/logo/goodgeeks-logo.png" alt="GoodGeeks" fill style={{ objectFit: "contain" }} />
              </Box>
            </Box>

            <Typography sx={{ color: "rgba(230,238,249,0.9)", mb: 2 }}>
              GoodGeeks — fast, friendly IT support and repairs. On-site and remote services for homes and small businesses.
            </Typography>

            <Stack direction="row" spacing={1}>
              <IconButton aria-label="Facebook" href="#" size="large" sx={{ color: "inherit" }}>
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="Instagram" href="#" size="large" sx={{ color: "inherit" }}>
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="Twitter" href="#" size="large" sx={{ color: "inherit" }}>
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="LinkedIn" href="#" size="large" sx={{ color: "inherit" }}>
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 800 }}>
              Quick links
            </Typography>
            <Stack component="nav" spacing={1}>
              <MuiLink href="/#services" underline="none" color="inherit" onClick={() => window.scrollTo({ top: document.getElementById("services")?.offsetTop - 80 || 0, behavior: "smooth" })}>
                Services
              </MuiLink>
              <MuiLink href="/#about" underline="none" color="inherit" onClick={() => window.scrollTo({ top: document.getElementById("about")?.offsetTop - 80 || 0, behavior: "smooth" })}>
                About
              </MuiLink>
              <MuiLink href="/#reviews" underline="none" color="inherit" onClick={() => window.scrollTo({ top: document.getElementById("reviews")?.offsetTop - 80 || 0, behavior: "smooth" })}>
                Reviews
              </MuiLink>
              <MuiLink href="/#contact" underline="none" color="inherit" onClick={() => window.scrollTo({ top: document.getElementById("contact")?.offsetTop - 80 || 0, behavior: "smooth" })}>
                Contact
              </MuiLink>
            </Stack>
          </Grid>

          {/* Contact */}
          <Grid item xs={6} sm={4} md={3}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 800 }}>
              Contact
            </Typography>
            <Typography sx={{ color: "rgba(230,238,249,0.85)" }}>Phone: <MuiLink href="tel:+61400000000" color="inherit">+61 400 000 000</MuiLink></Typography>
            <Typography sx={{ color: "rgba(230,238,249,0.85)" }}>Email: <MuiLink href="mailto:hello@goodgeeks.nz" color="inherit">hello@goodgeeks.nz</MuiLink></Typography>
            <Typography sx={{ mt: 1, color: "rgba(230,238,249,0.7)" }}>Open: Mon–Fri 8:30am – 6pm</Typography>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 800 }}>
              Newsletter
            </Typography>

            <Typography sx={{ color: "rgba(230,238,249,0.8)", mb: 1 }}>
              Get tips and offers — no spam. Unsubscribe anytime.
            </Typography>

            <Box component="form" onSubmit={subscribe} sx={{ display: "flex", gap: 1, mt: 1 }}>
              <TextField
                variant="filled"
                size="small"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 1,
                  input: { color: "#E6EEF9" },
                  "& .MuiFilledInput-root": { background: "rgba(255,255,255,0.03)" },
                }}
                InputProps={{ disableUnderline: true }}
                fullWidth
              />
              <Button variant="contained" type="submit" sx={{ backgroundImage: "linear-gradient(90deg,#0066FF,#00C4FF)", fontWeight: 800 }}>
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* bottom row */}
        <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.04)", mt: 6, pt: 4 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Typography variant="body2" sx={{ color: "rgba(230,238,249,0.7)" }}>
                © {new Date().getFullYear()} GoodGeeks — All rights reserved.
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <MuiLink href="/privacy-policy" color="inherit" underline="hover">Privacy</MuiLink>
                <MuiLink href="/terms" color="inherit" underline="hover">Terms</MuiLink>
              </Stack>
            </Box>
          </Container>
        </Box>
      </Container>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
