//src/app/reviews/page.txs
"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Rating,
  TextField,
  Button,
  Stack,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

type Review = {
  id?: string;
  name: string;
  rating: number;
  text: string;
  suburb?: string;
  created_at?: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState({ name: "", rating: 5, text: "", suburb: "" });
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch reviews on mount
  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setReviews(data);
      })
      .catch((err) => {
        console.error(err);
        setSnack({ open: true, message: "Failed to load reviews", severity: "error" });
      });
  }, []);

  // Submit review
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews((prev) => [newReview, ...prev]);
        setForm({ name: "", rating: 5, text: "", suburb: "" });
        setSnack({ open: true, message: "Review submitted!", severity: "success" });
      } else {
        const err = await res.json();
        setSnack({ open: true, message: err.message || "Failed to submit review", severity: "error" });
      }
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Submission error", severity: "error" });
    }
  }

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Customer Reviews
      </Typography>

      {/* Review Form */}
      <Box component="form" onSubmit={submit} sx={{ mb: 4 }}>
        <Stack spacing={2} maxWidth={700}>
          <TextField
            required
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Suburb (optional)"
            value={form.suburb}
            onChange={(e) => setForm({ ...form, suburb: e.target.value })}
          />
          <Rating
            value={form.rating}
            onChange={(e, v) => setForm({ ...form, rating: v || 5 })}
          />
          <TextField
            label="Review"
            multiline
            minRows={3}
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
          />
          <Button variant="contained" type="submit" sx={{ width: 160 }}>
            Submit Review
          </Button>
        </Stack>
      </Box>

      {/* Reviews List */}
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "stretch" }}>
        {reviews.map((r) => (
          <Card
            key={r.id ?? r.name + r.created_at}
            sx={{
              width: { xs: "100%", sm: "48%", md: "31%" },
              borderRadius: 3,
              boxShadow: "0 8px 28px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent>
              <Stack spacing={1}>
                <Box>
                  <Typography sx={{ fontWeight: 700, display: "inline" }}>{r.name}</Typography>
                  {r.suburb && (
                    <Typography component="span" sx={{ fontWeight: 400, color: "text.secondary", ml: 1 }}>
                      — {r.suburb}
                    </Typography>
                  )}
                </Box>

                <Rating value={r.rating} readOnly size="small" />
                <Typography sx={{ color: "text.secondary" }}>{r.text}</Typography>
                {r.created_at && (
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
