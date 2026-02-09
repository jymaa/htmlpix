import createMDX from "@next/mdx";
import { withPlausibleProxy } from "next-plausible";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["mdx", "tsx", "ts"],
  experimental: {
    authInterrupts: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "impressive-cod-713.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "cdn.htmlpix.com",
      },
    ],
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
  },
});

const withPlausible = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST?.trim()
  ? withPlausibleProxy({
      customDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_HOST.trim(),
      scriptName: "vitals",
    })
  : (config) => config;

export default withPlausible(withMDX(nextConfig));
