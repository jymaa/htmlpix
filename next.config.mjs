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
        hostname: "cdn.htmlpix.com",
      },
      {
        protocol: "https",
        hostname: "pub-d90268f86a134686a1cf1d990af7b506.r2.dev",
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
