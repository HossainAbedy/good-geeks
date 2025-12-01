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
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: { xs: 100, md: 96 }, // stacked above WhatsApp if WhatsApp at 32
            right: { xs: 20, md: 96 },
            zIndex: 3000,
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(180deg,#222,#111)",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            "&:hover": { transform: "scale(1.06)" },
          }}
          aria-label="Open AI chat"
        >
          <SmartToyIcon />
        </IconButton>
      </Tooltip>

      <AIChatWidget open={open} onClose={() => setOpen(false)} />
    </>
  );
}
