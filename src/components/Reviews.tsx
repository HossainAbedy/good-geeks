// src/components/Reviews.tsx
"use client";

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Rating,
  Stack,
} from "@mui/material";

const reviews = [
  {
    name: "Sarah - Richmond",
    rating: 5,
    text: "Quick, friendly and fixed my laptop same day. Highly recommend!",
  },
  {
    name: "Liam - Carlton",
    rating: 5,
    text: "Great managed IT support for our cafe — reliable & responsive.",
  },
  {
    name: "Priya - Hawthorn",
    rating: 4,
    text: "Good value, technician explained things clearly and fixed my Wi-Fi.",
  },
];

export default function Reviews() {
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

        {/** Wrapper using Flexbox instead of Grid */}
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
              key={i}
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
              {/** Accent bar */}
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
                    {r.name}
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
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
