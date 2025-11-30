//src/components/Services.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import ComputerIcon from "@mui/icons-material/Computer";
import WifiIcon from "@mui/icons-material/Wifi";
import SecurityIcon from "@mui/icons-material/Security";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PrintIcon from "@mui/icons-material/Print";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";

const services = [
  {
    id: "repairs",
    title: "Computer & Laptop Repairs",
    icon: <ComputerIcon sx={{ fontSize: 40 }} />,
    description: "Windows & Mac repair, speed-up, troubleshooting.",
    details:
      "Full-service repairs for laptops and desktops: hardware diagnostics, component replacement (HDD, SSD, RAM, screens), OS re-installation, driver fixes, performance tuning and preventive servicing. We keep a replacement-stock for common parts and can provide on-site or workshop repairs. Typical turnaround: 24–72 hours depending on parts.",
  },
  {
    id: "wifi",
    title: "Wi-Fi & Networking",
    icon: <WifiIcon sx={{ fontSize: 40 }} />,
    description: "Home & business Wi-Fi setup, optimisation, and fixes.",
    details:
      "We design, deploy and troubleshoot Wi-Fi & wired networks for homes and small businesses. Services include site surveys, optimal AP placement, mesh & controller-based deployments, VLANs, QoS for VoIP, wired cabling, and ISP handover configuration. We also provide network documentation and secure guest access portals.",
  },
  {
    id: "security",
    title: "Virus & Malware Removal",
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    description: "Complete cleanup + protection for safer browsing.",
    details:
      "Malware/Ransomware cleanup, deep system scans, registry sanitisation and secure restoration of user files where possible. After remediation we harden the system: automated backups, endpoint AV/EDR setup recommendations, and user training to reduce reinfection risk.",
  },
  {
    id: "business",
    title: "Business IT Support",
    icon: <BusinessCenterIcon sx={{ fontSize: 40 }} />,
    description: "Office setup, email, cloud, backups, managed IT services.",
    details:
      "Managed IT for small businesses: account and device provisioning, Microsoft 365 / Google Workspace migration, centralized backups, scheduled maintenance, remote monitoring and SLA based support. We also assist with user training and security policy templates.",
  },
  {
    id: "printer",
    title: "Printer & Device Setup",
    icon: <PrintIcon sx={{ fontSize: 40 }} />,
    description: "Printers, scanners, smart devices, POS systems.",
    details:
      "We set up printers, scanners and POS devices, including network printer sharing, driver configuration, secure print and print quotas. On-site installation and preventive maintenance plans available.",
  },
  {
    id: "cloud",
    title: "Cloud & Backup Solutions",
    icon: <CloudQueueIcon sx={{ fontSize: 40 }} />,
    description: "Microsoft 365, Google Workspace, backup & recovery.",
    details:
      "Cloud migration and backup design: Microsoft 365, Google Workspace, OneDrive, SharePoint, and business-grade backups. We design retention policies, automated backup schedules, disaster recovery plans and assist with compliance requirements.",
  },
];

const Transition = React.forwardRef(function Transition(props: any, ref: any) {
  // Slide + slight fade for a modern popup feel
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Services() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const [selected, setSelected] = useState<string | null>(null);

  const openService = (id: string) => setSelected(id);
  const closeService = () => setSelected(null);

  const active = services.find((s) => s.id === selected) ?? null;

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        background: "linear-gradient(135deg, #F3F8FF, #ECF3FF)",
        fontFamily: `"Segoe UI Variable", "Segoe UI", Roboto, sans-serif`,
      }}
    >
      <Container maxWidth="lg">
        <Stack textAlign="center" spacing={2} sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(90deg, #0066FF, #00C4FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Our IT Services
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "#555",
              maxWidth: "700px",
              mx: "auto",
              fontWeight: 400,
            }}
          >
            Reliable tech support for homes and small businesses across Melbourne.
          </Typography>
        </Stack>

        {/* ---------- Responsive flex grid (no MUI Grid) ---------- */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 2, sm: 3, md: 4 },
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {services.map((s) => (
            <Box
              key={s.id}
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 12px)",
                  md: "calc(33.333% - 18px)",
                },
                display: "flex",
              }}
            >
              <Card
                elevation={0}
                onClick={() => openService(s.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") openService(s.id);
                }}
                sx={{
                  cursor: "pointer",
                  flex: 1,
                  minHeight: 320, // identical height across all cards
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: "20px",
                  padding: 3,
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(250,250,255,0.85))",
                  boxShadow:
                    "0 10px 30px rgba(11,95,255,0.06), inset 0 0 8px rgba(255,255,255,0.6)",
                  transition: "transform 220ms cubic-bezier(.2,.9,.2,1), box-shadow 220ms",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow:
                      "0 18px 50px rgba(11,95,255,0.12), inset 0 0 12px rgba(255,255,255,0.65)",
                  },
                }}
              >
                {/* Top area: fixed box for icon + title (so titles align across cards) */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    alignItems: "center",
                    height: 120,
                  }}
                >
                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #007BFF, #00D1FF)",
                      color: "white",
                      width: 72,
                      height: 72,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "18px",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                      flex: "0 0 auto",
                    }}
                  >
                    {s.icon}
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.05 }}>
                      {s.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#4A5568", mt: 0.5 }}>
                      {s.description}
                    </Typography>
                  </Box>
                </Box>

                {/* Footer area: small CTA aligned to bottom */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundImage: "linear-gradient(90deg,#0066FF,#00C4FF)",
                      textTransform: "none",
                      fontWeight: 700,
                      px: 2.5,
                      py: 1,
                      boxShadow: "0 8px 20px rgba(11,95,255,0.12)",
                    }}
                  >
                    Learn more
                  </Button>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      {/* ---------- Dialog: large service details ---------- */}
      <Dialog
        open={!!active}
        onClose={closeService}
        fullScreen={isSm}
        TransitionComponent={Transition}
        aria-labelledby="service-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 3 },
            overflow: "hidden",
            px: { xs: 0, sm: 3 },
            py: { xs: 0, sm: 2 },
          },
        }}
      >
        {active && (
          <>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} id="service-dialog-title">
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {active.title}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: "#6B7280" }}>
                  {active.description}
                </Typography>
              </Box>

              <IconButton aria-label="Close details" onClick={closeService}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <Stack spacing={3}>
                {/* big hero area inside dialog */}
                <Box
                  sx={{
                    borderRadius: 2,
                    height: { xs: 180, sm: 260 },
                    background:
                      "linear-gradient(180deg, rgba(6,57,122,0.06), rgba(0,197,168,0.03))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {/* placeholder illustrative element — optionally swap with image */}
                  <Box sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        width: 88,
                        height: 88,
                        mx: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        background: "linear-gradient(135deg,#0066FF,#00C4FF)",
                        boxShadow: "0 12px 30px rgba(6,57,122,0.12)",
                      }}
                    >
                      {active.icon}
                    </Box>

                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
                      {active.title}
                    </Typography>
                  </Box>
                </Box>

                {/* long description */}
                <Typography variant="body1" sx={{ color: "#333", whiteSpace: "pre-wrap" }}>
                  {active.details}
                </Typography>

                {/* optional bullets / features */}
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    What we include
                  </Typography>
                  <Stack component="ul" spacing={1} sx={{ pl: 2, m: 0 }}>
                    <Typography component="li" sx={{ color: "#374151" }}>
                      Diagnostic check & written quote
                    </Typography>
                    <Typography component="li" sx={{ color: "#374151" }}>
                      Priority turnaround for business customers
                    </Typography>
                    <Typography component="li" sx={{ color: "#374151" }}>
                      Optional warranty on parts & labour
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={closeService} variant="outlined" sx={{ borderRadius: 2 }}>
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  // go to contact or open booking prefilled for the service
                  // TODO: wire booking route and prefill using router push or query
                  window.location.href = "#contact";
                }}
                sx={{
                  ml: 1,
                  backgroundImage: "linear-gradient(90deg,#0066FF,#00C4FF)",
                  color: "white",
                }}
              >
                Book a Visit
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
