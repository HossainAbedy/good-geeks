"use client";

import { IconButton, Tooltip } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function WhatsAppFloating({ phone = "+61426542214" }) {
  const text = encodeURIComponent("Hi Good Geeks — I need support in Melbourne. My suburb is ...");
  const href = `https://wa.me/${phone.replace(/^\+/, "")}?text=${text}`;

  return (
    <Tooltip title="WhatsApp Chat" placement="left">
      <IconButton
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          position: "fixed",
          bottom: { xs: 20, md: 32 },
          right: { xs: 20, md: 32 },
          width: 64,
          height: 64,
          borderRadius: "50%",
          backgroundColor: "#25D366",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          zIndex: 2000,
          "&:hover": {
            backgroundColor: "#1EBE57",
            transform: "scale(1.08)",
          },
          transition: "all 180ms ease",
        }}
      >
        <WhatsAppIcon sx={{ color: "white", fontSize: 36 }} />
      </IconButton>
    </Tooltip>
  );
}
