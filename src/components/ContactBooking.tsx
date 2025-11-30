//src/components/ContactBooking.tsx
"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function ContactBooking() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", suburb: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const [openModal, setOpenModal] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        // Reset form
        setForm({ name: "", phone: "", email: "", suburb: "", message: "" });

        // Show success feedback
        setSnack({ open: true, message: "Thanks! We'll contact you shortly.", severity: "success" });
        setOpenModal(true);
      } else {
        const j = await res.json();
        setSnack({ open: true, message: j?.message || "Submission failed", severity: "error" });
      }
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Network error", severity: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box id="contact" component="section" sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          Contact & Booking
        </Typography>

        <Stack component="form" onSubmit={submit} spacing={2} maxWidth="700px">
          <TextField
            required
            label="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            required
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <TextField
            label="Email (optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="Suburb"
            value={form.suburb}
            onChange={(e) => setForm({ ...form, suburb: e.target.value })}
          />
          <TextField
            label="Short message / problem"
            multiline
            minRows={3}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />

          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Request Visit"}
            </Button>
            <Button
              variant="outlined"
              href="https://calendly.com/YOUR_CALENDLY_LINK"
              target="_blank"
            >
              Book Online
            </Button>
          </Stack>
        </Stack>

        {/* Snackbar for instant feedback */}
        <Snackbar
          open={snack.open}
          autoHideDuration={4000}
          onClose={() => setSnack({ ...snack, open: false })}
        >
          <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>
            {snack.message}
          </Alert>
        </Snackbar>

        {/* Dialog for confirmation */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>Message Sent</DialogTitle>
          <DialogContent>
            <Typography>
              Your message has been sent successfully! We'll get back to you soon.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
