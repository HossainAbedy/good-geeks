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
} from "@mui/material";

export default function ContactBooking() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", suburb: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);

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
        setOpenSnack(true);
        setForm({ name: "", phone: "", email: "", suburb: "", message: "" });
      } else {
        const j = await res.json();
        alert(j?.message || "Failed to submit");
      }
    } catch (err) {
      alert("Could not send — check network");
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
          <TextField required label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField required label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <TextField label="Email (optional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField label="Suburb" value={form.suburb} onChange={(e) => setForm({ ...form, suburb: e.target.value })} />
          <TextField label="Short message / problem" multiline minRows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Button variant="contained" type="submit" disabled={loading}>
              Request Visit
            </Button>
            <Button variant="outlined" href="https://calendly.com/YOUR_CALENDLY_LINK" target="_blank">
              Book Online
            </Button>
          </Stack>
        </Stack>

        <Snackbar open={openSnack} autoHideDuration={3000} onClose={() => setOpenSnack(false)} message="Thanks! We'll contact you shortly." />
      </Container>
    </Box>
  );
}
