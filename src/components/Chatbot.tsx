"use client";
import { useState } from "react";
import { Box, TextField, Button, Stack } from "@mui/material";

export default function Chatbot() {
  const [messages, setMessages] = useState([{ role: "system", content: "You are GoodGeeks assistant for Melbourne IT support. Answer concisely." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: newMessages }) });
    const j = await res.json();
    const assistant = j.choices?.[0]?.message?.content || j?.error?.message || "No response.";
    setMessages((prev) => [...prev, { role: "assistant", content: assistant }]);
    setLoading(false);
  }

  return (
    <Box>
      <Stack spacing={2}>
        <Box sx={{ height: 300, overflow: "auto", p: 2, border: "1px solid #eee", borderRadius: 2 }}>
          {messages.filter(m => m.role !== "system").map((m, idx) => (
            <Box key={idx} sx={{ mb: 1 }}>
              <strong>{m.role === "user" ? "You:" : "Bot:"}</strong> {m.content}
            </Box>
          ))}
        </Box>

        <Stack direction="row" spacing={2}>
          <TextField fullWidth value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about backups, pricing or availability..." />
          <Button variant="contained" onClick={send} disabled={loading}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}