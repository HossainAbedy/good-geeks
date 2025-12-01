// /src/components/ui/AIChatWidget.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Message = { role: "user" | "assistant"; content: string };

export default function AIChatWidget({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi — I can help with questions about Good Geeks (services, booking, support)." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (open) {
      // small focus behavior
      setTimeout(() => {
        const el = document.getElementById("ai-chat-input");
        el?.focus();
      }, 250);
    }
  }, [open]);

  useEffect(() => {
    // scroll to bottom of messages
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function send() {
    const prompt = input.trim();
    if (!prompt) return;
    const userMsg: Message = { role: "user", content: prompt };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const j = await res.json();
      if (res.ok && j.reply) {
        const botMsg: Message = { role: "assistant", content: String(j.reply) };
        setMessages((m) => [...m, botMsg]);
      } else {
        const err = j?.error || "No response";
        setMessages((m) => [...m, { role: "assistant", content: `Error: ${err}` }]);
      }
    } catch (err: any) {
      setMessages((m) => [...m, { role: "assistant", content: `Network error: ${String(err)}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 420 }, borderRadius: 2, overflow: "hidden" } }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <Typography variant="h6">GoodGeeks AI Assistant</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 2, height: "calc(100vh - 180px)", overflow: "auto" }}>
        <List ref={listRef as any} disablePadding>
          {messages.map((m, idx) => (
            <ListItem key={idx} sx={{ alignItems: "flex-start" }}>
              <ListItemText
                primary={m.role === "user" ? "You" : "GoodGeeks AI"}
                secondary={m.content}
                primaryTypographyProps={{ fontWeight: 700 }}
                secondaryTypographyProps={{ whiteSpace: "pre-wrap", color: "text.primary" }}
              />
            </ListItem>
          ))}
          {loading && (
            <ListItem>
              <CircularProgress size={18} />
              <ListItemText primary="Thinking..." sx={{ ml: 1 }} />
            </ListItem>
          )}
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <Stack direction="row" spacing={1}>
          <TextField
            id="ai-chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about services, bookings, support..."
            fullWidth
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <Button variant="contained" onClick={send} disabled={loading || !input.trim()}>
            Send
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
