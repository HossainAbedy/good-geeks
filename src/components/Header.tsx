// src/components/Header.jsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";

const NAV = [
  { label: "Home", href: "/#hero", id: "hero" },
  { label: "Services", href: "/#services", id: "services" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Why Us", href: "/#whychooseus", id: "whychooseus" },
  { label: "Reviews", href: "/#reviews", id: "reviews" },
  { label: "Contact", href: "/#contact", id: "contact" },
];

export default function Header() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  // smooth navigation helper
  const navigateTo = useCallback(
    (href) => {
      setOpen(false);
      try {
        const url = new URL(href, window.location.origin);
        if (url.hash && url.pathname === window.location.pathname) {
          const id = url.hash.replace("#", "");
          const el = document.getElementById(id);
          if (el) {
            const topOffset = 80; // header height to offset
            const top = Math.max(el.getBoundingClientRect().top + window.scrollY - topOffset, 0);
            window.scrollTo({ top, behavior: "smooth" });
            // update URL without jumping
            window.history.replaceState({}, "", url.pathname + url.hash);
            return;
          }
        }
      } catch (err) {
        // continue to router fallback
      }

      // fallback route change
      router.push(href);
    },
    [router]
  );

  // shrink header on scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // intersection observer: set active nav item by visible section
  useEffect(() => {
    const ids = NAV.map((n) => n.id);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);

    if (!elements.length) {
      // no sections found — do nothing
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // choose the most visible / top-most entry
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-40% 0px -50% 0px", // more likely to reflect main view
        threshold: [0.25, 0.5, 0.75],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // keyboard for logo
  const onLogoKey = (e) => {
    if (e.key === "Enter" || e.key === " ") navigateTo("/#hero");
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={scrolled ? 6 : 0}
        sx={{
          transition: "all 240ms ease",
          background: scrolled ? "rgba(255,255,255,0.9)" : "transparent",
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
            onClick={() => navigateTo("/#hero")}
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
              const isActive = active === navItem.id;
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
              onClick={() => navigateTo("/#contact")}
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

            <IconButton aria-label="Call GoodGeeks" size="large" sx={{ ml: 1 }}>
              <a href="tel:+61400000000" style={{ color: "inherit", display: "inline-flex" }}>
                <PhoneIcon />
              </a>
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
              <Image src="/logo/goodgeeks-logo.png" alt="GoodGeeks" fill style={{ objectFit: "contain" }} />
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
                navigateTo("/#contact");
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
    </>
  );
}
