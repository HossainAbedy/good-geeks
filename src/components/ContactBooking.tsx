//src/components/ContactBooking.tsx
"use client";

import React, { useState } from "react";
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

type Snack = { open: boolean; message: string; severity: "success" | "error" };

export default function ContactBooking() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    suburb: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<Snack>({
    open: false,
    message: "",
    severity: "success",
  });
  const [openModal, setOpenModal] = useState(false);

  // visually-hidden style for screen readers
  const srOnly: React.CSSProperties = {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    whiteSpace: "nowrap",
    border: 0,
  };

  // Basic validators
  function validateName(name: string) {
    const v = name.trim();
    if (!v) return "Please enter your full name";
    if (v.length < 2) return "Name is too short";
    return "";
  }

  function validatePhone(phone: string) {
    const raw = phone.trim();
    if (!raw) return "Phone is required";

    // normalize: remove spaces, dashes
    const normalized = raw.replace(/[\s-()]/g, "");

    // Australian mobile pattern: starts with +61 or 0 followed by 4 and 8 digits
    const mobileRE = /^(?:\+61|0)4\d{8}$/;
    if (mobileRE.test(normalized)) return "";

    // fallback: accept general phone-like numbers with >= 8 digits
    const digits = normalized.replace(/\D/g, "");
    if (digits.length >= 8) return "";
    return "Enter a valid phone number (e.g. 0412 345 678 or +61 412 345 678)";
  }

  function validateEmail(email: string) {
    const v = email.trim();
    if (!v) return ""; // optional
    // simple email regex
    const re = /^\S+@\S+\.\S+$/;
    return re.test(v) ? "" : "Enter a valid email address";
  }

  function validateMessage(msg: string) {
    if (!msg) return ""; // optional
    if (msg.trim().length < 6) return "Please provide a bit more detail";
    return "";
  }

  function validateAll() {
    const e: Partial<Record<string, string>> = {};
    e.name = validateName(form.name) || undefined;
    e.phone = validatePhone(form.phone) || undefined;
    e.email = validateEmail(form.email) || undefined;
    e.message = validateMessage(form.message) || undefined;
    // remove undefined entries
    Object.keys(e).forEach((k) => {
      if ((e as any)[k] === undefined) delete (e as any)[k];
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // update single field and clear its error
  function updateField<K extends keyof typeof form>(key: K, value: string) {
    setForm((s) => ({ ...s, [key]: value }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[key as string];
      return copy;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateAll()) {
      setSnack({ open: true, message: "Please fix the errors above", severity: "error" });
      return;
    }

    setLoading(true);
    try {
      // send trimmed values
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        suburb: form.suburb.trim(),
        message: form.message.trim(),
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setForm({ name: "", phone: "", email: "", suburb: "", message: "" });
        setSnack({ open: true, message: "Thanks! We'll contact you shortly.", severity: "success" });
        setOpenModal(true);
      } else {
        const j = await res.json().catch(() => ({}));
        setSnack({ open: true, message: j?.message || "Submission failed", severity: "error" });
      }
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Network error", severity: "error" });
    } finally {
      setLoading(false);
    }
  }

  // Small SEO: ContactPoint structured data (non-visual)
  const contactLd = {
    "@context": "https://schema.org",
    "@type": "ContactPoint",
    telephone: "+61426542214",
    contactType: "customer support",
    areaServed: "Melbourne, Australia",
    availableLanguage: ["English"],
  };

  const isFormValid = (): boolean => {
    // quick client-side check for button state
    return !validateName(form.name) && !validatePhone(form.phone) && !validateEmail(form.email) && !validateMessage(form.message);
  };

  return (
    <Box id="contact" component="section" sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Hidden H2 for accessibility/SEO */}
        <Typography component="h2" id="contact-heading" sx={srOnly}>
          Contact Good Geeks — Book an on-site visit or ask a question
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          Contact & Booking
        </Typography>

        <Stack
          component="form"
          onSubmit={submit}
          spacing={2}
          maxWidth="700px"
          role="form"
          aria-labelledby="contact-heading"
        >
          <TextField
            required
            label="Full name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            onBlur={() => setErrors((prev) => ({ ...prev, name: validateName(form.name) || undefined }))}
            error={Boolean(errors.name)}
            helperText={errors.name}
            inputProps={{ "aria-invalid": Boolean(errors.name), maxLength: 100 }}
          />

          <TextField
            required
            label="Phone"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            onBlur={() => setErrors((prev) => ({ ...prev, phone: validatePhone(form.phone) || undefined }))}
            error={Boolean(errors.phone)}
            helperText={errors.phone || "We may call or message this number"}
            inputProps={{ "aria-invalid": Boolean(errors.phone), inputMode: "tel", maxLength: 30 }}
          />

          <TextField
            label="Email (optional)"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            onBlur={() => setErrors((prev) => ({ ...prev, email: validateEmail(form.email) || undefined }))}
            error={Boolean(errors.email)}
            helperText={errors.email}
            inputProps={{ "aria-invalid": Boolean(errors.email), inputMode: "email", maxLength: 160 }}
          />

          <TextField
            label="Suburb"
            value={form.suburb}
            onChange={(e) => updateField("suburb", e.target.value)}
            inputProps={{ maxLength: 120 }}
          />

          <TextField
            label="Short message / problem"
            multiline
            minRows={3}
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            onBlur={() => setErrors((prev) => ({ ...prev, message: validateMessage(form.message) || undefined }))}
            error={Boolean(errors.message)}
            helperText={errors.message}
            inputProps={{ "aria-invalid": Boolean(errors.message), maxLength: 2000 }}
          />

          <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              type="submit"
              disabled={loading || !isFormValid()}
              aria-disabled={loading || !isFormValid()}
            >
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

        {/* JSON-LD structured data for ContactPoint */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }}
        />
      </Container>
    </Box>
  );
}
