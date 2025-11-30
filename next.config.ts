import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Ensures image optimization works even on custom domains / GoDaddy hosting
  images: {
    unoptimized: true, // GoDaddy does NOT support Next.js Image Optimization
  },

  // Enable SWC minification for smaller bundle size
  swcMinify: true,

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
        ],
      },
    ];
  },

  // SEO improvement: ensure trailing slash for clean URLs
  trailingSlash: true,

  // To allow static export for GoDaddy
  output: "export", // IMPORTANT for shared hosting
};

export default nextConfig;
