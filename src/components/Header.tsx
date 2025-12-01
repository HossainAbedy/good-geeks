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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";

type NavItem = {
  label: string;
  href: string;
  id?: string;
};

const NAV: NavItem[] = [
 { label: "Home", href: "/#hero", id: "hero" },
  { label: "Services", href: "/#services", id: "services" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Why Us", href: "/#whychooseus", id: "whychooseus" },

  // Home page reviews section
  { label: "Reviews", href: "/#reviews", id: "reviews-section" },

  // Dedicated full page routes
  { label: "Reviews Page", href: "/reviews", id: "reviews-page" },
  { label: "Newsletter", href: "/newsletter", id: "newsletter" },
  { label: "Contact Page", href: "/contact", id: "contact-page" },
];

export default function Heeder() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [active, setActive] = useState<string>("hero");
  const [scrolled, setScrolled] = useState<boolean>(false);

  // client-only smooth navigation helper (guards window)
  const navigateTo = useCallback(
    (href: string) => {
      setOpen(false);

      if (typeof window === "undefined") {
        // server fallback: use router push
        router.push(href);
        return;
      }

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
        // fallback to router if URL parsing fails
      }

      // final fallback navigation
      router.push(href);
    },
    [router]
  );

  // shrink header on scroll (client-only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // intersection observer: set active nav item by visible section (client-only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ids = NAV.map((n) => n.id).filter(Boolean) as string[];
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);

    if (!elements.length) {
      // no sections found — do nothing
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // mark the section that is intersecting as active
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-40% 0px -50% 0px",
        threshold: [0.25, 0.5, 0.75],
      }
    );

    elements.forEach((el) => observer.observe(el!));
    return () => observer.disconnect();
  }, []);

  // keyboard handler for logo
  const onLogoKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      navigateTo("/#hero");
    }
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
          <Box
            sx={{
              position: "relative",
              width: scrolled ? 180 : 220,   // BIGGER LOGO
              height: scrolled ? 55 : 70,    // BIGGER LOGO
              transition: "all 240ms ease",
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))", // NICE SHADOW
            }}
          >
            <Image
              src="/logo/goodgeeks-logo.png"
              alt="GoodGeeks"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </Box>
        </Box>
          {/* Desktop nav */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center", ml: 2 }}>
            {NAV.map((navItem) => {
              const isActive = navItem.id ? active === navItem.id : false;
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
                    whiteSpace: "nowrap",            // 🔥 prevents text breaking into a new line
                    minWidth: "fit-content",         // 🔥 prevents shrinking too much
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

            <IconButton
              aria-label="Call GoodGeeks"
              size="large"
              component="a"
              href="tel:+61426542214"
              sx={{ ml: 1 }}
            >
              <PhoneIcon />
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
                component="a"
                href={navItem.href}
                onClick={() => {
                  // allow anchor click, but also run navigateTo for special same-page handling
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

            <IconButton
              aria-label="Call GoodGeeks"
              component="a"
              href="tel:+61426542214"
              sx={{ ml: 1 }}
            >
              <PhoneIcon />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
