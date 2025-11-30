//src/app/newsletter/page.txs
"use client";

import React, { useState } from "react";
import { Container, Typography, TextField, Button, Box, Stack, Snackbar, Alert } from "@mui/material";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setSnack({ open: true, message: "Please enter a valid email", severity: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const j = await res.json();
      if (res.ok) {
        setSnack({ open: true, message: "Thanks — check your inbox", severity: "success" });
        setEmail("");
      } else {
        // prefer message from server if present
        setSnack({ open: true, message: j?.message || "Subscription failed", severity: "error" });
      }
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Network error", severity: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
        Join our newsletter
      </Typography>

      <Typography sx={{ color: "text.secondary", mb: 4, maxWidth: 680 }}>
        Get tips, local offers, and maintenance reminders straight to your inbox.
      </Typography>

      <Box component="form" onSubmit={submit}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} maxWidth={720}>
          <TextField
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            size="medium"
            autoComplete="email"
          />
          <Button variant="contained" type="submit" sx={{ px: 4 }} disabled={loading}>
            {loading ? "Subscribing…" : "Subscribe"}
          </Button>
        </Stack>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
