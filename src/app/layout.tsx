// app/layout.js
import "./globals.css";
import type { Metadata } from "next";
import ThemeRegistry from "./theme-registry";

export const metadata: Metadata = {
  title: "Good Geeks – Tech Support Melbourne",
  description: "Professional IT Support Services in Melbourne",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* EVERYTHING that uses MUI goes inside ThemeRegistry (client boundary) */}
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}



