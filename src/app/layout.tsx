// app/layout.js
import "./globals.css";
import type { Metadata } from "next";
import ThemeRegistry from "./theme-registry";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppFloating from "@/components/ui/WhatsappFloating";

export const metadata = {
  metadataBase: new URL("https://goodgeeks.com.au"),
  title: {
    default: "Good Geeks – Tech Support Melbourne",
    template: "%s | Good Geeks Melbourne"
  },
  description:
    "Good Geeks provides expert IT support, computer repair, data recovery, NBN setup, networking, and on-site tech repair services across Melbourne.",
  keywords: [
    "IT support Melbourne",
    "computer repair Melbourne",
    "tech support Melbourne",
    "laptop repair Melbourne",
    "PC repair Melbourne",
    "NBN setup",
    "onsite technician"
  ],
  icons: {
    icon: "/favicon.ico"
  },
  openGraph: {
    title: "Good Geeks – Melbourne IT Support & Computer Repairs",
    description:
      "Professional computer repair and technical support services across Melbourne. Fast, reliable, expert technicians.",
    url: "https://goodgeeks.com.au",
    siteName: "Good Geeks",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Good Geeks – Melbourne IT Support"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Good Geeks – Melbourne IT Support & Computer Repairs",
    description:
      "Expert IT technicians for computer repair, malware removal, networking, and on-site support.",
    images: ["/og-image.jpg"]
  }
};

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Font Optimization */}
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />

          {/* Local Business Schema (SEO Booster) */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                name: "Good Geeks Melbourne",
                url: "https://goodgeeks.com.au",
                logo: "https://goodgeeks.com.au/logo.png",
                image: "https://goodgeeks.com.au/og-image.jpg",
                telephone: "+61 430 000 000",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Melbourne",
                  addressRegion: "VIC",
                  addressCountry: "Australia"
                },
                description:
                  "Professional IT support and computer repair services in Melbourne."
              })
            }}
          />
        </head>

        <body>
          <ThemeRegistry>
            <WhatsAppFloating  />
            {/* GLOBAL HEADER */}
            <Header />

            {/* PAGE CONTENT */}
            <main>{children}</main>

            {/* GLOBAL FOOTER */}
            <Footer />
          </ThemeRegistry>
        </body>
      </html>
    );
  }
