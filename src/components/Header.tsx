// src/components/Header.jsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Fab,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const NAV = [
  { label: "Home", href: "/", id: "hero" },
  { label: "Services", href: "/#services", id: "services" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Why Us", href: "/#whychooseus", id: "whychooseus" },
  { label: "Review", href: "/reviews" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("/");
  const [scrolled, setScrolled] = useState(false);

  // smooth navigation helper: supports hashes (same-page) and page routes
  const navigateTo = useCallback(
    (href) => {
      setOpen(false);
      try {
        const url = new URL(href, window.location.origin);
        // if same-path + hash -> smooth scroll
        if (url.hash && (url.pathname === window.location.pathname || url.pathname === "")) {
          const id = url.hash.replace("#", "");
          const el = document.getElementById(id);
          if (el) {
            const topOffset = 88; // header offset
            const top = Math.max(el.getBoundingClientRect().top + window.scrollY - topOffset, 0);
            window.scrollTo({ top, behavior: "smooth" });
            window.history.replaceState({}, "", url.pathname + url.hash);
            setActive(id);
            return;
          }
        }
      } catch (err) {
        // ignore
      }

      // otherwise navigate to page route
      // use router.push for Next App Router
      router.push(href);
      // set active to pathname for highlighting
      try {
        const p = new URL(href, window.location.origin).pathname;
        setActive(p);
      } catch {
        setActive(href);
      }
    },
    [router]
  );

  // shrink header on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // intersection observer to watch in-page sections (only those NAV entries that have an id)
  useEffect(() => {
    const ids = NAV.filter((n) => n.id).map((n) => n.id);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length) {
      // set active to current pathname as fallback
      setActive(window.location.pathname || "/");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the entry with largest intersectionRatio that's intersecting
        let best = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
          }
        });
        if (best) setActive(best.target.id);
      },
      { root: null, rootMargin: "-40% 0px -50% 0px", threshold: [0.25, 0.5, 0.75] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // keyboard for logo -> go home
  const onLogoKey = (e) => {
    if (e.key === "Enter" || e.key === " ") navigateTo("/");
  };

  // whatsapp link (your number)
  const whatsappHref = "https://wa.me/61426542214";

  return (
    <>
      <AppBar
        position="sticky"
        elevation={scrolled ? 6 : 0}
        sx={{
          transition: "all 240ms ease",
          background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
          color: scrolled ? "text.primary" : "common.white",
          backdropFilter: scrolled ? "saturate(140%) blur(6px)" : "blur(2px)",
          borderBottom: scrolled ? "1px solid rgba(10,20,40,0.06)" : "none",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1200,
            mx: "auto",
            width: "100%",
            px: { xs: 2, md: 1.5 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: scrolled ? 60 : 76,
            transition: "min-height 240ms ease",
            gap: 2,
          }}
        >
          {/* Logo */}
          <Box
            role="link"
            tabIndex={0}
            onClick={() => navigateTo("/")}
            onKeyDown={onLogoKey}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              textDecoration: "none",
              outline: "none",
            }}
            aria-label="GoodGeeks home"
          >
            <Box sx={{ position: "relative", width: 140, height: scrolled ? 36 : 48 }}>
              <Image src="/logo/logo.png" alt="GoodGeeks" fill style={{ objectFit: "contain" }} priority />
            </Box>
          </Box>

          {/* Desktop nav */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center", ml: 2 }}>
            {NAV.map((navItem) => {
              const isBrowser = typeof window !== "undefined";
              const isActive = navItem.id
                ? active === navItem.id
                : active === navItem.href || (isBrowser && active === new URL(navItem.href, window.location.origin).pathname);
              return (
                <Button
                  key={navItem.href}
                  onClick={() => navigateTo(navItem.href)}
                  variant={isActive ? "contained" : "text"}
                  sx={{
                    fontWeight: 700,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    ...(isActive && {
                      backgroundImage: "linear-gradient(90deg,#0066FF,#00C4FF)",
                      color: "#fff",
                      boxShadow: "0 8px 24px rgba(6,57,122,0.12)",
                    }),
                  }}
                >
                  {navItem.label}
                </Button>
              );
            })}

            {/* CTA */}
            <Button
              onClick={() => navigateTo("/contact")}
              variant="contained"
              sx={{
                ml: 1.5,
                fontWeight: 800,
                px: 3,
                borderRadius: 2,
                backgroundImage: "linear-gradient(90deg,#0066FF,#00C4FF)",
              }}
            >
              Book Now
            </Button>

            <IconButton component="a" href="tel:+61400000000" aria-label="Call GoodGeeks" size="large" sx={{ ml: 1 }}>
              <PhoneIcon />
            </IconButton>

            {/* WhatsApp quick */}
            <IconButton component="a" href={whatsappHref} target="_blank" aria-label="WhatsApp GoodGeeks" size="large" sx={{ ml: 1 }}>
              <WhatsAppIcon />
            </IconButton>
          </Box>

          {/* Mobile menu */}
          <IconButton sx={{ display: { md: "none" } }} onClick={() => setOpen(true)} aria-label="Open menu">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: 320 } }}>
        <Box sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box sx={{ position: "relative", width: 140, height: 40 }}>
              <Image src="/logo/logo.png" alt="GoodGeeks" fill style={{ objectFit: "contain" }} />
            </Box>
            <IconButton onClick={() => setOpen(false)} aria-label="Close menu">
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ flex: 1 }}>
            {NAV.map((navItem) => (
              <ListItemButton
                key={navItem.href}
                onClick={() => {
                  navigateTo(navItem.href);
                  setOpen(false);
                }}
                sx={{ borderRadius: 1, mb: 1 }}
              >
                <ListItemText primary={navItem.label} />
              </ListItemButton>
            ))}
          </List>

          <Box sx={{ mt: "auto", display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                navigateTo("/contact");
                setOpen(false);
              }}
              sx={{ borderRadius: 2, py: 1.25, fontWeight: 800 }}
            >
              Book Now
            </Button>

            <IconButton aria-label="Call GoodGeeks" component="a" href="tel:+61400000000" sx={{ ml: 1 }}>
              <PhoneIcon />
            </IconButton>
          </Box>
        </Box>
      </Drawer>

      {/* Floating WhatsApp FAB */}
      <Fab
        color="success"
        aria-label="WhatsApp"
        href={whatsappHref}
        target="_blank"
        sx={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 1400,
          backgroundColor: "#25D366",
          "&:hover": { backgroundColor: "#1DA851" },
        }}
      >
        <WhatsAppIcon />
      </Fab>
    </>
  );
}
