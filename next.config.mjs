import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["mdx", "tsx", "ts"],
  experimental: {
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "impressive-cod-713.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "dev-asia.504fe3e01303e85e7c073450f63e27cb.r2.cloudflarestorage.com",
      },
    ],
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
