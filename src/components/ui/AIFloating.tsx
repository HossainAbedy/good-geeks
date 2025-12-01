// /src/components/ui/AIFloating.tsx
"use client";

import React, { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AIChatWidget from "./AIChatWidget";

export default function AIFloating() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Chat with AI" placement="left">
        <IconButton
          aria-label="Open GoodGeeks AI chat"
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: { xs: 120, md: 96 }, // leave room for WhatsApp
            right: { xs: 20, md: 96 },
            zIndex: 3000,
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(180deg,#111827,#0b1220)",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(2,6,23,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform .15s ease, box-shadow .15s ease",
            "&:hover": { transform: "scale(1.06)", boxShadow: "0 14px 36px rgba(2,6,23,0.55)" },
            "& .MuiSvgIcon-root": { fontSize: 28 },
          }}
        >
          <SmartToyIcon />
        </IconButton>
      </Tooltip>

      <AIChatWidget open={open} onClose={() => setOpen(false)} />
    </>
  );
}
