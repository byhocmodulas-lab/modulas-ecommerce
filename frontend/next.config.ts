import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "assets.modulas.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-Content-Type-Options",     value: "nosniff" },
          { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
          {
            key:   "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
  // Turbopack config (default in Next.js 16)
  // root is set to the npm workspace root (one level up from frontend/).
  // This allows Turbopack to find workspace-hoisted packages in the root
  // node_modules/, while preventing it from crawling up to C:\Users\Admin\
  // where a stray package-lock.json would cause chunk URLs to embed
  // "Modulas E-commerce" (with a space → %20) and break loading.
  // GLB/GLTF/HDR/EXR files are handled as static assets via Next.js public/ dir
  // or via next/image — no loader override needed for Turbopack
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
};

export default nextConfig;
