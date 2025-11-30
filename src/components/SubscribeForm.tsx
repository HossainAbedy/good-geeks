"use client";
import { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    if (res.ok) { alert("Subscribed — check email"); setEmail(""); } else { alert("Fail"); }
  }
  return (
    <form onSubmit={submit}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField required label="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" variant="contained">Subscribe</Button>
      </Stack>
    </form>
  );
}
