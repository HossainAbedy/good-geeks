"use client";
import { IconButton, Tooltip } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function WhatsAppButton({ phone = "+61426542214" }) {
  const text = encodeURIComponent("Hi Good Geeks — I need support in Melbourne. My suburb is ...");
  const href = `https://wa.me/${phone.replace(/^\\+/, "")}?text=${text}`;

  return (
    <Tooltip title="Message us on WhatsApp">
      <IconButton component="a" href={href} target="_blank" rel="noreferrer">
        <WhatsAppIcon sx={{ color: "#25D366" }} />
      </IconButton>
    </Tooltip>
  );
}
