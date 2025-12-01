// src/components/ContactBooking.tsx
"use client";
import React, { useState, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Autocomplete as MUIAutocomplete,
  IconButton,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import dynamic from "next/dynamic";

/* ---------------------------
   Melbourne suburbs (comprehensive)
   - You can extend this list if you want
---------------------------- */
const MELBOURNE_SUBURBS = [
  "Abbotsford","Airport West","Albert Park","Alphington","Ardeer","Armadale","Ascot Vale",
  "Ashburton","Ashwood","Balaclava","Balwyn","Balwyn North","Bentleigh","Bentleigh East",
  "Berwick","Blackburn","Blackburn North","Blackburn South","Bonbeach","Brighton","Brighton East",
  "Broadmeadows","Brooklyn","Brunswick","Brunswick East","Brunswick West","Bulleen","Burwood",
  "Camberwell","Carlton","Carlton North","Carnegie","Caulfield","Caulfield North","Caulfield South",
  "Chadstone","Chelsea","Cheltenham","Clarinda","Clayton","Clayton South","Coburg","Coburg North",
  "Collingwood","Croydon","Dandenong","Doncaster","Doncaster East","Donvale","Eaglemont","East Melbourne",
  "Echuca","Elsternwick","Eltham","Elwood","Essendon","Essendon North","Fairfield","Fawkner",
  "Fitzroy","Fitzroy North","Forest Hill","Frankston","Glen Huntly","Glen Iris","Glen Waverley","Gowanbrae",
  "Greensborough","Hampton","Hampton East","Hawthorn","Hawthorn East","Heatherton","Heidelberg",
  "Heidelberg Heights","Highett","Hillside","Hoppers Crossing","Horsham","Ivanhoe","Kensington",
  "Keilor","Keilor East","Keilor Park","Kew","Kew East","Kingsbury","Knoxfield","Kurunjang",
  "Malvern","Malvern East","McKinnon","Melbourne","Melton","Melton South","Mentone","Moorabbin",
  "Moonee Ponds","Mordialloc","Mount Waverley","Mulgrave","Narre Warren","Noble Park","North Melbourne",
  "Northcote","Oakleigh","Oakleigh East","Parkville","Pascoe Vale","Point Cook","Port Melbourne",
  "Prahran","Preston","Reservoir","Richmond","Ringwood","Ringwood East","Rockbank","Roxburgh Park",
  "Sandringham","Seddon","Seaford","South Melbourne","South Yarra","Southbank","Springvale","St Kilda",
  "St Kilda East","Sunbury","Sunshine","Sunshine North","Surrey Hills","Swan Hill","Toorak","Truganina",
  "Upwey","Vermont","Viewbank","Warrandyte","Watsonia","Werribee","West Footscray","West Melbourne",
  "Wheelers Hill","Williamstown","Williamstown North","Williamstown South","Windsor","Woodend",
  "Yarraville","Yarrambat","Airport","Bacchus Marsh","Balwyn","Research","Healesville","Mooroopna",
  "Laverton","Lysterfield","Officer","Sydenham","Taylors Lakes","Taylors Hill","Tullamarine",
  "Vermont South","Wallan","Werribee South","Williamstown","Yarra Glen","Yarraman"
  // This list covers a large number of Melbourne suburbs; add any missing ones if needed.
];

const DynamicMapComponent = dynamic(() => import("./ui/DynamicMap"), { ssr: false });

/* ---------------------------
   Main component
---------------------------- */
type Snack = { open: boolean; message: string; severity: "success" | "error" };
export default function ContactBooking() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    suburb: "",
    message: "",
    address: "",
    lat: null as number | null,
    lng: null as number | null,
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<Snack>({ open: false, message: "", severity: "success" });
  const [openModal, setOpenModal] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: -37.8136, lng: 144.9631 });
  const [mapZoom, setMapZoom] = useState<number>(12);
  // validators (same as earlier)
  function validateName(name: string) {
    const v = name.trim();
    if (!v) return "Please enter your full name";
    if (v.length < 2) return "Name is too short";
    return "";
  }
  function validatePhone(phone: string) {
    const raw = phone.trim();
    if (!raw) return "Phone is required";
    const normalized = raw.replace(/[\s-()]/g, "");
    const mobileRE = /^(?:\+61|0)4\d{8}$/;
    if (mobileRE.test(normalized)) return "";
    const digits = normalized.replace(/\D/g, "");
    if (digits.length >= 8) return "";
    return "Enter a valid phone number (e.g. 0412 345 678 or +61 412 345 678)";
  }
  function validateEmail(email: string) {
    const v = email.trim();
    if (!v) return "";
    const re = /^\S+@\S+\.\S+$/;
    return re.test(v) ? "" : "Enter a valid email address";
  }
  function validateMessage(msg: string) {
    if (!msg) return "";
    if (msg.trim().length < 6) return "Please provide a bit more detail";
    return "";
  }
  function validateAll() {
    const e: Partial<Record<string, string>> = {};
    e.name = validateName(form.name) || undefined;
    e.phone = validatePhone(form.phone) || undefined;
    e.email = validateEmail(form.email) || undefined;
    e.message = validateMessage(form.message) || undefined;
    if (!form.suburb) e.suburb = "Please choose your suburb";
    Object.keys(e).forEach((k) => {
      if ((e as any)[k] === undefined) delete (e as any)[k];
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  function updateField<K extends keyof typeof form>(key: K, value: any) {
    setForm((s) => ({ ...s, [key]: value }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[key as string];
      return copy;
    });
  }
  // reverse geocode via Nominatim
  async function reverseGeocode(lat: number, lng: number) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`;
      const res = await fetch(url, { headers: { "User-Agent": "GoodGeeksContactForm/1.0" } });
      if (!res.ok) return null;
      const data = await res.json();
      const address = data?.display_name || "";
      const suburb =
        data?.address?.suburb ||
        data?.address?.village ||
        data?.address?.hamlet ||
        data?.address?.neighbourhood ||
        data?.address?.town ||
        data?.address?.city_district ||
        "";
      return { address, suburb };
    } catch (err) {
      console.warn("reverseGeocode error", err);
      return null;
    }
  }
  // map click handler
  const onMapClick = useCallback(
    async (lat: number, lng: number) => {
      updateField("lat", lat);
      updateField("lng", lng);
      setMapCenter({ lat, lng });
      setMapZoom(15);
      const r = await reverseGeocode(lat, lng);
      if (r) {
        if (r.address) updateField("address", r.address);
        if (r.suburb) updateField("suburb", r.suburb);
      }
    },
    []
  );
  // Use user's current location
  async function handleLocationFetch() {
    if (!navigator.geolocation) {
      setSnack({ open: true, message: "Geolocation not supported", severity: "error" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMapCenter({ lat, lng });
        setMapZoom(15);
        updateField("lat", lat);
        updateField("lng", lng);
        const r = await reverseGeocode(lat, lng);
        if (r) {
          if (r.address) updateField("address", r.address);
          if (r.suburb) updateField("suburb", r.suburb);
          setSnack({ open: true, message: `Location detected: ${r.suburb || "location found"}`, severity: "success" });
        } else {
          setSnack({ open: true, message: "Could not reverse geocode location", severity: "error" });
        }
      },
      () => {
        setSnack({ open: true, message: "Permission denied for location", severity: "error" });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }
  // Submit form, including address/lat/lng
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateAll()) {
      setSnack({ open: true, message: "Please fix the errors above", severity: "error" });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        suburb: form.suburb.trim(),
        message: form.message.trim(),
        address: form.address || null,
        lat: form.lat,
        lng: form.lng,
      };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setForm({ name: "", phone: "", email: "", suburb: "", message: "", address: "", lat: null, lng: null });
        setSnack({ open: true, message: "Thanks! We'll contact you shortly.", severity: "success" });
        setOpenModal(true);
        // optionally center map back to default
        setMapCenter({ lat: -37.8136, lng: 144.9631 });
        setMapZoom(12);
      } else {
        const j = await res.json().catch(() => ({}));
        setSnack({ open: true, message: j?.message || "Submission failed", severity: "error" });
      }
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Network error", severity: "error" });
    } finally {
      setLoading(false);
    }
  }
  // Quick helper for whether submit should be enabled
  const isFormValidForButton = () =>
    !validateName(form.name) && !validatePhone(form.phone) && !validateEmail(form.email) && !validateMessage(form.message) && !!form.suburb;
  // small visually hidden
  const srOnly: React.CSSProperties = {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    whiteSpace: "nowrap",
    border: 0,
  };
  // If map tiles fail, show message
  // Render
  return (
    <Box id="contact" component="section" sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Typography component="h2" id="contact-heading" sx={srOnly}>
          Contact Good Geeks — Book an on-site visit or ask a question
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          Contact & Booking
        </Typography>
        <Stack component="form" onSubmit={submit} spacing={2} direction={{ xs: "column", md: "row" }}>
          {/* left form */}
          <Stack spacing={2} sx={{ flex: "1 1 420px", maxWidth: 700 }}>
            <TextField
              required
              label="Full name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              onBlur={() => setErrors((prev) => ({ ...prev, name: validateName(form.name) || undefined }))}
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
            <TextField
              required
              label="Phone"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              onBlur={() => setErrors((prev) => ({ ...prev, phone: validatePhone(form.phone) || undefined }))}
              error={Boolean(errors.phone)}
              helperText={errors.phone || "We may call or message this number"}
            />
            <TextField
              label="Email (optional)"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              onBlur={() => setErrors((prev) => ({ ...prev, email: validateEmail(form.email) || undefined }))}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
            {/* suburb autocomplete + use my location button */}
            <Stack direction="row" spacing={1} alignItems="center">
              <MUIAutocomplete
                freeSolo
                options={MELBOURNE_SUBURBS}
                value={form.suburb}
                onChange={(e, v) => updateField("suburb", typeof v === "string" ? v : v ?? "")}
                renderInput={(params) => <TextField {...params} label="Suburb (type to search)" />}
                sx={{ flex: 1 }}
              />
              <IconButton aria-label="Use my location" onClick={handleLocationFetch} color="primary" sx={{ ml: 0 }}>
                <MyLocationIcon />
              </IconButton>
            </Stack>
            <TextField
              label="Short message / problem"
              multiline
              minRows={3}
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              onBlur={() => setErrors((prev) => ({ ...prev, message: validateMessage(form.message) || undefined }))}
              error={Boolean(errors.message)}
              helperText={errors.message}
            />
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button variant="contained" type="submit" disabled={loading || !isFormValidForButton()}>
                {loading ? <CircularProgress size={20} /> : "Request Visit"}
              </Button>
              <Button variant="outlined" href="https://calendly.com/YOUR_CALENDLY_LINK" target="_blank">
                Book Online
              </Button>
            </Stack>
          </Stack>
          {/* right map */}
          <Box sx={{ flex: "1 1 420px", width: "100%", minHeight: 360 }}>
            <Box sx={{ height: 360, width: "100%", borderRadius: 2, overflow: "hidden", boxShadow: "0 10px 30px rgba(2,8,23,0.12)" }}>
              <DynamicMapComponent
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={mapZoom}
                onMapClick={onMapClick}
                markerPosition={form.lat && form.lng ? [form.lat, form.lng] : null}
              />
            </Box>
            <Typography sx={{ mt: 1, fontSize: 13, color: "text.secondary" }}>
              {form.address ? `Address: ${form.address}` : "Tip: click the map or use your location to auto-fill suburb"}
            </Typography>
          </Box>
        </Stack>
        {/* snack */}
        <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
          <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>
            {snack.message}
          </Alert>
        </Snackbar>
        {/* modal */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>Message Sent</DialogTitle>
          <DialogContent>
            <Typography>Your message has been sent successfully! We'll get back to you soon.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Close</Button>
          </DialogActions>
        </Dialog>
        {/* structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPoint",
              telephone: "+61426542214",
              contactType: "customer support",
              areaServed: "Melbourne, Australia",
              availableLanguage: ["English"],
            }),
          }}
        />
      </Container>
    </Box>
  );
}