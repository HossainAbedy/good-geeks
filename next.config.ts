import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Image optimization on external domains is disabled (GoDaddy compatibility)
  images: {
    unoptimized: true,
  },

  // Optional: add trailing slash for cleaner URLs
  trailingSlash: true,

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // SWC minification for smaller bundle
  //swcMinify: true,

  // Don't use "output: export" — allow API routes to work on Vercel
  // Static pages will still be prerendered where possible
};

export default nextConfig;
