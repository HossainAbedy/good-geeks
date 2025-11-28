// src/lib/sx.ts
import { SxProps, Theme } from "@mui/material";

export const spacing = (n: number) => `${n * 8}px`;
export const radius = { sm: 8, md: 14, lg: 20 };
export const elevation = (level = 1) => {
  if (level === 1) return "0 6px 18px rgba(11,19,32,0.06)";
  if (level === 2) return "0 10px 30px rgba(11,19,32,0.08)";
  return "0 12px 40px rgba(11,19,32,0.10)";
};

export const centerColumn = (sx: SxProps<Theme> = {}) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  ...sx,
});
