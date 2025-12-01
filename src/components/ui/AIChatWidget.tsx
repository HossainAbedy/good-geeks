// /src/components/ui/AIChatWidget.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Role = "user" | "assistant";
type Message = { id: string; role: Role; content: string; createdAt: string };

const STORAGE_KEY = "goodgeeks_ai_messages_v1";

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function AIChatWidget({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) return JSON.parse(raw) as Message[];
    } catch {
      /* ignore */
    }
    // initial assistant greeting
    return [
      {
        id: makeId(),
        role: "assistant",
        content: "Hi — I can help with questions about Good Geeks (services, booking, support).",
        createdAt: new Date().toISOString(),
      },
    ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity?: "error" | "success" }>({
    open: false,
    message: "",
  });

  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // keep localStorage in sync
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  useEffect(() => {
    // scroll to bottom
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // send messages array to server; the server expects either prompt or messages
  async function send() {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: makeId(), role: "user", content: text, createdAt: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // prepare payload in chat-history format
      const payloadMessages = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errorMsg = j?.error || `Server returned ${res.status}`;
        setMessages((m) => [
          ...m,
          { id: makeId(), role: "assistant", content: `Error: ${errorMsg}`, createdAt: new Date().toISOString() },
        ]);
        setSnack({ open: true, message: `Chat error: ${errorMsg}`, severity: "error" });
      } else {
        const reply = typeof j.reply === "string" ? j.reply : String(j?.reply || "No reply");
        setMessages((m) => [...m, { id: makeId(), role: "assistant", content: reply, createdAt: new Date().toISOString() }]);
      }
    } catch (err: any) {
      const msg = String(err?.message || err);
      setMessages((m) => [
        ...m,
        { id: makeId(), role: "assistant", content: `Network error: ${msg}`, createdAt: new Date().toISOString() },
      ]);
      setSnack({ open: true, message: `Network error: ${msg}`, severity: "error" });
    } finally {
      setLoading(false);
    }
  }

  function clearHistory() {
    setMessages([
      {
        id: makeId(),
        role: "assistant",
        content: "Hi — I can help with questions about Good Geeks (services, booking, support).",
        createdAt: new Date().toISOString(),
      },
    ]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setSnack({ open: true, message: "Chat history cleared", severity: "success" });
  }

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { width: { xs: "100%", sm: 460 }, borderRadius: 2, overflow: "hidden" } }}
        role="dialog"
        aria-label="GoodGeeks AI chat"
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <Typography variant="h6">GoodGeeks AI Assistant</Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button size="small" onClick={clearHistory} aria-label="Clear chat history">
              Clear
            </Button>

            <IconButton onClick={onClose} aria-label="Close chat">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        <Box sx={{ p: 2, height: "calc(100vh - 200px)", overflow: "auto", bgcolor: "background.default" }} ref={listRef}>
          <List disablePadding>
            {messages.map((m) => (
              <ListItem key={m.id} sx={{ alignItems: "flex-start" }}>
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
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              id="ai-chat-input"
              inputRef={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about services, bookings, support..."
              fullWidth
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!loading) send();
                }
              }}
              aria-label="Type your message"
            />
            <Button variant="contained" onClick={() => send()} disabled={loading || !input.trim()}>
              {loading ? <CircularProgress size={18} /> : "Send"}
            </Button>
          </Stack>
        </Box>
      </Drawer>

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.severity || "info"} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}
