// src/components/Reviews.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Rating,
  Stack,
} from "@mui/material";
import { createClient } from "@supabase/supabase-js";

type Review = {
  id?: string;
  name: string;
  rating: number;
  text: string;
  suburb?: string;
  created_at?: string;
};

// Initialize Supabase client with public anon key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) {
          console.error("Error fetching reviews:", error);
          return;
        }

        if (data) setReviews(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchReviews();
  }, []);

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: "#F8FAFC",
      }}
    >
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
          What our customers say
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 3,
          }}
        >
          {reviews.map((r, i) => (
            <Card
              key={r.id ?? i}
              sx={{
                width: { xs: "100%", sm: "48%", md: "31%" },
                borderRadius: 4,
                height: "100%",
                overflow: "hidden",
                boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
                transition: "0.25s ease",
                backgroundColor: "#fff",
                position: "relative",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 14px 36px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Box
                sx={{
                  height: 5,
                  width: "100%",
                  background: "linear-gradient(135deg, #0046FF, #00C2FF)",
                }}
              />
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={1.2}>
                  <Rating
                    name={`r-${i}`}
                    value={r.rating}
                    readOnly
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      color: "#0F172A",
                    }}
                  >
                    {r.name} {r.suburb ? `— ${r.suburb}` : ""}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.92rem",
                      lineHeight: 1.55,
                    }}
                  >
                    {r.text}
                  </Typography>
                  {r.created_at && (
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {new Date(r.created_at).toLocaleDateString()}
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
