// app/layout.js
// app/layout.js
import "./globals.css";
import type { Metadata } from "next";
import ThemeRegistry from "./theme-registry";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Good Geeks – Tech Support Melbourne",
  description: "Professional IT Support Services in Melbourne",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeRegistry>
          {/* GLOBAL HEADER */}
          <Header />

          {/* PAGE CONTENT */}
          {children}

          {/* GLOBAL FOOTER */}
          <Footer />
        </ThemeRegistry>
      </body>
    </html>
  );
}



